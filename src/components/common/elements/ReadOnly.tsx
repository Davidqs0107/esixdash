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
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

interface IReadOnly {
  label: string;
  children?: string;
  className?: "dark" | "light";
}

const ReadOnlyContainer = styled(Box)(({ theme }) => ({
  marginBottom: "20px",
  "& > label": {
    display: "block",
    fontSize: "8px",
    marginBottom: "0px !important",
    color: "#433AA8",
    lineHeight: "12px"
  },
  "&.light": {
    padding: "5px 10px",
    backgroundColor: "#FFFFFF",
    borderRadius: "5px"
  },
  "&.light label": {
    fontWeight: 600,
    marginBottom: 0
  }
}));

const ReadOnly: React.FC<IReadOnly> = ({ label, children, className = "dark" }) => {
  return (
    <ReadOnlyContainer className={className}>
      <Typography
        component="label"
      >
        {label}
      </Typography>
      <Typography component="span" sx={{ display: "block" }}>
        {children}
      </Typography>
    </ReadOnlyContainer>
  );
};

export default ReadOnly;
