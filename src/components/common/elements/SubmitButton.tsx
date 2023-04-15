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

import React from "react";
import RequireAtLeastOne from "../../util/RequireAtLeastOne";
import { IButtonBase } from "./IButton";
import QDButton from "./QDButton";

type ISubmitButton = RequireAtLeastOne<IButtonBase, "label" | "children">;

/**
 * Themed submit button, makes use of the underlying QDButton
 * If you're getting a type error, you are likely passing in a string instead of an i18n FormattedMessage.
 *
 * You must pass in either a label or children. See {@link RequireAtLeastOne} for info on this type
 */
const SubmitButton: React.FC<ISubmitButton> = ({
  children,
  disabled,
  label,
  key,
  style,
  onClick,
  className,
  id,
  size = "large",
  color = "primary",
}) => {
  const getClassName = () => {
    return className !== undefined
      ? `${className}`
      : "";
  };

  return (
    <QDButton
      id={id}
      className={getClassName()}
      onClick={onClick}
      style={style}
      key={key}
      label={label}
      disabled={disabled}
      type="submit"
      variant="contained"
      color={color}
      textCase="provided"
      size={size}
    >
      {children}
    </QDButton>
  );
};

export default SubmitButton;
