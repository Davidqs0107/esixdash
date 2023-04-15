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
import React, { useContext, useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Container, Box, Grid, FormGroup } from "@mui/material";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import RadioButton from "../../common/forms/buttons/RadioButton";
import RadioButtonGroup from "../../common/forms/buttons/RadioButtonGroup";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import { RiskLevelWizardContext } from "../../../contexts/RiskLevelWizardContext";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Icon from "../../common/Icon";
import Header from "../../common/elements/Header";
import Label from "../../common/elements/Label";

const RiskLevelWizardStep0Drawer: React.FC = () => {
  const intl = useIntl();
  const contextValue = useContext(RiskLevelWizardContext);
  const {
    existingRiskLevels,
    setRiskLevelToCopy,
    getNextStep,
    currentStep,
    setNewRiskObject,
    newRiskObject,
    toggleDrawer,
    riskLevelToCopy,
  } = contextValue;

  const [initialState, setInitialState] = useState({
    copyOrNew: "",
    riskLevelToCopy: "",
  });

  useEffect(() => {
    setInitialState({
      copyOrNew: riskLevelToCopy ? "createCopy" : "createNew",
      riskLevelToCopy: riskLevelToCopy,
    });
  }, [riskLevelToCopy]);

  const handleSubmit = (values: any) => {
    const riskToCopy =
      values.copyOrNew === "createCopy" ? values.riskLevelToCopy : "";
    setNewRiskObject(newRiskObject);
    // changing riskToCopy to string is necessary b/c of logic in other places
    setRiskLevelToCopy(`${riskToCopy}`);

    getNextStep();
  };

  const RiskSchema = Yup.object().shape({
    copyOrNew: Yup.string().required(
      intl.formatMessage({
        id: "pleaseChooseOne",
        defaultMessage: "Please choose one.",
      })
    ),
    riskLevelToCopy: Yup.string().when("copyOrNew", {
      is: (val: string) => val === "createCopy",
      then: Yup.string().required(
        intl.formatMessage({
          id: "error.riskLevelToCopy.required",
          defaultMessage: "Risk Level To Copy is a required field",
        })
      ),
    }),
  });

  return currentStep === 0 ? (
    <Container sx={{ width: "397px" }}>
      <Label htmlFor="steps">
        <FormattedMessage
          id="step1of3"
          description="Step 1 of 3"
          defaultMessage="Step 1 of 3"
        />

        <img
          width="14px"
          height="14px"
          src={Icon.caretRightWhite}
          alt="icon"
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
      <Formik
        initialValues={initialState}
        validationSchema={RiskSchema}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
            <Box>
              <FormGroup>
                <Label>
                  <FormattedMessage
                    id="chooseOne"
                    description="Drawer form placeholder text"
                    defaultMessage="Choose One"
                  />
                  :
                </Label>

                <RadioButtonGroup
                  id="radioGroup"
                  value={props.values.copyOrNew}
                  error={props.errors.copyOrNew}
                  touched={props.touched.copyOrNew}
                >
                  <FormGroup sx={{ mb: 3 }}>
                    <Field
                      name="copyOrNew"
                      as={RadioButton}
                      label={
                        <FormattedMessage
                          id="configureRiskLevelManually"
                          description="Drawer form placeholder text"
                          defaultMessage="Configure risk level manually"
                        />
                      }
                      id="createNew"
                      value="createNew"
                      checked={props.values.copyOrNew === "createNew"}
                      {...props}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Field
                      name="copyOrNew"
                      as={RadioButton}
                      label={
                        <FormattedMessage
                          id="createCopyOfExistingRiskLevel"
                          description="Drawer form placeholder text"
                          defaultMessage="Create a copy of an existing risk level"
                        />
                      }
                      id="createCopy"
                      value="createCopy"
                      checked={props.values.copyOrNew === "createCopy"}
                      {...props}
                    />
                  </FormGroup>
                </RadioButtonGroup>
              </FormGroup>

              <Box sx={{ ml: 3, mb: "80px" }}>
                {props.values.copyOrNew === "createCopy" && (
                  <DropdownFloating
                    name="riskLevelToCopy"
                    placeholder={`${intl.formatMessage({
                      id: "chooseRiskLevelPlanToCopy",
                      description: "Input Label",
                      defaultMessage: "Choose Risk Level To Copy",
                    })}*`}
                    list={existingRiskLevels}
                    value={props.values.riskLevelToCopy}
                    {...props}
                  />
                )}
              </Box>
            </Box>

            <Grid container rowSpacing={1} justifyContent="center">
              <Grid item xs={4}>
                <CancelButton
                  id="drawer.risk.wizrd.button.cancel"
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
                  disabled={!props.values.copyOrNew}
                >
                  <FormattedMessage
                    id="continue"
                    description="Save changes button"
                    defaultMessage="Continue"
                  />
                </SubmitButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Container>
  ) : null;
};

export default RiskLevelWizardStep0Drawer;
