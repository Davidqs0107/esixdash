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

import { defineMessage } from "react-intl";

const MajorCodeConverter = (majorCode: string) => {
  // const intl = useIntl();
  let message;

  switch (majorCode) {
    case "100":
      message = defineMessage({
        id: "error.majorCode.100",
        description: "Invalid parameter",
        defaultMessage: "Invalid parameter",
      });
      break;
    case "101":
      message = defineMessage({
        id: "error.majorCode.101",
        description: "Null pointer exception",
        defaultMessage: "Null pointer exception",
      });
      break;
    case "102":
      message = defineMessage({
        id: "error.majorCode.102",
        description: "IO/Remote exception",
        defaultMessage: "IO/Remote exception",
      });
      break;
    case "103":
      message = defineMessage({
        id: "error.majorCode.103",
        description: "Unsupported operation",
        defaultMessage: "Unsupported operation",
      });
      break;
    case "104":
      message = defineMessage({
        id: "error.majorCode.104",
        description: "Illegal state",
        defaultMessage: "Illegal state",
      });
      break;
    case "200":
      message = defineMessage({
        id: "error.majorCode.200",
        description: "Not available",
        defaultMessage: "Not available",
      });
      break;
    case "201":
      message = defineMessage({
        id: "error.majorCode.201",
        description: "Not found",
        defaultMessage: "Not found",
      });
      break;
    case "202":
      message = defineMessage({
        id: "error.majorCode.202",
        description: "Invalid currency",
        defaultMessage: "Invalid currency",
      });
      break;
    case "203":
      message = defineMessage({
        id: "error.majorCode.203",
        description: "Currency conversion",
        defaultMessage: "Currency conversion",
      });
      break;
    case "204":
      message = defineMessage({
        id: "error.majorCode.204",
        description: "No exchange rate",
        defaultMessage: "No exchange rate",
      });
      break;
    case "205":
      message = defineMessage({
        id: "error.majorCode.205",
        description: "General security",
        defaultMessage: "General security",
      });
      break;
    case "206":
      message = defineMessage({
        id: "error.majorCode.206",
        description: "Currency mismatch",
        defaultMessage: "Currency mismatch",
      });
      break;
    case "207":
      message = defineMessage({
        id: "error.majorCode.207",
        description: "Reversal",
        defaultMessage: "Reversal",
      });
      break;
    case "208":
      message = defineMessage({
        id: "error.majorCode.208",
        description: "Validation",
        defaultMessage: "Validation",
      });
      break;
    case "209":
      message = defineMessage({
        id: "error.majorCode.209",
        description: "Duplicate",
        defaultMessage: "Duplicate",
      });
      break;
    case "210":
      message = defineMessage({
        id: "error.majorCode.210",
        description: "Exchange amount too small",
        defaultMessage: "Exchange amount too small",
      });
      break;
    case "211":
      message = defineMessage({
        id: "error.majorCode.211",
        description: "Transaction",
        defaultMessage: "Transaction",
      });
      break;
    case "212":
      message = defineMessage({
        id: "error.majorCode.212",
        description: "Message format",
        defaultMessage: "Message format",
      });
      break;
    case "213":
      message = defineMessage({
        id: "error.majorCode.213",
        description: "Cafis",
        defaultMessage: "Cafis",
      });
      break;
    case "214":
      message = defineMessage({
        id: "error.majorCode.214",
        description: "Error",
        defaultMessage: "Error",
      });
      break;
    case "300":
      message = defineMessage({
        id: "error.majorCode.300",
        description: "Insufficient funds",
        defaultMessage: "Insufficient funds",
      });
      break;
    case "400":
      message = defineMessage({
        id: "error.majorCode.400",
        description: "Risk rule",
        defaultMessage: "Risk rule",
      });
      break;
    case "500":
      message = defineMessage({
        id: "error.majorCode.500",
        description: "Change order",
        defaultMessage: "Change order",
      });
      break;
    case "600":
      message = defineMessage({
        id: "error.majorCode.600",
        description: "External Callout Failed",
        defaultMessage: "External Callout Failed",
      });
      break;
    case "900":
      message = defineMessage({
        id: "error.majorCode.900",
        description: "HTTP",
        defaultMessage: "HTTP",
      });
      break;
    default:
      message = defineMessage({
        id: "error.majorCode.unknown",
        description: "Unknown",
        defaultMessage: "Unknown",
      });
  }
  // return intl.formatMessage(message);
  return message;
};

export default MajorCodeConverter;
