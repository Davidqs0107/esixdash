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
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

interface IQDTooltip {
  title: string | ReactElement;
  placement?:
    | "bottom-start" // default
    | "bottom"
    | "bottom-end"
    | "right-start"
    | "right"
    | "right-end"
    | "left-start"
    | "left"
    | "left-end"
    | "top-start"
    | "top"
    | "top-end";
  interactive?: boolean; // default false,
  children?: React.ReactNode;
  whiteSpace?: "normal" | "pre-wrap";
}

const QDTooltip: React.FC<IQDTooltip> = ({
  title,
  placement = "bottom-start",
  interactive = false,
  children,
  whiteSpace = "normal",
}) => {
  return !interactive ? (
    <Tooltip
      title={<Box sx={{ whiteSpace: whiteSpace }}>{title}</Box>}
      placement={placement}
      disableInteractive
    >
      <Box sx={{ whiteSpace: whiteSpace }}>{children}</Box>
    </Tooltip>
  ) : (
    <Tooltip
      title={<Box sx={{ whiteSpace: whiteSpace }}>{title}</Box>}
      placement={placement}
    >
      <Box sx={{ whiteSpace: whiteSpace }}>{children}</Box>
    </Tooltip>
  );
};

export default QDTooltip;
