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

import { defineMessage, IntlShape } from "react-intl";

type CardTypeDefintionTypes = "temp" | "one" | "phy" | "virtual" | "router";

type CardTypeDefintionType = {
  [name in CardTypeDefintionTypes]: any;
};

const CardTypeConverter = (type: any, intl: IntlShape) => {
  const cardTypeDefintion: CardTypeDefintionType = {
    temp: defineMessage({
      id: "card.type.temporary",
      description: "Card Type",
      defaultMessage: "Temporary",
    }),
    one: defineMessage({
      id: "card.type.oneTimeUse",
      description: "Card Type",
      defaultMessage: "One-time use",
    }),
    phy: defineMessage({
      id: "card.type.personalized",
      description: "Card Type",
      defaultMessage: "Personalized",
    }),
    virtual: defineMessage({
      id: "card.type.virtual",
      description: "Card Type",
      defaultMessage: "Virtual",
    }),
    router: defineMessage({
      id: "card.type.router",
      description: "Card Type",
      defaultMessage: "Router",
    }),
  };

  // @ts-ignore
  return intl.formatMessage(cardTypeDefintion[type]);
};

export default CardTypeConverter;
