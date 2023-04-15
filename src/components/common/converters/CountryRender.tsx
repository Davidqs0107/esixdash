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
import CountryCodeToFlag from "./CountryCodeToFlag";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

interface ICountryRender {
  countryCode: string;
  countryList: string[];
  displayFlag?: boolean;
  labelClass?: string;
}

const CountryRender: React.FC<ICountryRender> = ({
  countryCode,
  countryList = [],
  displayFlag = true,
  labelClass,
}) => {
  
  const findDisplayName = (countryCode: string, countryList: any) => {
    const entry: any = countryList.find((c: any) => c.code === countryCode);
    return entry ? entry.name : countryCode;
    return "";
  };

  return (
    <Box sx={{display: 'flex', alignItems: 'center'}} >
      {displayFlag && countryCode !== undefined && countryCode !== null ? (
        <Box sx={{ mr: 1 }} component="span">
          <CountryCodeToFlag
            countryCode={countryCode}
            width="30px"
            height="30px"
          />
        </Box>
      ) : null}{" "}
        <Typography component="span">
        {countryCode && findDisplayName(countryCode, countryList)}
        </Typography>
    </Box>
  );
};

export default CountryRender;
