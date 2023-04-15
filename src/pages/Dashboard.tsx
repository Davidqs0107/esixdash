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

import React from "react";
import { Box, Drawer } from "@mui/material";
import Sidenav from "../components/common/navigation/Sidenav";
import Topnav from "../components/common/navigation/Topnav";
import PartnerContextProvider from "../contexts/PartnerUserContext";
import MessageUtil from "../components/common/MessageUtil";
import ContentVisibilityContextProvider from "../contexts/ContentVisibilityContext";

interface IDashboard {
  props: any;
  children?: React.ReactNode;
  blank?: boolean;
}

const drawerWidth = 200;

const Dashboard: React.FC<IDashboard> = (props) => {
  const { blank } = props;
  return (
    <PartnerContextProvider>
      <ContentVisibilityContextProvider>
        <Topnav />
        <Box
          component="main"
          sx={{
            display: "flex",
            //minWidth: "1440px",
            backgroundColor: blank ? "#FFFFFF" : "#F7FAFF",
          }}
        >
          <Box
            component="nav"
            sx={{
              boxShadow: "rgb(33 31 64 / 20%) 0px 69px 40px -20px",
              backgroundColor: "#FFFFFF",
              zIndex: "1",
              paddingTop: "50px",
            }}
          >
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
              }}
              PaperProps={{
                style: {
                  border: "none",
                  position: "relative",
                  minHeight: "100vh",
                  overflowY: "unset",
                  width: drawerWidth,
                },
              }}
              variant="permanent"
              anchor="left"
            >
              <Sidenav {...props} />
            </Drawer>
          </Box>

          <Box component="aside" sx={{ flexGrow: 1 }}>
            <Box sx={{ p: blank ? 0 : "50px 62px" }}>{props.children}</Box>
          </Box>
        </Box>
        <MessageUtil />
      </ContentVisibilityContextProvider>
    </PartnerContextProvider>
  );
};

export default Dashboard;
