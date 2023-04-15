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

import React, { useContext } from "react";
import { defineMessage, useIntl } from "react-intl";
import Grid from "@mui/material/Grid";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";
import SubnavListCard from "../../programs/SubnavListCard";
import ProgramsFeesDrawer from "../../programs/drawers/ProgramsFeesDrawer";
import ProgramsRiskLevelDrawer from "../../programs/drawers/ProgramsRiskLevelDrawer";
import FeePlanWizardDrawer from "../../programs/drawers/FeePlanWizardDrawer";
import DrawerComp from "../../common/DrawerComp";
import RiskLevelWizardDrawer from "../../programs/drawers/RiskLevelWizardDrawer";

const FirstLastNameSearch = () => {
  const intl = useIntl();
  const { program, feePlans, riskLevels } = useContext(ProgramEditContext);

  const feePlansLabel = defineMessage({
    id: "drawer.programs.edit.label.feePlans",
    description: "Fee Plans Section Label",
    defaultMessage: "Fee Plans",
  });

  const createFeePlansDrawer = (entry: any, prog: any) => (
    <ProgramsFeesDrawer programName={prog.name} feePlanList={feePlans} />
  );

  const addFeePlanLabel = defineMessage({
    id: "drawer.program.edit.button.addNewFeeButton",
    description: "Add Fee Plans Label",
    defaultMessage: "Add New Fee Plan >>",
  });

  const createAddFeePlansDrawer = () => (
    <DrawerComp
      buttonProps="mt-2 mr-0 pr-0"
      asLink
      bodyInteractive="small"
      label={intl.formatMessage(addFeePlanLabel)}
    >
      <FeePlanWizardDrawer
        programName={program.name}
        toggleDrawer={() => true}
      />
    </DrawerComp>
  );

  const riskProfilesLabel = defineMessage({
    id: "drawer.programs.edit.label.riskProfiles",
    description: "Risk Profiles Section Label",
    defaultMessage: "Risk Profiles",
  });

  const riskLevelDisplay = defineMessage({
    id: "programs.riskLevel.label.riskLevel",
    defaultMessage: "Risk Level - {name}",
    description: "Risk level display name",
  });

  const enrichRiskLevels = (entries: any[]) => {
    for (const entry of entries) {
      entry.riskDisplay = intl.formatMessage(riskLevelDisplay, {
        name: entry.securityLevel,
      });
    }
    return entries;
  };

  const createRiskProfilesFunc = (entry: any, prog: any) => (
    <ProgramsRiskLevelDrawer
      programName={prog.name}
      riskLevelList={riskLevels}
    />
  );

  const addRiskPlanLabel = defineMessage({
    id: "drawer.program.edit.button.addNewRiskProfileButton",
    description: "Add Risk Profile Label",
    defaultMessage: "Add New Risk Profile >>",
  });

  const createAddRiskProfileDrawer = () => (
    <DrawerComp
      buttonProps="mt-2 mr-0 pr-0"
      asLink
      bodyInteractive="small"
      label={intl.formatMessage(addRiskPlanLabel)}
    >
      <RiskLevelWizardDrawer
        programName={program.name}
        toggleDrawer={() => true}
      />
    </DrawerComp>
  );

  return (
    <Grid container>
      <Grid item xs={4} style={{ marginRight: "40px" }}>
        <SubnavListCard
          header={feePlansLabel}
          entries={feePlans}
          program={program}
          editDrawerFunc={createFeePlansDrawer}
          addDrawer={createAddFeePlansDrawer()}
        />
      </Grid>
      <Grid item xs={4} style={{ marginRight: "40px" }}>
        <SubnavListCard
          header={riskProfilesLabel}
          entries={enrichRiskLevels(riskLevels)}
          entryName="riskDisplay"
          program={program}
          editDrawerFunc={createRiskProfilesFunc}
          addDrawer={createAddRiskProfileDrawer()}
        />
      </Grid>
    </Grid>
  );
};

export default FirstLastNameSearch;
