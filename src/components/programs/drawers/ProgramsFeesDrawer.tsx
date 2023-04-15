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
import { Container, Box, Grid, FormGroup, Button } from "@mui/material";
import { Formik } from "formik";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import { ProgramDetailContext } from "../../../contexts/ProgramDetailContext";
import FeePlanWizardContextProvider from "../../../contexts/FeePlanWizardContext";
import FeePlanWizardStep1Drawer from "./FeePlanWizardStep1Drawer";
import FeePlanWizardStep2Drawer from "./FeePlanWizardStep2Drawer";
import FeePlanWizardDrawer from "./FeePlanWizardDrawer";
import QDButton from "../../common/elements/QDButton";
import Header from "../../common/elements/Header";
import Label from "../../common/elements/Label";
import TextRender from "../../common/TextRender";

interface IProgramFeesDrawer {
  programName: string;
  toggleDrawer?: any;
  toggleLevelTwo?: any;
  isLevelTwoOpen?: boolean;
  feePlanList: any;
  selectedFeePlan?: string;
}

const ProgramsFeesDrawer: React.FC<IProgramFeesDrawer> = ({
  programName,
  toggleDrawer = () => {
    /* function provided by drawer comp */
  },
  toggleLevelTwo = () => {
    /* function provided by drawer comp */
  },
  isLevelTwoOpen = false,
  feePlanList,
  selectedFeePlan,
}) => {
  const intl = useIntl();
  const { currentFeePlan, feePlan, setFeePlan } =
    useContext(ProgramDetailContext);

  const [feePlans, setFeePlans] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [skipWizardEntry, setSkipWizardEntry] = useState(false);

  const setUpFeePlans = async () => {
    const list = feePlanList.map((x: any) => ({
      text: x.name,
      planName: x.name,
    }));
    list.unshift({
      text: intl.formatMessage({
        id: "createNewFeePlan",
        defaultMessage: "Create New Fee Plan",
      }),
      planName: "Create New Fee Plan",
    });
    list.unshift({});
    setFeePlans(list);
  };

  const handleChange = (value: any) => {
    let startWizard = false;
    if (value === "Create New Fee Plan") {
      startWizard = true;

      if (isLevelTwoOpen) {
        toggleLevelTwo();
      }
    }
    setShowWizard(startWizard);
  };

  const handleWizardEntrySkip = () => {
    if (isLevelTwoOpen) {
      toggleLevelTwo();
    }
    setSkipWizardEntry(true);
    setShowWizard(true);
  };

  const resetFeePlanToCurrentPlan = () => {
    // the value of feePlan changes when the dropdown is used, so we need to reset it to its
    // original value in the context when revisiting this drawer again.
    setFeePlan(currentFeePlan);
  };

  useEffect(() => {
    resetFeePlanToCurrentPlan();
    setUpFeePlans();

    if (selectedFeePlan != undefined) {
      toggleLevelTwo();
    }
  }, []);

  // eslint-disable-next-line no-nested-ternary
  return showWizard ? (
    skipWizardEntry ? (
      <FeePlanWizardContextProvider
        programName={programName}
        skippedStep0
        startStep={1}
        toggleDrawer={toggleDrawer}
        feePlan={feePlan}
      >
        <FeePlanWizardStep1Drawer />
        <FeePlanWizardStep2Drawer />
      </FeePlanWizardContextProvider>
    ) : (
      <FeePlanWizardDrawer
        programName={programName}
        toggleDrawer={toggleDrawer}
      />
    )
  ) : (
    <Container sx={{ width: "397px" }}>
      <Formik
        initialValues={{ feePlan: currentFeePlan }}
        onSubmit={(values, actions) => console.log(values, actions)}
        enableReinitialize
      >
        {(feePlanProps: any) => (
          <form onSubmit={feePlanProps.handleSubmit}>
            <Box>
              <FormGroup>
                <Header
                  value={intl.formatMessage({
                    id: "feePlanDetails",
                    description: "drawer header",
                    defaultMessage: "Fee Plan Details",
                  })}
                  level={2}
                  color="white"
                  bold
                  drawerTitle
                />
              </FormGroup>
              {selectedFeePlan ? (
                <Box
                  display="flex"
                  sx={{ marginBottom: "32px", rowGap: "6px" }}
                  flexDirection="column"
                >
                  <Label variant="grey" fontWeight={400}>
                    <FormattedMessage id="feePlan" defaultMessage="Fee Plan" />
                  </Label>
                  <TextRender
                    data={selectedFeePlan}
                    textTransform="capitalize"
                    fontWeight={400}
                  />
                </Box>
              ) : (
                <FormGroup>
                  {feePlans.length > 0 ? (
                    <DropdownFloating
                      {...feePlanProps}
                      id="risk-level-dropdown"
                      list={feePlans}
                      name="feePlan"
                      placeholder={intl.formatMessage({
                        id: "feePlan",
                        defaultMessage: "Fee Plan",
                      })}
                      value={feePlanProps.values.feePlan}
                      valueKey="planName"
                      handleChange={(e: any) => {
                        feePlanProps.handleChange(e);
                        handleChange(e.target.value);
                        setFeePlan(e.target.value);
                      }}
                    />
                  ) : null}
                </FormGroup>
              )}

              <FormGroup
                sx={{
                  textAlign: "right",
                  mb: "80px",
                }}
              >
                <QDButton
                  id="program-fee-list-toggle"
                  label={
                    isLevelTwoOpen
                      ? `${intl.formatMessage({
                          id: "program.hideFeePlans",
                          defaultMessage:
                            "Hide all fees assigned to this fee plan",
                        })} >>`
                      : `${intl.formatMessage({
                          id: "program.showFeePlans",
                          defaultMessage:
                            "Show all fees assigned to this fee plan",
                        })} <<`
                  }
                  variant="text"
                  color="secondary"
                  size="small"
                  onClick={() => toggleLevelTwo()}
                />
              </FormGroup>
            </Box>
          </form>
        )}
      </Formik>
      <Grid textAlign="center">
        <QDButton
          color="primary"
          variant="contained"
          size="small"
          onClick={() => handleWizardEntrySkip()}
          id="fee-wizard-add-fee-entry"
        >
          <FormattedMessage
            id="button.addFeeEntry"
            description="Add Fee"
            defaultMessage="ADD FEE ENTRY"
          />
        </QDButton>
      </Grid>
    </Container>
  );
};

export default ProgramsFeesDrawer;
