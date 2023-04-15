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

import PhoneInput from "react-phone-number-input";
import React from "react";
import PhoneNumberInput from "./PhoneNumberInput";
import Box from "@mui/material/Box";

interface IPhoneNumber {
  name: string;
  id: string;
  values: any;
  setFieldValue: any;
  placeholder: string;
  setTouched: any;
  disabled?: boolean;
}

const PhoneNumber: React.FC<IPhoneNumber> = ({
  name,
  id,
  setTouched,
  setFieldValue,
  placeholder,
  values,
  disabled,
  ...props
}) => {
  return (
    <Box sx={{
      ".PhoneInputCountrySelectArrow": {
        color: "white",
        marginTop: "15px"
      },
      ".PhoneInputCountryIcon": {
        color: "white",
        marginTop: "15px"
      },
      ".PhoneInputCountry": {
        alignItems: "start",
        paddingRight: "5px"
      }
    }}>
      <PhoneInput
        name={name}
        id={id}
        value={values[name]}
        onChange={(e: any) => setFieldValue(name, e)}
        placeholder={placeholder}
        inputComponent={PhoneNumberInput}
        disabled={disabled}
        onBlur={(e) => {
          setTouched({ [name]: true }, e);
        }}
        {...props}
      />
    </Box>
  );
};

export default PhoneNumber;
