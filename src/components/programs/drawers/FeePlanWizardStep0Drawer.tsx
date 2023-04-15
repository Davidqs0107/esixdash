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
import { FeePlanWizardContext } from "../../../contexts/FeePlanWizardContext";
import Icon from "../../common/Icon";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Header from "../../common/elements/Header";
import Label from "../../common/elements/Label";

const FeePlanWizardStep0Drawer: React.FC = () => {
  const {
    setFeePlanToCopy,
    feePlanToCopy,
    getNextStep,
    currentStep,
    setNewFeeObject,
    newFeeObject,
    existingFeePlans,
    setChangeOrderObject,
    toggleDrawer,
  } = useContext(FeePlanWizardContext);

  const intl = useIntl();

  const [initialState, setInitialState] = useState({
    copyOrNew: "",
    feePlanToCopy: "",
  });

  useEffect(() => {
    setInitialState({
      copyOrNew: feePlanToCopy ? "createCopy" : "createNew",
      feePlanToCopy: feePlanToCopy
        ? feePlanToCopy
        : existingFeePlans.length > 0
        ? existingFeePlans[0]
        : "",
    });
  }, [feePlanToCopy, existingFeePlans]);

  const handleSubmit = (values: any) => {
    const feePlanToCopy =
      values.copyOrNew === "createCopy" ? values.feePlanToCopy : "";

    setNewFeeObject(newFeeObject);

    setFeePlanToCopy(feePlanToCopy);

    setChangeOrderObject({});

    getNextStep();
  };

  const FeeSchema = Yup.object().shape({
    copyOrNew: Yup.string().required(
      intl.formatMessage({
        id: "pleaseChooseOne",
        defaultMessage: "Please choose one.",
      })
    ),
    feePlanToCopy: Yup.string().when("copyOrNew", {
      is: (val: string) => val === "createCopy",
      then: Yup.string().required(
        intl.formatMessage({
          id: "error.feePlanToCopy.required",
          defaultMessage: "Fee Plan To Copy is a required field",
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
        initialValues={initialState}
        validationSchema={FeeSchema}
        onSubmit={(values) => handleSubmit(values)}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
            <Grid>
              <FormGroup>
                <FormGroup>
                  <Label htmlFor="">
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
                            id="configureFeePlanManually"
                            description="Drawer form placeholder text"
                            defaultMessage="Configure fee plan manually"
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
                            id="createCopyOfExistingFeePlan"
                            description="Drawer form placeholder text"
                            defaultMessage="Create a copy of an existing fee plan"
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
                      name="feePlanToCopy"
                      placeholder={`${intl.formatMessage({
                        id: "chooseFeePlanToCopy",
                        description: "Input Label",
                        defaultMessage: "Choose Fee Plan To Copy",
                      })}*`}
                      list={existingFeePlans}
                      value={props.values.feePlanToCopy}
                      {...props}
                    />
                  )}
                </Box>
              </FormGroup>
            </Grid>

            <Grid container rowSpacing={1} justifyContent="center">
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

export default FeePlanWizardStep0Drawer;
