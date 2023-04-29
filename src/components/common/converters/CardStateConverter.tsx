/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
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

const CardStateConverter = (status: string, intl: any) => {
  console.log(status);
  const cardStateDefinition = defineMessages<string, MessageDescriptor>({
    CREATED: {
      id: "card.state.created",
      description: "card state",
      defaultMessage: "Created",
    },
    SHIPPED: {
      id: "card.state.shipped",
      description: "card state",
      defaultMessage: "Shipped",
    },
    SOLD: {
      id: "card.state.sold",
      description: "card state",
      defaultMessage: "Sold",
    },
    RETURNED: {
      id: "card.state.returned",
      description: "card state",
      defaultMessage: "Returned",
    },
    RESENT: {
      id: "card.state.resent",
      description: "card state",
      defaultMessage: "Resent",
    },
    ACTIVATED: {
      id: "card.state.activated",
      description: "card state",
      defaultMessage: "Activated",
    },
    INVALID: {
      id: "card.state.invalid",
      description: "card state",
      defaultMessage: "Invalid",
    },
    ERROR: {
      id: "card.state.error",
      description: "card state",
      defaultMessage: "Error",
    },
  });
  if (cardStateDefinition[status] !== null)
    return intl.formatMessage(cardStateDefinition[status]);
  console.debug(`No card state definition is found for ${status}`);
  return status;
};

export default CardStateConverter;
