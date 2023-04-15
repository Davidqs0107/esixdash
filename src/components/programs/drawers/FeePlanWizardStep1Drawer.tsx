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

import { Container, Box, Grid, FormGroup } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { FieldArray, Formik, Field } from "formik";
import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import Icon from "../../common/Icon";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import { FeePlanWizardContext } from "../../../contexts/FeePlanWizardContext";
import {
  FormatTxSource,
  FormatTxType,
} from "../../common/converters/FormatTxSource";
import QDButton from "../../common/elements/QDButton";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import QDCheckbox from "../../common/forms/inputs/QDCheckbox";
import Label from "../../common/elements/Label";
import Header from "../../common/elements/Header";

interface IFee {
  id: number | undefined;
  feeType: string;
  currency: string;
  fixFee: number | string;
  percentage: number | string;
  chargeReceiver: boolean;
  receiverFixFee: number | string;
  receiverPercentage: number | string;
  changeState: string | undefined;
}

interface IFeePlanWizardStep1Drawer {
  newFeePlan: string;
  newFees: IFee[];
}

const initialValue: IFeePlanWizardStep1Drawer = {
  newFeePlan: "",
  newFees: [],
};

const FeePlanWizardStep1Drawer: React.FC = () => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const contextValue = useContext(FeePlanWizardContext);
  const [selectFees, setSelectFees] = useState([]);
  const [originalFees, setOriginalFees] = useState([]);

  const {
    feePlanToCopy,
    setNewFeeObject,
    getNextStep,
    getPreviousStep,
    currentStep,
    programName,
    newFeeObject,
    skippedStep0,
    existingFeePlans,
    toggleDrawer,
    currencies,
    calculationMethods,
  } = contextValue;

  const { data: operatingProgramFeeEntriesData } = useQuery({
    queryKey: ["getOperatingProgramFeeEntries"],
    queryFn: () =>
      // @ts-ignore
      api.OperatingFeesAPI.getOperatingProgramFeeEntries(),
  });

  const [initialState, setInitialState] = useState<IFeePlanWizardStep1Drawer>({
    ...initialValue,
  });

  const goToPreviousStep = () => {
    setInitialState({ ...initialValue });
    getPreviousStep();
  };

  const getFees = () =>
    // @ts-ignore
    api.OperatingFeesAPI.getFees(programName, feePlanToCopy, {}).catch(
      (error: any) => setErrorMsg(error)
    );

  const buildInitialState = async () => {
    const copyFees: any = [];
    if (feePlanToCopy && feePlanToCopy.length > 0) {
      let idx = 0;

      await getFees().then((fees: any) => {
        copyFees.push(
          ...fees.map((fee: any) => ({
            id: ++idx,
            feeType: `${fee.transactionSourceCode},${fee.transactionTypeCode}`,
            currency: fee.currency,
            fixFee: isNaN(fee.fixFee) ? null : fee.fixFee,
            percentage: isNaN(fee.percentage)
              ? null
              : (fee.percentage * 100.0).toFixed(3),
            receiverFixFee: isNaN(fee.receiverFixFee)
              ? null
              : fee.receiverFixFee,
            receiverPercentage: isNaN(fee.receiverPercentage)
              ? null
              : (fee.receiverPercentage * 100.0).toFixed(3),
            chargeReceiver:
              fee.receiverFixFee > 0 || fee.receiverPercentage > 0,
            calculationMethodDescription: getCalculationMethod(
              fee.calculationMethod,
              fee.fixFee,
              fee.percentage
            ),
          }))
        );
      });

      if (copyFees && copyFees.length > 0) {
        setOriginalFees(copyFees);
      }
    }

    // in case the user proceeded to step 3 and then decided to come back to step 2
    const reRenderFees = newFeeObject.newFees
      ? newFeeObject.newFees
      : [...initialState.newFees];

    let planName;
    if (skippedStep0) {
      // when we skip step zero, set newPlanName to the name that was selected in the fees drawer dropdown
      planName = feePlanToCopy;
    } else {
      planName = newFeeObject.newFeePlan ? newFeeObject.newFeePlan : "";
    }
    setInitialState({
      newFeePlan: planName,
      newFees:
        feePlanToCopy && feePlanToCopy.length > 0 ? copyFees : reRenderFees,
    });
  };

  const parseCalculationMethod = (values: any) => {
    if (values.calculationMethodDescription === "Percentage") {
      values.fixedFee = 0;
      values.feePercentage = 0;
    }

    if (values.calculationMethodDescription === "Flat Amount") {
      values.percentage = 0;
      values.receiverPercentage = 0;
    }

    let parsedCalculationMethod = 0;
    switch (values.calculationMethodDescription) {
      case "Flat + Percentage":
        parsedCalculationMethod = 0;
        break;
      case "Greater Of":
        parsedCalculationMethod = 1;
        break;
      case "Lesser Of":
        parsedCalculationMethod = 2;
        break;
      default:
        parsedCalculationMethod = 0;
        break;
    }
    values.calculationMethod = parsedCalculationMethod;
    return values;
  };

  const getCalculationMethod = (
    value: number,
    fixedFeeAmount: any,
    feePercentage: any
  ) => {
    let calculationMethod = "";
    switch (value) {
      case 0:
        if (fixedFeeAmount !== 0 && feePercentage !== 0) {
          calculationMethod = "Flat + Percentage";
        } else if (fixedFeeAmount !== 0) {
          calculationMethod = "Flat Amount";
        } else {
          calculationMethod = "Percentage";
        }
        break;
      case 1:
        calculationMethod = "Greater Of";
        break;
      case 2:
        calculationMethod = "Lesser Of";
        break;
      default:
        calculationMethod = "Flat + Percentage";
        break;
    }
    return calculationMethod;
  };

  useEffect(() => {
    if (currentStep === 1) {
      buildInitialState();
    }
  }, [currentStep, existingFeePlans]);
  // existingFeePlans is needed here, b/c on initial load of this component
  // the value of existingFeePlans has not been populated (special case for skipped0 == true).

  useEffect(() => {
    if (operatingProgramFeeEntriesData) {
      const dropDownFees = operatingProgramFeeEntriesData.map((fee: any) => ({
        feeType: `${fee.transactionSourceCode},${fee.transactionTypeCode}`,
        text: `${FormatTxSource(
          fee.transactionSourceCode,
          intl
        )} - ${FormatTxType(fee.transactionTypeCode, intl)}`,
      }));
      setSelectFees(dropDownFees);
    }
  }, [operatingProgramFeeEntriesData]);

  const handleSubmit = (values: any) => {
    const { newFeePlan, newFees } = values;

    const newOrChangedFees: IFee[] = [];

    /* Look for updated fees. */
    newFees.forEach((fee: any) => {
      fee = parseCalculationMethod(fee);
      const original: any = originalFees.find(
        (p: IFee) => p.id && p.id === fee.id
      );

      // 1. this could be a new fee plan and we are copying from an existing fee plan
      // 2. this could be an existing fee plan with a new fee
      if (existingFeePlans.indexOf(newFeePlan) < 0 || !original) {
        fee.changeState = "Adding";
        newOrChangedFees.push(fee);
      } else {
        for (const key of Object.keys(fee)) {
          /* First, check if _both_ values are undefined. */
          if (!original[key] && !fee[key]) {
            continue;
          }

          /* Then check for value equivalency. */
          if (!original[key] || original[key] !== fee[key]) {
            fee.changeState = "Updating";
            newOrChangedFees.push(fee);
            break;
          }
        }
      }
    });

    /* Look for removed entries. */
    originalFees.forEach((fee: IFee) => {
      if (
        existingFeePlans.indexOf(newFeePlan) !== -1 &&
        !newFees.find((nf: IFee) => nf.id === fee.id)
      ) {
        fee.changeState = "Removing";
        newOrChangedFees.push(fee);
      }
    });

    setNewFeeObject({
      newFeePlan,
      newFees: newOrChangedFees,
    });

    getNextStep();
  };

  const canContinue = (isDirty: boolean, newFees: any[]) => {
    let allRequiredInfoEntered = true;

    newFees.forEach((e) => {
      if (Object.keys(e).length === 0 && e.constructor === Object) {
        allRequiredInfoEntered = false;
      } else if (!e.feeType || e.feeType.length < 1) {
        allRequiredInfoEntered = false;
      } else if (!e.currency || e.currency.length < 1) {
        allRequiredInfoEntered = false;
      } else if (
        e.calculationMethodDescription !== "Percentage" &&
        (!e.fixFee || e.fixFee.length < 1)
      ) {
        allRequiredInfoEntered = false;
      } else if (
        e.calculationMethodDescription !== "Flat Amount" &&
        (!e.percentage || e.percentage.length < 1)
      ) {
        allRequiredInfoEntered = false;
      }
    });

    /* If not all required info is entered, then return false. */
    if (!allRequiredInfoEntered) {
      return false;
    }

    /* Otherwise, return whether existing values have changes. This means that required fields have valid information
     * and they have been modified.
     */
    return isDirty;
  };

  const FeeSchema = Yup.object().shape({
    newFeePlan: Yup.string().required(
      intl.formatMessage({
        id: "error.feePlan.required",
        defaultMessage: "Fee Plan is a required field",
      })
    ),
    newFees: Yup.array().of(
      Yup.object().shape({
        feeType: Yup.string().required(
          intl.formatMessage({
            id: "error.feeType.required",
            defaultMessage: "Fee Type is a required field",
          })
        ),
        currency: Yup.string().required(
          intl.formatMessage({
            id: "error.feeType.required",
            defaultMessage: "Currency is a required field",
          })
        ),
        fixFee: Yup.string().when(
          "calculationMethodDescription",
          (calculationMethodDescription, schema) => {
            return calculationMethodDescription !== "Percentage"
              ? schema
                  .required(
                    intl.formatMessage({
                      id: "error.program.feeAmount.required",
                      defaultMessage: "Fee Amount ($) is a required field",
                    })
                  )
                  .test(
                    "currencyFormat",
                    intl.formatMessage({
                      id: "error.currency.15integers5decimals.format",
                      defaultMessage:
                        "Value should have no more than 15 integers and 5 decimals",
                    }),
                    (value: any) =>
                      value == undefined ||
                      /^(?:\d{1,15}\.\d{0,5})$|^\d{1,15}$/.test(value)
                  )
              : Yup.string();
          }
        ),
        percentage: Yup.string().when(
          "calculationMethodDescription",
          (calculationMethodDescription, schema) => {
            return calculationMethodDescription !== "Flat Amount"
              ? schema
                  .required(
                    intl.formatMessage({
                      id: "error.feeAmount.required",
                      defaultMessage: "Fee Amount (%) is a required field",
                    })
                  )
                  .test(
                    "requiredValue",
                    intl.formatMessage({
                      id: "error.greaterThan0",
                      defaultMessage: "Must be a number greater than 0.0",
                    }),
                    (value: any) => value != undefined && parseFloat(value) > 0
                  )
                  .test(
                    "percentageFormat",
                    intl.formatMessage({
                      id: "error.number.7integers3decimals.format",
                      defaultMessage:
                        "Value should have no more than 7 integers and 3 decimals",
                    }),
                    (value: any) =>
                      value == undefined ||
                      /^(?:\d{1,7}\.\d{0,3})$|^\d{1,7}$/.test(value)
                  )
              : Yup.string();
          }
        ),
        chargeReceiver: Yup.boolean(),
        receiverFixFee: Yup.string().when(
          ["chargeReceiver", "calculationMethodDescription"],
          {
            is: (
              chargeReceiver: boolean,
              calculationMethodDescription: string
            ) => {
              return (
                chargeReceiver && calculationMethodDescription !== "Percentage"
              );
            },
            then: (schema: any) =>
              schema
                .required(
                  intl.formatMessage({
                    id: "error.receiverFee.required",
                    defaultMessage:
                      "Receiver fee amount ($) is a required field",
                  })
                )
                .test(
                  "currencyFormat",
                  intl.formatMessage({
                    id: "error.currency.15integers5decimals.format",
                    defaultMessage:
                      "Value should have no more than 15 integers and 5 decimals",
                  }),
                  (value: any) =>
                    value == undefined ||
                    /^(?:\d{1,15}\.\d{0,5})$|^\d{1,15}$/.test(value)
                ),
          }
        ),
        receiverPercentage: Yup.string().when(
          ["chargeReceiver", "calculationMethodDescription"],
          {
            is: (
              chargeReceiver: boolean,
              calculationMethodDescription: string
            ) => {
              return (
                chargeReceiver &&
                calculationMethodDescription !==
                  intl.formatMessage({
                    id: "calculation.method.flatAmount",
                    defaultMessage: "Flat Amount",
                  })
              );
            },
            then: (schema: any) =>
              schema
                .required(
                  intl.formatMessage({
                    id: "error.program.receiver.percentage.required",
                    defaultMessage:
                      "Receiver Fee Amount (%) is a required field",
                  })
                )
                .test(
                  "requiredValue",
                  intl.formatMessage({
                    id: "error.greaterThan0",
                    defaultMessage: "Must be a number greater than 0.0",
                  }),
                  (value: any) => value != undefined && parseFloat(value) > 0
                )
                .test(
                  "percentageFormat",
                  intl.formatMessage({
                    id: "error.number.7integers3decimals.format",
                    defaultMessage:
                      "Value should have no more than 7 integers and 3 decimals",
                  }),
                  (value: any) =>
                    value == undefined ||
                    /^(?:\d{1,7}\.\d{0,3})$|^\d{1,7}$/.test(value)
                ),
          }
        ),
      })
    ),
  });

  return currentStep === 1 ? (
    <Container sx={{ mt: 5 }} style={{ minWidth: "400px" }}>
      {!skippedStep0 ? (
        <Box sx={{ mb: 3 }}>
          <QDButton
            type="button"
            onClick={() => goToPreviousStep()}
            id="fee-back-btn"
            variant="icon"
            size="medium"
          >
            <Label htmlFor="steps">
              <img
                width="14px"
                height="14px"
                src={Icon.caretLeftWhite}
                alt="icon"
              />
              <FormattedMessage
                id="drawer.fee.wizard.button.step2of3"
                description="Step 2 of 3"
                defaultMessage="Step 2 of 3"
              />
            </Label>
          </QDButton>
        </Box>
      ) : (
        <Box sx={{ mb: 3 }}>
          <Label htmlFor="steps">
            <FormattedMessage
              id="step1of2"
              description="Step 1 of 2"
              defaultMessage="Step 1 of 2"
            />
          </Label>
        </Box>
      )}
      <Header
        value={
          skippedStep0
            ? intl.formatMessage({
                id: "addFeestoPlan",
                description: "drawer header",
                defaultMessage: "Add Fees to Plan",
              })
            : intl.formatMessage({
                id: "createNewFeePlan",
                description: "drawer header",
                defaultMessage: "Create New Fee Plan",
              })
        }
        level={2}
        color="white"
        bold
        drawerTitle
        marginTop={0}
      />

      <Formik
        initialValues={initialState}
        validationSchema={FeeSchema}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
            <FormGroup>
              <FormGroup>
                {skippedStep0 ? (
                  <DropdownFloating
                    name="newFeePlan"
                    placeholder={
                      <FormattedMessage
                        id="drawer.header.fee.wizard.label.feePlan"
                        description="Input Label"
                        defaultMessage="Fee Plan*"
                      />
                    }
                    list={existingFeePlans}
                    value={props.values.newFeePlan}
                    {...props}
                  />
                ) : (
                  <InputWithPlaceholder
                    id="input-new-fee-plan"
                    name="newFeePlan"
                    autoComplete="off"
                    type="text"
                    placeholder={intl.formatMessage({
                      id: "drawer.fee.wizard.newFeePlan",
                      description: "Drawer form placeholder text",
                      defaultMessage: "New Fee Plan*",
                    })}
                    {...props}
                  />
                )}
              </FormGroup>
              <FormGroup sx={{ mt: 2 }}>
                <Label htmlFor="currencyGroup">
                  <FormattedMessage
                    id="addFees"
                    description="Section Label"
                    defaultMessage="Add Fees"
                  />
                </Label>
                <FieldArray
                  name="newFees"
                  render={({ remove, push }) => (
                    <div>
                      {/* eslint-disable-next-line max-len */}
                      {props.values.newFees &&
                        props.values.newFees.map(
                          (newMargin: any, index: number) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Box sx={{ mb: 5 }} key={`div.newFees.${index}`}>
                              <Grid container>
                                <Grid item md={1} lg={1} sx={{ mt: 1 }}>
                                  <QDButton
                                    key={`btn.newFees.${index}`}
                                    type="button"
                                    onClick={() => remove(index)}
                                    id="exchange-delete-margin"
                                    variant="icon"
                                  >
                                    <img
                                      /* eslint-disable-next-line react/no-array-index-key */
                                      key={`img.newFees.${index}`}
                                      height={16}
                                      width={16}
                                      src={Icon.deleteIcon}
                                      alt="delete icon"
                                    />
                                  </QDButton>
                                </Grid>
                                <Grid item md={11} lg={11}>
                                  <DropdownFloating
                                    /* eslint-disable-next-line react/no-array-index-key */
                                    key={`dropdown.newFees[${index}].feeType`}
                                    id={`dropdown.newFees[${index}].feeAmount`}
                                    name={`newFees.${index}.feeType`}
                                    placeholder={`${intl.formatMessage({
                                      id: "chooseParameter",
                                      description: "Input Label",
                                      defaultMessage: "Choose Parameter",
                                    })}*`}
                                    list={selectFees}
                                    valueKey="feeType"
                                    value={props.values.newFees[index].feeType}
                                    {...props}
                                  />
                                </Grid>
                              </Grid>
                              {props.touched.newFees &&
                                props.touched.newFees[index] &&
                                props.touched.newFees[index].feeType &&
                                props.errors.newFees &&
                                props.errors.newFees[index] &&
                                props.errors.newFees[index].feeType && (
                                  <Grid container>
                                    <Grid item md={1} lg={1}></Grid>
                                    <Grid item md={11} lg={11}>
                                      <Label variant="error" noMargin={true}>
                                        {props.errors.newFees[index].feeType}
                                      </Label>
                                    </Grid>
                                  </Grid>
                                )}
                              <Grid container spacing={2}>
                                <Grid item md={1} lg={1}></Grid>
                                <Grid item md={11} lg={11}>
                                  <FormGroup>
                                    <Grid container>
                                      <Grid item md={12} lg={12}>
                                        <DropdownFloating
                                          /* eslint-disable-next-line react/no-array-index-key */
                                          key={`dropdown.newFees[${index}].currencies`}
                                          id={`dropdown.newFees[${index}].currencies`}
                                          name={`newFees.${index}.currency`}
                                          placeholder={`${intl.formatMessage({
                                            id: "currency",
                                            description: "Input Label",
                                            defaultMessage: "Currency",
                                          })}*`}
                                          list={currencies}
                                          value={
                                            props.values.newFees[index].currency
                                          }
                                          {...props}
                                        />
                                      </Grid>
                                    </Grid>
                                    <Grid container>
                                      <Grid item md={12} lg={12}>
                                        <DropdownFloating
                                          /* eslint-disable-next-line react/no-array-index-key */
                                          key={`dropdown.newFees[${index}].calculationMethods`}
                                          id={`dropdown.newFees[${index}].calculationMethods`}
                                          name={`newFees.${index}.calculationMethodDescription`}
                                          placeholder={`${intl.formatMessage({
                                            id: "calculationMethod",
                                            description: "Input Label",
                                            defaultMessage:
                                              "Calculation Method",
                                          })}*`}
                                          list={calculationMethods}
                                          value={
                                            props.values.newFees[index]
                                              .calculationMethodDescription
                                          }
                                          {...props}
                                        />
                                      </Grid>
                                    </Grid>
                                    {props.touched.newFees &&
                                      props.touched.newFees[index] &&
                                      props.touched.newFees[index].currency &&
                                      props.errors.newFees &&
                                      props.errors.newFees[index] &&
                                      props.errors.newFees[index].currency && (
                                        <Grid container>
                                          <Grid md={11} lg={11}>
                                            <Box>
                                              <Label
                                                variant="error"
                                                noMargin={true}
                                              >
                                                {
                                                  props.errors.newFees[index]
                                                    .currency
                                                }
                                              </Label>
                                            </Box>
                                          </Grid>
                                        </Grid>
                                      )}
                                    {props.values.newFees[index]
                                      .calculationMethodDescription && (
                                      <Grid container spacing={2}>
                                        {props.values.newFees[index]
                                          .calculationMethodDescription !==
                                          "Percentage" && (
                                          <Grid item md={6} lg={6}>
                                            <InputWithPlaceholder
                                              /* eslint-disable-next-line react/no-array-index-key */
                                              key={`input.newFees[${index}].fixFee`}
                                              id={`input.newFees[${index}].fixFee`}
                                              name={`newFees.${index}.fixFee`}
                                              autoComplete="off"
                                              type="text"
                                              placeholder={`${intl.formatMessage(
                                                {
                                                  id: "fee.wizard.newFees.feeAmount",
                                                  description: "Input Label",
                                                  defaultMessage:
                                                    "Fee Amount ($)",
                                                }
                                              )}*`}
                                              value={
                                                props.values.newFees[index]
                                                  .fixFee
                                              }
                                              {...props}
                                            />
                                          </Grid>
                                        )}
                                        {props.values.newFees[index]
                                          .calculationMethodDescription !==
                                          "Flat Amount" && (
                                          <Grid item md={6} lg={6}>
                                            <InputWithPlaceholder
                                              /* eslint-disable-next-line react/no-array-index-key */
                                              key={`input.newFees[${index}].percentage`}
                                              id={`input.newFees[${index}].percentage`}
                                              name={`newFees.${index}.percentage`}
                                              autoComplete="off"
                                              type="text"
                                              placeholder={`${intl.formatMessage(
                                                {
                                                  id: "fee.wizard.newFees.feeAmountPercent",
                                                  description: "Input Label",
                                                  defaultMessage:
                                                    "Fee Amount (%)",
                                                }
                                              )}*`}
                                              value={
                                                props.values.newFees[index]
                                                  .percentage
                                              }
                                              {...props}
                                            />
                                          </Grid>
                                        )}
                                      </Grid>
                                    )}
                                    {props.touched.newFees &&
                                      props.touched.newFees[index] &&
                                      props.touched.newFees[index].fixFee &&
                                      props.errors.newFees &&
                                      props.errors.newFees[index] &&
                                      props.errors.newFees[index].fixFee && (
                                        <Box>
                                          <Label
                                            variant="error"
                                            noMargin={true}
                                          >
                                            {props.errors.newFees[index].fixFee}
                                          </Label>
                                        </Box>
                                      )}
                                    {props.touched.newFees &&
                                      props.touched.newFees[index] &&
                                      props.touched.newFees[index].percentage &&
                                      props.errors.newFees &&
                                      props.errors.newFees[index] &&
                                      props.errors.newFees[index]
                                        .percentage && (
                                        <Box>
                                          <Label
                                            variant="error"
                                            noMargin={true}
                                          >
                                            {
                                              props.errors.newFees[index]
                                                .percentage
                                            }
                                          </Label>
                                        </Box>
                                      )}
                                    <Box>
                                      <Field
                                        name={`newFees.${index}.chargeReceiver`}
                                        as={QDCheckbox}
                                        value={
                                          props.values.newFees[index]
                                            .chargeReceiver == "on"
                                        }
                                        data={{
                                          label: intl.formatMessage({
                                            id: "chargeReceiver",
                                            defaultMessage: "Charge Receiver",
                                          }),
                                          id: `checkbox.newFees[${index}].chargeReceiver`,
                                          /* eslint-disable-next-line react/no-array-index-key */
                                          key: `checkbox.newFees[${index}].chargeReceiver`,
                                          checkbox: {
                                            color: "secondary",
                                            size: "small",
                                            checked:
                                              props.values.newFees[index]
                                                .chargeReceiver,
                                          },
                                        }}
                                        {...props}
                                      />
                                    </Box>
                                  </FormGroup>
                                  {props.values.newFees[index]
                                    .chargeReceiver && (
                                    <FormGroup>
                                      <Grid container spacing={2}>
                                        {props.values.newFees[index]
                                          .calculationMethodDescription !==
                                          "Percentage" && (
                                          <Grid item md={6} lg={6}>
                                            <InputWithPlaceholder
                                              /* eslint-disable-next-line react/no-array-index-key */
                                              key={`input.newFees[${index}].receiverFixFee`}
                                              id={`input.newFees[${index}].receiverFixFee`}
                                              name={`newFees.${index}.receiverFixFee`}
                                              autoComplete="off"
                                              type="text"
                                              placeholder={`${intl.formatMessage(
                                                {
                                                  id: "fee.wizard.newFees.receiverFeeAmount",
                                                  description: "Input Label",
                                                  defaultMessage:
                                                    "Receiver Fee Amount($)",
                                                }
                                              )}*`}
                                              value={
                                                props.values.newFees[index]
                                                  .receiverFixFee
                                              }
                                              {...props}
                                            />
                                          </Grid>
                                        )}
                                        {props.values.newFees[index]
                                          .calculationMethodDescription !==
                                          "Flat Amount" && (
                                          <Grid item md={6} lg={6}>
                                            <InputWithPlaceholder
                                              /* eslint-disable-next-line react/no-array-index-key */
                                              key={`input.newFees[${index}].receiverPercentage`}
                                              id={`input.newFees[${index}].receiverPercentage`}
                                              name={`newFees.${index}.receiverPercentage`}
                                              autoComplete="off"
                                              type="text"
                                              placeholder={`${intl.formatMessage(
                                                {
                                                  id: "fee.wizard.newFees.receiverFeeAmountPercent",
                                                  description: "Input Label",
                                                  defaultMessage:
                                                    "Receiver Fee Amount($)",
                                                }
                                              )}*`}
                                              value={
                                                props.values.newFees[index]
                                                  .receiverPercentage
                                              }
                                              {...props}
                                            />
                                          </Grid>
                                        )}
                                      </Grid>
                                      {props.touched.newFees &&
                                        props.touched.newFees[index] &&
                                        props.touched.newFees[index]
                                          .receiverFixFee &&
                                        props.errors.newFees &&
                                        props.errors.newFees[index] &&
                                        props.errors.newFees[index]
                                          .receiverFixFee && (
                                          <Box>
                                            <Label
                                              variant="error"
                                              noMargin={true}
                                            >
                                              {
                                                props.errors.newFees[index]
                                                  .receiverFixFee
                                              }
                                            </Label>
                                          </Box>
                                        )}
                                      {props.touched.newFees &&
                                        props.touched.newFees[index] &&
                                        props.touched.newFees[index]
                                          .receiverPercentage &&
                                        props.errors.newFees &&
                                        props.errors.newFees[index] &&
                                        props.errors.newFees[index]
                                          .receiverPercentage && (
                                          <Box>
                                            <Label
                                              variant="error"
                                              noMargin={true}
                                            >
                                              {
                                                props.errors.newFees[index]
                                                  .receiverPercentage
                                              }
                                            </Label>
                                          </Box>
                                        )}
                                    </FormGroup>
                                  )}
                                </Grid>
                              </Grid>
                            </Box>
                          )
                        )}
                      <Box sx={{ pb: 2, textAlign: "right" }}>
                        <QDButton
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={() => push({})}
                          id="fee-wizard-add-fee"
                        >
                          <FormattedMessage
                            id="button.addAdditionalFee"
                            description="Input Label"
                            defaultMessage="ADD ADDITIONAL FEE"
                          />
                        </QDButton>
                      </Box>
                    </div>
                  )}
                />
              </FormGroup>
              <FormGroup>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mt: 5,
                  }}
                >
                  <CancelButton
                    id="drawer.fee.wizard.button.cancel"
                    onClick={() => toggleDrawer()}
                  >
                    <FormattedMessage
                      id="cancel"
                      description="Cancel button"
                      defaultMessage="Cancel"
                    />
                  </CancelButton>
                  <SubmitButton
                    id="drawer.fee.wizrd.button.continue"
                    disabled={!canContinue(props.dirty, props.values.newFees)}
                    onClick={() => handleSubmit(props.values)}
                  >
                    <FormattedMessage
                      id="continue"
                      description="Save changes button"
                      defaultMessage="Continue"
                    />
                  </SubmitButton>
                </Box>
              </FormGroup>
            </FormGroup>
          </form>
        )}
      </Formik>
    </Container>
  ) : null;
};

export default FeePlanWizardStep1Drawer;
