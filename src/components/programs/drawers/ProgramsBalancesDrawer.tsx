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
import { useIntl } from "react-intl";
import { Box, Typography } from "@mui/material";
import Header from "../../common/elements/Header";
import CurrencyCodeToSymbol from "../../common/converters/CurrencyCodeToSymbolConverter";
import CurrencyRender from "../../common/converters/CurrencyRender";
import Pill from "../../common/elements/PillLabel";

interface IProgramFeesDrawer {
  toggleDrawer?: any;
  custodialAccounts: any;
  defaultHomeCurrency: string;
}

const ProgramsBalancesDrawer: React.FC<IProgramFeesDrawer> = ({
  toggleDrawer = () => {
    /* function provided by drawer comp */
  },
  custodialAccounts,
  defaultHomeCurrency,
}) => {
  const intl = useIntl();

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          value={intl.formatMessage({
            id: "programBalances",
            defaultMessage: "Program Balances",
          })}
          level={2}
          bold
          color="white"
        />
      </Box>
      <Box>
        {custodialAccounts.map(({ balance, currency }: any) => {
          return (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <CurrencyRender currencyCode={balance.currencyCode} />
                {defaultHomeCurrency == currency && (
                  <Box sx={{ marginLeft: "16px", marginBottom: "3px" }}>
                    <Pill label="Home" color="info" />
                  </Box>
                )}
              </Box>
              <Typography sx={{ marginBottom: "0px !important" }}>
                <CurrencyCodeToSymbol currencyCode={balance.currencyCode} />
                {balance.amount.toLocaleString()}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default ProgramsBalancesDrawer;
