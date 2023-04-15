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
import React, { useContext, useEffect, useState, FormEvent } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Container, Box, Grid, FormGroup } from "@mui/material";
import { useFormikContext, Field, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import RadioButton from "../../common/forms/buttons/RadioButton";
import RadioButtonGroup from "../../common/forms/buttons/RadioButtonGroup";
import DatePicker from "../../common/forms/inputs/DatePicker";
import api from "../../../api/api";
import { RiskLevelWizardContext } from "../../../contexts/RiskLevelWizardContext";
import Icon from "../../common/Icon";
import { MessageContext } from "../../../contexts/MessageContext";
import SubmitButton from "../../common/elements/SubmitButton";
import CancelButton from "../../common/elements/CancelButton";
import QDButton from "../../common/elements/QDButton";
import Header from "../../common/elements/Header";
import Label from "../../common/elements/Label";

interface ISuccessObject {
  success: boolean;
  successMessage: string;
}

const RiskLevelWizardStep2Drawer: React.FC = () => {
  const contextValue = useContext(RiskLevelWizardContext);
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const {
    newRiskObject,
    existingRiskLevels,
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
  });
  const [successObj, setSuccessObj] = useState<ISuccessObject>({
    success: false,
    successMessage: "",
  });

  const getChangeOrders = () =>
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
        }

        setInitialValues(withOrder);
        setChangeOrderObject(withOrder);
      })
      .catch((e: any) => setErrorMsg(e));

  const createUpdateRiskConfigRequest = async (
    name: string,
    id: string,
    dto: any
  ) =>
    // @ts-ignore
    api.OperatingChangeOrderAPI.createUpdateRiskConfigRequest(
      name,
      id,
      dto
    ).catch((e: any) => setErrorMsg(e));

  const createRiskRuleRequests = async (
    changeOrderId: string,
    newRiskLevel: any,
    newRiskRules: any,
    existingOrNew: string
  ) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const rule of newRiskRules) {
      const RULE_VALUE_MAX_LENGTH = 128;
      const fixeRuleValue =
        rule.value.length >= RULE_VALUE_MAX_LENGTH
          ? `${rule.value.substring(0, RULE_VALUE_MAX_LENGTH)}...`
          : rule.value;
      const riskParamDto = {
        memo:
          rule.changeStateMemo && rule.changeStateMemo !== ""
            ? rule.changeStateMemo
            : `${rule.changeState} '${rule.paramName}' param with '${fixeRuleValue}' value`,
        securityLevel: newRiskLevel,
        paramName: rule.paramName,
        value: rule.value,
        action: rule.changeState === "Removing" ? "Delete" : "InsertOrUpdate",
        block:
          (rule.block && rule.block[0] == "on") ||
          (rule.checkboxOptions &&
            rule.checkboxOptions.indexOf("block") !== -1),
        disabled:
          (rule.disabled && rule.disabled[0] == "on") ||
          (rule.checkboxOptions &&
            rule.checkboxOptions.indexOf("disabled") !== -1),
        notify:
          (rule.notify && rule.notify[0] == "on") ||
          (rule.checkboxOptions &&
            rule.checkboxOptions.indexOf("notify") !== -1),
      };

      // eslint-disable-next-line no-await-in-loop
      await createUpdateRiskConfigRequest(
        programName,
        changeOrderId,
        riskParamDto
      );
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
    const { newRiskLevel, newRiskRules } = newRiskObject;

    const { activationDate, existingOrNew, changeOrder } = values;

    const existingLevel =
      existingRiskLevels.indexOf(parseInt(newRiskLevel, 10)) !== -1;

    // create new change order
    if (existingOrNew === "createNew") {
      const coMemo = existingLevel
        ? `New risk rules for ${programName} program, risk level ${newRiskLevel}`
        : `New Risk Level ${newRiskLevel} for ${programName} program`;

      const changeOrderDto = {
        type: "OperatingRisk",
        partnerProgramName: programName,
        activationDateAndTime:
          activationDate && activationDate.length > 0
            ? `${activationDate}T06:00`
            : null,
        memo: coMemo,
      };

      // @ts-ignore
      api.OperatingChangeOrderAPI.createChangeOrder(
        programName,
        changeOrderDto
      ).then(async (orderResult: any) => {
        if (!existingLevel) {
          // new Risk Level
          const riskLevelDto = {
            memo: `New Risk Level ${newRiskLevel} for ${programName} program`,
            securityLevel: newRiskLevel,
            action: "InsertOrUpdate",
          };

          // @ts-ignore
          // eslint-disable-next-line max-len
          api.OperatingChangeOrderAPI.createUpdateRiskLevelRequest(
            programName,
            orderResult.id,
            riskLevelDto
          ).then(() => {
            createRiskRuleRequests(
              orderResult.id,
              newRiskLevel,
              newRiskRules,
              existingOrNew
            );
          });
        } else {
          await createRiskRuleRequests(
            orderResult.id,
            newRiskLevel,
            newRiskRules,
            existingOrNew
          );
        }
      });
    } else {
      // use existing change order
      // eslint-disable-next-line no-lonely-if
      if (!existingLevel) {
        // new Risk Level
        const riskLevelDto = {
          memo: `New Risk Level ${newRiskLevel} for ${programName} program`,
          securityLevel: newRiskLevel,
          action: "InsertOrUpdate",
        };

        // @ts-ignore
        // eslint-disable-next-line max-len
        api.OperatingChangeOrderAPI.createUpdateRiskLevelRequest(
          programName,
          changeOrder,
          riskLevelDto
        ).then(() => {
          createRiskRuleRequests(
            changeOrder,
            newRiskLevel,
            newRiskRules,
            existingOrNew
          );
        });
      } else {
        // existing Risk Level
        await createRiskRuleRequests(
          changeOrder,
          newRiskLevel,
          newRiskRules,
          existingOrNew
        );
      }
    }
  };

  const handleOnChange = (values: any) => {
    // persist form selection to keep data when user decided to comeback to step 3
    const { activateOn, activationDate, existingOrNew, changeOrder } = values;
    setChangeOrderObject({
      activateOn: activateOn ? activateOn : "",
      activationDate: activationDate,
      existingOrNew: existingOrNew,
      changeOrder: changeOrder,
    });
  };

  const RiskSchema = Yup.object().shape({
    existingOrNew: Yup.string().required(
      intl.formatMessage({
        id: "pleaseChooseOne",
        description: "drawer header",
        defaultMessage: "Please choose one.",
      })
    ),
    activateOn: Yup.string().when("existingOrNew", {
      is: (val: string) => val === "createNew",
      then: Yup.string().required(
        intl.formatMessage({
          id: "error.activateOn.required",
          description: "drawer header",
          defaultMessage: "Activate On is a required field",
        })
      ),
    }),
    activationDate: Yup.string().when("activateOn", {
      is: (val: string) => val === "schedule",
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
          id: "createNewRiskLevel",
          description: "drawer header",
          defaultMessage: "Create New Risk Level",
        })}
        level={2}
        color="white"
        bold
        drawerTitle
        marginTop={0}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={RiskSchema}
        onSubmit={(values) => handleSubmit(values)}
        validate={handleOnChange}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
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
                  <FormGroup sx={{ mb: 3 }}>
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

                    {props.values.existingOrNew === "useExisting" && (
                      <Box sx={{ ml: 3, mb: "80px" }}>
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
                      </Box>
                    )}
                  </FormGroup>
                </RadioButtonGroup>
              </FormGroup>

              {props.values.existingOrNew === "createNew" && (
                <FormGroup sx={{ mb: "80px" }}>
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
                        label={
                          <FormattedMessage
                            id="schedule"
                            description="Drawer form placeholder text"
                            defaultMessage="Schedule"
                          />
                        }
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
              )}

              <Grid container rowSpacing={1} justifyContent="center">
                <Grid item xs={4}>
                  <CancelButton
                    id="drawer.risk.wizard.button.cancel"
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
                    id="drawer.risk.wizard.button.continue"
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

export default RiskLevelWizardStep2Drawer;
