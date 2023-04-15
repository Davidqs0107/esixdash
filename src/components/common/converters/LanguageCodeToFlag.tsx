/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import React from "react";
import japanFlag from "../../../../public/flags/japan.png";
import usFlag from "../../../../public/flags/us.png";
import brFlag from "../../../../public/flags/brazil.png";
import esFlag from "../../../../public/flags/spain.png";
import Avatar from "@mui/material/Avatar";

interface ILanguageCodeToFlag {
  locale: string;
  className?: string;
}

const LanguageCodeToFlag: React.FC<ILanguageCodeToFlag> = ({
  locale,
  className = "",
}) => {
  const flagPaths: any = {
    en: usFlag,
    ja: japanFlag,
    pt: brFlag,
    es: esFlag,
  };
  return (
    <Avatar
      className={className}
      src={flagPaths[locale]}
      alt={`${locale} flag`}
    />
  );
};

export default LanguageCodeToFlag;
