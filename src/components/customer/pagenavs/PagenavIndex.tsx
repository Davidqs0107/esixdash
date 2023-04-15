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

import { FormattedMessage } from "react-intl";

import PageNavHolds from "./PageNavHolds";
import PageNavWallets from "./PageNavWallets";
import PageNavCards from "./PageNavCards";
import PageNavCustomerMemos from "./PagenavCustomerMemos";
import PageNavRiskStatus from "./PageNavRiskStatus";
import PageNavTransactions from "./PageNavTransactions";
import PageNavProgressTransactions from "./PageNavProgressTransactions";
import PageNavNetworkMessages from "./PageNavNetworkMessages";
import PagenavExternalAccounts from "./PagenavExternalAccounts";
import PagenavRelationships from "./PagenavRelationships";
import PageNavProduct from "./PageNavProduct";
import React from "react";

const navs = [
  {
    key: "customerMemos",
    name: <FormattedMessage id="memos" defaultMessage="Memos" />,
    targetComponent: PageNavCustomerMemos,
  },
  {
    key: "riskStatus",
    name: <FormattedMessage id="risk" defaultMessage="Risk" />,
    targetComponent: PageNavRiskStatus,
  },
  {
    key: "wallets",
    name: <FormattedMessage id="wallets" defaultMessage="Wallets" />,
    targetComponent: PageNavWallets,
  },
  {
    key: "cards",
    name: <FormattedMessage id="cards" defaultMessage="Cards" />,
    targetComponent: PageNavCards,
  },
  {
    key: "product",
    name: <FormattedMessage id="product" defaultMessage="Product" />,
    targetComponent: PageNavProduct,
  },
  {
    key: "holds",
    name: <FormattedMessage id="holds" defaultMessage="Holds" />,
    targetComponent: PageNavHolds,
  },
  {
    key: "financials",
    name: <FormattedMessage id="financials" defaultMessage="Financials" />,
    targetComponent: PageNavProduct,
  },
  {
    key: "transactions",
    name: <FormattedMessage id="transactions" defaultMessage="Transactions" />,
    targetComponent: PageNavTransactions,
  },
  {
    key: "progressTransactions",
    name: (
      <FormattedMessage
        id="inProgressTransactions"
        defaultMessage="In Progress Transactions"
      />
    ),
    targetComponent: PageNavProgressTransactions,
  },
  {
    key: "paymentNetworkMessages",
    name: (
      <FormattedMessage
        id="networkMessages"
        defaultMessage="Network Messages"
      />
    ),
    targetComponent: PageNavNetworkMessages,
  },
  {
    key: "externalAccounts",
    name: <FormattedMessage id="external" defaultMessage="External" />,
    targetComponent: PagenavExternalAccounts,
  },
  {
    key: "relationships",
    name: <FormattedMessage id="relationships" defaultMessage="Relationships" />,
    targetComponent: PagenavRelationships,
  }
];

export default navs;
