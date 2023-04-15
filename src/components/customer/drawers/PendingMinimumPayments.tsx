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

import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Box from "@mui/material/Box";
import * as Yup from "yup";
import StandardTable from "../../common/table/StandardTable";
import DateAndTimeConverter from "../../common/converters/DateAndTimeConverter";
import QDFormattedCurrency from "../../common/converters/QDFormattedCurrency";
import Header from "../../common/elements/Header";

interface PendingMinimumPaymentsInput {
  repaymentPeriods: any;
  currency: any;
  toggleDrawer?: () => boolean;
}

const PendingMinimumPayments: React.FC<PendingMinimumPaymentsInput> = ({
  repaymentPeriods,
  currency,
  toggleDrawer = () => Yup.boolean,
}) => {
  const intl = useIntl();

  const PendingMinimumPayments = async () => {
    toggleDrawer();
  };

  const tableMetadata = [
    {
      header: (
        <FormattedMessage
          id="billingCycleDate"
          description="Billing cycle date"
          defaultMessage="Billing cycle date"
        />
      ),
      render: (rowData: any) => (
        <DateAndTimeConverter epoch={rowData.from} monthFormat="long" />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="originalOwedAmount"
          description="Original minimum payment owed amount"
          defaultMessage="Original owed amount"
        />
      ),
      render: (rowData: any) => (
        <QDFormattedCurrency
          currency={currency}
          amount={rowData.periodBalanceAmount}
        />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="unpaidAmount"
          description="Unpaid amount"
          defaultMessage="Unpaid amount"
        />
      ),
      render: (rowData: any) => (
        <QDFormattedCurrency
          currency={currency}
          amount={rowData.minimumPaymentAmount}
        />
      ),
    },
  ];

  return (
    <Box sx={{ minWidth: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          bold
          color="white"
          value={intl.formatMessage({
            id: "minimumPaymentDueHistory",
            defaultMessage: "Minimum Payment Due History",
          })}
        />
      </Box>
      <StandardTable
        id="product-minimum-payment-table"
        tableRowPrefix="wallets-row"
        tableMetadata={tableMetadata}
        dataList={repaymentPeriods}
      />
    </Box>
  );
};

export default PendingMinimumPayments;
