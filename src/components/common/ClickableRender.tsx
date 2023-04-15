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

import Box from "@mui/material/Box";
import React, { FC, ReactNode } from "react";

interface IClickableRender {
  data?: string;
  className?: string;
  onClickFunc: () => void;
  id?: string;
  children?: ReactNode;
  justifyContent?: string;
  role?: string;
}

const ClickableRender: FC<IClickableRender> = ({
  id,
  className,
  onClickFunc,
  data = "",
  justifyContent,
  children,
  role = "button",
  ...props
}) => {
  const handleOnKeyDown = (e: { keyCode: number }) => {
    if (e.keyCode === 13 || e.keyCode === 32) {
      onClickFunc();
    }
  };

  return (
    <Box
      id={id}
      role={role}
      tabIndex={0}
      style={{
        display: "flex",
        justifyContent: justifyContent ? justifyContent : "inherit",
      }}
      onClick={onClickFunc}
      sx={{
        display: "flex",
        alignItems: "center",
      }}
      className={className}
      onKeyDown={(e: { keyCode: number }) => handleOnKeyDown(e)}
    >
      {children}
      {data}
    </Box>
  );
};

export default ClickableRender;
