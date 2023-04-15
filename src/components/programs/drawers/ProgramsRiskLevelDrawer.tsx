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
import { Container, Box, Grid, FormGroup } from "@mui/material";
import { Formik } from "formik";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import { ProgramDetailContext } from "../../../contexts/ProgramDetailContext";
import RiskLevelWizardDrawer from "./RiskLevelWizardDrawer";
import RiskLevelWizardStep1Drawer from "./RiskLevelWizardStep1Drawer";
import RiskLevelWizardContextProvider from "../../../contexts/RiskLevelWizardContext";
import RiskLevelWizardStep2Drawer from "./RiskLevelWizardStep2Drawer";
import { MessageContext } from "../../../contexts/MessageContext";
import Header from "../../common/elements/Header";
import QDButton from "../../common/elements/QDButton";
import Label from "../../common/elements/Label";
import TextRender from "../../common/TextRender";

interface IProgramsRiskLevelDrawer {
  programName: string;
  toggleDrawer?: any;
  toggleLevelTwo?: any;
  isLevelTwoOpen?: boolean;
  riskLevelList: any;
  selectedRiskLevel?: string;
}

const ProgramsRiskLevelDrawer: React.FC<IProgramsRiskLevelDrawer> = ({
  programName,
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
  toggleLevelTwo = () => {
    /* provided by drawer comp */
  },
  isLevelTwoOpen = false,
  riskLevelList,
  selectedRiskLevel,
}) => {
  const intl = useIntl();
  const { currentLevel, level, setLevel } = useContext(ProgramDetailContext);
  const [riskLevels, setRiskLevels] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [skipWizardEntry, setSkipWizardEntry] = useState(false);

  const getRiskLevels = async () => {
    const list = await riskLevelList.map((x: any) => ({
      text: x.securityLevel,
      level: x.securityLevel,
    }));
    list.unshift({
      text: intl.formatMessage({
        id: "createNewRiskLevel",
        defaultMessage: "Create New Risk Level",
      }),
      level: "Create New Risk Level",
    });
    list.unshift({});
    setRiskLevels(list);
  };

  const handleChange = (value: any) => {
    let startWizard = false;
    if (value === "Create New Risk Level") {
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

  const resetLevelToCurrentLevel = () => {
    // the value of level changes when the dropdown is used, so we need to reset it to its
    // original value in the context when revisiting this drawer again.
    setLevel(currentLevel);
  };

  useEffect(() => {
    // this is needed in order to revert the
    resetLevelToCurrentLevel();

    if (selectedRiskLevel != undefined) {
      toggleLevelTwo();
    }
  }, []);

  useEffect(() => {
    getRiskLevels();
  }, [level]);

  // eslint-disable-next-line no-nested-ternary
  return showWizard ? (
    skipWizardEntry ? (
      <RiskLevelWizardContextProvider
        programName={programName}
        riskLevel={level.toString()}
        toggleDrawer={toggleDrawer}
        skippedStep0
        startStep={1}
      >
        <RiskLevelWizardStep1Drawer />
        <RiskLevelWizardStep2Drawer />
      </RiskLevelWizardContextProvider>
    ) : (
      <RiskLevelWizardDrawer
        programName={programName}
        toggleDrawer={toggleDrawer}
      />
    )
  ) : (
    <Container sx={{ width: "397px" }}>
      <Formik
        initialValues={{ riskLevel: currentLevel }}
        onSubmit={(values, actions) => console.log(values, actions)}
        enableReinitialize
      >
        {(riskLevelProps: any) => (
          <form onSubmit={riskLevelProps.handleSubmit}>
            <Box>
              <FormGroup>
                <Header
                  value={intl.formatMessage({
                    id: "riskLevelDetail",
                    description: "drawer header",
                    defaultMessage: "Risk Level Detail",
                  })}
                  level={2}
                  color="white"
                  bold
                  drawerTitle
                />
              </FormGroup>
              {selectedRiskLevel ? (
                <Box
                  display="flex"
                  sx={{ marginBottom: "32px", rowGap: "6px" }}
                  flexDirection="column"
                >
                  <Label variant="grey" fontWeight={400}>
                    <FormattedMessage
                      id="riskLevel"
                      defaultMessage="Risk Level"
                    />
                  </Label>
                  <TextRender
                    data={selectedRiskLevel}
                    textTransform="capitalize"
                    fontWeight={400}
                  />
                </Box>
              ) : (
                <FormGroup>
                  {riskLevels.length > 0 ? (
                    <DropdownFloating
                      {...riskLevelProps}
                      id="risk-level-dropdown"
                      list={riskLevels}
                      name="riskLevel"
                      placeholder={intl.formatMessage({
                        id: "riskLevel",
                        defaultMessage: "Risk Level",
                      })}
                      value={riskLevelProps.values.riskLevel}
                      valueKey="level"
                      handleChange={(e: any) => {
                        riskLevelProps.handleChange(e);
                        handleChange(e.target.value);
                        setLevel(e.target.value);
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
                  id="program-risk-list-toggle"
                  label={
                    isLevelTwoOpen
                      ? intl.formatMessage({
                          id: "riskLevel.hideRules",
                          defaultMessage:
                            "Hide all rules assigned to this risk level >>",
                        })
                      : intl.formatMessage({
                          id: "riskLevel.showRules",
                          defaultMessage:
                            "Show all rules assigned to this risk level <<",
                        })
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
          onClick={() => handleWizardEntrySkip()}
          color="primary"
          size="small"
          variant="contained"
        >
          <FormattedMessage
            id="button.addRiskRule"
            description="Add Risk Rule"
            defaultMessage="ADD RISK RULE"
          />
        </QDButton>
      </Grid>
    </Container>
  );
};

export default ProgramsRiskLevelDrawer;
