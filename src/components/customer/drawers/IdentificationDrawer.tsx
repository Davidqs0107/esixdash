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

import * as Yup from "yup";
import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Field, Formik, useFormikContext } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import { useQueries } from "@tanstack/react-query";
import Header from "../../common/elements/Header";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import OfficialIdTypeConverter from "../../common/converters/OfficialIdTypeConverter";
import DatePicker from "../../common/forms/inputs/DatePicker";
import emitter from "../../../emitter";
import AccountHoldersContext from "../../../contexts/account-holders/AccountHoldersContext";
import StateList from "../../util/ListOfStates";

interface IIdentificationDrawer {
  edit?: boolean;
  identification?: any;
  toggleDrawer?: any;
  personIdentifier: string;
}

const IdentificationDrawer: React.FC<IIdentificationDrawer> = ({
  edit = false,
  identification = {},
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
  personIdentifier,
}) => {
  const intl = useIntl();
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const accountHoldersContext = useContext(AccountHoldersContext);
  const { secondaryPersonId, isSecondary } = accountHoldersContext;

  const formatDate = (date: string) => {
    return date ? moment(date, "YYYY-MM-DD") : null;
  };

  const [countries, setCountries] = useState([]);
  const [officialIdTypes, setOfficialIdTypes] = useState([]);
  const [initialValues, setInitialValues] = useState({
    type: edit ? identification.type : "",
    issuanceDate: edit ? formatDate(identification.issuanceDate) : null,
    expirationDate: edit ? formatDate(identification.expirationDate) : null,
    primary: edit ? identification.primary : "",
    secondary: edit ? identification.secondary : "",
    state: edit ? identification.state : "",
    country: edit ? identification.country : "",
    active: edit ? identification.active : true,
    isInternational: false,
  });

  const [getCountriesQuery, getOfficialIdTypesQuery] = useQueries({
    queries: [
      {
        queryKey: ["getCountryList2"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getCountryList2(),
        onError: (error: any) => setErrorMsg(error),
      },

      {
        queryKey: ["getOfficialIdTypes"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getOfficialIdTypes(),
        onError: (error: any) => setErrorMsg(error),
      },
    ],
  });

  const updateOfficialId = (id: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.updateOfficialId(id, dto).catch((error: any) =>
      setErrorMsg(error)
    );

  const addOrUpdateIdentification = (values: any) => {
    const id = !isSecondary ? personIdentifier : secondaryPersonId;

    updateOfficialId(id, {
      type: values.type,
      primary: values.primary,
      secondary: values.secondary,
      issuanceDate: values.issuanceDate
        ? moment(values.issuanceDate, "YYYY-MM-DD").format("YYYYMMDD")
        : "",
      expirationDate: values.expirationDate
        ? moment(values.expirationDate, "YYYY-MM-DD").format("YYYYMMDD")
        : "",
      state: values.state,
      country: values.country,
    }).then(() => {
      emitter.emit("customer.edit.info.changed", {});
      toggleDrawer();
      setSuccessMsg({
        responseCode: "200000",
        message: intl.formatMessage({
          id: "phoneInfo.updated.successful",
          defaultMessage: "Phone Info Updated Successfully.",
        }),
      });
    });
  };

  const IdentificationSchema = Yup.object().shape({
    type: Yup.string().required(
      intl.formatMessage({
        id: "error.IDType.required",
        defaultMessage: "ID type is a required field.",
      })
    ),
    primary: Yup.string().required(
      intl.formatMessage({
        id: "error.primaryNumber.required",
        defaultMessage: "Primary number is a required field.",
      })
    ),
    secondary: Yup.string(),
    issuanceDate: Yup.string(),
    expirationDate: Yup.string(),
    state: Yup.string(),
    country: Yup.string().required(
      intl.formatMessage({
        id: "error.IDIssuerCountry.required",
        defaultMessage: "ID issuer (country) is a required field.",
      })
    ),
    active: Yup.boolean().required(
      intl.formatMessage({
        id: "error.active.required",
        defaultMessage: "Active is a required field.",
      })
    ),
  });

  useEffect(() => {
    if (getCountriesQuery.data && getOfficialIdTypesQuery.data) {
      setCountries(
        getCountriesQuery.data[0].map((c: any) => ({
          text: c.name,
          code: c.code,
        }))
      );

      setOfficialIdTypes(
        getOfficialIdTypesQuery.data.map((r: string) => ({
          text: OfficialIdTypeConverter(r, intl),
          code: r,
        }))
      );
    }
  }, [getCountriesQuery.data, getOfficialIdTypesQuery.data]);

  const FormObserver: React.FC<any> = () => {
    const { values } = useFormikContext<any>();
    useEffect(() => {
      if (values.country === "USA" || values.country === "US") {
        values.isInternational = false;
      } else values.isInternational = true;
    }, [values]);
    return null;
  };

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
                  id: "editIdentification",
                  description: "drawer header",
                  defaultMessage: "Edit Identification",
                })
              : intl.formatMessage({
                  id: "addIdentification",
                  description: "drawer header",
                  defaultMessage: "Add Identification",
                })
          }
        />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={IdentificationSchema}
          onSubmit={(values) => addOrUpdateIdentification(values)}
          enableReinitialize
        >
          {(props: any) => (
            <form onSubmit={props.handleSubmit}>
              <FormObserver />
              <Box sx={{ marginBottom: "60px" }}>
                <DropdownFloating
                  id="select-identification-type-dropdown"
                  name="type"
                  placeholder={`${intl.formatMessage({
                    id: "IDType",
                    defaultMessage: "ID Type",
                  })}*`}
                  list={officialIdTypes}
                  value={props.values.type}
                  valueKey="code"
                  {...props}
                />
                <InputWithPlaceholder
                  id="input-identification-primary"
                  name="primary"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "primaryNumber",
                    defaultMessage: "Primary Number",
                  })}*`}
                  value={props.values.primary}
                  {...props}
                />
                <InputWithPlaceholder
                  id="input-identification-secondary"
                  name="secondary"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "secondaryNumber",
                    description: "Details",
                    defaultMessage: "Secondary Number",
                  })}*`}
                  value={props.values.secondary}
                  {...props}
                />
                <Field
                  id="customer-edit-issuance-date-picker"
                  name="issuanceDate"
                  label={`${intl.formatMessage({
                    id: "issuedDate",
                    defaultMessage: "Issued Date",
                  })}*`}
                  component={DatePicker}
                  maxDate="4100-01-01"
                  value={props.values.issuanceDate}
                  {...props}
                />
                <Field
                  id="customer-edit-expiration-date-picker"
                  name="expirationDate"
                  label={`${intl.formatMessage({
                    id: "expirationDate",
                    defaultMessage: "Expiration Date",
                  })}*`}
                  component={DatePicker}
                  maxDate="4100-01-01"
                  value={props.values.expirationDate}
                  minDate={moment().format("YYYY-MM-DD")}
                  {...props}
                />
                <DropdownFloating
                  id="select-country-dropdown"
                  name="country"
                  placeholder={`${intl.formatMessage({
                    id: "IDIssuerCountry",
                    description: "Details",
                    defaultMessage: "ID Issuer (Country)",
                  })}*`}
                  list={countries}
                  value={props.values.country}
                  valueKey="code"
                  {...props}
                />
                {props.values.isInternational ? (
                  <InputWithPlaceholder
                    id="input-identification-state"
                    name="state"
                    autoComplete="off"
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "IDIssuerState",
                      description: "Input Label for id issuer state",
                      defaultMessage: "ID Issuer (State)",
                    })}
                    value={props.values.state}
                    {...props}
                  />
                ) : (
                  <DropdownFloating
                    id="select-state-dropdown"
                    name="state"
                    placeholder={intl.formatMessage({
                      id: "drawer.label.identification.issuerState",
                      description: "Input Label for id issuer state",
                      defaultMessage: "ID Issuer (State)",
                    })}
                    className="login-input"
                    list={StateList}
                    value={props.values.state}
                    valueKey="code"
                    {...props}
                  />
                )}
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="drawer-identification-button-cancel"
                  style={{ marginRight: "14px" }}
                  onClick={() => toggleDrawer()}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <SubmitButton
                  id="drawer-identification-button-savechanges"
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

export default IdentificationDrawer;
