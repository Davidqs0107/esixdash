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

import Typography from "@mui/material/Typography";
import { Avatar, FormGroup, Grid, TextField, Box } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Field, FieldArray, FieldProps, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import QDCheckbox from "../../common/forms/inputs/QDCheckbox";
import SubmitButton from "../../common/elements/SubmitButton";
import { creditFormSchema } from "../../../yup";
import Label from "../../common/elements/Label";

import {
  DrawBalanceSubType,
  DrawBalanceType,
  DrawType,
  ProgramCreditCardConfig,
  RepaymentHierarchyItem,
  InterestRateTierHelperItem,
  InterestRateTierItem,
} from "../../../types/program";
import QDButton from "../../common/elements/QDButton";
import FormikInputField from "../../common/forms/formikWrapper/FormikInputField";
import { FormikSelect } from "../../common/forms/formikWrapper/FormikSelect";
import Icon from "../../common/Icon";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    smallCircle: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      margin: "0 20px 0 0",
      fontSize: "13px",
    },
    checkbox: {
      fontSize: "13px",
      lineHeight: "14px",
      color: "#152C5B",
    },
  })
);

interface CreditInput {
  initialValues: ProgramCreditCardConfig;
  submitForm?: any;
  refId?: any;
  programName?: any;
  edit: boolean;
}

/**
 * Temporarily copy pasted from configure form base
 * This is only the credit portion and ideally can be injected into the base form.
 * @param initialValues
 * @constructor
 */
const ConfigureProductFormCredit: React.FC<CreditInput> = ({
  initialValues,
  submitForm,
  refId,
  programName,
  edit,
}) => {
  const intl = useIntl();
  const classes = useStyles();
  const [rendered, setRendered] = useState<any>(null);
  const [purchaseDrawFlag, setPurchaseDrawFlag] = useState<any>(null);
  const [cashAdvanceDrawFlag, setCashAdvanceDrawFlag] = useState<any>(null);
  const [feeDrawFlag, setFeeDrawFlag] = useState<any>(null);
  const [repaymentHierarchyList, setRepaymentHierarchyList] = useState<
    RepaymentHierarchyItem[]
  >([]);
  const [daysPerYearOptions, setDaysPerYearOptions] = useState([
    { label: "360", value: 360 },
    { label: "365", value: 365 },
    { label: "366", value: 366 },
  ]);

  const [interestTypes, setInterestTypes] = useState([
    { label: "SIMPLE", value: "SIMPLE" },
    { label: "COMPOUND", value: "COMPOUND" },
    { label: "HYBRID", value: "HYBRID" },
    { label: "NONE", value: "NONE" },
  ]);

  const [currentPeriodGraceReturnBillingTypes] = useState([
    {
      label: intl.formatMessage({
        id: "none",
        defaultMessage: "None",
      }),
      value: "NONE",
    },
    {
      label: intl.formatMessage({
        id: "partial",
        defaultMessage: "Partial",
      }),
      value: "PARTIAL",
    },
  ]);

  const [repaymentAssessmentRequirementTypes] = useState([
    {
      label: intl.formatMessage({
        id: "minimumDue",
        defaultMessage: "Minimum Due",
      }),
      value: "MINIMUM_DUE",
    },
    {
      label: intl.formatMessage({
        id: "totalDue",
        defaultMessage: "Total Due",
      }),
      value: "TOTAL_DUE",
    },
    {
      label: intl.formatMessage({
        id: "statementBalance",
        defaultMessage: "Statement Balance",
      }),
      value: "STATEMENT_BALANCE",
    },
  ]);

  const [purchaseEditFlag, setPurchaseEditFlag] = useState<any>(null);
  const [cashAdvanceEditFlag, setCashAdvanceEditFlag] = useState<any>(null);

  const defaultPurchaseRepaymentHierarchy: RepaymentHierarchyItem[] = [
    {
      drawType: "PURCHASE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "PRINCIPAL",
    },
    {
      drawType: "PURCHASE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "INTEREST",
    },
    {
      drawType: "PURCHASE",
      drawBalanceType: "CURRENT",
      drawBalanceSubType: "PRINCIPAL",
    },
    {
      drawType: "PURCHASE",
      drawBalanceType: "CURRENT",
      drawBalanceSubType: "INTEREST",
    },
    {
      drawType: "PURCHASE",
      drawBalanceType: "PREVIOUS",
      drawBalanceSubType: "PRINCIPAL",
    },
    {
      drawType: "PURCHASE",
      drawBalanceType: "PREVIOUS",
      drawBalanceSubType: "INTEREST",
    },
  ];

  const defaultCashAdvanceRepaymentHierarchy: RepaymentHierarchyItem[] = [
    {
      drawType: "CASH_ADVANCE",
      drawBalanceType: "CURRENT",
      drawBalanceSubType: "PRINCIPAL",
    },
    {
      drawType: "CASH_ADVANCE",
      drawBalanceType: "CURRENT",
      drawBalanceSubType: "INTEREST",
    },
    {
      drawType: "CASH_ADVANCE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "PRINCIPAL",
    },
    {
      drawType: "CASH_ADVANCE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "INTEREST",
    },
  ];

  const defaultFeeRepaymentHierarchy: RepaymentHierarchyItem[] = [
    {
      drawType: "FEE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "PRINCIPAL",
    },
    {
      drawType: "FEE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "INTEREST",
    },
    {
      drawType: "FEE",
      drawBalanceType: "CURRENT",
      drawBalanceSubType: "PRINCIPAL",
    },
    {
      drawType: "FEE",
      drawBalanceType: "CURRENT",
      drawBalanceSubType: "INTEREST",
    },
    {
      drawType: "FEE",
      drawBalanceType: "PREVIOUS",
      drawBalanceSubType: "PRINCIPAL",
    },
    {
      drawType: "FEE",
      drawBalanceType: "PREVIOUS",
      drawBalanceSubType: "INTEREST",
    },
  ];

  const [shiftSetting, setShiftSetting] = useState([
    {
      label: "NONE",
      value: "NONE",
    },
    {
      label: "FORWARD",
      value: "FORWARD",
    },
    {
      label: "BACKWARD",
      value: "BACKWARD",
    },
  ]);

  const buildDefaultMinimumPaymentPercentages = (drawType: DrawType) => {
    let defaultPercentage: Partial<
      Record<DrawBalanceType, Record<DrawBalanceSubType, number | null>>
    > = {
      PREVIOUS: {
        INTEREST: null,
        PRINCIPAL: null,
      },
      CURRENT: {
        INTEREST: null,
        PRINCIPAL: null,
      },
      OWED: {
        INTEREST: null,
        PRINCIPAL: null,
      },
    };
    if (drawType === "CASH_ADVANCE") {
      delete defaultPercentage["PREVIOUS"];
    }
    return defaultPercentage;
  };

  const dragItem = useRef();
  const dragOverItem = useRef();

  const updateConfig = (config: ProgramCreditCardConfig) => {
    if (config.repaymentHierarchy) {
      setRepaymentHierarchyList(config.repaymentHierarchy);
      if (config.interestConfig.PURCHASE) {
        setPurchaseDrawFlag(true);
        config.daysPerYear = config.interestConfig.PURCHASE.daysPerYear;

        if (edit) {
          setPurchaseEditFlag(true);
        }
      } else {
        setPurchaseEditFlag(false);
      }
      if (config.interestConfig.CASH_ADVANCE) {
        setCashAdvanceDrawFlag(true);
        config.daysPerYear = config.interestConfig.CASH_ADVANCE.daysPerYear;

        if (edit) {
          setCashAdvanceEditFlag(true);
        }
      } else {
        setCashAdvanceEditFlag(false);
      }

      if (!config.drawTypes.includes("FEE")) {
        config.drawTypes.push("FEE");
        config.interestConfig["FEE"] = {
          daysPerYear: 0,
          minAnnualRate: 0,
          maxAnnualRate: 0,
          defaultAnnualRate: 0,
          interestMode: "NONE",
        };
        config.minimumPaymentPercentages["FEE"] =
          buildDefaultMinimumPaymentPercentages("FEE");
        config.repaymentHierarchy.push(...defaultFeeRepaymentHierarchy);
        setFeeDrawFlag(true);
      }

      if (config.interestConfig.FEE) {
        setFeeDrawFlag(true);
        config.daysPerYear = config.interestConfig.FEE.daysPerYear;
      }
      if (config.interestTiers) {
        config.interestTiersHelper = [];
        Object.keys(config.interestTiers).map((tierName) => {
          const tier = config.interestTiers![tierName];
          config.interestTiersHelper!.push({
            name: tierName,
            PURCHASE: tier!.PURCHASE,
            CASH_ADVANCE: tier!.CASH_ADVANCE,
            FEE: tier!.FEE,
            persisted: edit,
          });
        });
      }
    }

    setRendered(true);
  };

  useEffect(() => {
    updateConfig(initialValues);
  }, [initialValues, daysPerYearOptions]);

  const dragStart = (position: any) => {
    dragItem.current = position;
  };

  const dragEnter = (position: any) => {
    dragOverItem.current = position;
  };

  const drop = (config: ProgramCreditCardConfig) => {
    if (dragItem.current != undefined && dragOverItem.current != undefined) {
      const copyListItems = [...config.repaymentHierarchy];
      const dragItemContent = copyListItems[dragItem.current];
      copyListItems.splice(dragItem.current, 1);
      copyListItems.splice(dragOverItem.current, 0, dragItemContent);
      dragItem.current = undefined;
      dragOverItem.current = undefined;
      setRepaymentHierarchyList(copyListItems);
      config.repaymentHierarchy = copyListItems;
    }
  };

  const createPaymentHierarchy = (config: ProgramCreditCardConfig) => {
    const hierarchies = [];
    if (repaymentHierarchyList && repaymentHierarchyList.length > 0) {
      for (const hierarchy of repaymentHierarchyList) {
        const hierarchyItem = createPaymentHierarchyEntry(
          hierarchy.drawType +
            " " +
            hierarchy.drawBalanceSubType +
            " " +
            hierarchy.drawBalanceType,
          config,
          hierarchies.length
        );
        hierarchies.push(hierarchyItem);
      }
      return hierarchies;
    }
  };

  const applyDrawType = (
    drawTypeFlag: boolean,
    drawTypeFlagFunc: any,
    drawType: DrawType,
    config: ProgramCreditCardConfig
  ) => {
    drawTypeFlagFunc(!drawTypeFlag);
    if (drawTypeFlag) {
      delete config.interestConfig[drawType];
      delete config.minimumPaymentPercentages[drawType];
      const idx = config.drawTypes.indexOf(drawType);
      if (idx !== -1) {
        config.drawTypes.splice(idx, 1);
      }
    } else {
      config.interestConfig[drawType] = {
        daysPerYear: 0,
        minAnnualRate: 0,
        maxAnnualRate: 0,
        defaultAnnualRate: 0,
        interestMode: "NONE",
      };
      config.minimumPaymentPercentages[drawType] =
        buildDefaultMinimumPaymentPercentages(drawType);
      config.drawTypes.push(drawType);
    }
    updatePaymentHierarchy(drawTypeFlag, drawType, config);
  };

  const updatePaymentHierarchy = (
    drawTypeFlag: boolean,
    drawType: any,
    config: ProgramCreditCardConfig
  ) => {
    if (drawTypeFlag) {
      // remove from hierarchy
      const list = repaymentHierarchyList.filter(
        (i: any) => i.drawType != drawType
      );
      setRepaymentHierarchyList(list);
      config.repaymentHierarchy = list;
    } else {
      // add to hierarchy
      if (drawType === "PURCHASE") {
        repaymentHierarchyList.push(...defaultPurchaseRepaymentHierarchy);
      }
      if (drawType === "CASH_ADVANCE") {
        repaymentHierarchyList.push(...defaultCashAdvanceRepaymentHierarchy);
      }
      if (drawType === "FEE") {
        repaymentHierarchyList.push(...defaultFeeRepaymentHierarchy);
      }
    }
  };

  const createPaymentHierarchyEntry = (
    text: string,
    config: ProgramCreditCardConfig,
    index: number
  ) => (
    <Grid
      container
      xs={12}
      spacing={3}
      marginBottom={4}
      direction="row"
      onDragStart={() => dragStart(index)}
      onDragEnter={() => dragEnter(index)}
      onDragEnd={() => drop(config)}
      onDragOver={(e: any) => e.preventDefault()}
      key={index}
      draggable
    >
      <Grid item>
        <Avatar className={classes.smallCircle}>{index + 1}</Avatar>
      </Grid>
      <Grid item alignSelf="center">
        <Typography
          style={{
            fontSize: "13px",
            fontFamily: "Montserrat",
            fontWeight: 500,
          }}
        >
          {text}
        </Typography>
      </Grid>
    </Grid>
  );

  const createInputGridItem = (
    name: string,
    placeHolder: string,
    xs: any = 4,
    suffix?: string,
    required?: boolean
  ) => (
    <Grid item xs={xs} lg={xs} direction="row">
      <FormikInputField
        name={name}
        placeholder={placeHolder}
        suffix={suffix}
        required={required}
      />
    </Grid>
  );

  const onSubmitFunc = (config: ProgramCreditCardConfig) => {
    //put in days per year
    if (config.interestConfig.PURCHASE) {
      config.interestConfig.PURCHASE.daysPerYear = config.daysPerYear as number;
    }
    if (config.interestConfig.CASH_ADVANCE) {
      config.interestConfig.CASH_ADVANCE.daysPerYear =
        config.daysPerYear as number;
    }
    if (config.interestConfig.FEE) {
      config.interestConfig.FEE.daysPerYear = config.daysPerYear as number;
    }
    // set interest rate tiers
    if (config.interestTiersHelper) {
      config.interestTiers = {};
      config.interestTiersHelper.map((tier: any) => {
        config.interestTiers![tier.name] = {
          PURCHASE: config.drawTypes.includes("PURCHASE")
            ? tier.PURCHASE
            : undefined,
          CASH_ADVANCE: config.drawTypes.includes("CASH_ADVANCE")
            ? tier.CASH_ADVANCE
            : undefined,
          FEE: config.drawTypes.includes("FEE") ? tier.FEE : undefined,
        };
      });
      delete config.interestTiersHelper;
    }
    submitForm(config, "net.e6tech.h3.middletier.model.offering.banking.creditcard.CreditCard");
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={creditFormSchema}
      enableReinitialize={true}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={(values) => {
        onSubmitFunc(values);
      }}
    >
      {(props: any) => (
        <Form noValidate>
          <FormGroup>
            <Grid container xs={12} direction="row">
              <button
                ref={refId}
                id="submitBtn"
                type="submit"
                style={{ display: "none" }}
                value="Validate"
              />

              <Label variant="grey" size="field-label" bMargin="15px">
                <FormattedMessage
                  id="creditLimit"
                  defaultMessage="Credit Limit"
                />
                {":"}
              </Label>
              <Grid container spacing={3} xs={12} direction="row">
                {createInputGridItem(
                  "minSpendLimit",
                  intl.formatMessage({
                    id: "minimumAllowed",
                    defaultMessage: "Minimum Allowed",
                  }),
                  3
                )}

                {createInputGridItem(
                  "maxSpendLimit",
                  intl.formatMessage({
                    id: "maximumAllowed",
                    defaultMessage: "Maximum Allowed",
                  }),
                  3
                )}

                {programName ? (
                  <Grid item xs={4} lg={4} textAlign="center">
                    <SubmitButton id="save-changes" disabled={false}>
                      <FormattedMessage
                        id="configure.form.button.setPlugins"
                        description="Save Button"
                        defaultMessage="Save"
                      />
                    </SubmitButton>
                  </Grid>
                ) : null}
              </Grid>

              <Label variant="grey" size="field-label" bMargin="15px">
                <FormattedMessage
                  id="creditBalances"
                  defaultMessage="Credit Balances (Choose at least one)"
                />
              </Label>
              <Grid container direction="column">
                <Grid item direction="row">
                  <Field
                    name="purchase"
                    as={QDCheckbox}
                    onClick={() => {
                      applyDrawType(
                        purchaseDrawFlag,
                        setPurchaseDrawFlag,
                        "PURCHASE",
                        props.values
                      );
                    }}
                    data={{
                      label: intl.formatMessage({
                        id: "purchase",
                        defaultMessage: "Purchase",
                      }),
                      id: "configure.form.base.purchase",
                      key: "configure-form-base-purchase",
                      disabled: purchaseEditFlag,
                      checkbox: {
                        color: "primary",
                        size: "small",
                        checked: purchaseDrawFlag,
                      },
                      className: classes.checkbox,
                    }}
                    className="label-regular"
                  />
                </Grid>
                <Grid item direction="row">
                  <Field
                    name="cash_advance"
                    as={QDCheckbox}
                    onClick={() => {
                      applyDrawType(
                        cashAdvanceDrawFlag,
                        setCashAdvanceDrawFlag,
                        "CASH_ADVANCE",
                        props.values
                      );
                    }}
                    data={{
                      label: intl.formatMessage({
                        id: "cashAdvance",
                        defaultMessage: "Cash Advance",
                      }),
                      id: "configure.form.base.cash_advance",
                      key: "configure-form-base-cash_advance",
                      disabled: cashAdvanceEditFlag,
                      checkbox: {
                        color: "primary",
                        size: "small",
                        checked: cashAdvanceDrawFlag,
                      },
                      className: classes.checkbox,
                    }}
                  />
                </Grid>
                <Grid item direction="row">
                  <Field
                    name="fee"
                    as={QDCheckbox}
                    onClick={() => {
                      applyDrawType(
                        feeDrawFlag,
                        setFeeDrawFlag,
                        "FEE",
                        props.values
                      );
                    }}
                    data={{
                      label: intl.formatMessage({
                        id: "fee",
                        defaultMessage: "Fee",
                      }),
                      id: "configure.form.base.fee",
                      key: "configure-form-base-fee",
                      disabled: true,
                      checkbox: {
                        color: "primary",
                        size: "small",
                        checked: feeDrawFlag,
                      },
                      className: classes.checkbox,
                    }}
                  />
                </Grid>
              </Grid>

              {props.errors.drawTypes ? (
                <Grid item xs={12}>
                  <Label variant="error">
                    <FormattedMessage
                      id="chooseAtLeastOne"
                      defaultMessage="Choose at least one"
                    />
                  </Label>
                </Grid>
              ) : null}

              <Box sx={{ mt: 2 }}>
                <Label variant="grey" size="field-label" bMargin="15px">
                  <FormattedMessage
                    id="interestAccrual"
                    defaultMessage="Interest Accrual"
                  />
                  {":"}
                </Label>
              </Box>

              <Grid container spacing={2} xs={12} direction="row">
                <Grid item xs={12} lg={3} direction="row">
                  {props.values.daysPerYear !== undefined && (
                    <Field name="daysPerYear">
                      {({ field, form, meta }: FieldProps) => {
                        return (
                          <FormikSelect
                            required
                            field={field}
                            form={form}
                            meta={meta}
                            label={intl.formatMessage({
                              id: "daysPerYear",
                              defaultMessage: "Days Per Year",
                            })}
                            options={daysPerYearOptions}
                          />
                        );
                      }}
                    </Field>
                  )}
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Label variant="grey" size="field-label" bMargin="15px">
                  <FormattedMessage
                    id="currentPeriodReturnToGraceForgiveness"
                    defaultMessage="Current Period Return to Grace Forgiveness"
                  />
                </Label>
              </Box>

              <Grid container spacing={2} xs={12} direction="row">
                <Grid item xs={12} lg={3} direction="row">
                  {props.values.currentPeriodGraceReturnBilling !==
                    undefined && (
                    <Field name="currentPeriodGraceReturnBilling">
                      {({ field, form, meta }: FieldProps) => {
                        return (
                          <FormikSelect
                            field={field}
                            form={form}
                            meta={meta}
                            label={intl.formatMessage({
                              id: "currentPeriodReturnToGraceForgiveness",
                              defaultMessage:
                                "Current Period Return to Grace Forgiveness",
                            })}
                            options={currentPeriodGraceReturnBillingTypes}
                          />
                        );
                      }}
                    </Field>
                  )}
                </Grid>
              </Grid>

              <Box>
                <Label variant="grey" size="field-label" bMargin="15px">
                  <FormattedMessage
                    id="repaymentAmountRequirement"
                    defaultMessage="Repayment Amount Requirement"
                  />
                </Label>
              </Box>

              <Grid container spacing={2} xs={12} direction="row">
                <Grid item xs={12} lg={3} direction="row">
                  {props.values.repaymentAssessmentRequirement !==
                    undefined && (
                    <Field name="repaymentAssessmentRequirement">
                      {({ field, form, meta }: FieldProps) => {
                        return (
                          <FormikSelect
                            field={field}
                            form={form}
                            meta={meta}
                            label={intl.formatMessage({
                              id: "repaymentAmountRequirement",
                              defaultMessage: "Repayment Amount Requirement",
                            })}
                            options={repaymentAssessmentRequirementTypes}
                          />
                        );
                      }}
                    </Field>
                  )}
                </Grid>
              </Grid>

              {purchaseDrawFlag ? (
                <Grid container spacing={2}>
                  <Grid item xs={3} sx={{ width: 205 }}>
                    <Label variant="grey">
                      <FormattedMessage
                        id="purchase"
                        defaultMessage="Purchase"
                      />
                    </Label>
                  </Grid>
                  <Grid item xs={3} sx={{ width: 205 }}>
                    <Field name="interestConfig.PURCHASE.interestMode">
                      {({ field, form, meta }: FieldProps) => {
                        return (
                          <FormikSelect
                            required
                            field={field}
                            form={form}
                            meta={meta}
                            label={intl.formatMessage({
                              id: "interestAccrualType",
                              defaultMessage: "Interest Accrual Type",
                            })}
                            options={interestTypes}
                          />
                        );
                      }}
                    </Field>
                  </Grid>
                  <Grid item xs={6} flexGrow="1">
                    <Grid container spacing={2}>
                      {createInputGridItem(
                        "interestConfig.PURCHASE.minAnnualRate",
                        intl.formatMessage({
                          id: "minimumAllowed",
                          defaultMessage: "Minimum Allowed",
                        })
                      )}
                      {createInputGridItem(
                        "interestConfig.PURCHASE.defaultAnnualRate",
                        intl.formatMessage({
                          id: "default",
                          defaultMessage: "Default",
                        })
                      )}
                      {createInputGridItem(
                        "interestConfig.PURCHASE.maxAnnualRate",
                        intl.formatMessage({
                          id: "maximumAllowed",
                          defaultMessage: "Maximum Allowed",
                        })
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}

              {cashAdvanceDrawFlag ? (
                <Grid container spacing={2}>
                  <Grid item xs={3} sx={{ width: 205 }}>
                    <Label variant="grey">
                      <FormattedMessage
                        id="cashAdvance"
                        defaultMessage="Cash Advance"
                      />
                    </Label>
                  </Grid>
                  <Grid item xs={3} sx={{ width: 205 }}>
                    <Field name="interestConfig.CASH_ADVANCE.interestMode">
                      {({ field, form, meta }: FieldProps) => {
                        return (
                          <FormikSelect
                            required
                            field={field}
                            form={form}
                            meta={meta}
                            label={intl.formatMessage({
                              id: "interestAccrualType",
                              defaultMessage: "Interest Accrual Type",
                            })}
                            options={interestTypes}
                          />
                        );
                      }}
                    </Field>
                  </Grid>
                  <Grid item xs={6} flexGrow="1">
                    <Grid container spacing={2}>
                      {createInputGridItem(
                        "interestConfig.CASH_ADVANCE.minAnnualRate",
                        intl.formatMessage({
                          id: "minimumAllowed",
                          defaultMessage: "Minimum Allowed",
                        })
                      )}
                      {createInputGridItem(
                        "interestConfig.CASH_ADVANCE.defaultAnnualRate",
                        intl.formatMessage({
                          id: "default",
                          defaultMessage: "Default",
                        })
                      )}
                      {createInputGridItem(
                        "interestConfig.CASH_ADVANCE.maxAnnualRate",
                        intl.formatMessage({
                          id: "maximumAllowed",
                          defaultMessage: "Maximum Allowed",
                        })
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}

              {feeDrawFlag ? (
                <Grid container spacing={2}>
                  <Grid item xs={3} sx={{ width: 205 }}>
                    <Label variant="grey">
                      <FormattedMessage id="fee" defaultMessage="Fee" />
                    </Label>
                  </Grid>
                  <Grid item xs={3} sx={{ width: 205 }}>
                    <Field name="interestConfig.FEE.interestMode">
                      {({ field, form, meta }: FieldProps) => {
                        return (
                          <FormikSelect
                            required
                            field={field}
                            form={form}
                            meta={meta}
                            label={intl.formatMessage({
                              id: "interestAccrualType",
                              defaultMessage: "Interest Accrual Type",
                            })}
                            options={interestTypes}
                          />
                        );
                      }}
                    </Field>
                  </Grid>
                  <Grid item xs={6} flexGrow="1">
                    <Grid container spacing={2}>
                      {createInputGridItem(
                        "interestConfig.FEE.minAnnualRate",
                        intl.formatMessage({
                          id: "minimumAllowed",
                          defaultMessage: "Minimum Allowed",
                        })
                      )}
                      {createInputGridItem(
                        "interestConfig.FEE.defaultAnnualRate",
                        intl.formatMessage({
                          id: "default",
                          defaultMessage: "Default",
                        })
                      )}
                      {createInputGridItem(
                        "interestConfig.FEE.maxAnnualRate",
                        intl.formatMessage({
                          id: "maximumAllowed",
                          defaultMessage: "Maximum Allowed",
                        })
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}

              <Grid container xs={12}>
                <Label variant="grey" bMargin="15px">
                  <FormattedMessage
                    id="interestRateTiers"
                    defaultMessage="Interest Rate Tiers"
                  />
                </Label>
              </Grid>

              <FieldArray
                name="interestTiersHelper"
                validateOnChange={false}
                render={(arrayHelpers) => (
                  <>
                    <Grid container>
                      {props.values.interestTiersHelper
                        ? Object.keys(props.values.interestTiersHelper).map(
                            (tier, index) => (
                              <Grid container xs={12} spacing={2} key={index}>
                                <Grid
                                  item
                                  sx={{
                                    width: 30,
                                    alignSelf: "center",
                                    pt: "0 !important",
                                  }}
                                >
                                  {props.values.interestTiersHelper![index]
                                    .persisted ? null : (
                                    <QDButton
                                      type="button"
                                      variant="icon"
                                      onClick={() => arrayHelpers.remove(index)}
                                    >
                                      <img
                                        height={16}
                                        width={16}
                                        src={Icon.deleteIcon}
                                        alt="delete icon"
                                      />
                                    </QDButton>
                                  )}
                                </Grid>
                                <Grid item xs={3}>
                                  <FormikInputField
                                    name={`interestTiersHelper[${tier}].name`}
                                    placeholder={intl.formatMessage({
                                      id: "tierName",
                                      defaultMessage: "Tier Name",
                                    })}
                                    disabled={
                                      props.values.interestTiersHelper![index]
                                        .persisted
                                    }
                                    dirty={false}
                                    {...props}
                                  />
                                </Grid>
                                {purchaseDrawFlag ? (
                                  <Grid item xs={3}>
                                    <FormikInputField
                                      name={`interestTiersHelper[${tier}].PURCHASE`}
                                      placeholder={intl.formatMessage({
                                        id: "purchaseRate",
                                        defaultMessage: "Purchase Rate",
                                      })}
                                      {...props}
                                    />
                                  </Grid>
                                ) : null}
                                {cashAdvanceDrawFlag ? (
                                  <Grid item xs={3}>
                                    <FormikInputField
                                      name={`interestTiersHelper[${tier}].CASH_ADVANCE`}
                                      placeholder={intl.formatMessage({
                                        id: "cashRate",
                                        defaultMessage: "Cash Rate",
                                      })}
                                      {...props}
                                    />
                                  </Grid>
                                ) : null}
                                {feeDrawFlag ? (
                                  <Grid item xs={3}>
                                    <FormikInputField
                                      name={`interestTiersHelper[${tier}].FEE`}
                                      placeholder={intl.formatMessage({
                                        id: "feeRate",
                                        defaultMessage: "Fee Rate",
                                      })}
                                      {...props}
                                    />
                                  </Grid>
                                ) : null}
                              </Grid>
                            )
                          )
                        : null}
                      <Grid container sx={{ mb: 2 }}>
                        <Grid item lg={7} flexGrow="1"></Grid>
                        <Grid item>
                          <QDButton
                            type="button"
                            size="small"
                            onClick={() => arrayHelpers.push({})}
                            id="interchange-add-currency"
                            color="primary"
                            variant="contained"
                            label={intl.formatMessage({
                              id: "button.addNewTier",
                              defaultMessage: "ADD NEW TIER",
                            })}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid lg={4}></Grid>
                  </>
                )}
              />

              {feeDrawFlag ? (
                <Grid container>
                  <Grid container xs={12}>
                    <Label variant="grey" bMargin="15px">
                      <FormattedMessage id="fees" defaultMessage="Fees" />
                    </Label>
                  </Grid>
                  <Grid container xs={12} spacing={3} direction="row">
                    {createInputGridItem(
                      "latePaymentFee",
                      intl.formatMessage({
                        id: "latePaymentFee",
                        defaultMessage: "Late Payment Fee",
                      }),
                      3,
                      undefined,
                      false
                    )}
                  </Grid>
                </Grid>
              ) : null}

              <Grid container xs={2}>
                <Grid container xs={12}>
                  <Label variant="grey" bMargin="15px">
                    <FormattedMessage
                      id="repayment"
                      defaultMessage="Repayment"
                    />
                  </Label>
                </Grid>
                <Grid container xs={12} spacing={3} direction="row">
                  {createInputGridItem(
                    "repaymentPeriodLength",
                    intl.formatMessage({
                      id: "defaultRepaymentPeriod",
                      defaultMessage: "Default Repayment Period",
                    }),
                    3
                  )}
                </Grid>

                <Grid container xs={12}>
                  <Label variant="grey" bMargin="15px">
                    <FormattedMessage
                      id="nonProcessingDayHandling"
                      defaultMessage="Non Processing Day Handling"
                    />
                  </Label>
                </Grid>

                <Grid container xs={12} spacing={3} direction="row">
                  <Grid item xs={3} sx={{ width: 205 }}>
                    {props.values.repaymentDueShiftSetting !== undefined && (
                      <Field name="repaymentDueShiftSetting">
                        {({ field, form, meta }: FieldProps) => {
                          return (
                            <FormikSelect
                              field={field}
                              form={form}
                              meta={meta}
                              label={intl.formatMessage({
                                id: "dueDateShift",
                                defaultMessage: "Due Date Shift",
                              })}
                              options={shiftSetting}
                              required={true}
                            />
                          );
                        }}
                      </Field>
                    )}
                  </Grid>
                  <Grid item xs={3} sx={{ width: 205 }}>
                    {props.values.automaticLoadShiftSetting !== undefined && (
                      <Field name="automaticLoadShiftSetting">
                        {({ field, form, meta }: FieldProps) => {
                          return (
                            <FormikSelect
                              field={field}
                              form={form}
                              meta={meta}
                              label={intl.formatMessage({
                                id: "autoLoadShift",
                                defaultMessage: "Auto Load Shift",
                              })}
                              options={shiftSetting}
                              required={true}
                            />
                          );
                        }}
                      </Field>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid container xs={12}>
                <Label variant="grey" bMargin="15px">
                  <FormattedMessage
                    id="repaymentHierarchy"
                    defaultMessage="Repayment Hierarchy"
                  />
                </Label>
              </Grid>
              {createPaymentHierarchy(props.values)}

              <Grid container xs={12}>
                <Label variant="grey" bMargin="15px">
                  <FormattedMessage
                    id="minimumRepayment"
                    defaultMessage="Minimum Repayment"
                  />
                </Label>
              </Grid>

              <Grid container spacing={3} lg={7} direction="row">
                {createInputGridItem(
                  "minimumPaymentOverallBalancePercentage",
                  intl.formatMessage({
                    id: "overallBalanceRatio",
                    defaultMessage: "Overall Balance Ratio",
                  }),
                  4,
                  "%"
                )}
                {createInputGridItem(
                  "minimumPaymentStandardThreshold",
                  intl.formatMessage({
                    id: "minimumThreshold",
                    defaultMessage: "Minimum Threshold",
                  })
                )}
                {createInputGridItem(
                  "minimumPaymentOwedPastDuePercentage",
                  intl.formatMessage({
                    id: "owedPastDueRatio",
                    defaultMessage: "Owed Past Due Ratio",
                  }),
                  4,
                  "%"
                )}
              </Grid>

              {purchaseDrawFlag ? (
                <Grid container xs={12} direction="row">
                  <Grid container xs={12}>
                    <Label variant="grey" bMargin="15px">
                      <FormattedMessage
                        id="purchaseRepaymentRatios"
                        defaultMessage="Purchase repayment ratios"
                      />
                    </Label>
                  </Grid>
                  <Grid
                    container
                    sx={{ mr: 4 }}
                    spacing={3}
                    lg={7}
                    direction="row"
                  >
                    {createInputGridItem(
                      "minimumPaymentPercentages.PURCHASE.CURRENT.PRINCIPAL",
                      intl.formatMessage({
                        id: "currentPrincipalRatio",
                        defaultMessage: "Current Principal Ratio",
                      }),
                      4,
                      "%"
                    )}
                    {createInputGridItem(
                      "minimumPaymentPercentages.PURCHASE.PREVIOUS.PRINCIPAL",
                      intl.formatMessage({
                        id: "previousPrincipalRatio",
                        defaultMessage: "Previous Principal Ratio",
                      }),
                      4,
                      "%"
                    )}
                    {createInputGridItem(
                      "minimumPaymentPercentages.PURCHASE.OWED.PRINCIPAL",
                      intl.formatMessage({
                        id: "owedPrincipalRatio",
                        defaultMessage: "Owed Principal Ratio",
                      }),
                      4,
                      "%"
                    )}
                  </Grid>
                  <Grid
                    container
                    sx={{ mr: 4 }}
                    spacing={3}
                    lg={7}
                    direction="row"
                  >
                    {createInputGridItem(
                      "minimumPaymentPercentages.PURCHASE.CURRENT.INTEREST",
                      intl.formatMessage({
                        id: "currentInterestRatio",
                        defaultMessage: "Current Interest Ratio",
                      }),
                      4,
                      "%"
                    )}
                    {createInputGridItem(
                      "minimumPaymentPercentages.PURCHASE.PREVIOUS.INTEREST",
                      intl.formatMessage({
                        id: "previousInterestRatio",
                        defaultMessage: "Previous Interest Ratio",
                      }),
                      4,
                      "%"
                    )}
                    {createInputGridItem(
                      "minimumPaymentPercentages.PURCHASE.OWED.INTEREST",
                      intl.formatMessage({
                        id: "owedInterestRatio",
                        defaultMessage: "Owed Interest Ratio",
                      }),
                      4,
                      "%"
                    )}
                  </Grid>
                </Grid>
              ) : null}

              {cashAdvanceDrawFlag ? (
                <Grid container xs={12} direction="row">
                  <Grid container xs={12}>
                    <Label variant="grey" bMargin="15px">
                      <FormattedMessage
                        id="cashAdvanceRepaymentRatios"
                        defaultMessage="Cash Advance repayment ratios"
                      />
                    </Label>
                  </Grid>
                  <Grid
                    container
                    sx={{ mr: 4 }}
                    spacing={3}
                    lg={7}
                    direction="row"
                  >
                    {createInputGridItem(
                      "minimumPaymentPercentages.CASH_ADVANCE.CURRENT.PRINCIPAL",
                      intl.formatMessage({
                        id: "currentPrincipalRatio",
                        defaultMessage: "Current Principal Ratio",
                      }),
                      4,
                      "%"
                    )}
                    {createInputGridItem(
                      "minimumPaymentPercentages.CASH_ADVANCE.OWED.PRINCIPAL",
                      intl.formatMessage({
                        id: "owedPrincipalRatio",
                        defaultMessage: "Owed Principal Ratio",
                      }),
                      4,
                      "%"
                    )}
                  </Grid>
                  <Grid
                    container
                    sx={{ mr: 4 }}
                    spacing={3}
                    lg={7}
                    direction="row"
                  >
                    {createInputGridItem(
                      "minimumPaymentPercentages.CASH_ADVANCE.CURRENT.INTEREST",
                      intl.formatMessage({
                        id: "currentInterestRatio",
                        defaultMessage: "Current Interest Ratio",
                      }),
                      4,
                      "%"
                    )}
                    {createInputGridItem(
                      "minimumPaymentPercentages.CASH_ADVANCE.OWED.INTEREST",
                      intl.formatMessage({
                        id: "owedInterestRatio",
                        defaultMessage: "Owed Interest Ratio",
                      }),
                      4,
                      "%"
                    )}
                  </Grid>
                </Grid>
              ) : null}
              {feeDrawFlag ? (
                <Grid container xs={12} direction="row">
                  <Grid container xs={12}>
                    <Label variant="grey" bMargin="15px">
                      <FormattedMessage
                        id="feeRepaymentRatios"
                        defaultMessage="Fee repayment ratios"
                      />
                    </Label>
                  </Grid>
                  <Grid
                    container
                    sx={{ mr: 4 }}
                    spacing={3}
                    lg={7}
                    direction="row"
                  >
                    {createInputGridItem(
                      "minimumPaymentPercentages.FEE.CURRENT.PRINCIPAL",
                      intl.formatMessage({
                        id: "currentPrincipalRatio",
                        defaultMessage: "Current Principal Ratio",
                      }),
                      4,
                      "%"
                    )}
                    {createInputGridItem(
                      "minimumPaymentPercentages.FEE.PREVIOUS.PRINCIPAL",
                      intl.formatMessage({
                        id: "previousPrincipalRatio",
                        defaultMessage: "Previous Principal Ratio",
                      }),
                      4,
                      "%"
                    )}
                    {createInputGridItem(
                      "minimumPaymentPercentages.FEE.OWED.PRINCIPAL",
                      intl.formatMessage({
                        id: "owedPrincipalRatio",
                        defaultMessage: "Owed Principal Ratio",
                      }),
                      4,
                      "%"
                    )}
                  </Grid>
                  <Grid
                    container
                    sx={{ mr: 4 }}
                    spacing={3}
                    lg={7}
                    direction="row"
                  >
                    {createInputGridItem(
                      "minimumPaymentPercentages.FEE.CURRENT.INTEREST",
                      intl.formatMessage({
                        id: "currentInterestRatio",
                        defaultMessage: "Current Interest Ratio",
                      }),
                      4,
                      "%"
                    )}
                    {createInputGridItem(
                      "minimumPaymentPercentages.FEE.PREVIOUS.INTEREST",
                      intl.formatMessage({
                        id: "previousInterestRatio",
                        defaultMessage: "Previous Interest Ratio",
                      }),
                      4,
                      "%"
                    )}
                    {createInputGridItem(
                      "minimumPaymentPercentages.FEE.OWED.INTEREST",
                      intl.formatMessage({
                        id: "owedInterestRatio",
                        defaultMessage: "Owed Interest Ratio",
                      }),
                      4,
                      "%"
                    )}
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};

export default ConfigureProductFormCredit;
