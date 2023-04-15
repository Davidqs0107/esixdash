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

import React from "react";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { QDRadio } from "../buttons/RadioButton";

interface IRadioWithInput {
  formControlLabelData: [
    {
      key: string;
      id: string;
      className?: string;
      /**
       * A control element. For instance, it can be be a `Radio`, a `Switch` or a `Checkbox`.
       */
      control: React.ReactElement<any, any>;
      /**
       * If `true`, the control will be disabled.
       */
      disabled?: boolean;
      /**
       * Pass a ref to the `input` element.
       */
      inputRef?: React.Ref<any>;
      /**
       * The text to be used in an enclosing label element.
       */
      label: React.ReactNode | string;
      /**
       * The position of the label.
       */
      labelPlacement?: "end" | "start" | "top" | "bottom";
      name?: string;
      /**
       * Callback fired when the state is changed.
       *
       * @param {object} event The event source of the callback.
       * You can pull out the new checked state by accessing `event.target.checked` (boolean).
       */
      onChange?: (event: React.ChangeEvent<{}>, checked: boolean) => void;
      /**
       * The value of the component.
       */
      value?: unknown;
      radio: {
        checked?: boolean;
        required?: boolean;
        checkedIcon?: React.ReactNode;
        color?: "primary" | "secondary" | "default";
        disabled?: boolean;
        /**
         * The icon to display when the component is unchecked.
         */
        icon?: React.ReactNode;
        size?: "small" | "medium";
      };
    }
  ];
  formLegend?: string;
  formLegendClassName?: string;
  id?: string;
  className?: string;
  name?: string;
  onChange?: any;
  props?: any;
  selection: string;
  setSelection: any;
}

const QDRadioGroup: React.FC<IRadioWithInput> = ({
  formControlLabelData,
  formLegend,
  formLegendClassName,
  id,
  className,
  name,
  onChange,
  selection,
  setSelection,
}) => {
  const updateSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelection((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl sx={{ marginBottom: "0px" }}>
      <FormLabel
        sx={{
          color: "#8995AD",
          fontSize: "12px",
          letterSpacing: "-0.2px",
          lineHeight: "15px",
        }}
      >
        {formLegend}
      </FormLabel>
      <RadioGroup
        id={id}
        name={name}
        value={selection}
        onChange={onChange || updateSelection}
      >
        {formControlLabelData.map((datum) => (
          <FormControlLabel
            key={datum.key}
            id={datum.id}
            value={datum.value}
            sx={{
              marginBottom: "0",
              ".MuiTypography-body1": {
                fontSize: "13px",
              },
            }}
            control={
              <QDRadio
                checked={datum.radio.checked}
                color={datum.radio.color}
                required={datum.radio.required}
                size={datum.radio.size}
                disabled={datum.radio.disabled}
              />
            }
            label={datum.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default QDRadioGroup;
