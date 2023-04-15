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
import React, { ReactElement } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Container, Grid, Box } from "@mui/material";
import TableCellAccordion from "../common/forms/accordions/TableCellAccordion";
import DrawerComp from "../common/DrawerComp";
import ProgramDetailContextProvider from "../../contexts/ProgramDetailContext";
import ProgramsFeesDrawer from "./drawers/ProgramsFeesDrawer";
import ProgramFeeLevelTwo from "./drawers/level-two/ProgramFeeLevelTwo";
import FeePlanWizardDrawer from "./drawers/FeePlanWizardDrawer";
import Label from "../common/elements/Label";

interface IProgramFeePlanList {
  program: any;
  entries: any;
}

const ProgramFeePlanList: React.FC<IProgramFeePlanList> = ({
  program,
  entries,
}) => {
  const intl = useIntl();

  const ListWithDrawer = (
    name: string,
    injectedDrawer: ReactElement,
    levelTwo: any,
    index: number
  ) => (
    <Grid container sx={{ mb: 1 }} key={`div.entry.${index}`}>
      <Grid item sx={{ flexGrow: 1 }}>
        <Label>{name}</Label>
      </Grid>
      <Grid item>
        <ProgramDetailContextProvider
          programName={program.name}
          currentFeePlan={name}
        >
          <DrawerComp
            LevelTwo={levelTwo}
            widthPercentage={75}
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
    <ProgramDetailContextProvider
      programName={program.name}
      currentFeePlan="default"
    >
      <DrawerComp
        asLink
        bodyInteractive="small"
        label={`${intl.formatMessage({
          id: "addNewFeePlan",
          defaultMessage: "Add New Fee Plan",
        })} >>`}
        buttonStyle={{ paddingTop: "8px", lineHeight: "15px" }}
        truncateAt={60}
      >
        <FeePlanWizardDrawer programName={program.name} />
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
              entry.name,
              <ProgramsFeesDrawer
                programName={program.name}
                feePlanList={entries}
              />,
              ProgramFeeLevelTwo,
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
                  entry.name,
                  <ProgramsFeesDrawer
                    programName={program.name}
                    feePlanList={entries}
                  />,
                  ProgramFeeLevelTwo,
                  index
                )
            )}
          </TableCellAccordion>
        )}
      </Box>
      <Box sx={{ textAlign: "right" }}>
        {entries && entries.length < 3 && AddDrawer()}
      </Box>
    </Container>
  );
};

export default ProgramFeePlanList;
