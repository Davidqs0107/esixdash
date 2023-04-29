/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
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

import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Helmet from "react-helmet";
import { Formik } from "formik";
import moment from "moment";
import { Box, Grid, Link, Typography, Container } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useQuery } from "@tanstack/react-query";
import Header from "../../components/common/elements/Header";
import api from "../../api/api";
import { MessageContext } from "../../contexts/MessageContext";
import BrandingWrapper from "../../app/BrandingWrapper";
import AddressTypeConverter from "../../components/common/converters/AddressTypeConverter";
import InternationalizePhoneType from "../../components/common/converters/PhoneTypesI18nMap";
import InternationalizeEmailType from "../../components/common/converters/EmailTypesI18nMap";
import EmailStateConverter from "../../components/common/converters/EmailStateConverter";
import OfficialIdTypeConverter from "../../components/common/converters/OfficialIdTypeConverter";
import DrawerComp from "../../components/common/DrawerComp";
import TextRender from "../../components/common/TextRender";
import StandardTable from "../../components/common/table/StandardTable";
import CheckmarkConverter from "../../components/common/converters/CheckmarkConverter";
import AddressDrawer from "../../components/customer/drawers/AddressDrawer";
import EmailDrawer from "../../components/customer/drawers/EmailDrawer";
import PhoneDrawer from "../../components/customer/PhoneDrawer";
import IdentificationDrawer from "../../components/customer/drawers/IdentificationDrawer";
import emitter from "../../emitter";
import { ContentVisibilityContext } from "../../contexts/ContentVisibilityContext";
import BreadcrumbsNav from "../../components/common/navigation/BreadcrumbsNav";
import PersonalInformationDrawer from "../../components/customer/drawers/DrawerPersonalInformation";
import { Info, InfoSubtitle, InfoTitle } from "../../components/common/info";
import AccountHoldersContext from "../../contexts/account-holders/AccountHoldersContext";
import Icon from "../../components/common/Icon";
import EllipseMenu from "../../components/common/EllipseMenu";
import QDButton from "../../components/common/elements/QDButton";
import toCountryName from "../../components/common/converters/CountryNameConverter";
import PersonHistoryDrawer from "../../components/customer/drawers/PersonHistoryDrawer";
import DateAndTimeConverter from "../../components/common/converters/DateAndTimeConverter";
import { toCustomerName } from "../../components/common/converters/CustomerNameConverter";
import Label from "../../components/common/elements/Label";

interface ICustomerEditParam {
  id: string;
}

interface ISecondaryIdEditParam {
  secondaryId: string;
}

export interface IPersonalInfo {
  personId: string;
  title: string | null;
  firstName: string;
  middleName: string;
  lastName: string;
  lastName2: string;
  suffix: string | null;
  nickName: string;
  gender: string | null;
  dob: string;
  created: string;
  modified: string;
}

const useStyles = makeStyles({
  breadCrumbsText: {
    fontFamily: "Montserrat",
    fontWeight: "bold",
    fontSize: "12px",
  },
});

const CustomerEdit: React.FC = () => {
  const intl = useIntl();
  const history = useHistory();
  const classes = useStyles();
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const { canSeeCustomerOfficialIds } = useContext(ContentVisibilityContext);
  const {
    accountHoldersList,
    isAccountHolder,
    primaryPersonState,
    secondaryPersonId,
    isSecondary,
    accountHolderContactList,
  } = useContext(AccountHoldersContext);
  const customerNumber = useParams<ICustomerEditParam>().id;
  const { secondaryId } = useParams<ISecondaryIdEditParam>();
  const { readOnly } = useContext(ContentVisibilityContext);
  const [phones, setPhones] = useState([]);
  const [emails, setEmails] = useState([]);
  const [identifications, setIdentifications] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [configurations, setConfigurations] = useState([]);
  const [availableConfigurations, setAvailableConfigurations] = useState([]);
  const [personId, setPersonId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [countries, setCountries] = useState([]);
  const [initialValues, setInitialValues] = useState<IPersonalInfo>({
    personId: "",
    title: null,
    firstName: "",
    middleName: "",
    lastName: "",
    lastName2: "",
    suffix: null,
    nickName: "",
    gender: null,
    dob: "",
    created: "",
    modified: "",
  });

  const { data: getCountryList2Data } = useQuery({
    queryKey: ["getCountryList2"],
    queryFn: () =>
      // @ts-ignore
      api.CommonAPI.getCountryList2(),
    onError: (error: any) => setErrorMsg(error),
  });

  const addressMetadata = [
    {
      header: (
        <FormattedMessage
          id="customer.edit.address.addressType"
          defaultMessage="Type"
        />
      ),
      render: (rowData: any) => {
        const { type } = rowData;
        return <TextRender data={AddressTypeConverter(type, intl)} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.phone.addressLine1"
          defaultMessage="Address"
        />
      ),
      render: (rowData: any) => {
        const { line1, line2, line3 } = rowData;
        return (
          <>
            {line1 && <TextRender data={line1} truncated={false} />}{" "}
            {line2 && <TextRender data={line2} truncated={false} />}{" "}
            {line3 && <TextRender data={line3} truncated={false} />}
          </>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="cityStatePostalCode"
          defaultMessage="City, State, Postal Code"
        />
      ),
      render: (rowData: any) => {
        const { neighborhood, city, state, postalCode } = rowData;
        const lines = `${
          neighborhood ? neighborhood + ", " : ""
        } ${city}, ${state} ${postalCode}`;
        return <TextRender data={lines} truncated={false} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.phone.country"
          defaultMessage="Country"
        />
      ),
      render: (rowData: any) => {
        const { country } = rowData;
        return <TextRender data={toCountryName(country, countries)} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.address.button"
          description=" "
          defaultMessage=" "
        />
      ),
      width: "90px",
      flex: "text-right",
      render: (rowData: any) => {
        const { id, type } = rowData;
        return (
          <>
            <EllipseMenu
              anchorOriginVertical="top"
              anchorOriginHorizontal="left"
              transformOriginVertical={10}
              transformOriginHorizontal={200}
              separatorOnLastItem
            >
              <DrawerComp
                id={`customer-edit-address-${type}-button`}
                buttonProps="w-100"
                bodyInteractive="regular"
                variant="text"
                disabled={readOnly}
                label={intl.formatMessage({
                  id: "customer.edit.button.address",
                  description: "Edit customer address button",
                  defaultMessage: "Edit",
                })}
              >
                <AddressDrawer
                  edit
                  address={rowData}
                  personIdentifier={personId}
                />
              </DrawerComp>

              <QDButton
                className="MuiMenuItem-delete"
                onClick={() => deleteAddress(personId, id)}
                id="customer-delete-address-button"
                color="primary"
                variant="text"
                size="small"
                disabled={readOnly}
                label={intl.formatMessage({
                  id: "customer.delete.button.address",
                  description: "Delete customer address button",
                  defaultMessage: "Delete",
                })}
              />
            </EllipseMenu>
          </>
        );
      },
    },
  ];

  const phonesMetadata = [
    {
      header: (
        <FormattedMessage
          id="customer.edit.phone.phoneType"
          defaultMessage="Type"
        />
      ),
      width: "150px",
      render: (rowData: any) => {
        const { type } = rowData;
        return <TextRender data={InternationalizePhoneType(type, intl)} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.phone.phoneNumber"
          defaultMessage="Phone Number"
        />
      ),
      render: (rowData: any) => {
        const { countryCode, phoneNumber } = rowData;
        return <TextRender data={`+${countryCode} ${phoneNumber}`} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.phone.button"
          description=" "
          defaultMessage=" "
        />
      ),
      flex: "text-right",
      render: (rowData: any) => {
        const { id, phoneNumber } = rowData;
        return (
          <>
            <EllipseMenu
              anchorOriginVertical="top"
              anchorOriginHorizontal="left"
              transformOriginVertical={10}
              transformOriginHorizontal={200}
              separatorOnLastItem
            >
              <DrawerComp
                id={`customer-edit-phone-${phoneNumber}-button`}
                buttonProps="w-100"
                bodyInteractive="regular"
                variant="text"
                disabled={readOnly}
                label={intl.formatMessage({
                  id: "customer.edit.button.phone",
                  description: "Edit customer phone button",
                  defaultMessage: "Edit",
                })}
              >
                <PhoneDrawer personIdentifier={personId} edit phone={rowData} />
              </DrawerComp>

              <QDButton
                className="MuiMenuItem-delete"
                onClick={() => deletePhone(personId, id)}
                id="customer-delete-phone-button"
                color="primary"
                variant="text"
                size="small"
                disabled={readOnly}
                label={intl.formatMessage({
                  id: "customer.delete.button.address",
                  description: "Delete customer address button",
                  defaultMessage: "Delete",
                })}
              />
            </EllipseMenu>
          </>
        );
      },
    },
  ];

  const emailsMetadata = [
    {
      header: (
        <FormattedMessage
          id="customer.edit.email.emailType"
          defaultMessage="Type"
        />
      ),
      width: "100px",
      render: (rowData: any) => {
        const { type } = rowData;
        return <TextRender data={InternationalizeEmailType(type, intl)} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.email.email"
          defaultMessage="Email Address"
        />
      ),
      width: "220px",
      render: (rowData: any) => {
        const { email } = rowData;
        return <TextRender data={email} truncated={false} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.email.verified"
          defaultMessage="Verified?"
        />
      ),
      render: (rowData: any) => {
        const { state } = rowData;

        if (state === "verified") {
          return (
            <>
              <Grid container columnGap={1} alignItems="center">
                <TextRender data="Yes" />
                <img
                  src={Icon.verifiedCheckmark}
                  height={12}
                  width={12}
                  alt="checkmark"
                />
              </Grid>
            </>
          );
        }
        return <TextRender data={EmailStateConverter(state, intl)} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.button"
          description=" "
          defaultMessage=" "
        />
      ),
      width: "90px",
      flex: "text-right",
      render: (rowData: any) => {
        const { id, type } = rowData;
        return (
          <>
            <EllipseMenu
              anchorOriginVertical="top"
              anchorOriginHorizontal="left"
              transformOriginVertical={10}
              transformOriginHorizontal={200}
              separatorOnLastItem
            >
              <DrawerComp
                id={`customer-edit-email-${type}-button`}
                buttonProps="w-100"
                bodyInteractive="regular"
                variant="text"
                disabled={readOnly}
                label={intl.formatMessage({
                  id: "customer.edit.button.email",
                  description: "Edit customer email button",
                  defaultMessage: "Edit",
                })}
              >
                <EmailDrawer personIdentifier={personId} edit email={rowData} />
              </DrawerComp>

              <QDButton
                className="MuiMenuItem-delete"
                onClick={() => deleteEmail(personId, id)}
                id="customer-delete-email-button"
                color="primary"
                variant="text"
                size="small"
                disabled={readOnly}
                label={intl.formatMessage({
                  id: "customer.delete.button.address",
                  description: "Delete customer address button",
                  defaultMessage: "Delete",
                })}
              />
            </EllipseMenu>
          </>
        );
      },
    },
  ];

  const identificationMetadata = [
    {
      header: (
        <FormattedMessage
          id="customer.edit.identification.idtype"
          defaultMessage="Type"
        />
      ),
      width: "10%",
      render: (rowData: any) => {
        const { type } = rowData;
        return <TextRender data={OfficialIdTypeConverter(type, intl)} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.identification.idNumber"
          defaultMessage="ID Number"
        />
      ),
      width: "12.5%",
      render: (rowData: any) => {
        const { primary } = rowData;
        return <TextRender data={primary} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.identification.idNumberSecondary"
          defaultMessage="ID Number Secondary"
        />
      ),
      width: "15%",
      render: (rowData: any) => {
        const { secondary } = rowData;
        return <TextRender data={secondary} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.identification.issueDate"
          defaultMessage="Issued Date"
        />
      ),
      width: "10%",
      render: (rowData: any) => {
        const { issuanceDate } = rowData;
        return issuanceDate ? (
          <FormattedDate
            value={moment(issuanceDate, "YYYYMMDD").toDate()}
            dateStyle="long"
          />
        ) : (
          ""
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.identification.expirationDate"
          defaultMessage="Expiration Date"
        />
      ),
      width: "10%",
      render: (rowData: any) => {
        const { expirationDate } = rowData;
        return expirationDate ? (
          <FormattedDate
            value={moment(expirationDate, "YYYYMMDD").toDate()}
            dateStyle="long"
          />
        ) : (
          ""
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.identification.issuerCountry"
          defaultMessage="ID Issuer (country)"
        />
      ),
      width: "10%",
      render: (rowData: any) => {
        const { country } = rowData;
        return <TextRender data={country} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.identification.issuerState"
          defaultMessage="ID Issuer (state)"
        />
      ),
      width: "10%",
      render: (rowData: any) => {
        const { state } = rowData;
        return <TextRender data={state} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.identification.active"
          defaultMessage="Active"
        />
      ),
      width: "7.5%",
      render: (rowData: any) => {
        const { active } = rowData;
        return <CheckmarkConverter width="12" height="12" bool={active} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.edit.button"
          description=" "
          defaultMessage=" "
        />
      ),
      width: "5%",
      flex: "text-right",
      render: (rowData: any) => {
        const { id, type } = rowData;
        return (
          <>
            <EllipseMenu
              anchorOriginVertical="top"
              anchorOriginHorizontal="left"
              transformOriginVertical={10}
              transformOriginHorizontal={200}
              separatorOnLastItem
            >
              <DrawerComp
                id={`customer-edit-identification-${type}-button`}
                buttonProps="w-100"
                bodyInteractive="regular"
                variant="text"
                disabled={readOnly}
                label={intl.formatMessage({
                  id: "customer.edit.button.email",
                  description: "Edit customer id button",
                  defaultMessage: "Edit",
                })}
              >
                <IdentificationDrawer
                  personIdentifier={personId}
                  edit
                  identification={rowData}
                />
              </DrawerComp>

              <QDButton
                className="MuiMenuItem-delete"
                onClick={() => deleteOfficialId(personId, id)}
                id="customer-delete-id-button"
                color="primary"
                variant="text"
                size="small"
                disabled
                label={intl.formatMessage({
                  id: "customer.delete.button.address",
                  description: "Delete customer address button",
                  defaultMessage: "Delete",
                })}
              />
            </EllipseMenu>
          </>
        );
      },
    },
  ];

  const getCustomerAddresses = (personIdentifier: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.getAddress(personIdentifier).catch((error: any) =>
      setErrorMsg(error)
    );

  const deleteAddress = (personIdentifier: string, addressId: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.deleteAddress(personIdentifier, addressId)
      .then(() => {
        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "address.success.deleted",
            defaultMessage: `Address Deleted Successfully`,
          }),
        });
        emitter.emit("customer.edit.info.changed", {});
      })
      .catch((error: any) => setErrorMsg(error));

  const getCustomerPhones = (personIdentifier: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.getPhones(personIdentifier).catch((error: any) =>
      setErrorMsg(error)
    );

  const deletePhone = (personIdentifier: string, phoneId: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.deletePhone(personIdentifier, phoneId)
      .then(() => {
        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "phone.success.deleted",
            defaultMessage: `Phone Deleted Successfully`,
          }),
        });
        emitter.emit("customer.edit.info.changed", {});
      })
      .catch((error: any) => setErrorMsg(error));

  const getCustomerEmails = (personIdentifier: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.getEmailList(personIdentifier).catch((error: any) =>
      setErrorMsg(error)
    );

  const deleteEmail = (personIdentifier: string, emailId: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.deleteEmail(personIdentifier, emailId)
      .then(() => {
        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "email.success.deleted",
            defaultMessage: `Email Deleted Successfully`,
          }),
        });
        emitter.emit("customer.edit.info.changed", {});
      })
      .catch((error: any) => setErrorMsg(error));

  const getCustomer = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.get(customerNumber).catch((error: any) =>
      setErrorMsg(error)
    );

  const getOfficialIds = (personIdentifier: string) =>
    // @ts-ignore
    api.PersonAPI.getOfficialIds(personIdentifier)
      .then((result: any) => setIdentifications(result))
      .catch((error: any) => setErrorMsg(error));

  const deleteOfficialId = (personIdentifier: string, officialId: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.deleteOfficialId(personIdentifier, officialId)
      .then(() => {
        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "ID.success.deleted",
            defaultMessage: `ID Deleted Successfully`,
          }),
        });
        emitter.emit("customer.edit.info.changed", {});
      })
      .catch((error: any) => setErrorMsg(error));

  const getInwardCustomerGraphs = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerGraphAPI.getInwardCustomerGraphs(customerNumber).catch(
      (error: any) => setErrorMsg(error)
    );

  const getOutwardCustomerGraphs = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerGraphAPI.getOutwardCustomerGraphs(customerNumber).catch(
      (error: any) => setErrorMsg(error)
    );

  const shouldRenderAddButton = (list: any, dropdownList: any) => {
    const types = list.map((a: any) => a.type);
    return !dropdownList.every((v: any) => types.includes(v.code));
  };

  // const getCustomerChildren = (customerNumber: string) =>
  //   api.CustomerAPI.getCustomerChildren(customerNumber, {}) // use api defaults
  //     .then((childList: any) => setChildren(childList.data))
  //     .catch((error: any) => setErrorMsg(error));

  const getCustomerInfo = () => {
    if (secondaryId && !accountHoldersList.length) {
      history.push(`/customer/${customerNumber}/account_holders`);
    }

    setPersonId(primaryPersonState.id);

    setAddresses(primaryPersonState.address);
    setEmails(primaryPersonState.emails);
    setPhones(primaryPersonState.contact);

    setInitialValues({
      personId: primaryPersonState.id,
      title: primaryPersonState.title,
      firstName: primaryPersonState.firstName,
      middleName: primaryPersonState.middleName,
      lastName: primaryPersonState.lastName,
      lastName2: primaryPersonState.lastName2,
      suffix: primaryPersonState.suffix,
      nickName: primaryPersonState.nickName,
      gender: primaryPersonState.gender,
      dob: primaryPersonState.dob,
      created: primaryPersonState.creationTime,
      modified: primaryPersonState.modifiedTime,
    });
  };

  const getSecondaryCustomerInfo = () => {
    const secondaryPerson = accountHolderContactList.filter(
      (contact: { person: any }) => contact.person.id === secondaryPersonId
    );

    const promises = [
      getCustomerAddresses(secondaryPerson[0].person.id),
      getCustomerEmails(secondaryPerson[0].person.id),
      getCustomerPhones(secondaryPerson[0].person.id),
    ];

    Promise.all(promises).then((results) => {
      setAddresses(results[0]);
      setEmails(results[1]);
      setPhones(results[2]);
    });

    setInitialValues({
      personId: secondaryPerson[0].person.id,
      title: secondaryPerson[0].person.title
        ? secondaryPerson[0].person.title
        : null,
      firstName: secondaryPerson[0].person.firstName,
      middleName: secondaryPerson[0].person.middleName,
      lastName: secondaryPerson[0].person.lastName,
      lastName2: secondaryPerson[0].person.lastName2,
      suffix: secondaryPerson[0].person.suffix
        ? secondaryPerson[0].person.suffix
        : null,
      nickName: secondaryPerson[0].person.nickName,
      gender: secondaryPerson[0].person.gender
        ? secondaryPerson[0].person.gender
        : null,
      dob: secondaryPerson[0].person.dob,
      created: secondaryPerson[0].person.created,
      modified: secondaryPerson[0].person.modified,
    });
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    !isSecondary ? getCustomerInfo() : getSecondaryCustomerInfo();
    emitter.on("customer.edit.info.changed", () => {
      // eslint-disable-next-line no-unused-expressions
      !isSecondary ? getCustomerInfo() : getSecondaryCustomerInfo();
    });
  }, []);

  useEffect(() => {
    if (canSeeCustomerOfficialIds) {
      const id: string = !isSecondary ? personId : secondaryPersonId;
      if (id) {
        getOfficialIds(id);
        emitter.on("customer.edit.info.changed", () => {
          getOfficialIds(id);
        });
      }
    }
  }, [personId, secondaryPersonId, canSeeCustomerOfficialIds]);

  useEffect(() => {
    if (getCountryList2Data) {
      setCountries(
        getCountryList2Data.map((c: any) => ({ text: c.name, code: c.code }))
      );
    }
  }, [getCountryList2Data]);

  return (
    <Container>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "page.title.editCustomer",
            defaultMessage: "Edit Customer",
          })}`}
        </title>
      </Helmet>
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
            <Grid container>
              <Grid item md={12} lg={12}>
                <BreadcrumbsNav aria-label="breadcrumb" className="withBorder">
                  <Link href="/customer" underline="none">
                    {intl.formatMessage({
                      id: "customers",
                      defaultMessage: "Customers",
                    })}
                  </Link>
                  <Link
                    href={`/customer/${customerNumber}/detail`}
                    underline="none"
                  >
                    {customerNumber}
                  </Link>
                  {isAccountHolder && (
                    <Link
                      href={`/customer/${customerNumber}/account_holders`}
                      underline="none"
                    >
                      {intl.formatMessage({
                        id: "accountHolders",
                        defaultMessage: "Account Holders",
                      })}
                    </Link>
                  )}
                  <Label variant="grey" fontWeight={400}>
                    {isAccountHolder
                      ? toCustomerName({
                          primaryPerson: primaryPersonState,
                        } as any)
                      : toCustomerName({ primaryPerson: initialValues } as any)}
                  </Label>
                </BreadcrumbsNav>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item md={12} lg={12} sx={{ marginBottom: "16px" }}>
                <Header
                  value={
                    isAccountHolder
                      ? intl.formatMessage({
                          id: "editAccountHolder",
                          defaultMessage: "Edit Account Holder",
                        })
                      : intl.formatMessage({
                          id: "customer.edit.header.title",
                          defaultMessage: "Person Details",
                        })
                  }
                  level={1}
                  bold
                />
              </Grid>
            </Grid>
            <Grid container sx={{ marginTop: "3rem" }}>
              <Grid item md={6} lg={6} sx={{ marginBottom: "16px" }}>
                <Header
                  value={intl.formatMessage({
                    id: "customer.edit.personalInformation",
                    defaultMessage: "Personal Information",
                  })}
                  level={2}
                  bold
                />
              </Grid>
              <Grid item md={6} lg={6}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <DrawerComp
                    id="customer-edit-change-customer-info"
                    buttonProps="mr-0 mt-2"
                    disabled={readOnly}
                    label={intl.formatMessage({
                      id: "customer.edit.button.editPersonalInfo",
                      defaultMessage: "EDIT",
                    })}
                  >
                    <PersonalInformationDrawer personInfo={initialValues} />
                  </DrawerComp>
                  <Box ml={2}>
                    <DrawerComp
                      id="customer-edit-change-customer-info"
                      disabled={readOnly}
                      label={intl.formatMessage({
                        id: "button.viewChangeHistory",
                        defaultMessage: "VIEW CHANGE HISTORY",
                      })}
                    >
                      <PersonHistoryDrawer
                        name={initialValues}
                        emails={emails}
                        phones={phones}
                        addresses={addresses}
                        identifications={identifications}
                        personId={personId}
                      />
                    </DrawerComp>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "customer.edit.label.title",
                        defaultMessage: "Title",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>
                      {initialValues.title ? initialValues.title : "- -"}
                    </InfoSubtitle>
                  </Info>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "customer.edit.label.firstName",
                        description: "Input Label for first name",
                        defaultMessage: "Given Name",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>{initialValues.firstName}</InfoSubtitle>
                  </Info>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "customer.edit.label.middleName",
                        description: "Input Label for middle name",
                        defaultMessage: "Middle Name",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>
                      {initialValues.middleName
                        ? initialValues.middleName
                        : "- -"}
                    </InfoSubtitle>
                  </Info>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "customer.edit.label.lastName",
                        description: "Input Label for last name",
                        defaultMessage: "Family Name",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>{initialValues.lastName}</InfoSubtitle>
                  </Info>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "customer.edit.label.secondFamilyName",
                        description: "Input Label for second family name",
                        defaultMessage: "Second Family Name",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>
                      {initialValues.lastName2
                        ? initialValues.lastName2
                        : "- -"}
                    </InfoSubtitle>
                  </Info>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "customer.edit.label.suffix",
                        defaultMessage: "Suffix",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>
                      {initialValues.suffix ? initialValues.suffix : "- -"}
                    </InfoSubtitle>
                  </Info>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "customer.edit.label.nickname",
                        description: "Input Label for nickname",
                        defaultMessage: "Nickname",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>
                      {initialValues.nickName ? initialValues.nickName : "- -"}
                    </InfoSubtitle>
                  </Info>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "gender",
                        defaultMessage: "Gender",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>
                      <span>{initialValues.gender}</span>
                    </InfoSubtitle>
                  </Info>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "customer.edit.label.dob",
                        defaultMessage: "Date of Birth",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>
                      {moment(initialValues.dob).format("MMM D, YYYY")}
                    </InfoSubtitle>
                  </Info>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "customer.edit.label.created",
                        defaultMessage: "Created",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>
                      {initialValues.created ? (
                        <DateAndTimeConverter
                          epoch={initialValues.created}
                          monthFormat={undefined}
                        />
                      ) : (
                        "- -"
                      )}
                    </InfoSubtitle>
                  </Info>
                </Grid>
                <Grid item xs={2} md={2} lg={2}>
                  <Info>
                    <InfoTitle>
                      {intl.formatMessage({
                        id: "customer.edit.label.modified",
                        defaultMessage: "Modified",
                      })}
                    </InfoTitle>
                    <InfoSubtitle>
                      {initialValues.modified ? (
                        <DateAndTimeConverter
                          epoch={initialValues.modified}
                          monthFormat={undefined}
                        />
                      ) : (
                        "- -"
                      )}
                    </InfoSubtitle>
                  </Info>
                </Grid>
              </Grid>
            </Box>
            <Grid container sx={{ marginTop: "3rem" }}>
              <Grid item md={6} lg={6} sx={{ marginBottom: "16px" }}>
                <Header
                  value={intl.formatMessage({
                    id: "customer.edit.addresses",
                    defaultMessage: "Addresses",
                  })}
                  level={2}
                  bold
                />
              </Grid>
              <Grid item lg={6} textAlign="right">
                <DrawerComp
                  id="customer-edit-add-new-address-button"
                  buttonProps="mr-0 mt-2"
                  disabled={readOnly}
                  label={intl.formatMessage({
                    id: "customer.edit.button.addNewAddress",
                    description: "Add new address button text",
                    defaultMessage: "ADD NEW ADDRESS",
                  })}
                >
                  <AddressDrawer personIdentifier={personId} />
                </DrawerComp>
              </Grid>
            </Grid>
            <Box>
              <StandardTable
                id="customer-edit-address-table"
                tableMetadata={addressMetadata}
                dataList={addresses}
                tableRowPrefix="address-table"
                //noBg
              />
            </Box>
            <Box sx={{ marginTop: "3rem" }}>
              <Grid container spacing={0} justifyContent="space-between">
                <Grid container item lg={6} justifyContent="space-between">
                  <Grid item lg={6} sx={{ marginBottom: "16px" }}>
                    <Header
                      value={intl.formatMessage({
                        id: "customer.edit.emails",
                        defaultMessage: "Email Addresses",
                      })}
                      level={2}
                      bold
                    />
                  </Grid>
                  <Grid item lg={6}>
                    <Box
                      display="flex"
                      justifyContent="flex-end"
                      marginRight={4}
                    >
                      <DrawerComp
                        id="customer-edit-add-new-email-button"
                        buttonProps="mr-0 mt-2"
                        disabled={readOnly}
                        label={intl.formatMessage({
                          id: "customer.edit.button.addNewEmail",
                          description: "Add new email button text",
                          defaultMessage: "ADD NEW EMAIL",
                        })}
                      >
                        <EmailDrawer
                          personIdentifier={
                            !isSecondary ? personId : secondaryPersonId
                          }
                        />
                      </DrawerComp>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container item lg={6} justifyContent="space-between">
                  <Grid item xs={6} md={6} lg={6} sx={{ marginBottom: "16px" }}>
                    <Box marginLeft={4}>
                      <Header
                        value={intl.formatMessage({
                          id: "customer.edit.phones",
                          defaultMessage: "Phone Numbers",
                        })}
                        level={2}
                        bold
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={6} lg={6}>
                    <Box display="flex" justifyContent="flex-end">
                      <DrawerComp
                        id="customer-edit-add-new-phone-button"
                        disabled={readOnly}
                        buttonProps="mr-0 mt-2"
                        label={intl.formatMessage({
                          id: "customer.edit.button.addNewPhone",
                          description: "Add new phone button text",
                          defaultMessage: "ADD NEW PHONE",
                        })}
                      >
                        <PhoneDrawer personIdentifier={personId} />
                      </DrawerComp>
                    </Box>
                  </Grid>
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <Box marginRight={4}>
                    <StandardTable
                      id="customer-edit-emails-table"
                      tableMetadata={emailsMetadata}
                      dataList={emails}
                      tableRowPrefix="emails-table"
                      //noBg
                    />
                  </Box>
                </Grid>
                <Grid item xs={6} md={6} lg={6}>
                  <Box marginLeft={4}>
                    <StandardTable
                      id="customer-edit-phones-table"
                      tableMetadata={phonesMetadata}
                      dataList={phones}
                      tableRowPrefix="phones-table"
                      //noBg
                    />
                  </Box>
                </Grid>
              </Grid>
            </Box>

            {canSeeCustomerOfficialIds && (
              <>
                <Grid container sx={{ marginTop: "3rem" }}>
                  <Grid item md={6} lg={6} sx={{ marginBottom: "16px" }}>
                    <Header
                      value={intl.formatMessage({
                        id: "customer.edit.identification",
                        defaultMessage: "Identification",
                      })}
                      level={2}
                      bold
                    />
                  </Grid>
                  <Grid item lg={6} textAlign="right">
                    <DrawerComp
                      id="customer-edit-add-new-identification-button"
                      buttonProps="mr-0 mt-2"
                      disabled={readOnly}
                      label={intl.formatMessage({
                        id: "customer.edit.button.addNewIdentification",
                        description: "Add new identification button text",
                        defaultMessage: "ADD NEW IDENTIFICATION",
                      })}
                    >
                      <IdentificationDrawer personIdentifier={personId} />
                    </DrawerComp>
                  </Grid>
                </Grid>
                <Box>
                  <StandardTable
                    id="customer-edit-identification-table"
                    tableMetadata={identificationMetadata}
                    dataList={identifications}
                    tableRowPrefix="identifications-table"
                    //noBg
                  />
                </Box>
              </>
            )}
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default CustomerEdit;
