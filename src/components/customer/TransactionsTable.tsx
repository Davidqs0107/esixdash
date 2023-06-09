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

import React, { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import StandardTable from "../common/table/StandardTable";
import YesNoConverter from "../common/converters/YesNoConverter";
import TxSourceConverter from "../common/converters/TxSourceConverter";
import TxTypeConverter from "../common/converters/TxTypeConverter";
import CurrencyRender from "../common/converters/CurrencyRender";
import DateAndTimeConverter from "../common/converters/DateAndTimeConverter";
import TextRender from "../common/TextRender";
import QDFormattedCurrency from "../common/converters/QDFormattedCurrency";
import DrawerComp from "../common/DrawerComp";
import DrawerTransactionDetails from "./drawers/DrawerTransactionDetails";
import Icon from "../common/Icon";
import ClickableRender from "../common/ClickableRender";
import emitter from "../../emitter";

interface ITransactionsTable {
  customerNumber: string;
  txList: any;
}

const TransactionsTable: React.FC<ITransactionsTable> = ({
  customerNumber,
  txList,
}) => {
  const intl = useIntl();
  const [txEntries, setTxEntries] = useState([]);
  const [expand, setExpand] = useState(false);

  const TxTableMetadata = [
    {
      width: "5%",
      header: <> </>,
      render: (
        rowData: any,
        className: string,
        icon: string,
        ctr: string,
        idx: number
      ) => {
        const {
          isparent,
          hidden,
          expanded,
          tx: { id },
        } = rowData;
        var ishidden = hidden;
        return isparent && !ishidden ? (
          <ClickableRender
            id="password-reset-back-button"
            onClickFunc={() => {
              let childRows: any = txEntries.filter((e: any) => e.txId == id);
              let expanded = false;
              for (let i = 0; i < childRows.length; i++) {
                childRows[i].hidden = false;
                if (childRows[i].isparent) {
                  expanded = !childRows[i].expanded;
                  childRows[i].expanded = expanded;
                } else {
                  childRows[i].txe.creationTime = 0; // remove date on child items
                  childRows[i].hidden = !expanded;
                }
              }
              setTxEntries(txEntries);
              setExpand(expanded);
            }}
          >
            <img
              height={13}
              width={13}
              src={expanded ? Icon.caretDownDark : Icon.caretRightDark}
              alt=">"
            />
          </ClickableRender>
        ) : null;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="date"
          description="Date of release of Transaction"
          defaultMessage="Date"
        />
      ),
      render: (rowData: any) => {
        const {
          txe: { creationTime },
        } = rowData;
        return creationTime !== 0 ? (
          <DateAndTimeConverter epoch={creationTime} monthFormat="long" />
        ) : null;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="currency"
          description="Currency used in transaction"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) => {
        const {
          txe: { currency },
        } = rowData;
        return <CurrencyRender currencyCode={currency} />;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="amount"
          description="Amount of Transaction"
          defaultMessage="Amount"
        />
      ),
      render: (rowData: any) => {
        const {
          txe: { amount, currency },
        } = rowData;
        return <QDFormattedCurrency currency={currency} amount={amount} />;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="source"
          description="Source of Transaction"
          defaultMessage="Source"
        />
      ),
      render: (rowData: any) => {
        const {
          txe: { transactionSourceCode },
        } = rowData;
        return <TxSourceConverter txSourceCode={transactionSourceCode} />;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="type"
          description="Type of transaction"
          defaultMessage="Type"
        />
      ),
      render: (rowData: any) => {
        const {
          txe: { transactionTypeCode },
        } = rowData;
        return <TxTypeConverter txTypeCode={transactionTypeCode} />;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="fee"
          description="Whether or not a fee was involved"
          defaultMessage="Fee"
        />
      ),
      render: (rowData: any) => {
        const {
          txe: { fee },
        } = rowData;
        return <YesNoConverter bool={fee} />;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="memo"
          description="Transaction memo"
          defaultMessage="Memo"
        />
      ),
      render: (rowData: any) => {
        const {
          txe: { memo },
        } = rowData;
        return <TextRender data={memo} />;
      },
    },
    {
      width: "14.2%",
      header: <> </>,
      render: (rowData: any) => {
        const {
          txe,
          tx: { id, authCode, internalMemo, originalAuthDate },
        } = rowData;

        return (
          <DrawerComp
            id="payment-table-view-details-drawer"
            label={intl.formatMessage({
              id: "button.VIEW",
              description: "View details",
              defaultMessage: "VIEW",
            })}
          >
            <DrawerTransactionDetails
              customerNumber={customerNumber}
              txId={id}
              authCode={authCode}
              internalMemo={internalMemo}
              originalAuthDate={originalAuthDate}
              detail={txe}
            />
          </DrawerComp>
        );
      },
    },
  ];

  useEffect(() => {
    setTxEntries(txList);
  }, [txList, expand]);

  return (
    <StandardTable
      id="customer-transaction-table"
      tableRowPrefix="customer-transactions-table"
      tableMetadata={TxTableMetadata}
      dataList={txEntries}
    />
  );
};

export default TransactionsTable;
