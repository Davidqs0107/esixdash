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

import React, { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";

interface IToggle {
  func: any;
  className?: string;
  checked: boolean;
  label?: string | React.ReactElement;
  id: string;
  labelPlacement?: "end" | "start" | "top" | "bottom";
  disabled?: boolean;
}

const QDSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: "4px",
    transitionDuration: "300ms",
    height: 24,
    "& .MuiSwitch-input": {
      width: 42,
    },
    "&.Mui-checked": {
      padding: "4px 6px !important",
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track": {
    borderRadius: 24 / 2,
    backgroundColor: "#8995AD",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const Toggle: React.FC<IToggle> = ({
  func,
  className,
  checked,
  id,
  label,
  labelPlacement,
  disabled
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const handleChange = () => {
    setIsChecked(!checked);
    func();
  };

  return (
    <FormGroup className={className}>
      <FormControlLabel
        control={
          <QDSwitch id={id} checked={isChecked} onChange={handleChange} />
        }
	disabled={disabled}
        label={label}
        labelPlacement={labelPlacement}
        sx={{
          marginBottom: 0,
          "&.MuiFormControlLabel-labelPlacementStart .MuiTypography-body1": {
            marginRight: "10px",
          },
          "&.MuiFormControlLabel-labelPlacementEnd .MuiTypography-body1": {
            marginLeft: "10px",
          },
        }}
      />
    </FormGroup>
  );
};

export default Toggle;
