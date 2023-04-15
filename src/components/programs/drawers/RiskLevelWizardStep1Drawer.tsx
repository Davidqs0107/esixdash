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
import { Container, Box, Grid, FormGroup } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { FieldArray, Formik, Field } from "formik";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import Icon from "../../common/Icon";
import api from "../../../api/api";
import { RiskLevelWizardContext } from "../../../contexts/RiskLevelWizardContext";
import { MessageContext } from "../../../contexts/MessageContext";
import RiskParamConverter from "../../common/converters/RiskParamConverter";
import QDButton from "../../common/elements/QDButton";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import QDCheckbox from "../../common/forms/inputs/QDCheckbox";
import Label from "../../common/elements/Label";
import Header from "../../common/elements/Header";

const RiskLevelWizardStep1Drawer: React.FC = () => {
  const { setErrorMsg } = useContext(MessageContext);
  const contextValue = useContext(RiskLevelWizardContext);

  const {
    riskLevelToCopy,
    setNewRiskObject,
    getNextStep,
    getPreviousStep,
    currentStep,
    programName,
    newRiskObject,
    skippedStep0,
    existingRiskLevels,
    toggleDrawer,
  } = contextValue;

  const intl = useIntl();
  const [paramList, setParamList] = useState([]);
  const [originalRisks, setOriginalRisks] = useState([]);

  const { data: getRiskParamsData } = useQuery({
    queryKey: ["getRiskParams", programName],
    queryFn: () =>
      // @ts-ignore
      api.RiskAPI.getRiskParams(programName),
  });

  const isRiskRuleNew = (newRiskLevel: any, rule: any) => {
    return (
      existingRiskLevels.indexOf(parseInt(newRiskLevel, 10)) < 0 ||
      originalRisks.find((p: any) => p.id === rule.id) === undefined
    );
  };

  const hasRiskRuleChanged = (newRiskLevel: any, rule: any, original: any) => {
    return (
      !isRiskRuleNew(newRiskLevel, rule) &&
      (original.paramName !== rule.paramName ||
        original.value !== rule.value ||
        original.block !== rule.block ||
        original.notify !== rule.notify ||
        original.disabled !== rule.disabled)
    );
  };

  const getRuleChangedMemo = (rule: any, original: any) => {
    // Generate memo text for changed params
    // If paramNameChanged is true, keep memo text short to keep it under 255 char limit
    let changeStateMemos = [];

    if (original) {
      let paramNameChanged = original.paramName !== rule.paramName;

      const RULE_VALUE_MAX_LENGTH = 128;
      const fixeRuleValue =
        rule.value.length >= RULE_VALUE_MAX_LENGTH
          ? `${rule.value.substring(0, RULE_VALUE_MAX_LENGTH)}...`
          : rule.value;

      if (paramNameChanged || original.value !== rule.value)
        changeStateMemos.push(
          paramNameChanged
            ? `Updating param from '${original.paramName}' to '${rule.paramName}' with '${fixeRuleValue}' value`
            : `Updating '${rule.paramName}' with '${fixeRuleValue}' value`
        );
      if (original.block !== rule.block)
        changeStateMemos.push(
          paramNameChanged
            ? `Updating 'Block' to '${rule.block}'`
            : `Updating '${rule.paramName}' param 'Block' to '${rule.block}'`
        );
      if (original.notify !== rule.notify)
        changeStateMemos.push(
          paramNameChanged
            ? `Updating 'Notify' to '${rule.notify}'`
            : `Updating '${rule.paramName}' param 'Notify' to '${rule.notify}'`
        );
      if (original.disabled !== rule.disabled)
        changeStateMemos.push(
          paramNameChanged
            ? `Updating 'Disabled' to '${rule.disabled}'`
            : `Updating '${rule.paramName}' param 'Disabled' to '${rule.disabled}'`
        );
    }

    return changeStateMemos ? changeStateMemos.join("\n") : "";
  };

  const [initialState, setInitialState] = useState({
    newRiskLevel: "",
    newRiskRules: [],
  });

  const getRiskConfigs = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.RiskAPI.getRiskConfigs(programName, riskLevelToCopy).catch(
      (error: any) => setErrorMsg(error)
    );

  const buildInitialState = async () => {
    const copyParams: any = [];
    if (riskLevelToCopy && riskLevelToCopy.length > 0) {
      await getRiskConfigs().then(
        (c: any) => c !== undefined && copyParams.push(...c)
      );

      if (copyParams && copyParams.length > 0) {
        setOriginalRisks(copyParams);
      }
    }

    // in case the user proceeded to step 3 and then decided to come back to step 2
    const reRenderParams = newRiskObject.newRiskRules
      ? newRiskObject.newRiskRules
      : [];

    let riskLevel;
    if (skippedStep0) {
      riskLevel = riskLevelToCopy;
    } else {
      riskLevel =
        newRiskObject.newRiskLevel !== undefined
          ? newRiskObject.newRiskLevel
          : "";
    }

    setInitialState({
      newRiskLevel: riskLevel,
      newRiskRules:
        riskLevelToCopy && riskLevelToCopy.length > 0
          ? reRenderParams.length > 0
            ? reRenderParams
            : copyParams
          : reRenderParams,
    });
  };

  useEffect(() => {
    if (currentStep === 1) {
      buildInitialState();
    }
  }, [currentStep]);

  const handleSubmit = (values: any) => {
    const { newRiskLevel, newRiskRules } = values;
    const newOrChangedRules: any = [];

    /* Look for changed items. */
    newRiskRules.forEach((rule: any) => {
      const original: any = originalRisks.find((p: any) => p.id === rule.id);

      if (
        isRiskRuleNew(newRiskLevel, rule) ||
        hasRiskRuleChanged(newRiskLevel, rule, original)
      ) {
        rule.changeState = isRiskRuleNew(newRiskLevel, rule)
          ? "Adding"
          : "Updating";
        rule.changeStateMemo = getRuleChangedMemo(rule, original);

        // Push any new or changed rules
        newOrChangedRules.push(rule);
      }
    });

    /* Look for removed entries. */
    originalRisks.forEach((rule: any) => {
      if (
        existingRiskLevels.indexOf(parseInt(newRiskLevel, 10)) !== -1 &&
        !newRiskRules.find((nr: any) => nr.id === rule.id)
      ) {
        rule.changeState = "Removing";
        newOrChangedRules.push(rule);
      }
    });

    setNewRiskObject({
      newRiskLevel,
      newRiskRules: newOrChangedRules,
    });

    getNextStep();
  };

  const RiskSchema = Yup.object().shape({
    newRiskLevel: Yup.number()
      .typeError(
        intl.formatMessage({
          id: "error.riskLevel.numberType",
          description: "drawer header",
          defaultMessage: "Risk Level must be a number",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.riskLevel.required",
          description: "drawer header",
          defaultMessage: "Risk Level is a required field",
        })
      ),
    newRiskRules: Yup.array().of(
      Yup.object().shape({
        paramName: Yup.string().required(
          intl.formatMessage({
            id: "error.riskParameter.required",
            description: "drawer header",
            defaultMessage: "Risk Parameter is a required field",
          })
        ),
        value: Yup.string().required(
          intl.formatMessage({
            id: "error.value.required",
            description: "drawer header",
            defaultMessage: "Value is a required field",
          })
        ),
      })
    ),
  });

  useEffect(() => {
    if (getRiskParamsData) {
      const params = getRiskParamsData.map((param: any) => ({
        text: RiskParamConverter(param.name, intl),
        param: param.name,
      }));
      params.sort((a: any, b: any) =>
        a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1
      );
      setParamList(params);
    }
  }, [getRiskParamsData]);

  return currentStep === 1 ? (
    <Container sx={{ width: "397px" }}>
      {!skippedStep0 ? (
        <>
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
              id="step2of3"
              description="Step 2 of 3"
              defaultMessage="Step 2 of 3"
            />
          </Label>
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
        </>
      ) : (
        <>
          <Label htmlFor="steps">
            <FormattedMessage
              id="step1of2"
              description="Step 1 of 2"
              defaultMessage="Step 1 of 2"
            />
          </Label>
          <Header
            value={intl.formatMessage({
              id: "addRulesToRiskLevel",
              description: "drawer header",
              defaultMessage: "Add Rules to Risk Level",
            })}
            level={2}
            color="white"
            bold
            drawerTitle
            marginTop={0}
          />
        </>
      )}

      <Formik
        initialValues={initialState}
        validationSchema={RiskSchema}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
            <FormGroup>
              <FormGroup>
                {skippedStep0 ? (
                  <DropdownFloating
                    name="newRiskLevel"
                    placeholder={`${intl.formatMessage({
                      id: "riskLevelNumber",
                      defaultMessage: "Risk Level Number",
                    })}*`}
                    list={existingRiskLevels}
                    value={props.values.newRiskLevel}
                    {...props}
                  />
                ) : (
                  <InputWithPlaceholder
                    name="newRiskLevel"
                    autoComplete="off"
                    type="text"
                    placeholder={`${intl.formatMessage({
                      id: "newRiskLevelNumber",
                      defaultMessage: "New Risk Level Number",
                    })}*`}
                    {...props}
                  />
                )}
              </FormGroup>
              <FormGroup>
                <Label htmlFor="currencyGroup">
                  <FormattedMessage
                    id="addRiskRules"
                    description="Section Label"
                    defaultMessage="Add Risk Rules"
                  />
                </Label>
                <FieldArray
                  name="newRiskRules"
                  render={({ remove, push }) => (
                    <div>
                      {props.values.newRiskRules &&
                        props.values.newRiskRules.map(
                          (newMargin: any, index: number) => (
                            <>
                              <Box sx={{ ml: 4 }}>
                                {props.touched.newRiskRules &&
                                  props.touched.newRiskRules[index] &&
                                  !props.touched.newRiskRules[index].value &&
                                  !props.touched.newRiskRules[index]
                                    .paramName &&
                                  !props.values.newRiskRules[index].value &&
                                  !props.values.newRiskRules[index]
                                    .paramName && (
                                    <Label variant="error" noMargin>
                                      <FormattedMessage
                                        id="error.parameterAndValue.required"
                                        defaultMessage="Parameter and Value cannot be blank"
                                      />
                                    </Label>
                                  )}
                              </Box>
                              <Grid
                                container
                                // eslint-disable-next-line react/no-array-index-key
                                key={`div.newRiskRules.${index}`}
                              >
                                <Grid item sx={{ pt: 1 }}>
                                  <QDButton
                                    /* eslint-disable-next-line react/no-array-index-key */
                                    key={`btn.newRiskRules.${index}`}
                                    type="button"
                                    onClick={() => remove(index)}
                                    id="exchange-delete-margin"
                                    variant="icon"
                                  >
                                    <img
                                      /* eslint-disable-next-line react/no-array-index-key */
                                      key={`img.newRiskRules.${index}`}
                                      height={16}
                                      width={16}
                                      src={Icon.deleteIcon}
                                      alt="delete icon"
                                    />
                                  </QDButton>
                                </Grid>
                                <Grid item sx={{ flexGrow: 1 }}>
                                  <Box>
                                    <DropdownFloating
                                      /* eslint-disable-next-line react/no-array-index-key */
                                      key={`dropdown.newRiskRules[${index}].paramName`}
                                      name={`newRiskRules.${index}.paramName`}
                                      placeholder={`${intl.formatMessage({
                                        id: "chooseParameter",
                                        defaultMessage: "Choose Parameter",
                                      })}*`}
                                      list={paramList}
                                      valueKey="param"
                                      value={
                                        props.values.newRiskRules[index]
                                          .paramName
                                      }
                                      {...props}
                                    />
                                  </Box>
                                  {props.touched.newRiskRules &&
                                    props.touched.newRiskRules[index] &&
                                    props.touched.newRiskRules[index]
                                      .paramName &&
                                    props.errors.newRiskRules &&
                                    props.errors.newRiskRules[index] &&
                                    props.errors.newRiskRules[index]
                                      .paramName && (
                                      <Box>
                                        <Label variant="error">
                                          {
                                            props.errors.newRiskRules[index]
                                              .paramName
                                          }
                                        </Label>
                                      </Box>
                                    )}
                                  <Box>
                                    {props.touched.newRiskRules &&
                                      props.touched.newRiskRules[index] &&
                                      props.touched.newRiskRules[index].value &&
                                      props.errors.newRiskRules &&
                                      props.errors.newRiskRules[index] &&
                                      props.errors.newRiskRules[index]
                                        .value && (
                                        <Box>
                                          <Label variant="error" noMargin>
                                            {
                                              props.errors.newRiskRules[index]
                                                .value
                                            }
                                          </Label>
                                        </Box>
                                      )}
                                    <Box>
                                      <InputWithPlaceholder
                                        name={`newRiskRules.${index}.value`}
                                        autoComplete="off"
                                        type="text"
                                        /* eslint-disable-next-line react/no-array-index-key */
                                        key={`newRiskRules.${index}.value`}
                                        placeholder={`${intl.formatMessage({
                                          id: "value",
                                          description: "Input Label",
                                          defaultMessage: "Value",
                                        })}*`}
                                        value={
                                          props.values.newRiskRules[index].value
                                        }
                                        {...props}
                                      />
                                    </Box>
                                  </Box>

                                  <FormGroup>
                                    <Box>
                                      <Grid>
                                        <Field
                                          name={`newRiskRules.${index}.block`}
                                          as={QDCheckbox}
                                          value={
                                            props.values.newRiskRules[index]
                                              .block
                                          }
                                          data={{
                                            label: intl.formatMessage({
                                              id: "block",
                                              defaultMessage: "Block",
                                            }),
                                            id: `block-checkbox-${index}`,
                                            key: `block-checkbox-${index}`,
                                            checkbox: {
                                              color: "secondary",
                                              size: "small",
                                              checked: newMargin.block,
                                            },
                                          }}
                                          {...props}
                                        />
                                      </Grid>
                                      <Grid>
                                        <Field
                                          name={`newRiskRules.${index}.notify`}
                                          as={QDCheckbox}
                                          value={
                                            props.values.newRiskRules[index]
                                              .notify
                                          }
                                          data={{
                                            label: intl.formatMessage({
                                              id: "notify",
                                              defaultMessage: "Notify",
                                            }),
                                            id: `notify-checkbox-${index}`,
                                            key: `notify-checkbox-${index}`,
                                            checkbox: {
                                              color: "secondary",
                                              size: "small",
                                              checked: newMargin.notify,
                                            },
                                          }}
                                          {...props}
                                        />
                                      </Grid>
                                      <Grid>
                                        <Field
                                          name={`newRiskRules.${index}.disabled`}
                                          as={QDCheckbox}
                                          value={
                                            props.values.newRiskRules[index]
                                              .disabled
                                          }
                                          data={{
                                            label: intl.formatMessage({
                                              id: "disabled",
                                              defaultMessage: "Disabled",
                                            }),
                                            id: `disabled-checkbox-${index}`,
                                            key: `disabled-checkbox-${index}`,
                                            checkbox: {
                                              color: "secondary",
                                              size: "small",
                                              checked: newMargin.disabled,
                                            },
                                          }}
                                          {...props}
                                        />
                                      </Grid>
                                    </Box>
                                  </FormGroup>
                                </Grid>
                              </Grid>
                            </>
                          )
                        )}

                      <Grid container justifyContent="right" sx={{ mb: 6 }}>
                        <QDButton
                          label={intl.formatMessage({
                            id: "button.addAdditionalRiskRule",
                            description: "Input Label",
                            defaultMessage: "ADD ADDITIONAL RISK RULE",
                          })}
                          color="primary"
                          variant="contained"
                          size="small"
                          onClick={() => push("")}
                          id="risk-wizard-add-risk-rule"
                        />
                      </Grid>
                    </div>
                  )}
                />
              </FormGroup>

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
                    id="drawer-risk-wizard-button-continue"
                    disabled={!props.dirty && !props.values.newRiskLevel}
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

export default RiskLevelWizardStep1Drawer;
