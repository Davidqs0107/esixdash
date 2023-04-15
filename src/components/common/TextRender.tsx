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

import React, { ReactElement } from "react";
import Typography from "@mui/material/Typography";
import QDTooltip from "./elements/QDTooltip";

type ITextVariant =
  | "success"
  | "error"
  | "link"
  | "grey"
  | "minor"
  | "labelLight"
  | "labelDark"
  | "tablePositiveData"
  | "tableNegativeData"
  | "inherit";

interface ITextRender {
  data: string | number | ReactElement;
  truncated?: boolean; // default is true
  truncateAt?: number; // default is 30
  className?: string;
  variant?: ITextVariant;
  component?: "p" | "label"; // default p
  size?: "normal" | "body" | "minor" | "field-label" | "big" | "large"; // default normal
  color?: string;
  bold?: boolean;
  regular?: boolean;
  noMargin?: boolean;
  bMargin?: any;
  textTransform?: "none" | "capitalize" | "uppercase" | "lowercase";
  fontWeight?: number;
  whiteSpace?: "normal" | "pre-wrap";
  lineHeight?: string;
}
const TextRender: React.FC<ITextRender> = ({
  data,
  truncated = true,
  truncateAt = 30,
  className,
  variant,
  component,
  size = "normal",
  color,
  bold = false,
  regular = false,
  noMargin = false,
  bMargin = 0,
  textTransform = "none",
  fontWeight,
  whiteSpace = "normal",
  lineHeight,
}) => {
  const getClassName = () => {
    return className;
  };

  const getComponent = () => {
    return component || "p";
  };

  const getColor = () => {
    switch (variant) {
      case "error":
        return "#23C38E";
      case "success":
        return "#EE0351";
      case "link":
        return "#433AA8";
      case "grey":
        return "#8995AD";
      case "labelLight":
        return "#FFFFFF";
      default:
        return "#152C5B";
    }
  };

  const getSize = () => {
    switch (size) {
      case "body":
        return "10px";
      case "minor":
        return "8px";
      case "field-label":
        return "13px";
      case "large":
            return "24px";
      case "big":
          return "72px";
      default:
        return "12px";
    }
  };

  const title =
    typeof data === "string" && truncated && data.length > truncateAt
      ? data
      : "";

  const Text = () => (
    <Typography
      sx={{
        color: color ? `${color} !important` : getColor,
        fontSize: getSize,
        fontWeight: bold ? 600 : fontWeight || 500,
        ...(noMargin && {
          marginBottom: "0px !important",
        }),
        ...(bMargin && {
          marginBottom: bMargin,
        }),
        ...(lineHeight && {
          lineHeight: lineHeight,
        }),
        display: "inline-flex",
        alignItems: "center",
        columnGap: 1,
        textTransform: textTransform,
        whiteSpace: whiteSpace,
      }}
      component={getComponent()}
      variant={variant}
    >
      {typeof data === "string" && truncated && data.length > truncateAt
        ? `${data.substring(0, truncateAt)}...`
        : data}
    </Typography>
  );

  return title ? (
    <QDTooltip title={title} interactive whiteSpace="pre-wrap">
      <Text />
    </QDTooltip>
  ) : (
    <Text />
  );
};

export default TextRender;
