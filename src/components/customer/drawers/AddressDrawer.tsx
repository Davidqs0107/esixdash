/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * THIS IS CONFIDENTIAL AND PROPRIETARY TO EPISODE SIX, and any
 * copying, reproduction, redistribution, dissemination, modification, or
 * other use, in whole or in part, is strictly prohibited without the prior
 * written consent of (or as may be specifically permitted in a fully signed
 * agreement with) Episode Six.   Violations may result in severe civil and/or
 * criminal penalties, and Episode Six will enforce its rights to the maximum
 * extent permitted by law.
 *
 */

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Box from "@mui/material/Box";
import { Formik, useFormikContext } from "formik";
import * as Yup from "yup";
import { useQueries } from "@tanstack/react-query";
import api from "../../../api/api";
import AddressTypeConverter from "../../common/converters/AddressTypeConverter";
import { MessageContext } from "../../../contexts/MessageContext";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Header from "../../common/elements/Header";
import emitter from "../../../emitter";
import StateList from "../../util/ListOfStates";
import AccountHoldersContext from "../../../contexts/account-holders/AccountHoldersContext";

interface IAddressDrawer {
  edit?: boolean;
  address?: any; // when edit is true, address needs to be supplied
  toggleDrawer?: any;
  personIdentifier: string;
}

const AddressDrawer: React.FC<IAddressDrawer> = ({
  personIdentifier,
  edit = false,
  address = {},
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
}) => {
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const intl = useIntl();
  const accountHoldersContext = useContext(AccountHoldersContext);
  const { secondaryPersonId, isSecondary } = accountHoldersContext;
  const [addressTypes, setAddressTypes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [initialValues, setInitialValues] = useState({
    type: "",
    line1: "",
    line2: "",
    line3: "",
    postalCode: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "",
    isInternational: false,
  });
  const ref = useRef<any>(null);

  const [getCountriesQuery, getAddressTypesQuery] = useQueries({
    queries: [
      {
        queryKey: ["getCountryList2"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getCountryList2(),
        onError: (error: any) => setErrorMsg(error),
      },

      {
        queryKey: ["getAddressTypes"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getAddressTypes(),
        onError: (error: any) => setErrorMsg(error),
      },
    ],
  });

  const updateAddress = (id: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.updateAddress(id, dto).catch((error: any) =>
      setErrorMsg(error)
    );

  const addOrUpdateAddress = (values: any) => {
    const identifier = !isSecondary ? personIdentifier : secondaryPersonId;
    updateAddress(identifier, {
      type: values.type,
      line1: values.line1,
      line2: values.line2,
      line3: values.line3,
      neighborhood: values.neighborhood,
      postalCode: values.postalCode,
      city: values.city,
      state: values.state,
      country: values.country,
    }).then(() => {
      emitter.emit("customer.edit.info.changed", {});
      toggleDrawer();
      setSuccessMsg({
        responseCode: "200000",
        message: intl.formatMessage({
          id: "address.updated.successful",
          defaultMessage: "Address Updated Successfully.",
        }),
      });
    });
  };

  const AddressSchema = Yup.object().shape({
    type: Yup.string().required(
      intl.formatMessage({
        id: "error.addressType.required",
        defaultMessage: "Address type is a required field.",
      })
    ),
    line1: Yup.string().required(
      intl.formatMessage({
        id: "error.addressLine1.required",
        defaultMessage: "Address line 1 is a required field.",
      })
    ),
    line2: Yup.string(),
    line3: Yup.string(),
    neighborhood: Yup.string().max(
      50,
      intl.formatMessage({
        id: "error.neighborhood.mustBe50Chars",
        defaultMessage: "Neighborhood must be 50 characters or less.",
      })
    ),
    postalCode: Yup.string().required(
      intl.formatMessage({
        id: "error.postalCode.required",
        defaultMessage: "Postal code is a required field.",
      })
    ),
    city: Yup.string().required(
      intl.formatMessage({
        id: "error.city.required",
        defaultMessage: "City is a required field.",
      })
    ),
    isInternational: Yup.boolean(),
    state: Yup.string().when("isInternational", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage({
          id: "error.state.required",
          defaultMessage: "State is a required field.",
        })
      ),
      otherwise: Yup.string(),
    }),
    country: Yup.string().required(
      intl.formatMessage({
        id: "error.country.required",
        description: "Details",
        defaultMessage: "Country is a required field.",
      })
    ),
  });

  useEffect(() => {
    setInitialValues({
      type: edit ? address.type : "",
      line1: edit ? address.line1 : "",
      line2: edit ? address.line2 : "",
      line3: edit ? address.line3 : "",
      neighborhood: edit ? address.neighborhood : "",
      postalCode: edit ? address.postalCode : "",
      city: edit ? address.city : "",
      state: edit ? address.state : "",
      country: edit ? (address.country == "US" ? "USA" : address.country) : "",
      isInternational: false,
    });
  }, []);

  const FormObserver: React.FC<any> = () => {
    const { values } = useFormikContext<any>();
    useEffect(() => {
      if (values.country === "USA" || values.country === "US") {
        values.isInternational = false;
      } else values.isInternational = true;
    }, [values]);
    return null;
  };

  useEffect(() => {
    if (getCountriesQuery.data && getAddressTypesQuery.data) {
      setCountries(
        getCountriesQuery.data.map((c: any) => ({
          text: c.name,
          code: c.code,
        }))
      );

      setAddressTypes(
        getAddressTypesQuery.data.map((type: any) => ({
          text: AddressTypeConverter(type, intl),
          code: type,
        }))
      );
    }
  }, [getCountriesQuery.data, getAddressTypesQuery.data]);

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          bold
          color="white"
          value={
            edit
              ? intl.formatMessage({
                  id: "editAddress",
                  description: "drawer header",
                  defaultMessage: "Edit Address",
                })
              : intl.formatMessage({
                  id: "addAddress",
                  description: "drawer header",
                  defaultMessage: "Add Address",
                })
          }
        />
      </Box>
      <Box>
        <Formik
          innerRef={ref}
          initialValues={initialValues}
          validationSchema={AddressSchema}
          onSubmit={(values) => addOrUpdateAddress(values)}
          enableReinitialize
        >
          {(props: any) => (
            <form onSubmit={props.handleSubmit}>
              <FormObserver />
              <Box sx={{ marginBottom: "60px" }}>
                <DropdownFloating
                  id="select-address-type-dropdown"
                  name="type"
                  placeholder={`${intl.formatMessage({
                    id: "addressType",
                    description: "Details",
                    defaultMessage: "Address Type",
                  })}*`}
                  className="login-input"
                  list={addressTypes}
                  value={props.values.type}
                  valueKey="code"
                  {...props}
                />
                <InputWithPlaceholder
                  id="input-address-line1"
                  name="line1"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "addressLine1",
                    description: "Details",
                    defaultMessage: "Address Line 1",
                  })}*`}
                  value={props.values.line1}
                  className="login-input"
                  {...props}
                />
                <InputWithPlaceholder
                  id="input-address-line2"
                  name="line2"
                  autoComplete="off"
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "addressLine2",
                    description: "Input Label for address line 2",
                    defaultMessage: "Address Line 2",
                  })}
                  value={props.values.line2}
                  className="login-input"
                  {...props}
                />
                <InputWithPlaceholder
                  id="input-address-line3"
                  name="line3"
                  autoComplete="off"
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "addressLine3",
                    description: "Input Label for address line 3",
                    defaultMessage: "Address Line 3",
                  })}
                  value={props.values.line3}
                  className="login-input"
                  {...props}
                />
                <InputWithPlaceholder
                  id="input-address-neighborhood"
                  name="neighborhood"
                  autoComplete="off"
                  type="text"
                  placeholder={intl.formatMessage({
                    id: "drawer.label.address.neighborhood",
                    description: "Input Label for neighborhood",
                    defaultMessage: "Neighborhood*",
                  })}
                  value={props.values.neighborhood}
                  className="login-input"
                  {...props}
                />
                <InputWithPlaceholder
                  id="input-address-postal-code"
                  name="postalCode"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "postalCode",
                    defaultMessage: "Postal Code",
                  })}*`}
                  value={props.values.postalCode}
                  className="login-input"
                  {...props}
                />
                <InputWithPlaceholder
                  id="input-address-city"
                  name="city"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "city",
                    defaultMessage: "City",
                  })}*`}
                  value={props.values.city}
                  className="login-input"
                  {...props}
                />
                {props.values.isInternational ? (
                  <InputWithPlaceholder
                    id="input-address-state"
                    name="state"
                    autoComplete="off"
                    type="text"
                    placeholder={`${intl.formatMessage({
                      id: "state",
                      defaultMessage: "State",
                    })}*`}
                    value={props.values.state}
                    className="login-input"
                    {...props}
                  />
                ) : (
                  <DropdownFloating
                    id="select-state-dropdown"
                    name="state"
                    placeholder={intl.formatMessage({
                      id: "drawer.label.address.state",
                      description: "Dropdown Label for state",
                      defaultMessage: "State*",
                    })}
                    className="login-input"
                    list={StateList}
                    value={props.values.state}
                    valueKey="code"
                    {...props}
                  />
                )}
                <DropdownFloating
                  id="select-country-dropdown"
                  name="country"
                  placeholder={`${intl.formatMessage({
                    id: "country",
                    defaultMessage: "Country",
                  })}*`}
                  className="login-input"
                  list={countries}
                  value={props.values.country}
                  valueKey="code"
                  {...props}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="drawer-address-button-cancel"
                  onClick={() => toggleDrawer()}
                  style={{ marginRight: "14px" }}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <SubmitButton
                  id="drawer-address-button-savechanges"
                  disabled={!props.dirty}
                >
                  <FormattedMessage
                    id="saveChanges"
                    description="Save changes button"
                    defaultMessage="Save Changes"
                  />
                </SubmitButton>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default AddressDrawer;
