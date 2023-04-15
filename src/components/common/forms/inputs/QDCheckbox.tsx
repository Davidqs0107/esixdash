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

import React from "react";
import { FormControlLabel, Checkbox, Typography } from "@mui/material";

import Checked from "./Checked";
import SecondaryUnchecked from "./SecondaryUnchecked";
import PrimaryUnchecked from "./PrimaryUnchecked";
import CheckedDisabled from "./CheckedDisabled";
import UncheckedPrimaryDisabled from "./UncheckedPrimaryDisabled";
import UncheckedSecondaryDisabled from "./UncheckedSecondaryDisabled";

interface ICheckboxWithInput {
  handleChange: any;
  name: string;
  value: string;
  data: {
    key: string;
    id: string;
    className?: string;
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
    name: string;
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
    checkbox: {
      checked?: boolean;
      required?: boolean;
      checkedIcon?: React.ReactNode;
      color: "primary" | "secondary";
      textColor: "primary" | "secondary";
      disabled?: boolean;
      size?: "small" | "medium";
      labelCursor?: "pointer" | "default";
    };
  };
}

const QDCheckbox: React.FC<ICheckboxWithInput> = ({
  name,
  value,
  data,
  ...props
}) => {
  const deriveClassName = () => {
    return data.className;
  };

  const deriveCheckbox = () => {
    if (data.disabled) {
      if (data.checkbox.checked) {
        // disabled and checked
        return <CheckedDisabled />;
      }

      return data.checkbox.color === "primary" ? (
        <UncheckedPrimaryDisabled />
      ) : (
        <UncheckedSecondaryDisabled />
      );
    }

    if (!data.checkbox.checked) {
      if (data.checkbox.color === "primary") {
        return <PrimaryUnchecked />;
      }
      return <SecondaryUnchecked />;
    }

    return <Checked />;
  };

  const textColor = data.checkbox.textColor || "primary";
  const labelCursor = data.checkbox.labelCursor || "pointer";

  return (
    <FormControlLabel
      label={
        <Typography
          variant={textColor === "primary" ? "boldLink" : "body1"}
          className={deriveClassName()}
          sx={{
            marginBottom: "0px !important",
            lineHeight: "12px",
            fontWeight: 400
          }}
        >
          {data.label}
        </Typography>
      }
      key={data.key}
      id={data.id}
      control={
        <Checkbox
          name={name}
          id={data.id}
          key={data.key}
          // classes={{ root: classes.checkbox, checked: classes.checked }}
          color={data.checkbox.color}
          value={value}
          size={data.checkbox.size}
          checked={data.checkbox.checked}
          disabled={data.disabled}
          checkedIcon={deriveCheckbox()}
          icon={deriveCheckbox()}
          {...props}
          disableRipple
          sx={{
            paddingLeft: "0px",
          }}
        />
      }
      sx={{
        margin: "0px",
        cursor: labelCursor,
      }}
    />
  );
};

export default QDCheckbox;
