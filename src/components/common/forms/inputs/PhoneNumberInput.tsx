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

import React, { forwardRef, useState } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

interface IPhoneInput {
  value: string;
  placeholder: string;
  name: string;
  id: string;
  touched: any;
  errors: any;
}

const PhoneNumberInput = (props: IPhoneInput, ref: any) => {
  const { name, placeholder, id, value } = props;

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        {...props}
        InputProps={{ notched: false, margin: "none" }}
        inputRef={ref}
        fullWidth
        label={placeholder}
        variant="outlined"
        name={name}
        id={id}
        type="tel"
        autoComplete="off"
        InputLabelProps={{
          variant: "filled",
          shrink: value !== undefined && value !== "",
        }}
        error={props.errors[name] && props.touched[name]}
      />
    </Box>
  );
};

export default forwardRef(PhoneNumberInput);
