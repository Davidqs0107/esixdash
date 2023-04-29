import React, { useContext, useEffect, useReducer, useState } from "react";
import AccountHoldersContext from "./AccountHoldersContext";
import AccountHoldersReducer from "./AccountHoldersReducer";
import { MessageContext } from "../MessageContext";
import { store } from "../../store";

import {
  GET_ACCOUNT_HOLDERS,
  GET_TOTAL_ACCOUNT_HOLDERS,
  SET_ACCOUNT_HOLDER_CONTACT_LIST,
  ADD_ACCOUNT_HOLDERS,
  SET_PRIMARY_PERSON,
  SET_IS_SECONDARY,
  SET_SECONDARY_PERSON_ID,
  SET_IS_ACCOUNT_HOLDER,
  CLEAR_CONTACT_LIST,
} from "./Types";
import api from "../../api/api";

const AccountHolderState = (props: any) => {
  const initialState = {
    accountHoldersList: [],
    totalAccountHolders: 0,
    accountHolderContactList: [],
    addAccountHolderList: [],
    primaryPersonState: {},
    isAccountHolder: false,
    isSecondary: false,
    secondaryPersonId: "",
  };
  const { setErrorMsg } = useContext(MessageContext);
  const [state, dispatch] = useReducer(AccountHoldersReducer, initialState);
  const storeState = store.getState();
  const roles = storeState.account?.user?.roles;

  const addAccountHolder = async (id: string, dto: any) => {
    // add account holder feature needs to be created added this to be used when feature is created
    // try {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   const info = await api.CustomerAPI.addPerson(id, dto);
    //   dispatch({
    //     type: ADD_ACCOUNT_HOLDERS,
    //     payload: { data: info },
    //   });
    // } catch (err) {
    //   setErrorMsg(err);
    // }
    console.log(
      "add account holder creation button hit add code on AccountHolderState.tsx"
    );
  };

  const setPrimaryPerson = (person: any) => {
    dispatch({
      type: SET_PRIMARY_PERSON,
      payload: { data: person },
    });
  };

  const setIsSecondary = (status: boolean) => {
    dispatch({
      type: SET_IS_SECONDARY,
      payload: { data: status },
    });
  };

  const setSecondaryPersonId = (id: string) => {
    dispatch({
      type: SET_SECONDARY_PERSON_ID,
      payload: { data: id },
    });
  };

  const getSecondaryPersonEmails = (id: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.getEmailList(id).catch((error: any) => setErrorMsg(error));
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const getSecondaryPersonPhones = (id: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.getPhones(id).catch((error: any) => setErrorMsg(error));
  const getSecondaryPersonOfficialIds = (id: string) => {
    if (roles.length == 1 && roles.includes("CustomerAgent")) {
      return [];
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.getOfficialIds(id).catch((error: any) => setErrorMsg(error));
  };
  const getSecondaryPersonAddresses = (id: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.getAddress(id).catch((error: any) => setErrorMsg(error));

  const clearAccountHolderContactList = () => {
    dispatch({
      type: CLEAR_CONTACT_LIST,
      payload: { data: [] },
    });
  };
  const getSecondaryPersonsInformation = async (person: any) => {
    try {
      const isSamePerson = state.primaryPersonState.id === person.id;

      const promises = [
        isSamePerson
          ? Promise.resolve(state.primaryPersonState.addresses)
          : getSecondaryPersonAddresses(person.id),
        isSamePerson
          ? Promise.resolve(state.primaryPersonState.emails)
          : getSecondaryPersonEmails(person.id),
        isSamePerson
          ? Promise.resolve(state.primaryPersonState.contact)
          : getSecondaryPersonPhones(person.id),
        getSecondaryPersonOfficialIds(person.id),
      ];

      Promise.all(promises).then((results) => {
        const info = [
          {
            person,
            address: results[0],
            emails: results[1],
            contact: results[2],
            personalId: results[3],
          },
        ];

        dispatch({
          type: SET_ACCOUNT_HOLDER_CONTACT_LIST,
          payload: { data: info },
        });
      });
    } catch (err) {
      setErrorMsg(err);
    }
  };

  const getAccountHolders = async (customerIdentifier: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const secondaryPersons = await api.CustomerAPI.getPersons(
        customerIdentifier
      );

      await Promise.allSettled(
        secondaryPersons.map((person: any) =>
          getSecondaryPersonsInformation(person)
        )
      );

      dispatch({
        type: GET_ACCOUNT_HOLDERS,
        payload: { data: secondaryPersons },
      });
    } catch (err) {
      setErrorMsg(err);
    }
  };

  const getTotalAccountHolders = async (customerIdentifier: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const info = await api.CustomerAPI.getPersons(customerIdentifier);

      dispatch({
        type: GET_TOTAL_ACCOUNT_HOLDERS,
        payload: { data: info.length },
      });
    } catch (err) {
      setErrorMsg(err);
    }
  };

  const setIsAccountHolder = async (status: boolean) => {
    dispatch({
      type: SET_IS_ACCOUNT_HOLDER,
      payload: { data: status },
    });
  };

  return (
    <AccountHoldersContext.Provider
      value={{
        accountHoldersList: state.accountHoldersList,
        totalAccountHolders: state.totalAccountHolders,
        accountHolderContactList: state.accountHolderContactList,
        addAccountHolderList: state.addAccountHolderList,
        isAccountHolder: state.isAccountHolder,
        primaryPersonState: state.primaryPersonState,
        isSecondary: state.isSecondary,
        secondaryPersonId: state.secondaryPersonId,
        getAccountHolders,
        getTotalAccountHolders,
        addAccountHolder,
        setPrimaryPerson,
        setIsSecondary,
        setSecondaryPersonId,
        setIsAccountHolder,
        getSecondaryPersonsInformation,
        clearAccountHolderContactList,
      }}
    >
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.children}
    </AccountHoldersContext.Provider>
  );
};

export default AccountHolderState;
