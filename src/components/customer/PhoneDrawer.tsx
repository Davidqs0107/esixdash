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

import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Box from "@mui/material/Box";
import { Formik } from "formik";
import * as Yup from "yup";
import PhoneInput, {
  isValidPhoneNumber,
  parsePhoneNumber,
} from "react-phone-number-input";
import api from "../../api/api";
import InternationalizePhoneType from "../common/converters/PhoneTypesI18nMap";
import { MessageContext } from "../../contexts/MessageContext";
import Header from "../common/elements/Header";
import DropdownFloating from "../common/forms/dropdowns/DropdownFloating";
import CancelButton from "../common/elements/CancelButton";
import SubmitButton from "../common/elements/SubmitButton";
import "react-phone-number-input/style.css";
import PhoneNumber from "../common/forms/inputs/PhoneNumber";
import emitter from "../../emitter";

interface IPhoneDrawer {
  personIdentifier: string;
  toggleDrawer?: any;
  phone?: any;
  edit?: boolean;
}

const PhoneDrawer: React.FC<IPhoneDrawer> = ({
  personIdentifier,
  phone = {},
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
  edit = false,
}) => {
  const { setErrorMsg } = useContext(MessageContext);
  const intl = useIntl();
  const [phoneTypes, setPhoneTypes] = useState([]);
  const [initialValues, setInitialValues] = useState({
    type: "",
    phoneNumber: ""
  });

  const getPhoneTypes = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CommonAPI.getPhoneTypes()
      .then((results: any) => {
        setPhoneTypes(
          results.map((r: string) => ({
            text: InternationalizePhoneType(r, intl),
            code: r,
          }))
        );
      })
      .catch((error: any) => setErrorMsg(error));

  const updatePhone = (
    id: string,
    type: string,
    countryCode: any,
    phoneNumber: any
  ) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.updatePhone(id, {
      type,
      countryCode,
      phoneNumber,
    }).catch((error: any) => setErrorMsg(error));

  const addOrUpdatePhone = (values: any) => {
    const parsed = parsePhoneNumber(values.phoneNumber);

    updatePhone(
      personIdentifier,
      values.type,
      parsed && parsed.countryCallingCode ? parsed.countryCallingCode : "",
      parsed && parsed.nationalNumber ? parsed.nationalNumber : ""
    ).then(() => {
      emitter.emit("customer.edit.info.changed", {});
      toggleDrawer();
    });
  };

  const PhoneSchema = Yup.object().shape({
    type: Yup.string().required(
      intl.formatMessage({
        id: "error.phoneType.required",
        defaultMessage: "Phone type is a required field.",
      })
    ),
    phoneNumber: Yup.string()
      .test(
        "test-valid-phone",
        intl.formatMessage({
          id: "error.phoneFormat.invalid",
          defaultMessage: "Invalid phone format",
        }),
        (value) => value !== undefined && isValidPhoneNumber(value)
      )
      .required(
        intl.formatMessage({
          id: "error.phoneNumber.required",
          defaultMessage: "Phone Number is a required field.",
        })
      ),
  });

  useEffect(() => {
    getPhoneTypes();
    setInitialValues({
      type: edit ? phone.type : "",
      phoneNumber: edit ? `+${phone.countryCode} ${phone.phoneNumber}` : "",
    });
  }, []);

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
                  id: "editPhone",
                  description: "drawer header",
                  defaultMessage: "Edit Phone",
                })
              : intl.formatMessage({
                  id: "addPhone",
                  description: "drawer header",
                  defaultMessage: "Add Phone",
                })
          }
        />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={PhoneSchema}
          onSubmit={(values) => addOrUpdatePhone(values)}
          enableReinitialize
        >
          {(props: any) => (
            <form onSubmit={props.handleSubmit}>
              <Box sx={{ marginBottom: "60px" }}>
                <DropdownFloating
                  id="select-phone-type-dropdown"
                  name="type"
                  placeholder={`${intl.formatMessage({
                    id: "phoneType",
                    description: "Details",
                    defaultMessage: "Phone Type",
                  })}*`}
                  className="login-input"
                  list={phoneTypes}
                  value={props.values.type}
                  valueKey="code"
                  {...props}
                />
                <PhoneNumber
                  name="phoneNumber"
                  id="customer-edit-drawer-phone-number"
                  values={props.values}
                  placeholder={intl.formatMessage({
                    id: "phoneNumber",
                    defaultMessage: "Phone Number",
                  })}
                  {...props}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="drawer-phone-button-cancel"
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
                  id="drawer-phone-button-savechanges"
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

export default PhoneDrawer;
