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

import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import StandardTable from "../common/table/StandardTable";
import CurrencyRender from "../common/converters/CurrencyRender";
import DateAndTimeConverter from "../common/converters/DateAndTimeConverter";
import TextRender from "../common/TextRender";
import TxTypeConverter from "../common/converters/TxTypeConverter";
import QDFormattedCurrency from "../common/converters/QDFormattedCurrency";
import TransactionStateConverter from "../common/converters/TransactionStateConverter";

interface IProgressTransactionsTable {
  txList: any;
}
const ProgressTransactionsTable: React.FC<IProgressTransactionsTable> = ({
  txList,
}) => {
  const intl = useIntl();

  const TxTableMetadata = [
    {
      width: "16.6%",
      header: (
        <FormattedMessage
          id="date"
          description="Date of creation of transaction in progress"
          defaultMessage="Date"
        />
      ),
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return creationTime !== 0 ? (
          <DateAndTimeConverter epoch={creationTime} monthFormat="long" />
        ) : null;
      },
    },
    {
      width: "16.6%",
      header: (
        <FormattedMessage
          id="currency"
          description="Currency used in transaction in progress"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) => {
        const { currency } = rowData;
        return <CurrencyRender currencyCode={currency} />;
      },
    },
    {
      width: "16.6%",
      header: (
        <FormattedMessage
          id="amount"
          description="Amount of currency involved in transaction in progress"
          defaultMessage="Amount"
        />
      ),
      render: (rowData: any) => {
        const { amount, currency } = rowData;
        return <QDFormattedCurrency currency={currency} amount={amount} />;
      },
    },
    {
      width: "16.6%",
      header: (
        <FormattedMessage
          id="state"
          description="Current state of in transaction in progress"
          defaultMessage="State"
        />
      ),
      render: (rowData: any) => {
        const { transactionState } = rowData;
        return (
          <TextRender
            data={TransactionStateConverter(
              transactionState.toUpperCase(),
              intl
            )}
          />
        );
      },
    },
    {
      width: "16.6%",
      header: (
        <FormattedMessage
          id="type"
          description="Type of transaction involved in transaction in progress"
          defaultMessage="Type"
        />
      ),
      render: (rowData: any) => {
        const { transactionTypeCode } = rowData;
        return <TxTypeConverter txTypeCode={transactionTypeCode} />;
      },
    },
    {
      width: "16.6%",
      header: (
        <FormattedMessage
          id="partnerName"
          description="Partner name of transaction in progress"
          defaultMessage="Partner Name"
        />
      ),
      render: (rowData: any) => {
        const { partnerName } = rowData;
        return <TextRender data={partnerName} />;
      },
    },
  ];

  return (
    <StandardTable
      id="progress-transaction-table"
      tableMetadata={TxTableMetadata}
      tableRowPrefix="customer-progressTxs-table"
      dataList={txList}
    />
  );
};

export default ProgressTransactionsTable;
