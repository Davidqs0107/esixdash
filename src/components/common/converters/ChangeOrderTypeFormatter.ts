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

import { defineMessage } from "react-intl";
import { IntlShape } from "react-intl/src/types";

const ChangeOrderTypeFormatter = (type: string, intl: IntlShape) => {
  const changeOrderTypeDefinition: any = {
    adjust: defineMessage({
      id: "change.order.adjust",
      description: "Adjustment change order",
      defaultMessage: "Adjustment",
    }),
    chargeoff: defineMessage({
      id: "change.order.chargeoff",
      description: "Chargeoff change order",
      defaultMessage: "Chargeoff",
    }),
    ExchangeMarginRequest: defineMessage({
      id: "change.order.exchangeMargin",
      description: "Exchange Margin Request",
      defaultMessage: "Exchange Margin",
    }),
    FeeEntryRequest: defineMessage({
      id: "change.order.feeEntry",
      description: "Fee Entry Request",
      defaultMessage: "Fee Entry",
    }),
    FeePlanRequest: defineMessage({
      id: "change.order.feePlan",
      description: "Fee Plan Request",
      defaultMessage: "Fee Plan",
    }),
    ProgramAdjustmentRequest: defineMessage({
      id: "change.order.programAdjustment",
      description: "Program Adjustment Request",
      defaultMessage: "Program Adjustment",
    }),
    RiskConfigRequest: defineMessage({
      id: "change.order.riskConfiguration",
      description: "Risk Configuration Request",
      defaultMessage: "Risk Configuration",
    }),
    RiskLevelRequest: defineMessage({
      id: "change.order.riskLevel",
      description: "Risk Level Request",
      defaultMessage: "Risk Level",
    }),
    withholding: defineMessage({
      id: "change.order.withholding",
      description: "Withholding Request",
      defaultMessage: "Withholding",
    }),
  };
  return intl.formatMessage(changeOrderTypeDefinition[type]);
};

export default ChangeOrderTypeFormatter;
