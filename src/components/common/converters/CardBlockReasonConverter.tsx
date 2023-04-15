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

const CardBlockReasonConverter = (type: any, intl: any) => {
  const cardBlockReasonDefintion: any = {
    loststolen: defineMessage({
      id: "card.block.loststolen",
      description: "Card block reason",
      defaultMessage: "Lost or Stolen",
    }),
    suspended: defineMessage({
      id: "card.block.suspended",
      description: "Card block reason",
      defaultMessage: "Suspended",
    }),
    fraud: defineMessage({
      id: "card.block.fraud",
      description: "Card block reason",
      defaultMessage: "Fraud",
    }),
    system: defineMessage({
      id: "card.block.system",
      description: "Card block reason",
      defaultMessage: "System",
    }),
    activation: defineMessage({
      id: "card.block.activation",
      description: "Card block reason",
      defaultMessage: "Activation",
    }),
    deactivation: defineMessage({
      id: "card.block.deactivation",
      description: "Card block reason",
      defaultMessage: "Deactivation",
    }),
  };

  return intl.formatMessage(cardBlockReasonDefintion[type]);
};

export default CardBlockReasonConverter;
