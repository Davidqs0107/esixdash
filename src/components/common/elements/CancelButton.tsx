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

import React from "react";
import RequireAtLeastOne from "../../util/RequireAtLeastOne";
import { IButtonBase } from "./IButton";
import QDButton from "./QDButton";
import Box from "@mui/material/Box";

type ICancelButton = RequireAtLeastOne<IButtonBase, "label" | "children">;
const CancelButton: React.FC<ICancelButton> = ({
  children,
  disabled,
  label,
  key,
  style,
  onClick,
  className,
  id,
  size = "large",
}) => {
  const getClassName = () => {
    return className !== undefined
    ? `${className}`
    : "";
  };

  return (
    <Box sx={{ mr: 3 }}>
      <QDButton
        id={id}
        className={getClassName()}
        onClick={onClick}
        style={style}
        key={key}
        label={label}
        disabled={disabled}
        variant="text"
        color="secondary"
        size={size}
      >
        {children}
      </QDButton>
    </Box>
  );
};

export default CancelButton;
