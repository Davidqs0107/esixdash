/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
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
import React, { useContext, useEffect } from "react";
import { useIntl, FormattedMessage } from "react-intl";
import { Box, Grid } from "@mui/material";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";
import StandardTable from "../../common/table/StandardTable";
import Header from "../../common/elements/Header";
import TextRender from "../../common/TextRender";
import DrawerComp from "../../common/DrawerComp";
import EllipseMenu from "../../common/EllipseMenu";
import FeePlanWizardDrawer from "../drawers/FeePlanWizardDrawer";
import ProgramsFeesDrawer from "../drawers/ProgramsFeesDrawer";
import ProgramFeeLevelTwo from "../drawers/level-two/ProgramFeeLevelTwo";
import ProgramDetailContextProvider from "../../../contexts/ProgramDetailContext";

const PageNavFees = () => {
  const intl = useIntl();
  const { programName, feePlans } = useContext(ProgramEditContext);

  const feePlansTableMetadata = [
    {
      width: "90%",
      header: (
        <FormattedMessage id="description" defaultMessage="Description" />
      ),
      render: (rowData: any) => <TextRender data={rowData.name} />,
    },
    {
      width: "10%",
      header: <> </>,
      render: (rowData: any) => {
        const { name } = rowData;
        return (
          <>
            <EllipseMenu
              anchorOriginVertical="top"
              anchorOriginHorizontal="left"
              transformOriginVertical={10}
              transformOriginHorizontal={260}
              icon="faEllipsisV"
            >
              <ProgramDetailContextProvider
                programName={programName}
                currentFeePlan={name}
              >
                <DrawerComp
                  id="fee-plan-view"
                  label={intl.formatMessage({
                    id: "view",
                    defaultMessage: "View",
                  })}
                  asLink
                  truncateAt={50}
                  LevelTwo={ProgramFeeLevelTwo}
                >
                  <ProgramsFeesDrawer
                    programName={programName}
                    feePlanList={feePlans}
                    selectedFeePlan={name}
                  />
                </DrawerComp>
              </ProgramDetailContextProvider>
            </EllipseMenu>
          </>
        );
      },
    },
  ];

  useEffect(() => {}, []);

  return (
    <>
      <Box>
        <Grid container justifyContent="space-between">
          <Grid item xs={5} md={5} lg={5}>
            <Box
              sx={{
                marginBottom: "18px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Header
                value={intl.formatMessage({
                  id: "customerFeePlans",
                  defaultMessage: "Customer Fee Plans",
                })}
                level={2}
                bold
                color="primary"
              />
              <DrawerComp
                id="fee-plans-add-new-button"
                label={intl.formatMessage({
                  id: "button.addNewFeePlan",
                  defaultMessage: "ADD NEW FEE PLAN",
                })}
              >
                <FeePlanWizardDrawer
                  programName={programName}
                  toggleDrawer={() => true}
                />
              </DrawerComp>
            </Box>
            <StandardTable
              id="feePlans-list"
              dataList={feePlans}
              tableMetadata={feePlansTableMetadata}
              tableRowPrefix="feePlans-table"
            />
          </Grid>
          <Grid item xs={5} md={5} lg={5}></Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PageNavFees;
