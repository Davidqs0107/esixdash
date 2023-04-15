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

import {
  defineMessage,
  FormattedDate,
  FormattedMessage,
  FormattedTime,
  useIntl,
} from "react-intl";
import { Field, FieldArray, Formik } from "formik";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import moment from "moment";
import Header from "../../common/elements/Header";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import { MessageContext } from "../../../contexts/MessageContext";
import api from "../../../api/api";
import DatePicker from "../../common/forms/inputs/DatePicker";
import Icon from "../../common/Icon";
import QDButton from "../../common/elements/QDButton";
import emitter from "../../../emitter";
import Label from "../../common/elements/Label";

interface IExternalAccountDrawer {
  toggleDrawer?: any;
  edit?: boolean;
  externalAccount?: any;
  customerNumber: string;
}

const ExternalAccountDrawer: React.FC<IExternalAccountDrawer> = ({
  toggleDrawer = () => {
    /* provided by DrawerComp */
  },
  edit = false,
  externalAccount = {},
  customerNumber,
}) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const [initialValues] = useState({
    partnerName: edit ? externalAccount.partnerName : "",
    referenceNumber: edit ? externalAccount.referenceNumber : "",
    identifierCode: edit ? externalAccount.identifierCode : null,
    expirationTime: edit ? externalAccount.expirationTime : null,
    attributes: edit ? externalAccount.attributes : [],
    modifiedTime: edit ? externalAccount.modifiedTime : "",
    creationTime: edit ? externalAccount.creationTime : "",
  });
  const [partnerNames, setPartnerNames] = useState([]);

  const deleteExtRef = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.deleteExternalReference(customerNumber, externalAccount.id)
      .then(() => {
        emitter.emit("external.accounts.changed", {});
        toggleDrawer();
      })
      .catch((error: any) => setErrorMsg(error));
  };
  const createExtRef = (customerIdentifier: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.createExtRef(customerIdentifier, dto).catch((error: any) =>
      setErrorMsg(error)
    );

  const updateExternalRef = (
    customerIdentifier: string,
    extRefId: string,
    dto: any
  ) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.updateExternalReference(
      customerIdentifier,
      extRefId,
      dto
    ).catch((error: any) => setErrorMsg(error));

  const createOrUpdateReferenceAttribute = (
    customerIdentifier: string,
    extRefId: string,
    dto: any
  ) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.createOrUpdateReferenceAttribute(
      customerIdentifier,
      extRefId,
      dto
    ).catch((error: any) => setErrorMsg(error));

  const deleteReferenceAttribute = (
    customerIdentifier: string,
    extRefId: string,
    attrName: string
  ) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.deleteReferenceAttribute(
      customerIdentifier,
      extRefId,
      attrName
    ).catch((error: any) => setErrorMsg(error));

  const addOrUpdateExternalAccount = async (values: any) => {
    const { referenceNumber, attributes } = values;
    if (edit) {
      if (referenceNumber !== externalAccount.referenceNumber) {
        await updateExternalRef(customerNumber, externalAccount.id, {
          referenceNumber,
        });
      }

      // check if any attributes were updated
      const updated = attributes.filter((a: any) =>
        externalAccount.attributes.find(
          (original: any) =>
            a.name === original.name && a.value !== original.value
        )
      );

      // check if any attributes were added
      const added = attributes.filter(
        (a: any) =>
          !externalAccount.attributes.find(
            (original: any) => a.name === original.name
          )
      );

      const addedOrUpdated = [...updated, ...added];

      if (addedOrUpdated && addedOrUpdated.length > 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const a of addedOrUpdated) {
          // eslint-disable-next-line no-await-in-loop
          await createOrUpdateReferenceAttribute(
            customerNumber,
            externalAccount.id,
            {
              name: a.name,
              value: a.value,
            }
          );
        }
      }

      // check if any attributes were deleted
      const deleted = externalAccount.attributes.filter(
        (original: any) =>
          !attributes.find((a: any) => a.name === original.name)
      );

      if (deleted && deleted.length > 0) {
        // eslint-disable-next-line no-restricted-syntax
        for (const d of deleted) {
          // eslint-disable-next-line no-await-in-loop
          await deleteReferenceAttribute(
            customerNumber,
            externalAccount.id,
            d.name
          );
        }
      }
      emitter.emit("external.accounts.changed", {});
      toggleDrawer();
    } else {
      createExtRef(customerNumber, {
        partnerName: values.partnerName,
        identifierCode: values.identifierCode,
        referenceNumber: values.referenceNumber,
        expirationTime:
          values.expirationTime !== null
            ? moment(`${values.expirationTime} 18:00:00`).format("x")
            : null,
        attributes: values.attributes,
      }).then(() => {
        toggleDrawer();
        emitter.emit("external.accounts.changed", {});
      });
    }
  };

  const listPartners = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.list()
      .then((results: any) => setPartnerNames(results.map((p: any) => p.name)))
      .catch((error: any) => setErrorMsg(error));

  const ExternaRefExchema = Yup.object().shape({
    partnerName: Yup.string().required(
      intl.formatMessage({
        id: "error.partnerName.required",
        defaultMessage: "Partner name is a required field.",
      })
    ),
    referenceNumber: Yup.string().required(
      intl.formatMessage({
        id: "error.referenceNumber.required",
        defaultMessage: "Reference number is a required field.",
      })
    ),
    attributes: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(
          intl.formatMessage({
            id: "error.name.required",
            defaultMessage: "Name is a required field.",
          })
        ),
        value: Yup.string().required(
          intl.formatMessage({
            id: "error.value.required",
            defaultMessage: "Value is a required field.",
          })
        ),
      })
    ),
  });

  useEffect(() => {
    listPartners();
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
                  id: "editExternalAccount",
                  description: "drawer header",
                  defaultMessage: "Edit External Account",
                })
              : intl.formatMessage({
                  id: "addExternalAccount",
                  description: "drawer header",
                  defaultMessage: "Add External Account",
                })
          }
        />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={ExternaRefExchema}
          onSubmit={(values) => addOrUpdateExternalAccount(values)}
          enableReinitialize
        >
          {(props: any) => (
            <form onSubmit={props.handleSubmit}>
              <Box>
                <Box sx={{ marginBottom: "60px" }}>
                  <InputWithPlaceholder
                    id="input-reference-number"
                    name="referenceNumber"
                    autoComplete="off"
                    type="text"
                    placeholder={`${intl.formatMessage({
                      id: "referenceNumber",
                      description: "External account reference number",
                      defaultMessage: "Reference Number",
                    })}*`}
                    value={props.values.referenceNumber}
                    {...props}
                  />
                  <InputWithPlaceholder
                    id="input-identifier-code"
                    name="identifierCode"
                    autoComplete="off"
                    type="text"
                    placeholder={`${intl.formatMessage({
                      id: "identifierCode",
                      description: "External account identifier code",
                      defaultMessage: "Identifier Code",
                    })}`}
                    value={props.values.identifierCode}
                    disabled={edit}
                    {...props}
                  />
                  {partnerNames && (
                    <DropdownFloating
                      name="partnerName"
                      placeholder={`${intl.formatMessage({
                        id: "partnerName",
                        description: "Details",
                        defaultMessage: "Partner Name",
                      })}*`}
                      list={partnerNames}
                      value={props.values.partnerName}
                      disabled={edit}
                      {...props}
                    />
                  )}
                  <Box>
                    {edit ? (
                      <>
                        <Label htmlFor="expirationTime">
                          <FormattedMessage
                            id="expirationDate"
                            description="Section Label"
                            defaultMessage="Expiration Date"
                          />
                        </Label>
                        {props.values.expirationTime !== null &&
                        props.values.expirationTime !== undefined ? (
                          <Box>
                            <Label variant="labelLight">
                              <FormattedDate
                                value={new Date(props.values.expirationTime)}
                                year="numeric"
                                month="long"
                                day="2-digit"
                              />
                              {", "}
                              <FormattedTime
                                value={new Date(props.values.expirationTime)}
                              />
                            </Label>
                          </Box>
                        ) : (
                          <Box>
                            <Label variant="labelLight">--</Label>
                          </Box>
                        )}
                      </>
                    ) : (
                      <Field
                        component={DatePicker}
                        name="expirationTime"
                        label={`${intl.formatMessage({
                          id: "expirationTime",
                          description: "Details",
                          defaultMessage: "Expiration Time",
                        })}`}
                        maxDate="4100-01-01"
                        minDate={moment().add(1, "days").format("YYYY-MM-DD")}
                        value={props.values.expirationTime}
                        disabled={edit}
                        {...props}
                      />
                    )}
                  </Box>
                  {edit && (
                    <Box>
                      <Label htmlFor="createdDate">
                        <FormattedMessage
                          id="createdDate"
                          description="Section Label"
                          defaultMessage="Created Date"
                        />
                      </Label>
                      <div>
                        <Label variant="labelLight">
                          <FormattedDate
                            value={new Date(props.values.creationTime)}
                            year="numeric"
                            month="long"
                            day="2-digit"
                          />
                          {", "}
                          <FormattedTime
                            value={new Date(props.values.creationTime)}
                          />
                        </Label>
                      </div>
                      <Label htmlFor="modifiedDate">
                        <FormattedMessage
                          id="modifiedDate"
                          description="Section Label"
                          defaultMessage="Modified Date"
                        />
                      </Label>
                      <div>
                        <Label variant="labelLight">
                          <FormattedDate
                            value={new Date(props.values.modifiedTime)}
                            year="numeric"
                            month="long"
                            day="2-digit"
                          />
                          {", "}
                          <FormattedTime
                            value={new Date(props.values.modifiedTime)}
                          />
                        </Label>
                      </div>
                    </Box>
                  )}
                  <Box sx={{ mt: 2 }}>
                    <Label htmlFor="attributes">
                      <FormattedMessage
                        id="attributes"
                        description="Section Label"
                        defaultMessage="Attributes"
                      />
                    </Label>
                    <FieldArray
                      name="attributes"
                      render={({ remove, push }) => (
                        <Box>
                          {props.values.attributes &&
                          props.values.attributes.length > 0
                            ? props.values.attributes.map(
                                (newIIN: any, index: number) => (
                                  <div
                                    /* eslint-disable-next-line react/no-array-index-key */
                                    key={`div.attributes.${index}`}
                                  >
                                    {props.touched.attributes &&
                                      props.touched.attributes[index] &&
                                      props.touched.attributes[index].name &&
                                      props.errors.attributes &&
                                      props.errors.attributes[index] &&
                                      props.errors.attributes[index].name && (
                                        <Label variant="error">
                                          {props.touched.attributes &&
                                            props.touched.attributes[index] &&
                                            props.touched.attributes[index]
                                              .name &&
                                            props.errors.attributes &&
                                            props.errors.attributes[index] &&
                                            props.errors.attributes[index].name}
                                        </Label>
                                      )}
                                    <Box
                                      display={{
                                        display: "flex",
                                      }}
                                    >
                                      <QDButton
                                        type="button"
                                        onClick={() => remove(index)}
                                        id="ext-acct-remove-attribute"
                                        variant="icon"
                                      >
                                        <img
                                          height={16}
                                          width={16}
                                          src={Icon.deleteIcon}
                                          alt="delete icon"
                                        />
                                      </QDButton>
                                      <Box sx={{ width: "100%" }}>
                                        <InputWithPlaceholder
                                          type="text"
                                          name={`attributes.${index}.name`}
                                          autoComplete="off"
                                          placeholder={`${intl.formatMessage({
                                            id: "name",
                                            description: "Input Label",
                                            defaultMessage: "Name",
                                          })}*`}
                                          value={
                                            props.values.attributes[index].name
                                          }
                                          index={index}
                                          altName="attributes"
                                          {...props}
                                        />
                                      </Box>
                                    </Box>
                                    <Box>
                                      {props.touched.attributes &&
                                        props.touched.attributes[index] &&
                                        props.touched.attributes[index].value &&
                                        props.errors.attributes &&
                                        props.errors.attributes[index] &&
                                        props.errors.attributes[index]
                                          .value && (
                                          <Label variant="error">
                                            {props.touched.attributes &&
                                              props.touched.attributes[index] &&
                                              props.touched.attributes[index]
                                                .value &&
                                              props.errors.attributes &&
                                              props.errors.attributes[index] &&
                                              props.errors.attributes[index]
                                                .value}
                                          </Label>
                                        )}
                                      <InputWithPlaceholder
                                        type="text"
                                        name={`attributes.${index}.value`}
                                        autoComplete="off"
                                        placeholder={`${intl.formatMessage({
                                          id: "value",
                                          description: "Input Label",
                                          defaultMessage: "Value",
                                        })}*`}
                                        value={
                                          props.values.attributes[index].value
                                        }
                                        index={index}
                                        altName="attributes"
                                        {...props}
                                      />
                                    </Box>
                                  </div>
                                )
                              )
                            : null}
                          <Box sx={{ textAlign: "right" }}>
                            <QDButton
                              onClick={() => push("")}
                              id="drawer-ext-acct-add-attribute"
                              color="primary"
                              variant="contained"
                              size="small"
                              label={intl.formatMessage(
                                defineMessage({
                                  id: "addAttributeAttribute",
                                  defaultMessage: "ADD ADDITIONAL ATTRIBUTE",
                                  description: "header",
                                })
                              )}
                            />
                          </Box>
                        </Box>
                      )}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <CancelButton
                    id="drawer-ext-acct-cancel"
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
                    id="drawer-ext-acct-savechanges"
                    disabled={!props.dirty}
                  >
                    <FormattedMessage
                      id="saveChanges"
                      description="Save changes button"
                      defaultMessage="Save Changes"
                    />
                  </SubmitButton>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  {edit && (
                    <QDButton
                      onClick={() => deleteExtRef()}
                      id="drawer-notification-button-delete"
                      color="error"
                      variant="contained"
                      label={intl.formatMessage(
                        defineMessage({
                          id: "delete",
                          defaultMessage: "Delete",
                          description: "Delete button",
                        })
                      )}
                    />
                  )}
                </Box>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ExternalAccountDrawer;
