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
 */

import React, { useContext, useEffect, useState } from "react";
import { NavLink, Link as Links, useParams } from "react-router-dom";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import { Box, Grid, Link, Typography } from "@mui/material";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { List, ListInlineItem, Container } from "@mui/material";
import StandardTable from "../../components/common/table/StandardTable";
import { CustomerSearchContext } from "../../contexts/CustomerSearchContext";
import Text from "../../components/common/elements/Text";
import Header from "../../components/common/elements/Header";
import BreadcrumbsNav from "../../components/common/navigation/BreadcrumbsNav";
import QDButton from "../../components/common/elements/QDButton";
import AccountHoldersContext from "../../contexts/account-holders/AccountHoldersContext";
import api from "../../api/api";
import { MessageContext } from "../../contexts/MessageContext";
import { toCustomerName } from "../../components/common/converters/CustomerNameConverter";
import Label from "../../components/common/elements/Label";

interface ICustomerEditParam {
  id: string;
}

const AccountHolders: React.FC = () => {
  const intl = useIntl();
  const customerNumber = useParams<ICustomerEditParam>().id;
  const {
    getAccountHolders,
    addAccountHolder,
    setIsAccountHolder,
    setPrimaryPerson,
    primaryPersonState,
    setIsSecondary,
    setSecondaryPersonId,
    accountHolderContactList,
  } = useContext(AccountHoldersContext);
  const { setErrorMsg } = useContext(MessageContext);

  const accountHolderData = () => {
    if (accountHolderContactList.length) {
      return;
    }
    getAccountHolders(customerNumber);
  };

  const getPerson = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const personObj = await api.CustomerAPI.get(customerNumber).catch((error) =>
      setErrorMsg(error)
    );
    const { primaryPerson } = personObj;
    setPrimaryPerson(primaryPerson);
  };

  const checkForSecondary = (id: string) => {
    if (id === primaryPersonState.id) {
      setIsSecondary(false);
    } else {
      setIsSecondary(true);
      setSecondaryPersonId(id);
    }
  };

  useEffect(() => {
    accountHolderData();
    // getPerson();
    setIsAccountHolder(true);
  }, []);

  const createAccountHolder = () => {
    const dtoa = {
      firstName: "Joe12",
      middleName: "M",
      lastName: "SecondPerson12",
      lastName2: "SecondPerson12",
      gender: "male",
      dob: "19820301",
      nickName: "Dough12",
      title: "Dr",
      suffix: "Jr",
      embossedName: "JOE SECONDPERSON21",
      phoneticFirstName: "Joe12",
      phoneticMiddleName: "Bhuck12",
      phoneticLastName: "SecondPerso2",
      altFirstName: "Joey12",
      altMiddleName: "Doughey12",
      altLastName: "AltDough12",
    };

    addAccountHolder(customerNumber, dtoa);
  };

  const tableMetadata = [
    {
      header: (
        <FormattedMessage
          id="customer.account.holders.name"
          description="Name for Account Holders"
          defaultMessage="Name"
        />
      ),
      render: (rowData: any) => {
        const { person } = rowData;
        return person.firstName ? (
          <Text value={`${person.lastName}, ${person.firstName}`} />
        ) : (
          <Text value={person.firstName} />
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.account.holders.lastActivity"
          description="Last Activity for Account Holders"
          defaultMessage="Primary / Secondary"
        />
      ),
      render: (rowData: any) => {
        const { person } = rowData;
        return (
          <Text
            value={
              person.id === primaryPersonState.id
                ? capitalizeFirst("primary")
                : capitalizeFirst("secondary")
            }
          />
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.account.holders.emailAddress"
          description="Email Address for Account Holders"
          defaultMessage="Email Address"
        />
      ),
      flex: "flex-2",
      render: (rowData: any) => {
        const { emails } = rowData;
        return <Text value={!emails.length ? "" : emails[0].email} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.account.holders.phoneNumber"
          description="Phone Number for Account Holders"
          defaultMessage="Phone Number"
        />
      ),
      render: (rowData: any) => {
        const { contact } = rowData;
        return <Text value={!contact.length ? "" : contact[0].phoneNumber} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.account.holders.edit"
          description="empty column header"
          defaultMessage=" "
        />
      ),
      render: (rowData: any) => {
        const { person } = rowData;
        return (
          <>
            <Links
              className="text-decoration-none text-white"
              to={`/customer/${customerNumber}/account_holders/edit/${person.id}`}
              style={{ color: "#433AA8" }}
            >
              <QDButton
                label={intl.formatMessage(
                  defineMessage({
                    id: "customer.account.holders.edit.accountHolders",
                    defaultMessage: "Edit Account holders Information",
                  })
                )}
                color="primary"
                variant="contained"
                size="small"
                textCase="provided"
                onClick={() => checkForSecondary(person.id)}
              >
                <FormattedMessage
                  id="customer.account.holders.view"
                  description="View"
                  defaultMessage="View"
                />
              </QDButton>
            </Links>
          </>
        );
      },
    },
  ];

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Container>
      <Grid container>
        <Grid item md={12} lg={12}>
          <BreadcrumbsNav aria-label="breadcrumb" className="withBorder">
            <Link href="/customer" underline="none">
              {intl.formatMessage({
                id: "customer",
                defaultMessage: "Customer",
              })}
            </Link>
            <Link href={`/customer/${customerNumber}/detail`} underline="none">
              {customerNumber}
            </Link>
            <Label variant="grey" fontWeight={400}>
              {intl.formatMessage({
                id: "accountHolders",
                defaultMessage: "Account Holders",
              })}
            </Label>
          </BreadcrumbsNav>
        </Grid>
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <Header
          level={2}
          value={intl.formatMessage({
            id: "customer.account.holders.list",
            defaultMessage: "Account Holders",
          })}
          bold
        />
        {/* added both button and drawer here for when the add account holder
             feature is added so that developer may choose witch to use in addition the add customer
             api is added on the AccountHolderState.tsx so call can be made all you need to do is send ID and DTO */}
        {/*
        <QDButton
          id="customer.account.holders-button"
          color="primary"
          variant="contained"
          textCase="provided"
          size="small"
          onClick={createAccountHolder}
        >
          <FormattedMessage
            id="customer.account.holders.addAccountHolder"
            description="Add Account Holder "
            defaultMessage="Add New Account Holder"
          />
        </QDButton> */}
        {/* <DrawerComp */}
        {/*  buttonProps="mr-0 mt-2" */}
        {/*  id="customer.account.holders-button" */}
        {/*  label={ */}
        {/*    <FormattedMessage */}
        {/*      id="customer.account.holders.addAccountHolder" */}
        {/*      description="Add Account Holder " */}
        {/*      defaultMessage="Add New Account Holder" */}
        {/*    /> */}
        {/*  } */}
        {/* > */}
        {/*  <BankDrawer /> */}
        {/* </DrawerComp> */}
      </Box>

      <StandardTable
        id="account-holders-results"
        tableMetadata={tableMetadata}
        dataList={accountHolderContactList}
        tableRowPrefix="search-result"
      />
    </Container>
  );
};

export default AccountHolders;
