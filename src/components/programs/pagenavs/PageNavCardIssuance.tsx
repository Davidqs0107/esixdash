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
 */

import React, { useContext, FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, Grid, Typography } from "@mui/material";
import DrawerComp from "../../../components/common/DrawerComp";
import ProgramCardProfileDrawer from "../../../components/programs/drawers/ProgramCardProfileDrawer";
import TableCellAccordion from "../../../components/common/forms/accordions/TableCellAccordion";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";

const PageNavCardIssuance: FC = () => {
  const intl = useIntl();
  const { cardProfiles, programName, program } = useContext(ProgramEditContext);

  const CardProfileEditDrawer = (name: string) => (
    <Grid container sx={{ mb: 1 }} key={`div.CardProfileEditDrawer.${name}`}>
      <Grid item sx={{ flexGrow: 1 }}>
        <Typography>{name}</Typography>
      </Grid>
      <Grid item>
        <DrawerComp
          buttonProps="mr-0"
          label={intl.formatMessage({
            id: "button.edit",
            description: "Edit program card profile information",
            defaultMessage: "EDIT",
          })}
        >
          <ProgramCardProfileDrawer
            profileName={name}
            programName={programName}
            bankName={program.bankName}
            partnerName={program.partnerName}
            edit
            readOnly
            toggleDrawer={() => true}
          />
        </DrawerComp>
      </Grid>
    </Grid>
  );

  const CardProfileAddDrawer = () => (
    <DrawerComp
      asLink
      bodyInteractive="small"
      label={`${intl.formatMessage({
        id: "addNewCardProfile",
        description: "Add New Card Profile button",
        defaultMessage: "Add New Card Profile",
      })} >>`}
      buttonStyle={{ paddingTop: "8px", lineHeight: "15px" }}
      truncateAt={60}
      disableHorizontalScroll
    >
      <ProgramCardProfileDrawer
        programName={programName}
        bankName={program.bankName}
        partnerName={program.partnerName}
        edit={false}
        readOnly={false}
        toggleDrawer={() => true}
      />
    </DrawerComp>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "350px" }}>
        <Box sx={{ marginBottom: "15px" }}>
          <Typography variant="labelDark">
            <FormattedMessage
              id="cardProfiles"
              defaultMessage="Card Profiles"
            />
          </Typography>
        </Box>
        <Box>
          <Box>
            {cardProfiles && cardProfiles.length > 0
              ? CardProfileEditDrawer(cardProfiles[0].name)
              : null}

            {cardProfiles && cardProfiles.length > 1 && (
              <TableCellAccordion
                showNumber={cardProfiles.length}
                hideNumber={cardProfiles.length - 1}
                addDrawer={CardProfileAddDrawer()}
              >
                {cardProfiles.map(
                  (profile: any, index: number) =>
                    index > 0 && CardProfileEditDrawer(profile.name)
                )}
              </TableCellAccordion>
            )}
          </Box>
          <Box sx={{ textAlign: "right" }}>
            {cardProfiles && cardProfiles.length <= 1 && CardProfileAddDrawer()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PageNavCardIssuance;
