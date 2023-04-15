/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import { defineMessages, IntlShape } from "react-intl";

const InternationalizeEmailType = (emailType: string, intl: IntlShape) => {
  const emailTypeDefinition = defineMessages({
    work: {
      id: "work",
      description: "work email type",
      defaultMessage: "Work",
    },
    personal: {
      id: "personal",
      description: "personal email type",
      defaultMessage: "Personal",
    },
  });

  // @ts-ignore
  return intl.formatMessage(emailTypeDefinition[emailType]);
};

export default InternationalizeEmailType;
