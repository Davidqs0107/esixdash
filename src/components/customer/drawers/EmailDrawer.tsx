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

import Box from "@mui/material/Box";
import { Formik } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import Header from "../../common/elements/Header";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import api from "../../../api/api";
import InternationalizeEmailType from "../../common/converters/EmailTypesI18nMap";
import { MessageContext } from "../../../contexts/MessageContext";
import EmailStateConverter from "../../common/converters/EmailStateConverter";
import emitter from "../../../emitter";
import AccountHoldersContext from "../../../contexts/account-holders/AccountHoldersContext";
import { useQueries } from "@tanstack/react-query";

interface IEmailDrawer {
  personIdentifier: string;
  toggleDrawer?: any;
  email?: any;
  edit?: boolean;
}

const EmailDrawer: React.FC<IEmailDrawer> = ({
  personIdentifier,
  email = {},
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
  edit = false,
}) => {
  const intl = useIntl();
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const [emailTypes, setEmailTypes] = useState([]);
  const [emailStates, setEmailStates] = useState([]);
  const [initialValues, setInitialValues] = useState({
    type: edit ? email.type : "",
    email: edit ? email.email : "",
    state: edit ? email.state : "",
  });

  const accountHoldersContext = useContext(AccountHoldersContext);
  const { secondaryPersonId, isSecondary } = accountHoldersContext;

  const [getEmailTypesQuery, getEmailStatesQuery] = useQueries({
    queries: [
      {
        queryKey: ["getEmailTypes"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getEmailTypes(),
        onError: (error: any) => setErrorMsg(error),
      },

      {
        queryKey: ["getEmailStates"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getEmailStates(),
        onError: (error: any) => setErrorMsg(error),
      },
    ],
  });

  const updateEmail = (id: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.updateEmail(id, dto).catch((error: any) =>
      setErrorMsg(error)
    );

  const updateSecondaryPersonEmail = (id: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PersonAPI.updateEmail(id, dto).catch((error: any) =>
      setErrorMsg(error)
    );

  const addOrUpdateEmail = (values: any) => {
    if (!isSecondary) {
      updateEmail(personIdentifier, {
        type: values.type,
        email: values.email,
        state: values.state,
      }).then(() => {
        emitter.emit("customer.edit.info.changed", {});
        toggleDrawer();
        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "email.success.updated",
            defaultMessage: "Email Updated Successfully.",
          }),
        });
      });
    } else {
      updateSecondaryPersonEmail(secondaryPersonId, {
        type: values.type,
        email: values.email,
        state: values.state,
      }).then(() => {
        emitter.emit("customer.edit.info.changed", {});
        toggleDrawer();
        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "email.success.updated",
            defaultMessage: "Email Updated Successfully.",
          }),
        });
      });
    }
  };

  const EmailSchema = Yup.object().shape({
    type: Yup.string().required(
      intl.formatMessage({
        id: "error.emailType.required",
        defaultMessage: "Email type is a required field.",
      })
    ),
    email: Yup.string()
      .email(
        intl.formatMessage({
          id: "error.emailFormat.invalid",
          defaultMessage: "Invalid email format.",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.emailAddress.required",
          defaultMessage: "Email address is a required field.",
        })
      ),
    state: Yup.string().required(
      intl.formatMessage({
        id: "error.state.required",
        defaultMessage: "State is a required field.",
      })
    ),
  });

  useEffect(() => {
    if (getEmailTypesQuery.data && getEmailStatesQuery.data) {
      setEmailTypes(
        getEmailTypesQuery.data.map((r: string) => ({
          text: InternationalizeEmailType(r, intl),
          code: r,
        }))
      );

      setEmailStates(
        getEmailStatesQuery.data.map((r: string) => ({
          text: EmailStateConverter(r, intl),
          code: r,
        }))
      );
    }
  }, [getEmailTypesQuery.data, getEmailStatesQuery.data]);

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
                  id: "editEmail",
                  description: "drawer header",
                  defaultMessage: "Edit Email",
                })
              : intl.formatMessage({
                  id: "addEmail",
                  description: "drawer header",
                  defaultMessage: "Add Email",
                })
          }
        />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={EmailSchema}
          onSubmit={(values) => addOrUpdateEmail(values)}
          enableReinitialize
        >
          {(props: any) => (
            <form onSubmit={props.handleSubmit}>
              <Box sx={{ marginBottom: "60px" }}>
                <DropdownFloating
                  id="select-email-type-dropdown"
                  name="type"
                  placeholder={`${intl.formatMessage({
                    id: "emailType",
                    defaultMessage: "Email Type",
                  })}*`}
                  className="login-input"
                  list={emailTypes}
                  value={props.values.type}
                  valueKey="code"
                  {...props}
                />
                <InputWithPlaceholder
                  id="input-email"
                  name="email"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "emailAddress",
                    defaultMessage: "Email Address",
                  })}*`}
                  value={props.values.email}
                  className="login-input"
                  {...props}
                />
                <DropdownFloating
                  id="select-email-state-dropdown"
                  name="state"
                  placeholder={`${intl.formatMessage({
                    id: "emailState",
                    defaultMessage: "Email State",
                  })}*`}
                  className="login-input"
                  list={emailStates}
                  value={props.values.state}
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

export default EmailDrawer;
