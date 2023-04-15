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
import { Box, Container, FormGroup } from "@mui/material";
import { Formik } from "formik";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import Header from "../../common/elements/Header";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import api from "../../../api/api";
import emitter from "../../../emitter";
import { MessageContext } from "../../../contexts/MessageContext";
import QDButton from "../../common/elements/QDButton";

interface IEditNotificationDrawer {
  customerId: string;
  customerNumber: string;
  notification: any;
  toggleDrawer?: any;
}

const EditNotificationDrawer: React.FC<IEditNotificationDrawer> = ({
  customerId,
  customerNumber,
  notification,
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
}) => {
  const [initialValues, setInitialValues] = useState({});
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);

  const validate = (values: any) => {
    let errors = {};
    notification.attributes.forEach((a: any) => {
      if (a.required && (!values[a.name] || values[a.name].length === 0)) {
        errors = {
          ...errors,
          [a.name]: (
            <FormattedMessage
              id="error.input.required"
              defaultMessage={"{name} is a required field."}
              values={{
                name: a.name,
              }}
            />
          ),
        };
      }
    });
    return errors;
  };

  const sortArrayOfObjectsByNestedKey = (array: any, key: string) => {
    return array.sort((a: any, b: any) => (a[key] > b[key] ? 1 : -1));
  };

  const formatAndSortAttributes = () => {
    notification.attributes.map((attr: any) => {
      if (attr.name === "disabled" && attr.choices.length == 0) {
        attr.choices.push("true", "false");
      }
    });
    return sortArrayOfObjectsByNestedKey(notification.attributes, "name");
  };

  const getInitialValues = () => {
    formatAndSortAttributes();
    let tempValues: any = { name: notification.name };
    notification.attributes.forEach((a: any) => {
      tempValues = { ...tempValues, [a.name]: a.value ? a.value : "" };
    });
    setInitialValues(tempValues);
  };

  const deleteNotification = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerNotificationAPI.deleteCustomerConfiguration(customerNumber, {
      name: notification.name,
      pluginSettingId: notification.pluginSettingId,
      subjectId: {
        subject: "Customer",
        id: customerId,
      },
    })
      .then(() => {
        toggleDrawer();
        emitter.emit("customer.edit.info.changed", {});
      })
      .catch((error: any) => setErrorMsg(error));
  };

  const saveChanges = (values: any) => {
    const attributes = notification.attributes.map((a: any) => {
      return {
        name: a.name,
        value: values[a.name],
        required: a.required,
        choices: a.choices,
      };
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerNotificationAPI.updateCustomerConfiguration(customerNumber, {
      name: values.name,
      attributes,
      subjectId: {
        subject: "Customer",
        id: customerId,
      },
    })
      .then(() => {
        emitter.emit("customer.edit.info.changed", {});
        toggleDrawer();
      })
      .catch((error: any) => setErrorMsg(error));
  };

  useEffect(() => {
    getInitialValues();
  }, []);

  return (
    <Container sx={{ minWidth: "400px" }}>
      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={(values) => saveChanges(values)}
        enableReinitialize
        validateOnBlur={false}
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
            <Box>
              <Header
                level={2}
                bold
                color="white"
                value={intl.formatMessage({
                  id: "editNotification",
                  description: "drawer header",
                  defaultMessage: "Edit Notification",
                })}
              />
              <FormGroup>
                <Box>
                  <Box>
                    <InputWithPlaceholder
                      {...props}
                      id="input-notification-name-textbox"
                      name="name"
                      placeholder={`${intl.formatMessage({
                        id: "name",
                        defaultMessage: "Name",
                      })}*`}
                      disabled
                      value={notification.name}
                    />
                  </Box>
                </Box>
              </FormGroup>
              <FormGroup>
                {notification.attributes.map((a: any) =>
                  a.choices.length > 0 && props.values[a.name] ? (
                    <Box key={`notification-${a.name}-dropdown`}>
                      <Box>
                        <DropdownFloating
                          id={`select-notification-${a.name}-dropdown`}
                          name={a.name}
                          placeholder={intl.formatMessage({
                            id: a.name,
                          })}
                          list={a.choices}
                          value={props.values[a.name]}
                          {...props}
                        />
                      </Box>
                    </Box>
                  ) : (
                    <Box key={`notification-${a.name}-input`}>
                      <Box>
                        <InputWithPlaceholder
                          id={`input-notification-${a.name}-textbox`}
                          name={a.name}
                          autoComplete="off"
                          type="text"
                          placeholder={intl.formatMessage({
                            id: a.name,
                          })}
                          value={props.values[a.name]}
                          {...props}
                        />
                      </Box>
                    </Box>
                  )
                )}
              </FormGroup>
              <FormGroup>
                <CancelButton
                  id="drawer-notification-button-cancel"
                  onClick={() => toggleDrawer()}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <SubmitButton
                  id="drawer-notification-button-savechanges"
                  disabled={!props.dirty}
                >
                  <FormattedMessage
                    id="saveChanges"
                    description="Save changes button"
                    defaultMessage="Save Changes"
                  />
                </SubmitButton>
              </FormGroup>
              <FormGroup>
                <QDButton
                  onClick={() => deleteNotification()}
                  id="drawer-notification-button-delete"
                  color="secondary"
                  variant="contained"
                  label={intl.formatMessage(
                    defineMessage({
                      id: "delete",
                      defaultMessage: "Delete",
                      description: "Delete button",
                    })
                  )}
                />
              </FormGroup>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default EditNotificationDrawer;
