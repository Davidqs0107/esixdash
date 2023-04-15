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
import Icon from "../Icon";

interface ICheckmarkConverter {
  bool: boolean;
  hideFalse?: boolean;
  width?: string;
  height?: string;
}
const CheckmarkConverter: React.FC<ICheckmarkConverter> = ({
  bool,
  hideFalse = false,
  ...props
}) => {
  const renderFalse = () =>
    hideFalse ? <></> : <img {...props} src={Icon.errorIcon} alt="No" />;

  return (
    <>
      {bool ? (
        <img {...props} src={Icon.checkmarkIcon} alt="Yes Checkmark" />
      ) : (
        renderFalse()
      )}
    </>
  );
};

export default CheckmarkConverter;
