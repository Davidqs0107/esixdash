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
import TextRender from "../TextRender";

type ITextVariant =
  | "success"
  | "error"
  | "link"
  | "grey"
  | "minor"
  | "labelLight"
  | "labelDark";

interface ILabel {
  htmlFor?: string;
  className?: string;
  variant?: ITextVariant;
  size?: "normal" | "body" | "minor" | "field-label" | "big"; // default normal
  color?: string;
  bold?: boolean;
  regular?: boolean;
  noMargin?: boolean;
  bMargin?: any;
  children: any;
  fontWeight?: number;
  lineHeight?: string;
}

const Label: React.FC<ILabel> = ({
  htmlFor,
  className,
  variant,
  color,
  bold = false,
  regular = false,
  noMargin = false,
  bMargin = 0,
  fontWeight,
  size = "normal",
  lineHeight,
  children,
}) => {
  return (
    <TextRender
      data={children}
      component="label"
      variant={variant}
      truncated={false}
      className={className}
      bold={bold}
      regular={regular}
      noMargin={noMargin}
      bMargin={bMargin}
      color={color}
      fontWeight={fontWeight}
      size={size}
      lineHeight={lineHeight}
    />
  );
};

export default Label;
