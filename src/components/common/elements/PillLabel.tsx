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
 */

import React, { isValidElement } from "react";
import Chip from "@mui/material/Chip";
import FormattedMessage from "../FormattedMessage";
import { FormattedMessage as ReactFormattedMessage } from "react-intl";

interface IPill {
  color?: any;
  label: string | React.ReactNode;
  variant?: string;
  className?: string;
}

const Pill: React.FC<IPill> = ({ color, label, variant, className }) => {
  const getClassName = () => {
    if (variant) {
      return `MuiChip-${variant}`;
    }
    return className;
  };

  if (
    isValidElement(label) &&
    (label.type === FormattedMessage || label.type === ReactFormattedMessage) &&
    !label.props.id
  ) {
    return null;
  }

  return (
    <Chip
      label={label}
      size="small"
      color={color}
      className={getClassName()}
      sx={{
        textTransform: "uppercase",
        "&.MuiChip-filledPrimary": {
          color: "#515969",
          fontSize: "8px",
          fontWeight: "bold",
          letterSpacing: "0.2px",
          lineHeight: "10px",
          backgroundColor: "#d8f4ff",
        },
        "&.MuiChip-filledSecondary": {
          color: "#515969",
          fontSize: "8px",
          fontWeight: "bold",
          letterSpacing: "0.2px",
          lineHeight: "10px",
          backgroundColor: "#fdefd4",
        },
      }}
    ></Chip>
  );
};

export default Pill;
