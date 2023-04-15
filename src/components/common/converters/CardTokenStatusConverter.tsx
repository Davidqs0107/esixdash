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

const CardTokenStatusConverter = (status: string, intl: any) => {
  const tokenStatusDefinition = defineMessages<string, MessageDescriptor>({
    ACTIVE: {
      id: "token.status.active",
      description: "token status",
      defaultMessage: "Active",
    },
    SUSPENDED: {
      id: "token.status.suspended",
      description: "token status",
      defaultMessage: "Suspended",
    },
    DEACTIVATED: {
      id: "token.status.deactivated",
      description: "token status",
      defaultMessage: "Deactivated",
    },
    INACTIVE: {
      id: "token.status.inactive",
      description: "token status",
      defaultMessage: "Inactive",
    },
  });
  if (tokenStatusDefinition[status] !== null)
    return intl.formatMessage(tokenStatusDefinition[status]);
  console.debug(`No token status definition is found for ${status}`);
  return status;
};

export default CardTokenStatusConverter;
