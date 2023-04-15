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

import { defineMessages, MessageDescriptor } from "react-intl";

const RequestTypeConverter = (type: string, intl: any) => {
  const requestTypeDefinitions = defineMessages<string, MessageDescriptor>({
    ExchangeMarginRequest: {
      id: "request.type.exchangeMarginRequest",
      description: "Change request type",
      defaultMessage: "Exchange Margin Request",
    },
    AmountChangeRequest: {
      id: "request.type.amountChangeRequest",
      description: "Change request type",
      defaultMessage: "Amount Change Request",
    },
    CustomerAdjustmentRequest: {
      id: "request.type.customerAdjustmentRequest",
      description: "Change request type",
      defaultMessage: "Customer Adjustment Request",
    },
    FeeEntryRequest: {
      id: "request.type.feeEntryRequest",
      description: "Change request type",
      defaultMessage: "Fee Entry Request",
    },
    FeePlanRequest: {
      id: "request.type.feePlanRequest",
      description: "Change request type",
      defaultMessage: "Fee Plan Request",
    },
    ProgramAdjustmentRequest: {
      id: "request.type.programAdjustmentRequest",
      description: "Change request type",
      defaultMessage: "Program Adjustment Request",
    },
    RiskConfigRequest: {
      id: "request.type.riskConfigRequest",
      description: "Change request type",
      defaultMessage: "Risk Config Request",
    },
    RiskLevelRequest: {
      id: "request.type.riskLevelRequest",
      description: "Change request type",
      defaultMessage: "Risk Level Request",
    },
  });

  return intl.formatMessage(requestTypeDefinitions[type]);
};

export default RequestTypeConverter;
