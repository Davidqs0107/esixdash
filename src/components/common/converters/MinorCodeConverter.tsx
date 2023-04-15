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

const MinorCodeConverter = (minorCode: string) => {
  // const intl = useIntl();
  let message;

  switch (minorCode) {
    case "000":
      message = defineMessage({
        id: "error.minorCode.000",
        description: "Minor Code",
        defaultMessage: "Not applicable",
      });
      break;
    case "001":
      message = defineMessage({
        id: "error.minorCode.001",
        description: "Minor Code",
        defaultMessage: "Customer number",
      });
      break;
    case "002":
      message = defineMessage({
        id: "error.minorCode.002",
        description: "Minor Code",
        defaultMessage: "Customer external reference",
      });
      break;
    case "003":
      message = defineMessage({
        id: "error.minorCode.003",
        description: "Minor Code",
        defaultMessage: "Program name",
      });
      break;
    case "004":
      message = defineMessage({
        id: "error.minorCode.004",
        description: "Minor Code",
        defaultMessage: "Account number",
      });
      break;
    case "005":
      message = defineMessage({
        id: "error.minorCode.005",
        description: "Minor Code",
        defaultMessage: "Store number",
      });
      break;
    case "006":
      message = defineMessage({
        id: "error.minorCode.006",
        description: "Minor Code",
        defaultMessage: "Wallet currency",
      });
      break;
    case "007":
      message = defineMessage({
        id: "error.minorCode.007",
        description: "Minor Code",
        defaultMessage: "Card number",
      });
      break;
    case "008":
      message = defineMessage({
        id: "error.minorCode.008",
        description: "Minor Code",
        defaultMessage: "PAN",
      });
      break;
    case "009":
      message = defineMessage({
        id: "error.minorCode.009",
        description: "Minor Code",
        defaultMessage: "Card ID",
      });
      break;
    case "010":
      message = defineMessage({
        id: "error.minorCode.010",
        description: "Minor Code",
        defaultMessage: "Bank name",
      });
      break;
    case "011":
      message = defineMessage({
        id: "error.minorCode.011",
        description: "Minor Code",
        defaultMessage: "Interchange name",
      });
      break;
    case "012":
      message = defineMessage({
        id: "error.minorCode.012",
        description: "Minor Code",
        defaultMessage: "Partner name",
      });
      break;
    case "013":
      message = defineMessage({
        id: "error.minorCode.013",
        description: "Minor Code",
        defaultMessage: "Exchange provider name",
      });
      break;
    case "014":
      message = defineMessage({
        id: "error.minorCode.014",
        description: "Minor Code",
        defaultMessage: "Exchange name",
      });
      break;
    case "015":
      message = defineMessage({
        id: "error.minorCode.015",
        description: "Minor Code",
        defaultMessage: "Fee plan name",
      });
      break;
    case "016":
      message = defineMessage({
        id: "error.minorCode.016",
        description: "Minor Code",
        defaultMessage: "Security level",
      });
      break;
    case "017":
      message = defineMessage({
        id: "error.minorCode.017",
        description: "Minor Code",
        defaultMessage: "Expired",
      });
      break;
    case "018":
      message = defineMessage({
        id: "error.minorCode.018",
        description: "Minor Code",
        defaultMessage: "Approval number",
      });
      break;
    case "019":
      message = defineMessage({
        id: "error.minorCode.019",
        description: "Minor Code",
        defaultMessage: "Person ID",
      });
      break;
    case "020":
      message = defineMessage({
        id: "error.minorCode.020",
        description: "Minor Code",
        defaultMessage: "Risk rule",
      });
      break;
    case "021":
      message = defineMessage({
        id: "error.minorCode.021",
        description: "Minor Code",
        defaultMessage: "Auth code",
      });
      break;
    case "022":
      message = defineMessage({
        id: "error.minorCode.022",
        description: "Minor Code",
        defaultMessage: "Transaction",
      });
      break;
    case "030":
      message = defineMessage({
        id: "error.minorCode.030",
        description: "Minor Code",
        defaultMessage: "Address ID",
      });
      break;
    case "031":
      message = defineMessage({
        id: "error.minorCode.031",
        description: "Minor Code",
        defaultMessage: "Email ID",
      });
      break;
    case "032":
      message = defineMessage({
        id: "error.minorCode.032",
        description: "Minor Code",
        defaultMessage: "Official ID ID",
      });
      break;
    case "033":
      message = defineMessage({
        id: "error.minorCode.033",
        description: "Minor Code",
        defaultMessage: "Phone ID",
      });
      break;
    case "034":
      message = defineMessage({
        id: "error.minorCode.034",
        description: "Minor Code",
        defaultMessage: "Card profile name",
      });
      break;
    case "035":
      message = defineMessage({
        id: "error.minorCode.035",
        description: "Minor Code",
        defaultMessage: "Fee entry ID",
      });
      break;
    case "036":
      message = defineMessage({
        id: "error.minorCode.036",
        description: "Minor Code",
        defaultMessage: "Mail template ID",
      });
      break;
    case "037":
      message = defineMessage({
        id: "error.minorCode.037",
        description: "Minor Code",
        defaultMessage: "Currency",
      });
      break;
    case "038":
      message = defineMessage({
        id: "error.minorCode.038",
        description: "Minor Code",
        defaultMessage: "Exchange pair rate",
      });
      break;
    case "039":
      message = defineMessage({
        id: "error.minorCode.039",
        description: "Minor Code",
        defaultMessage: "Invoice summary ID",
      });
      break;
    case "040":
      message = defineMessage({
        id: "error.minorCode.040",
        description: "Minor Code",
        defaultMessage: "Invoice summary modification",
      });
      break;
    case "041":
      message = defineMessage({
        id: "error.minorCode.041",
        description: "Minor Code",
        defaultMessage: "Risk exception ID",
      });
      break;
    case "042":
      message = defineMessage({
        id: "error.minorCode.042",
        description: "Minor Code",
        defaultMessage: "Parameter",
      });
      break;
    case "043":
      message = defineMessage({
        id: "error.minorCode.043",
        description: "Minor Code",
        defaultMessage: "Amount value",
      });
      break;
    case "044":
      message = defineMessage({
        id: "error.minorCode.044",
        description: "Minor Code",
        defaultMessage: "Auth token ID",
      });
      break;
    case "045":
      message = defineMessage({
        id: "error.minorCode.045",
        description: "Minor Code",
        defaultMessage: "Customer memo ID",
      });
      break;
    case "046":
      message = defineMessage({
        id: "error.minorCode.046",
        description: "Minor Code",
        defaultMessage: "Shipping number",
      });
      break;
    case "047":
      message = defineMessage({
        id: "error.minorCode.047",
        description: "Minor Code",
        defaultMessage: "Attribute name",
      });
      break;
    case "048":
      message = defineMessage({
        id: "error.minorCode.048",
        description: "Minor Code",
        defaultMessage: "Account locked",
      });
      break;
    case "049":
      message = defineMessage({
        id: "error.minorCode.049",
        description: "Minor Code",
        defaultMessage: "Date of birth",
      });
      break;
    case "050":
      message = defineMessage({
        id: "error.minorCode.050",
        description: "Minor Code",
        defaultMessage: "Expiration date",
      });
      break;
    case "051":
      message = defineMessage({
        id: "error.minorCode.051",
        description: "Minor Code",
        defaultMessage: "Security code",
      });
      break;
    case "052":
      message = defineMessage({
        id: "error.minorCode.052",
        description: "Minor Code",
        defaultMessage: "Child customer",
      });
      break;
    case "053":
      message = defineMessage({
        id: "error.minorCode.053",
        description: "Minor Code",
        defaultMessage: "Pending transaction",
      });
      break;
    case "054":
      message = defineMessage({
        id: "error.minorCode.054",
        description: "Minor Code",
        defaultMessage: "Card order",
      });
      break;
    case "055":
      message = defineMessage({
        id: "error.minorCode.055",
        description: "Minor Code",
        defaultMessage: "Card status",
      });
      break;
    case "056":
      message = defineMessage({
        id: "error.minorCode.056",
        description: "Minor Code",
        defaultMessage: "Pin",
      });
      break;
    case "057":
      message = defineMessage({
        id: "error.minorCode.057",
        description: "Minor Code",
        defaultMessage: "Customer blocked",
      });
      break;
    case "058":
      message = defineMessage({
        id: "error.minorCode.058",
        description: "Minor Code",
        defaultMessage: "Passcode",
      });
      break;
    case "059":
      message = defineMessage({
        id: "error.minorCode.059",
        description: "Minor Code",
        defaultMessage: "Password",
      });
      break;
    case "060":
      message = defineMessage({
        id: "error.minorCode.060",
        description: "Minor Code",
        defaultMessage: "Plugin",
      });
      break;
    case "061":
      message = defineMessage({
        id: "error.minorCode.061",
        description: "Minor Code",
        defaultMessage: "Customer memo attribute ID",
      });
      break;
    case "062":
      message = defineMessage({
        id: "error.minorCode.062",
        description: "Minor Code",
        defaultMessage: "Session token",
      });
      break;
    case "063":
      message = defineMessage({
        id: "error.minorCode.063",
        description: "Minor Code",
        defaultMessage: "Partner user ID",
      });
      break;
    case "064":
      message = defineMessage({
        id: "error.minorCode.064",
        description: "Minor Code",
        defaultMessage: "Partner user name",
      });
      break;
    case "065":
      message = defineMessage({
        id: "error.minorCode.065",
        description: "Minor Code",
        defaultMessage: "New password",
      });
      break;
    case "066":
      message = defineMessage({
        id: "error.minorCode.066",
        description: "Minor Code",
        defaultMessage: "Exchange margin",
      });
      break;
    case "067":
      message = defineMessage({
        id: "error.minorCode.067",
        description: "Minor Code",
        defaultMessage: "Parent customer",
      });
      break;
    case "068":
      message = defineMessage({
        id: "error.minorCode.068",
        description: "Minor Code",
        defaultMessage: "Subject",
      });
      break;
    case "069":
      message = defineMessage({
        id: "error.minorCode.069",
        description: "Minor Code",
        defaultMessage: "Risk level",
      });
      break;
    case "070":
      message = defineMessage({
        id: "error.minorCode.070",
        description: "Minor Code",
        defaultMessage: "ISO8583 message ID",
      });
      break;
    case "071":
      message = defineMessage({
        id: "error.minorCode.071",
        description: "Minor Code",
        defaultMessage: "Chargeback ID",
      });
      break;
    case "072":
      message = defineMessage({
        id: "error.minorCode.072",
        description: "Minor Code",
        defaultMessage: "Chargeback message ID",
      });
      break;
    case "090":
      message = defineMessage({
        id: "error.minorCode.090",
        description: "Minor Code",
        defaultMessage: "Change order ID",
      });
      break;
    case "091":
      message = defineMessage({
        id: "error.minorCode.091",
        description: "Minor Code",
        defaultMessage: "Change order state",
      });
      break;
    case "092":
      message = defineMessage({
        id: "error.minorCode.092",
        description: "Minor Code",
        defaultMessage: "Change order action",
      });
      break;
    case "093":
      message = defineMessage({
        id: "error.minorCode.093",
        description: "Minor Code",
        defaultMessage: "Change order type",
      });
      break;
    case "094":
      message = defineMessage({
        id: "error.minorCode.094",
        description: "Minor Code",
        defaultMessage: "Change order requester",
      });
      break;
    case "095":
      message = defineMessage({
        id: "error.minorCode.095",
        description: "Minor Code",
        defaultMessage: "Duplicate merchant control",
      });
      break;
    case "200":
      message = defineMessage({
        id: "error.minorCode.200",
        description: "Minor Code",
        defaultMessage: "Pin verification",
      });
      break;
    case "201":
      message = defineMessage({
        id: "error.minorCode.201",
        description: "Minor Code",
        defaultMessage: "Pin fail count",
      });
      break;
    case "202":
      message = defineMessage({
        id: "error.minorCode.202",
        description: "Minor Code",
        defaultMessage: "Card expired",
      });
      break;
    case "203":
      message = defineMessage({
        id: "error.minorCode.203",
        description: "Minor Code",
        defaultMessage: "Pin fail count temporary lock",
      });
      break;
    case "300":
      message = defineMessage({
        id: "error.minorCode.300",
        description: "Minor Code",
        defaultMessage: "Customer incident ID",
      });
      break;
    case "600":
      message = defineMessage({
        id: "error.minorCode.600",
        description: "Minor Code",
        defaultMessage: "Known error code",
      });
      break;
    default:
      message = defineMessage({
        id: "error.minorCode.unknown",
        description: "Unknown Error",
        defaultMessage: "Unknown Error",
      });
  }
  // return intl.formatMessage(message);
  return message;
};

export default MinorCodeConverter;
