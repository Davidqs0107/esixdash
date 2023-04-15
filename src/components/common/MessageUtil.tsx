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

import React, { useState, useEffect, useContext } from "react";
import { useIntl } from "react-intl";
import { MessageContext } from "../../contexts/MessageContext";
import ErrorToast from "./toasts/ErrorToast";
import CreateToast from "./toasts/CreateToast";
import MajorCodeConverter from "./converters/MajorCodeConverter";
import MinorCodeConverter from "./converters/MinorCodeConverter";
import MajorSuccessCodeConverter from "./converters/MajorSuccessCodeConverter";
import MinorSuccessCodeConverter from "./converters/MinorSuccessCodeConverter";

interface IModalMsg {
  toastType: string;
  toastHeader: string;
  toastBody: string;
  toastString: string;
}

interface IModalMessageContextProps {
  errorMsg: { message: string; responseCode: string };
  warningMsg: { message: string; responseCode: string };
  successMsg: { message: string; responseCode: string };
  infoMsg: { message: string; responseCode: string };
}

const MessageUtil: React.FC = () => {
  const { errorMsg, warningMsg, successMsg, infoMsg } =
    useContext<IModalMessageContextProps>(MessageContext);
  const [feedBackMessage, setFeedBackMessage] = useState<IModalMsg>({
    toastType: "",
    toastHeader: "",
    toastBody: "",
    toastString: "",
  });
  const intl = useIntl();

  const splitMajorCode = (responseCode: string) => {
    return responseCode && responseCode.length > 3
      ? responseCode.substring(0, 3)
      : "";
  };

  const splitMinorCode = (responseCode: string) => {
    return responseCode && responseCode.length > 3
      ? responseCode.substring(3, 6)
      : "";
  };

  const formatErrorMessage = () => {
    if (successMsg) {
      setFeedBackMessage({
        toastType: "success",
        toastHeader: intl.formatMessage(
          MajorSuccessCodeConverter(splitMajorCode(successMsg.responseCode))
        ),
        toastBody: intl.formatMessage(
          MinorSuccessCodeConverter(splitMinorCode(successMsg.responseCode))
        ),
        toastString: successMsg.message,
      });
    }
    if (errorMsg) {
      setFeedBackMessage({
        toastType: "error",
        toastHeader: intl.formatMessage(
          MajorCodeConverter(splitMajorCode(errorMsg.responseCode))
        ),
        toastBody: intl.formatMessage(
          MinorCodeConverter(splitMinorCode(errorMsg.responseCode))
        ),
        toastString: errorMsg.message,
      });
    }
    if (warningMsg) {
      setFeedBackMessage({
        toastType: "warning",
        toastHeader: intl.formatMessage(
          MajorCodeConverter(splitMajorCode(warningMsg.responseCode))
        ),
        toastBody: intl.formatMessage(
          MinorCodeConverter(splitMinorCode(warningMsg.responseCode))
        ),
        toastString: warningMsg.message,
      });
    }
    if (infoMsg) {
      setFeedBackMessage({
        toastType: "info",
        toastHeader: intl.formatMessage(
          MajorCodeConverter(splitMajorCode(infoMsg.responseCode))
        ),
        toastBody: intl.formatMessage(
          MinorCodeConverter(splitMinorCode(infoMsg.responseCode))
        ),
        toastString: infoMsg.message,
      });
    }
    if (!successMsg && !errorMsg && !warningMsg && !infoMsg) {
      setFeedBackMessage({
        toastType: "",
        toastHeader: "",
        toastBody: "",
        toastString: "",
      });
    }
  };

  useEffect(() => {
    formatErrorMessage();
  }, [errorMsg, warningMsg, successMsg, infoMsg]);

  if (feedBackMessage.toastType !== "") {
    return (
      <>
        {feedBackMessage.toastHeader !== undefined ? (
          <CreateToast toastType={feedBackMessage.toastType}>
            {feedBackMessage.toastHeader}
            {feedBackMessage.toastBody}
            {feedBackMessage.toastString}
          </CreateToast>
        ) : (
          <ErrorToast>
            {feedBackMessage.toastString}
            {feedBackMessage.toastString}
            {feedBackMessage.toastString}
          </ErrorToast>
        )}
      </>
    );
  }

  return <>{null}</>;
};

export default MessageUtil;
