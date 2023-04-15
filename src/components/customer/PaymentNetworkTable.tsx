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
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import StandardTable from "../common/table/StandardTable";
import YesNoConverter from "../common/converters/YesNoConverter";
import CurrencyRender from "../common/converters/CurrencyRender";
import DateAndTimeConverter from "../common/converters/DateAndTimeConverter";
import TextRender from "../common/TextRender";
import TxTypeConverter from "../common/converters/TxTypeConverter";
import DrawerComp from "../common/DrawerComp";
import ISO8583Drawer from "./drawers/ISO8583Drawer";
import NetworkMessageDetailsDrawer from "./drawers/NetworkMessageDetailsDrawer";
import QDFormattedCurrency from "../common/converters/QDFormattedCurrency";

interface IPaymentNetworkTable {
  customerNumber: string;
  txList: any;
}

const PaymentNetworkTable: React.FC<IPaymentNetworkTable> = ({
  customerNumber,
  txList,
}) => {
  const intl = useIntl();
  const PaymentTableMetadata = [
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="date"
          description="Date of ISO8583 message"
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
      width: "14.2%",
      header: (
        <FormattedMessage
          id="currency"
          description="Currency used in ISO8583 message"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) => {
        const amount: any = rowData.acquirerAmount || rowData.billingAmount;
        return (
          <CurrencyRender
            currencyCode={amount ? amount.currencyCode : "NULL"}
          />
        );
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="amount"
          description="Amount involved in ISO8583 message"
          defaultMessage="Amount"
        />
      ),
      render: (rowData: any) => {
        const amount: any = rowData.acquirerAmount || rowData.billingAmount;
        return (
          <QDFormattedCurrency
            currency={amount ? amount.currencyCode : "NULL"}
            amount={amount ? amount.amount : ""}
          />
        );
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="type"
          description="Type of ISO8583 message"
          defaultMessage="Type"
        />
      ),
      render: (rowData: any) => {
        const {
          transactionType: { code },
        } = rowData;
        return <TxTypeConverter txTypeCode={code} />;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="MTI"
          description="Message Type Indicator of ISO8583 message"
          defaultMessage="MTI"
        />
      ),
      render: (rowData: any) => {
        const { mti } = rowData;
        return <TextRender data={mti} />;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="success"
          description="Whether or not the ISO8583 transaction was successful"
          defaultMessage="Success"
        />
      ),
      render: (rowData: any) => {
        const { success } = rowData;
        return <YesNoConverter bool={success} />;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage
          id="reversal"
          description="Whether or not the ISO8583 transaction was a reversal"
          defaultMessage="Reversal"
        />
      ),
      render: (rowData: any) => {
        const { reversal } = rowData;
        return <YesNoConverter bool={reversal} />;
      },
    },
    {
      width: "14.2%",
      header: <> </>,
      render: (rowData: any) => {
        const { id } = rowData;
        return (
          <DrawerComp
            id="payment-table-view-details-drawer"
            label={intl.formatMessage({
              id: "button.VIEW",
              description: "View details",
              defaultMessage: "VIEW",
            })}
          >
            <NetworkMessageDetailsDrawer
              usersId={customerNumber}
              messagesId={id}
            />
          </DrawerComp>
        );
      },
    },
  ];

  return (
    <StandardTable
      id="payment-network-table"
      tableRowPrefix="customer-payment-table"
      tableMetadata={PaymentTableMetadata}
      dataList={txList}
    />
  );
};

export default PaymentNetworkTable;
