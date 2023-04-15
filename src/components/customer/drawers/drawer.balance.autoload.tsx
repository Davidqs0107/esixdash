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

import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Field, FieldProps, Form, Formik } from "formik";
import * as Yup from "yup";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Header from "../../common/elements/Header";
import {
  AutoloadProductType,
  AutoloadRule,
  CustomerExternalReference,
  OfferingCustomerSummary,
  OfferingCustomerSummaryExtend,
} from "../../../types/customer";
import { FormikSelect } from "../../common/forms/formikWrapper/FormikSelect";
import FormikInputField from "../../common/forms/formikWrapper/FormikInputField";
import emitter from "../../../emitter";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Label from "../../common/elements/Label";
import TextRender from "../../common/TextRender";
import QDButton from "../../common/elements/QDButton";
import AutoloadAPI from "../../../api/AutoloadAPI";

interface IAutoload {
  toggleDrawer: () => void;
  customerNumber: string;
  homeCurrency: string;
  product: OfferingCustomerSummaryExtend;
  view?: boolean;
}

const DrawerAutoload: React.FC<IAutoload> = ({
  customerNumber,
  homeCurrency,
  product,
  toggleDrawer = () => {},
  view = false,
}) => {
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const intl = useIntl();
  const [initialValues, setInitialValues] = useState<AutoloadRule>({
    id: "",
    externalReferenceId: "",
    fixedAmount: "",
    frequency: "",
    dayOffset: 0,
    productType: AutoloadProductType.CREDIT,
    autoLoadStrategy: "",
    currency: homeCurrency,
    enabled: true,
    ...product.autoLoadRuleDTO,
  });
  const [readOnly, setReadOnly] = useState<boolean>(view);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const getAutoLoadRules = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.AutoloadAPI.getAutoLoadRules(customerNumber)
      .then((result: any) => {
        const { id, externalReferenceId, enabled, config } = result.shift();
        setInitialValues({
          currency: homeCurrency,
          fixedAmount: config.fixedAmount,
          id: id,
          productType: AutoloadProductType.CREDIT,
          externalReferenceId: externalReferenceId,
          frequency: config.frequency,
          dayOffset: config.dayOffset,
          autoLoadStrategy: config.autoLoadStrategy,
          enabled: enabled,
        });
      })
      .catch((error: any) => console.log(error));

  const ref = useRef<any>(null);
  const [frequencies, setFrequencies] = useState([
    {
      label: intl.formatMessage({
        id: "weekly",
        defaultMessage: "Weekly",
      }),
      value: "WEEKLY",
    },
    {
      label: intl.formatMessage({
        id: "monthly",
        defaultMessage: "Monthly",
      }),
      value: "MONTHLY",
    },
  ]);

  const [autoloadStratagies, setAutoloadStratagies] = useState([
    { label: "TOTAL_BALANCE", value: "TOTAL_BALANCE" },
    { label: "STATEMENT_BALANCE", value: "STATEMENT_BALANCE" },
    { label: "MINIMUM_PAYMENT_OWED", value: "MINIMUM_PAYMENT_OWED" },
    { label: "FIXED_AMOUNT", value: "FIXED_AMOUNT" },
    // {label: "BALANCE_PERCENTAGE", value: "BALANCE_PERCENTAGE"}
  ]);
  const [externalRefList, setExternalRefList] = useState([]);
  const [autoloadStates, setAutoloadStates] = useState([
    { label: "True", value: "true" },
    { label: "False", value: "false" },
  ]);

  const getExternalReferences = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.getExternalReferences(customerNumber)
      .then((result: CustomerExternalReference[]) => {
        const refOptions: any[] = [];
        result.map((ref) => {
          refOptions.push({
            label: ref.referenceNumber, //should encrypt the ref number, only display last 4 digit eg: ******1234
            value: ref.id,
            partnerName: ref.partnerName
          });
        });
        // @ts-ignore
        setExternalRefList(refOptions);
      })
      .catch((error: any) => setErrorMsg(error));

  useEffect(() => {
    getExternalReferences();
  }, []);

  useEffect(() => {
    if (readOnly || isEdit) {
      getAutoLoadRules();
    }
  }, [readOnly, isEdit]);

  const AutoloadSchema = Yup.object().shape({
    externalReferenceId: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "External Reference is a required field",
        },
        {
          fieldName: intl.formatMessage({
            id: "externalReference",
            defaultMessage: "External Reference",
          }),
        }
      )
    ),
    frequency: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Frequency is a required field",
        },
        {
          fieldName: intl.formatMessage({
            id: "frequency",
            defaultMessage: "Frequency",
          }),
        }
      )
    ),
    autoLoadStrategy: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Strategy is a required field",
        },
        {
          fieldName: intl.formatMessage({
            id: "strategy",
            defaultMessage: "Strategy",
          }),
        }
      )
    ),
    dayOffset: Yup.number()
      .integer()
      .required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Day of Period is a required field",
          },
          {
            fieldName: intl.formatMessage({
              id: "dayOfPeriod",
              defaultMessage: "Day of Period",
            }),
          }
        )
      )
      .min(
        1,
        intl.formatMessage(
          {
            id: "error.field.number0and100",
            defaultMessage: "Day of Period must a number between 0 and 100",
          },
          {
            fieldName: intl.formatMessage({
              id: "dayOfPeriod",
              defaultMessage: "Day of Period",
            }),
          }
        )
      )
      .max(
        28,
        intl.formatMessage(
          {
            id: "error.field.number0and100",
            defaultMessage: "Day of Period must a number between 0 and 100",
          },
          {
            fieldName: intl.formatMessage({
              id: "dayOfPeriod",
              defaultMessage: "Day of Period",
            }),
          }
        )
      ),
    fixedAmount: Yup.number()
      .typeError(
        intl.formatMessage(
          {
            id: "error.field.numberType",
            defaultMessage: "Fixed Amount must be a number",
          },
          {
            fieldName: intl.formatMessage({
              id: "fixedAmount",
              defaultMessage: "Fixed Amount",
            }),
          }
        )
      )
      .positive(
        intl.formatMessage({
          id: "error.fixedAmount.mustBeA.positiveValue",
          defaultMessage: "Fixed Amount must be a positive value",
        })
      ),
  });

  const saveChanges = async (values: AutoloadRule) => {
    product.autoLoadRuleDTO = values;
    let dto: any = {
      externalReferenceId: values.externalReferenceId,
      enabled: values.enabled,
      configClassName: "CreditCardAutoloadConfig",
      config: {
        frequency: values.frequency,
        dayOffset: values.dayOffset,
        autoLoadStrategy: values.autoLoadStrategy,
        currency: values.currency,
        fixedAmount: values.fixedAmount,
      },
    };
    if (isEdit) {
      dto.id = initialValues.id;
      // @ts-ignore
      await api.AutoloadAPI.updateAutoLoadRule(customerNumber, dto)
        .then(() => {
          toggleDrawer();
          emitter.emit("autoload.changed", {});
          setSuccessMsg({
            responseCode: "200000",
            message: intl.formatMessage({
              id: "customer.success.created",
              defaultMessage: `Customer created Successfully`,
            }),
          });
        })
        .catch((error: any) => setErrorMsg(error));
    } else {
      // @ts-ignore
      await api.AutoloadAPI.createAutoLoadRule(customerNumber, dto)
        .then(() => {
          toggleDrawer();
          emitter.emit("autoload.changed", {});
          setSuccessMsg({
            responseCode: "200000",
            message: intl.formatMessage({
              id: "customer.success.updated",
              defaultMessage: `Customer has been Updated Successfully`,
            }),
          });
        })
        .catch((error: any) => setErrorMsg(error));
    }
  };

  const handleDelete = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.AutoloadAPI.deleteAutoLoadRule(customerNumber, initialValues.id)
      .then(() => {
        toggleDrawer();
        emitter.emit("autoload.changed", {});
      })
      .catch((error: any) => setErrorMsg(error));
  };

  const getPartnerName = () => {
    const extRef: any = externalRefList.find(
      (ref: any) => ref.value === initialValues.externalReferenceId
    );
    return extRef ? extRef.partnerName : "--";
  }

  if (readOnly) {
    return (
      <Box
        sx={{
          width: "400px",
          padding: "0 14px",
          marginTop: "40px",
          ".MuiTypography-grey": {
            display: "block",
          },
        }}
      >
        <Box sx={{ marginBottom: "40px" }}>
          <Header
            level={2}
            bold
            color="white"
            value={intl.formatMessage({
              id: "automaticLoadRule",
              defaultMessage: "Automatic Load Rule",
            })}
          />
        </Box>
        <Box sx={{ marginBottom: "70px" }}>
          <Box sx={{ marginBottom: "14px" }}>
            <Label variant="grey">
              <FormattedMessage id="frequency" defaultMessage="Frequency" />
            </Label>
            <TextRender data={initialValues.frequency} />
          </Box>
          <Box sx={{ marginBottom: "14px" }}>
            <Label variant="grey" regular>
              {initialValues.frequency === "WEEKLY"
                ? "Day of Week"
                : "Billing Day of Month"}
            </Label>
            <TextRender data={initialValues.dayOffset.toString()} />
          </Box>
          <Box sx={{ marginBottom: "14px" }}>
            <Label variant="grey">
              <FormattedMessage id="strategy" defaultMessage="Strategy" />
            </Label>
            <TextRender data={initialValues.autoLoadStrategy} />
          </Box>
          <Box sx={{ marginBottom: "14px" }}>
            <Label variant="grey">
              <FormattedMessage
                id="fixedAmount"
                defaultMessage="Fixed Amount"
              />
            </Label>
            <TextRender data={initialValues.fixedAmount || "--"} />
          </Box>
          <Box sx={{ marginBottom: "14px" }}>
            <Label variant="grey">
              <FormattedMessage id="partner" defaultMessage="Partner" />
            </Label>
            <TextRender
              data={
                initialValues.externalReferenceId ? 
                  getPartnerName()
                : "--"
              }
            />
          </Box>
          <Box sx={{ marginBottom: "14px" }}>
            <Label variant="grey">
              <FormattedMessage
                id="externalReference"
                defaultMessage="External Reference"
              />
            </Label>
            <TextRender data={initialValues.externalReferenceId} />
          </Box>
          <Box sx={{ marginBottom: "14px" }}>
            <Label variant="grey">
              <FormattedMessage id="enabled" defaultMessage="Enabled" />
            </Label>
            <TextRender data={initialValues.enabled.toString()} />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "30px",
            alignItems: "center",
          }}
        >
          <CancelButton
            id="drawer-personalInfo-button-cancel"
            className="mt-1 mr-2"
            onClick={() => toggleDrawer()}
          >
            <FormattedMessage
              id="cancel"
              description="Cancel button"
              defaultMessage="Cancel"
            />
          </CancelButton>
          <QDButton
            type="button"
            onClick={() => {
              setReadOnly(false);
              setIsEdit(true);
            }}
            id="automatic-load-rule-edit"
            label={intl.formatMessage({
              id: "edit",
              defaultMessage: "Edit",
            })}
            variant="contained"
            color="primary"
            size="large"
            textCase="provided"
            style={{ marginRight: "32px" }}
          />
          <QDButton
            type="button"
            onClick={handleDelete}
            id="automatic-load-rule-delete"
            label={intl.formatMessage({
              id: "delete",
              defaultMessage: "Delete",
            })}
            variant="contained"
            color="error"
            size="large"
            textCase="provided"
          />
        </Box>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          width: "400px",
          padding: "0 14px",
          marginTop: "40px",
          "& .billingDetails .MuiTypography-body1, & .billingDetails .MuiTypography-labelLight":
            {
              display: "block",
            },
          "& .billingDetails .MuiTypography-labelLight": {
            marginBottom: "15px",
          },
          "& .MuiTypography-link": {
            color: "#FFFFFF",
            display: "block",
            marginBottom: "15px",
          },
        }}
      >
        <Formik
          innerRef={ref}
          initialValues={initialValues}
          validationSchema={AutoloadSchema}
          onSubmit={(values) => saveChanges(values)}
        >
          {({ values, errors }) => (
            <Form>
              <Box>
                <Box sx={{ marginBottom: "40px" }}>
                  <Header
                    level={2}
                    bold
                    color="white"
                    value={
                      isEdit
                        ? intl.formatMessage({
                            id: "editAutomaticLoad",
                            defaultMessage: "Edit Automatic Load",
                          })
                        : intl.formatMessage({
                            id: "setupAutomaticLoad",
                            defaultMessage: "Setup Automatic Load",
                          })
                    }
                  />
                </Box>
                <Box>
                  <Field name="frequency">
                    {({ field, form, meta }: FieldProps) => {
                      return (
                        <FormikSelect
                          field={field}
                          form={form}
                          meta={meta}
                          label={intl.formatMessage({
                            id: "frequency",
                            defaultMessage: "Frequency",
                          })}
                          options={frequencies}
                        />
                      );
                    }}
                  </Field>
                  <FormikInputField
                    name="dayOffset"
                    placeholder={intl.formatMessage({
                      id: "dayOfPeriod",
                      defaultMessage: "Day of Period",
                    })}
                  />
                  <Field name="autoLoadStrategy">
                    {({ field, form, meta }: FieldProps) => {
                      return (
                        <FormikSelect
                          field={field}
                          form={form}
                          meta={meta}
                          label={intl.formatMessage({
                            id: "strategy",
                            defaultMessage: "Strategy",
                          })}
                          options={autoloadStratagies}
                        />
                      );
                    }}
                  </Field>
                  <FormikInputField
                    name="fixedAmount"
                    placeholder={intl.formatMessage({
                      id: "fixedAmount",
                      defaultMessage: "Fixed Amount",
                    })}
                  />
                  <Field name="externalReferenceId">
                    {({ field, form, meta }: FieldProps) => {
                      return (
                        <FormikSelect
                          field={field}
                          form={form}
                          meta={meta}
                          label={intl.formatMessage({
                            id: "externalReference",
                            defaultMessage: "External Reference",
                          })}
                          options={externalRefList}
                        />
                      );
                    }}
                  </Field>
                  <Field name="enabled">
                    {({ field, form, meta }: FieldProps) => {
                      return (
                        <FormikSelect
                          field={field}
                          form={form}
                          meta={meta}
                          label={intl.formatMessage({
                            id: "enabled",
                            defaultMessage: "Enabled",
                          })}
                          options={autoloadStates}
                        />
                      );
                    }}
                  </Field>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "30px",
                    alignItems: "center",
                  }}
                >
                  <CancelButton
                    id="drawer-personalInfo-button-cancel"
                    className="mt-1 mr-2"
                    onClick={() => toggleDrawer()}
                  >
                    <FormattedMessage
                      id="cancel"
                      description="Cancel button"
                      defaultMessage="Cancel"
                    />
                  </CancelButton>
                  <SubmitButton
                    id="drawer-personalInfo-button-saveChanges"
                    className="mt-1 mr-0"
                    // disabled={!props.dirty}
                  >
                    <FormattedMessage
                      id="saveChanges"
                      description="Save changes button"
                      defaultMessage="Save Changes"
                    />
                  </SubmitButton>
                </Box>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
    );
  }
};

export default DrawerAutoload;
