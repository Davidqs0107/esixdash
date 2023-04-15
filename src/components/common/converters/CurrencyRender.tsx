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
import Symbols from "./CurrencySymbols";
import CurrencyCodeToFlag from "./CurrencyCodeToFlag";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface ICurrencyRender {
  currencyCode: string;
  displayFlag?: boolean;
  labelClass?: string;
  flagWidth?: string;
  flagHeight?: string;
  fontWeight?: number;
}

const CurrencyRender: React.FC<ICurrencyRender> = ({
  currencyCode,
  displayFlag = true,
  labelClass,
  flagWidth = "30px",
  flagHeight = "30px",
  fontWeight = 400
}) => {
  const getNameFromSymbol = (symbol: string) => {
    if (symbol.length > 3) {
      // Any symbol that has more than 3 characters is not a standard currency
      // We emit a points currency label instead of performing a lookup.
      return `(${Symbols.POINTS})`;
    }
    return Symbols[currencyCode as keyof typeof Symbols]
      ? `(${Symbols[currencyCode as keyof typeof Symbols]})`
      : "";
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        justifyContent: "flex-start",
      }}
    >
      {displayFlag && currencyCode !== undefined && currencyCode !== null ? (
        <Box sx={{ mr: 1 }} component="span">
          <CurrencyCodeToFlag
            className="shadowed"
            currencyCode={currencyCode}
            width={flagWidth}
            height={flagHeight}
          />
        </Box>
      ) : null}{" "}
      <Typography component="span" fontWeight={fontWeight} sx={{ marginBottom: "0px !important" }}>
        {currencyCode !== undefined && currencyCode !== null
          ? `${currencyCode} ${getNameFromSymbol(currencyCode)}`
          : "N/A"}
      </Typography>
    </Box>
  );
};

export default CurrencyRender;
