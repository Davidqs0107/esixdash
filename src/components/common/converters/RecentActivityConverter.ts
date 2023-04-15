/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import { defineMessages, IntlShape } from "react-intl";

const FormatRecentActivity = (code: string | number, intl: IntlShape) => {
  const recentActivityLookup = defineMessages({
    CUSTOMER_BLOCK_CREATED: {
      id: "customer.recent.customerblockcreated",
      description: "Customer Block was created",
      defaultMessage: "Customer blocked",
    },
    CARD_BLOCK_CREATED: {
      id: "customer.recent.cardblockcreated",
      description: "Card Block was created",
      defaultMessage: "Card blocked",
    },
    CUSTOMER_BLOCK_RELEASED: {
      id: "customer.recent.customerblockreleased",
      description: "Customer Block was released",
      defaultMessage: "Customer block released",
    },
    CUSTOMER_BLOCK_RELEASED_WITH_MEMO: {
      id: "customer.recent.customerblockreleased",
      description: "Customer Block was released",
      defaultMessage: "Customer block released",
    },
    CARD_BLOCK_RELEASED: {
      id: "customer.recent.cardblockreleased",
      description: "Card Block was released",
      defaultMessage: "Card block released",
    },
    CARD_BLOCK_RELEASED_WITH_MEMO: {
      id: "customer.recent.cardblockreleased",
      description: "Card Block was released",
      defaultMessage: "Card block released",
    },
    CARD_ORDERED: {
      id: "customer.recent.cardordered",
      description: "Card ordered",
      defaultMessage: "Card ordered",
    },
    CUSTOMER_MEMO_CREATED: {
      id: "customer.recent.memocreated",
      description: "Created memo",
      defaultMessage: "New customer memo",
    },
    CHANGE_ORDER_CREATED: {
      id: "customer.recent.ordercreated",
      description: "Change order was submitted",
      defaultMessage: "Change order submitted",
    },
    CHANGE_ORDER_APPROVED: {
      id: "customer.recent.orderapproved",
      description: "Change order was approved",
      defaultMessage: "Change order approved",
    },
  });

  // @ts-ignore
  return intl.formatMessage(recentActivityLookup[code]);
};

export default FormatRecentActivity;
