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
import { useHistory } from "react-router-dom";
import { Box, Typography } from "@mui/material";

interface ISidenavItem {
  sideNavItem: {
    key: string;
    path: string;
    icon: any;
    tr: React.ReactNode;
  };
}

const SidenavItem: React.FC<ISidenavItem> = ({ sideNavItem }) => {
  const history = useHistory();
  return (
    <Box
      onClick={() => history.push(sideNavItem.path)}
      onKeyDown={() => history.push(sideNavItem.path)}
    >
      <Box
        className="icon"
        sx={{
          width: "24px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "14px 20px",
        }}
      >
        <img src={sideNavItem.icon} alt={sideNavItem.key} />
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography className="text" sx={{ fontWeight: "400" }}>
          {sideNavItem.tr}
        </Typography>
      </Box>
    </Box>
  );
};

export default SidenavItem;
