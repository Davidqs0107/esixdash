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
 */

import { defineMessage } from "react-intl";

const MinorSuccessCodeConverter = (majorCode: string) => {
  // const intl = useIntl();
  let message;

  switch (majorCode) {
    case "000":
      message = defineMessage({
        id: "success.minorCode.000",
        description: "Request Completed",
        defaultMessage: "Success",
      });
      break;
    case "001":
      message = defineMessage({
        id: "success.minorCode.001",
        description: "Enabled",
        defaultMessage: "Enabled",
      });
      break;
    case "002":
      message = defineMessage({
        id: "success.minorCode.001",
        description: "Disabled",
        defaultMessage: "Disabled",
      });
      break;
    default:
      message = defineMessage({
        id: "success.minorCode.unknown",
        description: "Unknown",
        defaultMessage: "Unknown",
      });
  }
  // return intl.formatMessage(message);
  return message;
};

export default MinorSuccessCodeConverter;
