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

import MajorCodeConverter from "./MajorCodeConverter";
import MinorCodeConverter from "./MinorCodeConverter";

const ReadableErrorMessage = (responseCode: string, intl: any) => {
  let errorMsg = "";
  if (responseCode && responseCode.length >= 3) {
    //console.log(responseCode.substring(0, 3), "major");
    errorMsg += intl.formatMessage(
      MajorCodeConverter(responseCode.substring(0, 3))
    );
  }
  if (responseCode && responseCode.length >= 6) {
    const minorMsg = intl.formatMessage(
      MinorCodeConverter(responseCode.substring(3, 6))
    );

    if (minorMsg !== "Not applicable" && minorMsg !== errorMsg) {
      errorMsg += `: ${minorMsg}`;
    }
  }
  return errorMsg;
};

export default ReadableErrorMessage;
