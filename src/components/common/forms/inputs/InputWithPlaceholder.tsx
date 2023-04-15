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

import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { InputProps as StandardInputProps } from "@mui/material/Input/Input";
import ReadOnly from "../../elements/ReadOnly";
import { FormState } from "../FormStateEnum";
import QDTooltip from "../../elements/QDTooltip";

interface IInputWithPlaceholder {
  id?: string;
  handleBlur: StandardInputProps["onBlur"];
  handleChange: StandardInputProps["onChange"];
  values: any;
  placeholder?: any;
  className?: string;
  name: string;
  type: React.InputHTMLAttributes<unknown>["type"];
  autoComplete?: string;
  touched: Record<string, boolean>;
  errors: Record<string, string>;
  multiline?: boolean;
  // validationMessage,
  disabled?: boolean;
  required?: boolean;
  index?: number;
  altName?: string;
  value?: string;
  autoFocus?: boolean;
  as?: string;
  setFieldTouched?: any;
  touchOnChange?: boolean;
  shrink?: boolean;
  readOnly?: boolean;
  margin?: string;
}

const resolveObjectProperty = (path: any, obj: any, separator = ".") => {
  try {
    if (path == undefined) {
      return false;
    } else {
      const properties = Array.isArray(path) ? path : path.split(separator);
      return properties.reduce(
        (prev: any, curr: any) => prev && prev[curr],
        obj
      );
    }
  } catch (e) {
    console.log(path);
  }
};

/**
 * This component has been heavily influenced to work with Formik Forms.
 * 
 * The value of the field can be set in two ways:
 *  1. values contains all the values in a Formik Form. We can extract out the value of this input by
 *  the name property based in, values[name].
 *  2. Pass it in directly with the value property.
 */
const InputWithPlaceholder: React.FC<IInputWithPlaceholder> = (
  props: IInputWithPlaceholder
) => {
  const {
    handleBlur,
    handleChange,
    values,
    placeholder,
    className = "",
    name,
    type,
    autoComplete,
    touched,
    errors,
    multiline,
    // validationMessage,
    disabled,
    required,
    index,
    altName,
    id,
    value,
    autoFocus,
    setFieldTouched,
    touchOnChange,
    shrink,
    readOnly = false,
    margin = "normal",
  } = props;
  const [labelText, setLabelText] = useState(placeholder);
  const [derivedClassName, setDerivedClassName] = useState(className);
  const [autofilling, setAutofilling] = useState(false);
  const [inputRef, setInputRef] = useState<HTMLInputElement>();
  const [helperText, setHelperText] = useState<string | undefined>(undefined);
      
  const getFormState : () => FormState = () => {

    // Field not visitied or the field is visited but empty and not required (no errors generated)
    if(!resolveObjectProperty(name, touched) || (!resolveObjectProperty(name, errors) && !values[name])){
      return "DEFAULT";
    }

    // Visited & Errors
    else if(resolveObjectProperty(name, errors)){
      return "ERROR"
    }

    // Visited && No Errors
    return "SUCCESS"
    
  }

  const isInvalid = () => getFormState() == "ERROR";

  function handleAutoFill(e: React.AnimationEvent) {
    if (
      e.animationName === "mui-auto-fill" ||
      e.animationName === "onAutoFillStart"
    ) {
      setAutofilling(true);
    } else {
      setAutofilling(false);
    }
  }

  const getDerivedClassName = () => {

    let formState = getFormState();

    switch(formState){
      case "DEFAULT": return "";
      case "SUCCESS": return "Mui-verified";
      case "ERROR": return "Mui-error";
    }
  }

  useEffect(() => {
    const newText = isInvalid() ? errors[name] : placeholder;
    setLabelText(newText);
    if (isInvalid() && newText !== undefined && newText.length > 0) {
      setHelperText(newText);
    } else {
      setHelperText("");
      setLabelText(newText);
    }
  }, [autofilling, touched, errors]);

  return readOnly ? (
    <ReadOnly label={placeholder}>{values[name] || value}</ReadOnly>
  ) : (
    <TextField
      //inputRef={setInputRef}
      id={id}
      name={name}
      label={placeholder}
      value={values[name] || value}
      className={getDerivedClassName()}
      //onAnimationStart={handleAutoFill}
      onChange={(...args) => {
        if (touchOnChange) {
          setFieldTouched(name);
        }
        if (handleChange) {
          handleChange(...args);
        }
      }}
      onBlur={handleBlur}
      error={getFormState() == "ERROR"}
      autoComplete="off"
      required={required}
      multiline={multiline}
      helperText={
        helperText && helperText.length > 54 ? (
          <QDTooltip title={helperText ? helperText : ""}>{helperText}</QDTooltip>
        ) : helperText
      }
      disabled={disabled}
      minRows={5}
      maxRows={5}
      //helperText={props.errors[props.name]}
      variant="outlined"
      InputLabelProps={{
        //variant: "filled",
        shrink: shrink || resolveObjectProperty(name, touched),
      }}
      InputProps={{ notched: false }}
      type={type}
      fullWidth
      autoFocus={autoFocus}
      sx={{
        marginBottom: margin == "normal" ? "22px" : 0,
        "&.Mui-verified .MuiOutlinedInput-notchedOutline": {
          border: "1.5px solid #23C38E",
          borderRadius: "5px",
        },
        "&.Mui-verified .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline":
          {
            border: "1.5px solid #23C38E",
            borderRadius: "5px",
          },
        "& .MuiInputLabel-root": {
          fontWeight: "400",
          marginLeft: "-4px",
        },
        "label.Mui-focused": {
          marginTop: "15px",
          pointerEvents: "none",
        },
        "label.MuiInputLabel-shrink": {
          marginTop: "15px",
          pointerEvents: "none",
          fontSize: "8px",
          fontWeight: "600",
          lineHeight: "12px",
        },
        "label.MuiInputLabel-shrink.Mui-error": {
          color: "#EE0351",
        },
        "& label.Mui-focused + .MuiInputBase-input": {
          paddingTop: "20px !important",
          paddingBottom: "9px !important",
        },
        "& label.MuiInputLabel-shrink + .MuiInputBase-input": {
          paddingTop: "20px !important",
          paddingBottom: "9px !important",
        },
        "& .MuiInputBase-input": {
          height: "18px",
        },
        "& .Mui-disabled": {
          color: "rgba(0, 0, 0, 0.38)",
          opacity: "0.8",
          pointerEvents: "none"
        },
        "& .Mui-disabled + label": {
          color: "rgba(0, 0, 0, 0.38)"
        }
      }}
    />
  );
};

export default InputWithPlaceholder;
