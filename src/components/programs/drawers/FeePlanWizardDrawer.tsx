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

import React from "react";
import Container from "@mui/material/Container";
import FeePlanWizardContextProvider from "../../../contexts/FeePlanWizardContext";
import FeePlanWizardStep0Drawer from "./FeePlanWizardStep0Drawer";
import FeePlanWizardStep1Drawer from "./FeePlanWizardStep1Drawer";
import FeePlanWizardStep2Drawer from "./FeePlanWizardStep2Drawer";

interface IFeePlanWizard {
  programName: string;
  toggleDrawer?: Function;
}

const FeePlanWizardDrawer: React.FC<IFeePlanWizard> = ({
  programName,
  toggleDrawer = () => {},
}) => (
  <Container disableGutters sx={{ width: "397px" }}>
    <FeePlanWizardContextProvider
      programName={programName}
      toggleDrawer={toggleDrawer}
    >
      <FeePlanWizardStep0Drawer />
      <FeePlanWizardStep1Drawer />
      <FeePlanWizardStep2Drawer />
    </FeePlanWizardContextProvider>
  </Container>
);

export default FeePlanWizardDrawer;
