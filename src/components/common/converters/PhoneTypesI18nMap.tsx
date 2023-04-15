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

const InternationalizePhoneType = (phoneType: string, intl: IntlShape) => {
  const phoneTypeDefinition = defineMessages({
    contact: {
      id: "contact",
      description: "contact phone type",
      defaultMessage: "Contact",
    },
    mob: {
      id: "mobile",
      description: "mobile phone type",
      defaultMessage: "Mobile",
    },
    home: {
      id: "home",
      description: "home phone type",
      defaultMessage: "Home",
    },
    work: {
      id: "work",
      description: "work phone type",
      defaultMessage: "Work",
    },
    fax: {
      id: "fax",
      description: "fax phone type",
      defaultMessage: "Fax",
    },
  });

  // @ts-ignore
  return intl.formatMessage(phoneTypeDefinition[phoneType]);
};

export default InternationalizePhoneType;
