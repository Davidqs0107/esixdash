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
import { Grid, List, ListItem, Typography } from "@mui/material";
import { defineMessage, MessageDescriptor, useIntl } from "react-intl";
import DrawerComp from "../common/DrawerComp";
import TableCellAccordion from "../common/forms/accordions/TableCellAccordion";
import ProgramDetailContextProvider from "../../contexts/ProgramDetailContext";

interface IItemEntry {
  name: string;
}

interface ILevelTwo {
  toggleLevelTwo: any;
}

interface ISubnavListCard {
  header: MessageDescriptor;
  entries: any;
  program: any;
  entryName?: string;
  editDrawerFunc: (name: any, program: any) => ReactElement;
  addDrawer?: ReactElement;
  levelTwo?: React.ComponentType<ILevelTwo>;
}

const SubnavListCard: React.FC<ISubnavListCard> = ({
  header,
  entries,
  entryName = "name",
  program,
  editDrawerFunc,
  addDrawer,
  levelTwo,
}) => {
  const intl = useIntl();

  const EDITLabel = defineMessage({
    id: "programs.cardProfiles.button.view",
    description: "View program card profile information",
    defaultMessage: "VIEW",
  });

  const createListItemContents = (name: string, entry: any) => (
    <Grid container>
      <Grid item xs={9} md={9} lg={9}>
        <Typography
          className="body-normal-md-bold"
          style={{ fontFamily: "Montserrat", fontSize: "13px" }}
        >
          {name}
        </Typography>
      </Grid>
      <Grid container xs={3} md={3} lg={3} justifyContent="flex-end">
        {levelTwo ? (
          <ProgramDetailContextProvider
            programName={program.name}
            currentLevel={entry.securityLevel}
          >
            <DrawerComp
              label={intl.formatMessage(EDITLabel)}
              widthPercentage={80}
              LevelTwo={levelTwo}
            >
              {editDrawerFunc(entry, program)}
            </DrawerComp>
          </ProgramDetailContextProvider>
        ) : (
          <DrawerComp
            label={intl.formatMessage(EDITLabel)}
            disableHorizontalScroll
          >
            {editDrawerFunc(entry, program)}
          </DrawerComp>
        )}
      </Grid>
    </Grid>
  );

  const createListItem = (value: any) => {
    return (
      <ListItem disableGutters>
        {createListItemContents(value[entryName], value)}
      </ListItem>
    );
  };

  return (
    <Grid container>
      <Grid item xs={12} md={12} lg={12}>
        <Typography variant="labelDark">
          {intl.formatMessage(header)}
        </Typography>
      </Grid>

      {/* Show 4 list items by default, but allow user to expand to see rest */}
      <Grid item xs={12} md={12} lg={12}>
        <List style={{ paddingTop: "9px", paddingBottom: "9px" }}>
          {entries.slice(0, 4).map(createListItem)}
          {entries.length <= 4 ? (
            <div style={{ float: "right" }}>{addDrawer}</div>
          ) : (
            ""
          )}
          {entries.length > 4 ? (
            <TableCellAccordion
              showNumber={entries.length}
              hideNumber={entries.length - 4}
              addDrawer={addDrawer}
            >
              {entries.slice(4).map(createListItem)}
            </TableCellAccordion>
          ) : (
            ""
          )}
        </List>
      </Grid>
    </Grid>
  );
};

export default SubnavListCard;
