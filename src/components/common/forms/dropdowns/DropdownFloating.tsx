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
 *
 */

import React, { useEffect, useState, ReactElement } from "react";
// @ts-ignore
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import InputBase from "@mui/material/InputBase";
import ReadOnly from "../../elements/ReadOnly";
import { styled } from "@mui/material/styles";
import newid from "../../../util/NewId";
import Icon from "../../Icon";
import { FormState } from "../FormStateEnum";

interface IDropdownFloating {
  id?: string;
  name: string;
  list: any[];
  valueKey?: string;
  placeholder: any;
  isActive?: boolean;
  disabled?: boolean;
  required?: boolean;
  handleBlur: any;
  handleChange: any;
  touched: any;
  errors: any;
  validationMessage?: any;
  value?: any;
  values: any;
  initialval?: any;
  readOnly?: any;
  margin?: string;
  formattedDisplayName?: ReactElement | undefined | null;
  isVerified?: any;
}

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  height: "44px",
  backgroundColor: theme.palette.background.paper,
  borderRadius: 4,
  "label.Mui-focused + &": {
    border: `1.5px solid ${theme.palette.primary.main}`,
    borderRadius: "5px",
  },
  "label.MuiInputLabel-shrink + &": {
    border: `1.5px solid ${theme.palette.primary.main}`,
    borderRadius: "5px",
  },
  "label.Mui-focused": {
    marginTop: "-2px",
  },
  "& .MuiInputBase-input": {
    color: `${theme.palette.primary.dark}`,
    height: "19px",
    paddingTop: "14.5px",
    marginBottom: "0px",
    paddingLeft: "8.5px",
    borderRadius: "5px !important",
    backgroundColor: theme.palette.background.paper,
    "&:focus": {
      backgroundColor: theme.palette.background.paper,
    },
  },
  "label.Mui-focused + & .MuiSelect-icon": {
    marginTop: "2px !important",
    transform: "rotate(180deg)",
  },
  "label.MuiInputLabel-shrink + & .MuiSelect-icon": {
    marginTop: "2px !important",
  },
  "& .MuiSelect-icon": {
    marginTop: "2px !important",
    userSelect: "none",
    width: "12px",
    height: "12px",
    display: "inline-block",
    flexShrink: "0",
    transition: "fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    position: "absolute",
    right: "0",
    top: "calc(50% - 0.5em)",
    pointerEvents: "none",
    overflow: "hidden",
    verticalAlign: "middle",
    marginRight: "12px",
  },
  "&:focus": {
    border: `1.5px solid ${theme.palette.primary.main}`,
    borderRadius: "5px",
    backgroundColor: theme.palette.background.paper,
  },
}));

const QDDropdownIcon: React.ElementType = () => {
  return (
    <img
      key={`${newid("select-caret")}`}
      className="MuiSelect-icon MuiSelect-iconStandard"
      src={Icon.caretDownDark}
      alt="caret icon"
    />
  );
};

const BootstrapMenuItem = styled(MenuItem)(({ theme }) => ({
  color: "#152C5B",
  fontSize: 12,
  "&:focus": {
    color: theme.palette.primary.main,
    fontWeight: 600,
    backgroundColor: "#FFFFFF",
  },
  "&:hover": {
    color: theme.palette.primary.main,
    fontWeight: 600,
    backgroundColor: "#FFFFFF !important",
    boxShadow: "0 2px 10px -4px rgba(21,44,91,0.15)",
  },
  "&.Mui-selected": {
    backgroundColor: "#FFFFFF",
  },
}));

const resolveObjectProperty = (path: any, obj: any, separator = ".") => {
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev: any, curr: any) => prev && prev[curr], obj);
};

const DropdownFloating: React.FC<IDropdownFloating> = ({
  id,
  name,
  list,
  valueKey,
  placeholder,
  isActive,
  disabled,
  required = false,
  handleBlur,
  handleChange,
  touched,
  errors,
  validationMessage,
  value,
  values,
  initialval,
  readOnly = false,
  margin = "normal",
  formattedDisplayName,
  isVerified,
}) => {
  const [labelText, setLabelText] = useState(placeholder);
  const [helperText, setHelperText] = useState<string | undefined>(undefined);

  const valuesNotEmpty = () => {
    return values[name] !== "" || value !== "";
  };

  const isErrorState = () => {
    return getFormState() == "ERROR";
  };

  /**
   * @returns a possible state a form field can be in. This is used for assisting the user in filling out
   * the form correctly.
   */
  const getFormState: () => FormState = () => {
    // Field not visitied or the field is visited but empty and not required (no errors generated)
    if (
      !resolveObjectProperty(name, touched) ||
      (!resolveObjectProperty(name, errors) && !values[name])
    ) {
      return "DEFAULT";
    }

    // Visited & Errors
    else if (resolveObjectProperty(name, errors)) {
      return "ERROR";
    }

    // Visited && No Errors
    return "SUCCESS";
  };

  const getClassname = () => {
    if (isVerified) {
      return "Mui-verified";
    }

    let formState = getFormState();

    switch (formState) {
      case "DEFAULT":
        return "";
      case "SUCCESS":
        return "Mui-verified";
      case "ERROR":
        return "Mui-error";
    }
  };

  const getReadOnlyVal = () => {
    if (formattedDisplayName && formattedDisplayName.props.value)
      return formattedDisplayName;
    return values[name] || value;
  };

  useEffect(() => {
    const errorValue = errors === undefined ? placeholder : errors[name];
    const newText = isErrorState() ? errorValue : placeholder;
    if (errors && !errors[name]) {
      setHelperText("");
    }
    if (isErrorState()) {
      setHelperText(newText);
    }
  }, [touched, errors]);

  const getDropdownLabel = (value: any) => {
    if (valueKey !== undefined) {
      let found = list.find((o) => o[valueKey] === value);
      if (found && found.text) return found.text;
    }
    return value;
  };

  if (readOnly) {
    return (
      <ReadOnly label={placeholder}>
        {getDropdownLabel(values[name] || value)}
      </ReadOnly>
    );
  }

  return disabled ? (
    <ReadOnly label={placeholder}>{getReadOnlyVal()}</ReadOnly>
  ) : (
    <FormControl
      fullWidth
      sx={{
        marginBottom: margin == "normal" ? "22px" : 0,
        "& .MuiInputLabel-root": {
          color: "#8995AD",
          fontSize: 12,
          zIndex: 2,
          marginTop: "-6px",
          marginLeft: "10px",
          cursor: "pointer",
          width: "initial",
          pointerEvents: "none",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#433AA8",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          width: "initial",
          pointerEvents: "none",
        },
        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
          color: "#433AA8",
          fontSize: "8px",
          marginTop: "8px",
          fontWeight: 600,
          cursor: "pointer",
          width: "initial",
          pointerEvents: "none",
          transform: "translate(0, -1.5px) scale(1)",
        },
        "& .MuiFormHelperText-root": {
          color: "#EE0351",
        },
        "& .MuiInputBase-root.Mui-error": {
          border: "1.5px solid #EE0351",
        },
        "&.Mui-error label.MuiInputLabel-formControl": {
          color: "#EE0351",
        },
        "& .MuiInputBase-root.Mui-error .MuiSelect-icon": {
          filter: "hue-rotate(90deg)",
        },
        "&.Mui-verified .MuiInputLabel-shrink + .MuiInputBase-root": {
          border: "1.5px solid #23C38E",
        },
      }}
      variant="standard"
      required={required}
      className={getClassname()}
    >
      <InputLabel
        id={`${id}-label`}
        variant="standard"
        shrink={valuesNotEmpty()}
        sx={{
          width: "100%",
        }}
      >
        {placeholder}
      </InputLabel>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <Select
        labelId={`${id}-label`}
        id={id}
        required={required}
        value={values[name] || value}
        onBlur={(event) => {
          // formik + mui dropdown specific fix
          // eslint-disable-next-line no-param-reassign
          event.target.name = name;
          handleBlur(event);
        }}
        onChange={(event) => {
          // formik + mui dropdown specific fix
          // eslint-disable-next-line no-param-reassign
          event.target.name = name;
          handleChange(event);
        }}
        error={isErrorState()}
        IconComponent={QDDropdownIcon}
        label={placeholder}
        disabled={disabled}
        variant="standard"
        input={<BootstrapInput />}
        MenuProps={{
          sx: {
            ".MuiPaper-root": {
              boxShadow: "none",
              marginTop: "6px",
              marginLeft: "-1px",
              paddingRight: "9px !important",
            },
            ".MuiList-root": {
              paddingRight: "9px !important",
            },
            ".MuiMenuItem-root": {
              width: "calc(100% + 24px)",
            },
          },
        }}
      >
        {list.map((opt) =>
          valueKey !== undefined ? (
            <BootstrapMenuItem
              id={`${name}-${opt}`}
              value={opt[valueKey]}
              key={`${name}-${opt.text}`}
            >
              {opt.text}
            </BootstrapMenuItem>
          ) : (
            <BootstrapMenuItem
              id={`${name}-${opt}`}
              value={opt}
              key={`${name}-${opt}`}
            >
              {opt}
            </BootstrapMenuItem>
          )
        )}
      </Select>
      {helperText && (
        <FormHelperText className="Mui-error">{helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default DropdownFloating;
