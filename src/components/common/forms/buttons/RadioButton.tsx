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

import React, { FC } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/system";
import Radio, { RadioProps } from "@mui/material/Radio";

const QDIcon = styled("span")(({ theme, color }) => ({
  borderRadius: "50%",
  width: 16,
  height: 16,
  boxShadow:
    color === "primary" ? "inset 0 0 0 2px #292750" : "inset 0 0 0 2px #fff",
  ".Mui-focusVisible &": {
    outline:
      color === "primary"
        ? "1px auto rgba(19,124,189,.6)"
        : "1px auto rgba(19,124,189,.6)",
    outlineOffset: 1,
  },
  "input:hover ~ &": {
    backgroundColor: color === "primary" ? "#ebf1f5" : "#292750",
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background:
      theme.palette.mode === "dark"
        ? "rgba(57,75,89,.5)"
        : "rgba(206,217,224,.5)",
  },
}));

const QDCheckedIcon = styled(QDIcon)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: "0 0 0 0",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&:before": {
    display: "block",
    width: 16,
    height: 16,
    backgroundImage: "radial-gradient(#fff,#fff 32%,transparent 36%)",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
}));

export const QDRadio = (props: RadioProps) => {
  return (
    <Radio
      sx={{
        "&:hover": {
          bgcolor: "transparent",
        },
      }}
      disableRipple
      color={props.color}
      checkedIcon={<QDCheckedIcon color={props.color} />}
      icon={<QDIcon color={props.color} />}
      {...props}
    />
  );
};

interface IRadioButton {
  label: string | JSX.Element;
  id: string;
  checked: boolean;
  value: string;
  name: string;
  handleChange: () => void;
  className: string;
  disabled: boolean;
  color:
    | "default"
    | "secondary"
    | "error"
    | "primary"
    | "success"
    | "info"
    | "warning"
    | undefined;
}

const RadioButton: FC<IRadioButton> = ({
  label,
  value,
  checked,
  name,
  id,
  className,
  disabled,
  handleChange,
  color,
}) => {
  return (
    <div className={`${className}`}>
      <FormControl sx={{ marginBottom: "0px" }}>
        <FormControlLabel
          value={value}
          sx={{
            marginBottom: "0",
          }}
          control={
            <QDRadio
              checked={checked}
              onChange={handleChange}
              id={id}
              value={value}
              name={name}
              disabled={disabled}
              color={color}
            />
          }
          label={label}
        />
      </FormControl>
    </div>
  );
};

export default RadioButton;
