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

import React from "react";
import { FormattedMessage } from "react-intl";
import CustomerSearchForm from "./CustomerSearchForm";
import CardSearchForm from "./CardSearchForm";
import ExternalReference from "./ExternalReference";
import PANSearchForm from "./PANSearchForm";

const nav = [
  {
    key: "customer-number",
    name: <FormattedMessage id="customer" defaultMessage="Customer" />,
    targetComponent: CustomerSearchForm,
  },
  {
    key: "ext-ref",
    name: (
      <FormattedMessage
        id="externalReference"
        defaultMessage="External Reference"
      />
    ),
    targetComponent: ExternalReference,
  },
  {
    key: "card",
    name: <FormattedMessage id="card" defaultMessage="Card" />,
    targetComponent: CardSearchForm,
  },
  {
    key: "pan",
    name: <FormattedMessage id="PAN" defaultMessage="PAN" />,
    targetComponent: PANSearchForm,
  }
];

export default nav;
