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

import { FormattedDisplayName } from "react-intl";
import React from "react";

interface ILanguageToIntl {
    value: string;
}

const LanguageToIntl: React.FC<ILanguageToIntl> = ({ value }) => {

  const formatted = value.replace("en-US", "en").replace("_", "-");

  return (
    <FormattedDisplayName type="language" value={formatted} />
  );
};

export default LanguageToIntl;