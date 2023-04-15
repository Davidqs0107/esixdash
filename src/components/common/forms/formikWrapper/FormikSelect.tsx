import React from 'react';
import { FieldProps } from 'formik';
import { FormControl, FormHelperText, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectProps } from '@mui/material/Select';
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import newid from "../../../util/NewId";
import Icon from "../../Icon";

interface ISelectFormFieldProps extends FieldProps, SelectProps {
  label?: string | React.ReactNode;
  formControlProps?: object;
  inputLabelProps?: object;
  formHelperTextProps?: object;
  options?: Array<{ label: string; value: string | number }>;
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

const resolveObjectProperty = (path: any, obj: any, separator = ".") => {
  const properties = Array.isArray(path) ? path : path.split(separator);
  return properties.reduce((prev: any, curr: any) => prev && prev[curr], obj);
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

export const FormikSelect: React.FC<ISelectFormFieldProps> = ({
  field,
  form,
  label,
  required = false,
  options,
  children,
  formControlProps = {},
  inputLabelProps = {},
  formHelperTextProps = {},
  ...props
}) => {
  const { errors, touched } = form;
  const { name, value } = field;
  const errorText = (touched[name] && errors[name]) || (resolveObjectProperty(name, touched) && resolveObjectProperty(name, errors));
  const emptyValue = value === '' || value === undefined || value === null;

  if (children && options) {
    throw new Error(
      'SelectFormField() :: cannot specify both `children` and `options`'
    );
  }

  let inner;
  if (children && !options) inner = children;
  else if (!children && options)
    inner = options.map(option => {
      const { label, value, ...restMenuItem } = option;
      return (
        <BootstrapMenuItem value={value} {...restMenuItem} key={value}>
          {label}
        </BootstrapMenuItem>
      );
    });

  return (
    <FormControl
      style={{ display: "flex" }}
      variant="outlined"
      {...formControlProps}
      error={!!errorText}
      sx={{
        "& .MuiInputLabel-root": {
          color: "#8995AD",
          fontSize: 12,
          zIndex: 2,
          cursor: "pointer",
          width: "initial",
          pointerEvents: "none",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#433AA8",
          fontSize: "12px",
          marginLeft: "10px",
          fontWeight: 600,
          cursor: "pointer",
          width: "initial",
          pointerEvents: "none",
        },
        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
          color: "#433AA8",
          fontSize: "8px",
          marginTop: "8px",
          marginLeft: "10px",
          fontWeight: 600,
          cursor: "pointer",
          width: "initial",
          pointerEvents: "none",
          transform: "translate(0, -1.5px) scale(1)",
        },
        "label.MuiInputLabel-shrink.Mui-error": {
          color: "#EE0351",
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
      }}
    >
      {label && (
        <InputLabel
          variant="filled"
          {...inputLabelProps}
          htmlFor={name}
          required={required}
          shrink={!emptyValue || errorText}
        >
          {label}
        </InputLabel>
      )}
      {/* @ts-ignore */}

      {errorText && (
        <FormHelperText {...formHelperTextProps} error>
          {/* @ts-ignore */}
          {!!errorText ? errorText : null}
        </FormHelperText>
      )}

      <Select 
        id={name} {...props} {...field} 
        value={value}
        input={<BootstrapInput />}
        IconComponent={QDDropdownIcon}
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
        {inner}
      </Select>

    </FormControl>
  );
};
