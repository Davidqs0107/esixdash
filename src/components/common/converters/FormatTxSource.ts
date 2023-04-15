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

import { defineMessage, IntlShape } from "react-intl";

const FormatTxSource = (code: number, intl: IntlShape) => {
  /* Provides react-intl the info to perform message extraction */
  const sourceDefinition = [
    defineMessage({
      id: "transaction.source.unknown",
      description: "Unknown transaction source",
      defaultMessage: "Unknown",
    }),
    defineMessage({
      id: "transaction.source.inwalletPOS",
      description: "Point of sales transaction made with in wallet info",
      defaultMessage: "In Wallet POS",
    }),
    defineMessage({
      id: "transaction.source.outofwalletPOS",
      description: "Point of sales transaction with out of wallet info",
      defaultMessage: "Out of Wallet POS",
    }),
    defineMessage({
      id: "transaction.source.inwalletATM",
      description: "ATM transaction made with in wallet info",
      defaultMessage: "In Wallet ATM",
    }),
    defineMessage({
      id: "transaction.source.outofwalletATM",
      description: "ATM transaction made with  out of wallet info",
      defaultMessage: "Out of Wallet ATM",
    }),
    defineMessage({
      id: "transaction.source.online",
      description: "Transaction performed over the internet",
      defaultMessage: "Online",
    }),
    defineMessage({
      id: "transaction.source.partner",
      description: "Transaction initiated by partner",
      defaultMessage: "Partner",
    }),
    defineMessage({
      id: "transaction.source.customer",
      description: "Transaction initiated by customer",
      defaultMessage: "Customer",
    }),
    defineMessage({
      id: "transaction.source.internal",
      description: "Transaction initiated by the system",
      defaultMessage: "Internal",
    }),
    defineMessage({
      id: "transaction.source.static",
      description: "QR Code printed in static format",
      defaultMessage: "Static",
    }),
    defineMessage({
      id: "transaction.source.mobilecommerce",
      description: "Online transaction initiated from phone",
      defaultMessage: "Mobile Commerce",
    }),
    defineMessage({
      id: "transaction.source.onus",
      description: "On us",
      defaultMessage: "On Us",
    }),
    defineMessage({
      id: "transaction.source.outofwalletonline",
      description: "Online transaction with out of wallet info",
      defaultMessage: "Out of Wallet Online",
    }),
  ];
  const validNumber = (num: any) => num >= 0 && num < 13;
  return validNumber(code) ? intl.formatMessage(sourceDefinition[code]) : "";
};

const FormatTxType = (code: number, intl: IntlShape) => {
  /* Provides react-intl the info to perform message extraction */
  const txTypeDefinitions = [
    defineMessage({
      id: "transaction.type.unknown",
      description: "Unknown transaction type",
      defaultMessage: "Unknown",
    }),
    defineMessage({
      id: "transaction.type.newAccount",
      description: "Transaction represents an account being created",
      defaultMessage: "New Account",
    }),
    defineMessage({
      id: "transaction.type.cardSale",
      description: "Card purchase for order",
      defaultMessage: "Card Sale",
    }),
    defineMessage({
      id: "transaction.type.purchase",
      description: "Transaction represents a purchase",
      defaultMessage: "Purchase",
    }),
    defineMessage({
      id: "transaction.type.refund",
      description: "Transaction represents a refund",
      defaultMessage: "Refund",
    }),
    defineMessage({
      id: "transaction.type.load",
      description: "Transaction represents a load",
      defaultMessage: "Load",
    }),
    defineMessage({
      id: "transaction.type.withdraw",
      description: "Transaction represents a withdraw",
      defaultMessage: "Withdraw",
    }),
    defineMessage({
      id: "transaction.type.balanceInquiry",
      description: "Transaction represents a Balance Inquiry",
      defaultMessage: "Balance Inquiry",
    }),
    defineMessage({
      id: "transaction.type.p2p",
      description: "Transaction represents a P2P Transfer",
      defaultMessage: "P2P",
    }),
    defineMessage({
      id: "transaction.type.walletTransfer",
      description: "Transaction represents a transfer between wallets",
      defaultMessage: "Wallet Transfer",
    }),
    defineMessage({
      id: "transaction.type.exchange",
      description: "Represents an Exchange Transaction",
      defaultMessage: "Exchange",
    }),
    defineMessage({
      id: "transaction.type.exchangeMargin",
      description: "Exchange Margin",
      defaultMessage: "Exchange Margin",
    }),
    defineMessage({
      id: "transaction.type.secondPresentment",
      description: "Second Presentment",
      defaultMessage: "Second Presentment",
    }),
    defineMessage({
      id: "transaction.type.chargeBack",
      description: "Chargeback",
      defaultMessage: "Chargeback",
    }),
    defineMessage({
      id: "transaction.type.customerAdjustment",
      defaultMessage: "Customer Adjustment",
    }),
    defineMessage({
      id: "transaction.type.exchangeAdjustment",
      defaultMessage: "Exchange Adjustment",
    }),
    defineMessage({
      id: "transaction.type.maintenance",
      defaultMessage: "Maintenance",
    }),
    defineMessage({
      id: "transaction.type.chargeoff",
      defaultMessage: "Chargeoff",
    }),
    defineMessage({
      id: "transaction.type.withholding",
      defaultMessage: "Withholding",
    }),
    defineMessage({
      id: "transaction.type.closeAccount",
      defaultMessage: "Close Account",
    }),
    defineMessage({
      id: "transaction.type.reward",
      defaultMessage: "Reward",
    }),
    defineMessage({
      id: "transaction.type.shipping",
      defaultMessage: "Shipping",
    }),
    defineMessage({
      id: "transaction.type.expeditedShipping",
      defaultMessage: "Expedited Shipping",
    }),
    defineMessage({
      id: "transaction.type.addressing",
      defaultMessage: "Addressing",
    }),
    defineMessage({
      id: "transaction.type.settlement",
      defaultMessage: "Settlement",
    }),
    defineMessage({
      id: "transaction.type.consolidated",
      defaultMessage: "Consolidated",
    }),
    defineMessage({
      id: "transaction.type.interest",
      defaultMessage: "Interest",
    }),
    defineMessage({
      id: "transaction.type.cashback",
      defaultMessage: "Cashback",
    }),
    defineMessage({
      id: "transaction.type.fee",
      defaultMessage: "Fee",
    }),
    defineMessage({
      id: "transaction.type.fee.monthly",
      defaultMessage: "Monthly Fee",
    }),
    defineMessage({
      id: "transaction.type.fee.annual",
      defaultMessage: "Annual Fee",
    }),
    defineMessage({
      id: "transaction.type.fastFund",
      defaultMessage: "Fast Fund",
    }),
    defineMessage({
      id: "transaction.type.fee.loadReversal",
      defaultMessage: "Payment Reversal",
    }),
    defineMessage({
      id: "transaction.type.fee.expiry",
      defaultMessage: "Expiry",
    }),
    defineMessage({
      id: "transaction.type.fee.moneySend",
      defaultMessage: "Money Send",
    }),
    defineMessage({
      id: "transaction.type.fee.latePaymentFee",
      defaultMessage: "Late Payment Fee",
    }),
  ];

  const validNumber = (num: any) => num >= 0 && num <= 35;
  return validNumber(code) ? intl.formatMessage(txTypeDefinitions[code]) : "";
};

export { FormatTxSource, FormatTxType };
