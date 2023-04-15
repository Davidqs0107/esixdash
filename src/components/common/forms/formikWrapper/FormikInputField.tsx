import React from "react";
import { TextField } from "@mui/material";
import { FieldAttributes, useField } from "formik";
import { NumericFormat, NumericFormatProps } from "react-number-format";

interface NumericCustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  suffix?: string;
}

type IFormikInputFieldProps = {
  suffix?: string;
  required?: boolean;
} & FieldAttributes<{}>;

const NumericFormatCustom = React.forwardRef<
  NumericFormatProps,
  NumericCustomProps
>(function NumericFormatCustom(props, ref) {
  const { onChange, suffix, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      suffix={suffix ? ` ${suffix}` : undefined}
    />
  );
});

const FormikInputField: React.FC<IFormikInputFieldProps> = ({
  placeholder,
  disabled,
  suffix,
  required = true,
  ...props
}) => {
  const [field, meta] = useField<{}>(props);

  const capitalizeFirst = (str: string) => {
    str = str.trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const labelText =
    placeholder && placeholder.trim()
      ? `${placeholder} ${required ? "*" : ""}`
      : " ";
  const hasValue =
    meta.value !== null && meta.value !== undefined ? true : undefined;
  const isTouched = meta.touched ? true : undefined;
  // @ts-ignore
  const isDirty = props.dirty !== undefined ? props.dirty : undefined;

  const errorText =
    (meta.error && meta.touched) || (meta.error && isDirty)
      ? capitalizeFirst(meta.error.replace(props.name, "This "))
      : "";

  return (
    <TextField
      label={labelText}
      {...field}
      helperText={errorText}
      error={!!errorText}
      minRows={5}
      maxRows={5}
      // helperText={props.errors[props.name]}
      variant="outlined"
      fullWidth
      disabled={disabled}
      inputProps={{
        notched: "false",
        maxLength: 301,
        style: { overflow: "hidden" },
        suffix: suffix,
      }}
      InputProps={{
        inputComponent: suffix ? (NumericFormatCustom as any) : undefined,
      }}
      InputLabelProps={{
        shrink: hasValue || isTouched || isDirty,
      }}
      sx={{
        boxShadow: "0 10px 10px -5px rgb(33 31 64 / 10%)",
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
        "label.MuiInputLabel-root.Mui-focused, label.MuiInputLabel-shrink": {
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
        "& .MuiOutlinedInput-notchedOutline legend > span": {
          display: "none",
        },
      }}
    />
  );
};

export default FormikInputField;
