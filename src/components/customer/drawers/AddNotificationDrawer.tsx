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
import { Formik } from "formik";
import Box from "@mui/material/Box";
import { FormattedMessage, useIntl } from "react-intl";
import Header from "../../common/elements/Header";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import emitter from "../../../emitter";

interface IAddNotificationDrawer {
  customerNumber: string;
  customerId: string;
  toggleDrawer?: any;
}

const AddNotificationDrawer: React.FC<IAddNotificationDrawer> = ({
  customerNumber,
  customerId,
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
}) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const [initialValues, setInitialValues] = useState({});
  const [availableConfigurations, setAvailableConfigurations] = useState([]);

  const getCustomerAvailableConfigurations = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerNotificationAPI.getCustomerAvailableConfigurations(
      customerNumber
    ).catch((error: any) => setErrorMsg(error));

  const sortArrayOfObjectsByNestedKey = (array: any, key: string) => {
    return array.sort((a: any, b: any) => (a[key] > b[key] ? 1 : -1));
  };

  const formatAndSortNotifications = (notifications: any) => {
    notifications.map((not: any) => {
      not.attributes.map((attr: any) => {
        if (attr.name === "disabled") {
          attr.choices.push("true", "false");
        }
      });
      return sortArrayOfObjectsByNestedKey(not.attributes, "name");
    });
    return notifications;
  };

  const getAttributes = (name: string) => {
    const config: any = availableConfigurations.find(
      (c: any) => c.name === name
    );
    return config ? config.attributes : [];
  };

  const saveChanges = (values: any) => {
    const config: any = availableConfigurations.find(
      (c: any) => c.name === values.name
    );

    if (!config) {
      setErrorMsg({ errorCode: "", errorMessage: "" });
    } else {
      const attributes = config.attributes.map((a: any) => {
        return {
          name: a.name,
          value: values[a.name],
          required: a.required,
          choices: a.choices,
        };
      });

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.CustomerNotificationAPI.createCustomerConfiguration(customerNumber, {
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
    }
  };

  const validate = (values: any) => {
    const config: any = availableConfigurations.find(
      (a: any) => a.name === values.name
    );
    if (!config) {
      return {};
    }

    let errors = {};
    config.attributes.forEach((a: any) => {
      if (a.required && (!values[a.name] || values[a.name].length === 0)) {
        errors = { ...errors, [a.name]: `${a.name} is a required field.` };
      }
    });

    return errors;
  };

  const getAvailableNames = (result: any) => {
    return result.map((c: any) => c.name);
  };

  useEffect(() => {
    getCustomerAvailableConfigurations().then((r: any) => {
      setAvailableConfigurations(formatAndSortNotifications(r));
      let tempValues: any = {};
      r.map((c: any) =>
        c.attributes.map((a: any) => {
          tempValues = { ...tempValues, [a.name]: a.value ? a.value : "" };
        })
      );
      setInitialValues(tempValues);
    });
  }, []);

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          bold
          color="white"
          value={intl.formatMessage({
            id: "drawer.header.addNotification",
            description: "drawer header",
            defaultMessage: "Add Notification",
          })}
        />
      </Box>
      <Box>
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
                {getAvailableNames(availableConfigurations).length > 0 && (
                  <DropdownFloating
                    {...props}
                    id="select-notification-name-dropdown"
                    name="name"
                    placeholder={intl.formatMessage({
                      id: "drawer.label.notification.name",
                      description: "Notification Name",
                      defaultMessage: "Name*",
                    })}
                    className="login-input"
                    list={getAvailableNames(availableConfigurations)}
                    handleChange={(e: any) => {
                      // this is needed in order to reset errors/touched between picking different dropdown options
                      props.resetForm();
                      props.handleChange(e);
                    }}
                  />
                )}
                {getAttributes(props.values.name).map((a: any) =>
                  a.choices.length > 0 ? (
                    <DropdownFloating
                      id={`select-notification-${a.name}-dropdown`}
                      name={a.name}
                      placeholder={a.name}
                      className="login-input"
                      list={a.choices}
                      {...props}
                    />
                  ) : (
                    <InputWithPlaceholder
                      id={`input-notification-${a.name}-textbox`}
                      name={a.name}
                      autoComplete="off"
                      type="text"
                      placeholder={a.name}
                      className="login-input"
                      {...props}
                    />
                  )
                )}
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CancelButton
                    id="drawer-address-button-cancel"
                    onClick={() => toggleDrawer()}
                    style={{ marginRight: "14px" }}
                  >
                    <FormattedMessage
                      id="drawer.address.button.cancel"
                      description="Cancel button"
                      defaultMessage="Cancel"
                    />
                  </CancelButton>
                  <SubmitButton
                    id="drawer-address-button-savechanges"
                    disabled={!props.dirty}
                  >
                    <FormattedMessage
                      id="drawer.address.button.saveChanges"
                      description="Save changes button"
                      defaultMessage="Save Changes"
                    />
                  </SubmitButton>
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default AddNotificationDrawer;
