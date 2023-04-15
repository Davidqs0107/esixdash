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

import React from "react";
import Typography from "@mui/material/Typography";

interface IText {
  value: string;
  className?: string;
  for?: string;
}

const Text: React.FC<IText> = ({ value, className }) => {
  const getClassName = () => {
    let genClassName = "ptext";
    if (className) {
      genClassName += ` ${className}`;
    }
    return genClassName;
  };
  return <Typography className={getClassName()}>{value}</Typography>;
};

export default Text;
