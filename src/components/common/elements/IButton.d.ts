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

import React, {Key} from "react";
import {MessageDescriptor} from "react-intl";

type AllowedChildren =
  | React.NamedExoticComponent<MessageDescriptor>
  | React.DetailedHTMLProps<
      React.ImgHTMLAttributes<HTMLImageElement>,
      HTMLImageElement
    >;
export interface IButtonBase {
  /**
   * The content of the button.
   *  - Only supports FormattedMessage for i18n text buttons
   *  - and img tag elements
   *  @todo: Remove the 'any' type
   */
  children?: AllowedChildren | AllowedChildren[] | any;
  /**
   * If `true`, the button will be disabled.
   */
  disabled?: boolean;
  /**
   * The wording to use on the button, used in place of children for difficult i18n scenarios
   */
  label?: string | React.ReactNode;
  /**
   * Used by react to detect inserts into lists
   */
  key?: Key;
  /**
   * The size of the button.
   * `small` is equivalent to the dense button styling.
   */
  size?: "small" | "medium" | "large" | "extra-tall";
  /**
   * The color of the component.
   */
  color?: "inherit" | "primary" | "secondary" | "info" | "error";

  type?: "button" | "reset" | "submit" | undefined;

  /**
   * The variant to use.
   */
  variant?: "text" | "outlined" | "contained" | "icon";
  /**
   * Name of the button for testing and identification purposes.
   */
  name?: string;
  style?: React.CSSProperties;
  onClick?: any;
  className?: string;
  id: string;
  delay?: number;
}
