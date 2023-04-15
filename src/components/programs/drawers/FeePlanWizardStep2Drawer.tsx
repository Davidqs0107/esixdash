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
import { Container, FormGroup, Box, Grid } from "@mui/material";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import RadioButton from "../../common/forms/buttons/RadioButton";
import RadioButtonGroup from "../../common/forms/buttons/RadioButtonGroup";
import api from "../../../api/api";
import Icon from "../../common/Icon";
import { MessageContext } from "../../../contexts/MessageContext";
import { FeePlanWizardContext } from "../../../contexts/FeePlanWizardContext";
import getDecimalFractionalPercentage from "../../common/converters/DecimalFractionalPercentageConverter";
import DatePicker from "../../common/forms/inputs/DatePicker";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import QDButton from "../../common/elements/QDButton";
import Header from "../../common/elements/Header";
import Label from "../../common/elements/Label";
import { FormatTxSource, FormatTxType } from "../../common/converters/FormatTxSource";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";

interface ISuccessObject {
  success: boolean;
  successMessage: string;
}

const FeePlanWizardStep2Drawer: React.FC = () => {
  const contextValue = useContext(FeePlanWizardContext);
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const {
    newFeeObject,
    existingFeePlans,
    currentStep,
    programName,
    getPreviousStep,
    skippedStep0,
    toggleDrawer,
    changeOrderObject,
    setChangeOrderObject,
  } = contextValue;

  const intl = useIntl();
  const [existingChangeOrders, setExistingChangeOrders] = useState([]);
  const [initialValues, setInitialValues] = useState({
    existingOrNew: "",
    changeOrder: "",
    activateOn: "",
    activationDate: "",
    memo: "",
  });
  const [successObj, setSuccessObj] = useState<ISuccessObject>({
    success: false,
    successMessage: "",
  });

  const getChangeOrders = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingChangeOrderAPI.getChangeOrders(programName, {
      state: "Open",
      startIndex: 0,
      count: 100,
      ascending: true,
    })
      .then((orders: any) => {
        const orderIds = orders.data.map((x: any) => ({
          id: x.id,
          text: x.memo,
        }));
        setExistingChangeOrders(orderIds);
        // Also set the initial value to the first order
        //  otherwise you have to switch away and back to the first item to use it.
        const withOrder = initialValues;
        if (orderIds.length > 0) {
          withOrder.changeOrder = changeOrderObject.changeOrder
            ? changeOrderObject.changeOrder
            : orderIds[0].id;
        }

        if (changeOrderObject) {
          withOrder.existingOrNew = changeOrderObject.existingOrNew;
          withOrder.activateOn = changeOrderObject.activateOn;
          withOrder.activationDate = changeOrderObject.activationDate;
          withOrder.memo = "";
        }

        setInitialValues(withOrder);
        setChangeOrderObject(withOrder);
      })
      .catch((e: any) => setErrorMsg(e));

  const createUpdateFeeEntryRequest = async (
    name: string,
    id: string,
    dto: any
  ) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingChangeOrderAPI.createUpdateFeeEntryRequest(
      name,
      id,
      dto
    ).catch((e: any) => setErrorMsg(e));

  const createFeesRequests = async (
    changeOrderId: string,
    newFeePlan: string,
    newFees: any[],
    existingOrNew: string
  ) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const fee of newFees) {
      let memo = "";
      const { currency, fixFee, percentage, calculationMethodDescription } =
        fee;
      
      const [transactionSourceCode, transactionTypeCode] =
        fee.feeType.split(",");

      const formattedTxSource = FormatTxSource(transactionSourceCode, intl);
      const formattedTxType = FormatTxType(transactionTypeCode, intl);

      switch (calculationMethodDescription) {
        case "Flat Amount":
          memo = `"Adding" "${formattedTxSource} - ${formattedTxType}" fee in "${currency}" for "Flat Amount" of "${fixFee}".`;
          break;
        case "Percentage":
          memo = `"Adding" new "${formattedTxSource} - ${formattedTxType}" fee in "${currency}" for "${percentage}" percent.`;
          break;
        case "Flat + Percentage":
          memo = `"Adding" new "${formattedTxSource} - ${formattedTxType}" fee in "${currency}" for "${fixFee}" and "${percentage}" percent.`;
          break;
        case "Greater Of":
          memo = `"Adding" new "${formattedTxSource} - ${formattedTxType}" fee in "${currency}" for greater of "${fixFee}" or "${percentage}" percent.`;
          break;
        case "Lesser Of":
          memo = `"Adding" new "${formattedTxSource} - ${formattedTxType}" fee in "${currency}" for lesser of "${fixFee}" or "${percentage}" percent.`;
          break;
      }

      
      const feeDto = {
        memo: memo,
        feePlanName: newFeePlan,
        currency: fee.currency,
        transactionSourceCode,
        transactionTypeCode,
        action: fee.changeState === "Removing" ? "Delete" : "InsertOrUpdate",
        fixFee: fee.fixFee,
        percentage: getDecimalFractionalPercentage(fee.percentage, 5),
        chargeReceiver: fee.chargeReceiver,
        receiverFixFee: fee.receiverFixFee,
        receiverPercentage: getDecimalFractionalPercentage(
          fee.receiverPercentage,
          5
        ),
        calculationMethod: fee.calculationMethod,
      };

      // eslint-disable-next-line no-await-in-loop
      await createUpdateFeeEntryRequest(programName, changeOrderId, feeDto);
    }

    let message;
    if (existingOrNew === "createNew") {
      message = intl.formatMessage({
        id: "changeOrder.create.success",
        defaultMessage: "Your change order was created successfully",
      });
    } else {
      message = intl.formatMessage({
        id: "changeRequest.create.success",
        defaultMessage: "Your change request was created successfully",
      });
    }

    setSuccessMsg({
      responseCode: "200000",
      message,
    });

    toggleDrawer();
  };

  const handleSubmit = async (values: any) => {
    const { newFeePlan, newFees } = newFeeObject;

    const { activationDate, existingOrNew, changeOrder, memo } = values;

    const existingPlan = existingFeePlans.indexOf(newFeePlan) !== -1;

    // create new change order
    if (existingOrNew === "createNew") {
      const coMemo = memo;

      const changeOrderDto = {
        type: "OperatingFee",
        partnerProgramName: programName,
        activationDateAndTime:
          activationDate && activationDate.length > 0
            ? `${activationDate}T06:00`
            : null,
        memo: coMemo,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.OperatingChangeOrderAPI.createChangeOrder(
        programName,
        changeOrderDto
      ).then(async (orderResult: any) => {
        if (!existingPlan) {
          // new fee plan
          const feePlaDto = {
            memo: `New fee plan '${newFeePlan}' for '${programName}' program`,
            feePlanName: newFeePlan,
            action: "InsertOrUpdate",
          };

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          api.OperatingChangeOrderAPI.createUpdateFeePlanRequest(
            programName,
            orderResult.id,
            feePlaDto
          ).then(() => {
            createFeesRequests(
              orderResult.id,
              newFeePlan,
              newFees,
              existingOrNew
            );
          });
        } else {
          await createFeesRequests(
            orderResult.id,
            newFeePlan,
            newFees,
            existingOrNew
          );
        }
      });
    } else {
      // use existing change order
      // eslint-disable-next-line no-lonely-if
      if (!existingPlan) {
        // new fee plan
        const feePlanDto = {
          memo: `New Fee Plan '${newFeePlan}' for '${programName}' program`,
          feePlanName: newFeePlan,
          action: "InsertOrUpdate",
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        api.OperatingChangeOrderAPI.createUpdateFeePlanRequest(
          programName,
          changeOrder,
          feePlanDto
        ).then(() => {
          createFeesRequests(changeOrder, newFeePlan, newFees, existingOrNew);
        });
      } else {
        // existing fee plan
        await createFeesRequests(
          changeOrder,
          newFeePlan,
          newFees,
          existingOrNew
        );
      }
    }
  };

  const handleOnChange = (values: any) => {
    // persist form selection to keep data when user decided to comeback to step 3
    const { activateOn, activationDate, existingOrNew, changeOrder, memo } = values;
    setChangeOrderObject({
      activateOn: activateOn ? activateOn : "",
      activationDate: activationDate,
      existingOrNew: existingOrNew,
      changeOrder: changeOrder,
      memo: memo
    });
  };

  const FeeSchema = Yup.object().shape({
    existingOrNew: Yup.string().required(
      intl.formatMessage({
        id: "pleaseChooseOne",
        description: "drawer header",
        defaultMessage: "Please choose one.",
      })
    ),
    activateOn: Yup.string().when("existingOrNew", {
      is: (val: any) => val === "createNew",
      then: Yup.string().required(
        intl.formatMessage({
          id: "error.activateOn.required",
          description: "drawer header",
          defaultMessage: "Activate On is a required field",
        })
      ),
    }),
    memo: Yup.string().when("existingOrNew", {
      is: (val: any) => val === "createNew",
      then: Yup.string().required(
        intl.formatMessage({
          id: "error.memo.required",
          defaultMessage: "Memo is a required field",
        })
      ),
    }),
    activationDate: Yup.string().when("activateOn", {
      is: (val: any) => val === "schedule",
      then: Yup.string()
        .min(8)
        .required(
          intl.formatMessage({
            id: "error.activationDate.required",
            description: "drawer header",
            defaultMessage: "Activation Date is a required field",
          })
        ),
      otherwise: Yup.string(),
    }),
  });

  useEffect(() => {
    if (currentStep === 2) {
      getChangeOrders();
    }
  }, [currentStep]);

  return currentStep === 2 ? (
    <Container sx={{ width: "397px" }}>
      {skippedStep0 ? (
        <Label htmlFor="steps">
          <Box onClick={() => getPreviousStep()}>
            <img
              width="14px"
              height="14px"
              src={Icon.caretLeftWhite}
              alt="icon"
            />
          </Box>
          <FormattedMessage
            id="step2of2"
            description="Step 2 of 2"
            defaultMessage="Step 2 of 2"
          />
        </Label>
      ) : (
        <Label htmlFor="steps">
          <Box onClick={() => getPreviousStep()}>
            <img
              width="14px"
              height="14px"
              src={Icon.caretLeftWhite}
              alt="icon"
            />
          </Box>
          <FormattedMessage
            id="step3of3"
            description="Step 3 of 3"
            defaultMessage="Step 3 of 3"
          />
        </Label>
      )}
      <Header
        value={intl.formatMessage({
          id: "createNewFeePlan",
          description: "drawer header",
          defaultMessage: "Create New Fee Plan",
        })}
        level={2}
        color="white"
        bold
        drawerTitle
        marginTop={0}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={FeeSchema}
        onSubmit={(values) => handleSubmit(values)}
        validate={handleOnChange}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit} noValidate>
            <FormGroup>
              <FormGroup>
                <Label htmlFor="">
                  {
                    <FormattedMessage
                      id="assignToAChangeOrder"
                      description="Drawer form placeholder text"
                      defaultMessage="Assign To a Change Order"
                    />
                  }
                  :
                </Label>
                <RadioButtonGroup
                  id="radioGroup"
                  value={props.values.existingOrNew}
                  error={props.errors.existingOrNew}
                  touched={props.touched.existingOrNew}
                >
                  <FormGroup sx={{ mb: 3 }}>
                    <Field
                      name="existingOrNew"
                      as={RadioButton}
                      label={
                        <FormattedMessage
                          id="createNewChangeOrder"
                          description="Drawer form placeholder text"
                          defaultMessage="Create New Change Order"
                        />
                      }
                      id="createNew"
                      value="createNew"
                      checked={props.values.existingOrNew === "createNew"}
                      {...props}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Field
                      name="existingOrNew"
                      as={RadioButton}
                      label={
                        <FormattedMessage
                          id="assignToExistingChangeOrder"
                          description="Drawer form placeholder text"
                          defaultMessage="Assign To Existing Change Order"
                        />
                      }
                      id="useExisting"
                      value="useExisting"
                      checked={props.values.existingOrNew === "useExisting"}
                      {...props}
                    />
                  </FormGroup>
                </RadioButtonGroup>
              </FormGroup>
              {props.values.existingOrNew === "useExisting" && (
                <FormGroup sx={{ ml: 3 }}>
                  <DropdownFloating
                    name="changeOrder"
                    placeholder={`${intl.formatMessage({
                      id: "chooseChangeOrder",
                      defaultMessage: "Choose change order",
                    })}*`}
                    list={existingChangeOrders}
                    value={props.values.changeOrder}
                    valueKey="id"
                    {...props}
                  />
                </FormGroup>
              )}
              {props.values.existingOrNew === "createNew" && (
                <>
                  <FormGroup sx={{ mt: 4 }}>
                    <InputWithPlaceholder
                      required={true}
                      name="memo"
                      autoComplete="off"
                      type="text"
                      placeholder={
                        <FormattedMessage
                          id="memo"
                          defaultMessage="Memo (255 characters max.)"
                        />
                      }
                      as="textarea"
                      multiline
                      {...props}
                    />
                  </FormGroup>
                  <FormGroup sx={{ mt: 1 }}>
                    <Label htmlFor="">
                      <FormattedMessage
                        id="activateOn"
                        description="Drawer form placeholder text"
                        defaultMessage="Activate on"
                      />
                      :
                    </Label>
                    <RadioButtonGroup
                      id="radioGroup"
                      value={props.values.activateOn}
                      error={props.errors.activateOn}
                      touched={props.touched.activateOn}
                    >
                      <FormGroup>
                        <Field
                          name="activateOn"
                          as={RadioButton}
                          label={
                            <FormattedMessage
                              id="approval"
                              description="Drawer form placeholder text"
                              defaultMessage="Approval"
                            />
                          }
                          id="approval"
                          value="approval"
                          checked={props.values.activateOn === "approval"}
                          {...props}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Field
                          name="activateOn"
                          as={RadioButton}
                          label={intl.formatMessage({
                            id: "schedule",
                            description: "Drawer form placeholder text",
                            defaultMessage: "Schedule",
                          })}
                          id="schedule"
                          value="schedule"
                          checked={props.values.activateOn === "schedule"}
                          {...props}
                        />
                      </FormGroup>
                    </RadioButtonGroup>
                    {props.values.activateOn === "schedule" ? (
                      <FormGroup sx={{ ml: 3 }}>
                        {props.touched.activationDate &&
                          props.errors.activationDate && (
                            <Label variant="error" noMargin>
                              {props.errors.activationDate}
                            </Label>
                          )}
                        <Field
                          component={DatePicker}
                          name="activationDate"
                          label={`${intl.formatMessage({
                            id: "chooseDate",
                            defaultMessage: "Choose date",
                          })}*`}
                          maxDate="4100-01-01"
                          minDate={moment().add(1, "days").format("YYYY-MM-DD")}
                          value={props.values.activationDate}
                          {...props}
                        />
                      </FormGroup>
                    ) : (
                      ""
                    )}
                  </FormGroup>
                </>
              )}

              <Grid
                container
                rowSpacing={1}
                justifyContent="center"
                sx={{ mt: 8 }}
              >
                <Grid item xs={4}>
                  <CancelButton
                    id="drawer-fee-wizard-button-cancel"
                    onClick={() => toggleDrawer()}
                  >
                    <FormattedMessage
                      id="cancel"
                      description="Cancel button"
                      defaultMessage="Cancel"
                    />
                  </CancelButton>
                </Grid>
                <Grid item xs={7}>
                  <SubmitButton
                    id="drawer-fee-wizard-button-continue"
                    disabled={!props.values.existingOrNew}
                  >
                    <FormattedMessage
                      id="continue"
                      description="Save changes button"
                      defaultMessage="Continue"
                    />
                  </SubmitButton>
                </Grid>
              </Grid>
            </FormGroup>
          </form>
        )}
      </Formik>
    </Container>
  ) : null;
};

export default FeePlanWizardStep2Drawer;
