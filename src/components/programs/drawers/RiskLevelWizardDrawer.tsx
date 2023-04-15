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

import Container from "@mui/material/Container";
import React from "react";
import RiskLevelWizardStep1Drawer from "./RiskLevelWizardStep1Drawer";
import RiskLevelWizardStep2Drawer from "./RiskLevelWizardStep2Drawer";
import RiskLevelWizardStep0Drawer from "./RiskLevelWizardStep0Drawer";
import RiskLevelWizardContextProvider from "../../../contexts/RiskLevelWizardContext";

interface IRiskLevelWizardDrawer {
  programName: string;
  toggleDrawer: Function;
}

const RiskLevelWizardDrawer: React.FC<IRiskLevelWizardDrawer> = ({
  programName,
  toggleDrawer,
}) => (
  <Container disableGutters sx={{ width: "397px" }}>
    <RiskLevelWizardContextProvider
      programName={programName}
      toggleDrawer={toggleDrawer}
    >
      <RiskLevelWizardStep0Drawer />
      <RiskLevelWizardStep1Drawer />
      <RiskLevelWizardStep2Drawer />
    </RiskLevelWizardContextProvider>
  </Container>
);

export default RiskLevelWizardDrawer;
