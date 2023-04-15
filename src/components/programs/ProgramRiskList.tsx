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

import { FormattedMessage, useIntl } from "react-intl";
import React, { ReactElement } from "react";
import { Container, Grid, Box } from "@mui/material";
import TableCellAccordion from "../common/forms/accordions/TableCellAccordion";
import DrawerComp from "../common/DrawerComp";
import ProgramsRiskLevelDrawer from "./drawers/ProgramsRiskLevelDrawer";
import ProgramDetailContextProvider from "../../contexts/ProgramDetailContext";
import ProgramRiskParamsLevelTwo from "./drawers/level-two/ProgramRiskParamsLevelTwo";
import RiskLevelWizardDrawer from "./drawers/RiskLevelWizardDrawer";
import Label from "../common/elements/Label";

interface IProgramRiskList {
  program: any;
  entries: any;
}

const ProgramRiskList: React.FC<IProgramRiskList> = ({ program, entries }) => {
  const intl = useIntl();
  const ListWithDrawer = (
    name: any,
    injectedDrawer: ReactElement,
    levelTwo: any,
    index: number
  ) => (
    <Grid
      container
      sx={{ mb: 1 }}
      key={`div.ProgramsRiskLevelDrawer.${program.id}.${index}`}
    >
      <Grid item sx={{ flexGrow: 1 }}>
        <Label>
          <FormattedMessage
            id="programs.riskLevel.label.riskLevel"
            defaultMessage="Risk Level - {name}"
            description="topnav label"
            values={{
              name,
            }}
          />
        </Label>
      </Grid>
      <Grid item>
        <ProgramDetailContextProvider
          key={`context-level-${name}`}
          programName={program.name}
          currentLevel={name}
        >
          <DrawerComp
            key={`drawer-level-${name}`}
            buttonProps="mr-0"
            LevelTwo={levelTwo}
            widthPercentage={70}
            label={intl.formatMessage({
              id: "button.edit",
              defaultMessage: "EDIT",
            })}
          >
            {injectedDrawer}
          </DrawerComp>
        </ProgramDetailContextProvider>
      </Grid>
    </Grid>
  );

  const AddDrawer = () => (
    <ProgramDetailContextProvider programName={program.name} currentLevel={0}>
      <DrawerComp
        asLink
        bodyInteractive="small"
        label={`${intl.formatMessage({
          id: "addNewRiskProfile",
          defaultMessage: "Add New Risk Profile",
        })} >>`}
        buttonStyle={{ paddingTop: "8px", lineHeight: "15px" }}
        truncateAt={60}
      >
        <RiskLevelWizardDrawer
          programName={program.name}
          toggleDrawer={() => true}
        />
      </DrawerComp>
    </ProgramDetailContextProvider>
  );

  return (
    <Container disableGutters>
      <Box>
        {entries.map(
          (entry: any, index: number) =>
            index <= 2 &&
            ListWithDrawer(
              entry.securityLevel,
              <ProgramsRiskLevelDrawer
                programName={program.name}
                riskLevelList={entries}
              />,
              ProgramRiskParamsLevelTwo,
              index
            )
        )}

        {entries && entries.length > 3 && (
          <TableCellAccordion
            showNumber={entries.length}
            hideNumber={entries.length - 3}
            addDrawer={AddDrawer()}
          >
            {entries.map(
              (entry: any, index: number) =>
                index > 2 &&
                ListWithDrawer(
                  entry.securityLevel,
                  <ProgramsRiskLevelDrawer
                    programName={program.name}
                    riskLevelList={entries}
                  />,
                  ProgramRiskParamsLevelTwo,
                  index
                )
            )}
          </TableCellAccordion>
        )}
      </Box>
      <Box sx={{ textAlign: "right" }}>
        {entries && entries.length <= 3 && AddDrawer()}
      </Box>
    </Container>
  );
};

export default ProgramRiskList;
