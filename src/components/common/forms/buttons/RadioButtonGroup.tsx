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
 */

import React, { FC } from "react";
import Label from "../../elements/Label";

interface IRadioButtonGroup {
  value: string;
  error?: string;
  touched?: boolean;
  className?: string;
  children: React.ReactNode;
  id: string;
}

interface IInputFeedback {
  error: string;
}

// Input feedback
const InputFeedback: FC<IInputFeedback> = ({ error }) =>
  error ? <Label variant="error">{error}</Label> : null;

// Radio group
const RadioButtonGroup: FC<IRadioButtonGroup> = ({
  value,
  error,
  touched = false,
  className,
  id,
  children,
}) => {
  const defineClassName = () => {
    let classVal = "input-field";
    if (value || (!error && touched)) {
      classVal += "is-success";
    }
    if (!!error && touched) {
      classVal += "is-error";
    }
    classVal += className;
    return classVal;
  };

  const classes = defineClassName();

  return (
    <div className={classes}>
      <div id={id}>
        <>
          {children}
          {touched && error ? <InputFeedback error={error} /> : null}
        </>
      </div>
    </div>
  );
};

export default RadioButtonGroup;
