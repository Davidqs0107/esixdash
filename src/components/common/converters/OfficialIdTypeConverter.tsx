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

import { defineMessages } from "react-intl";

const OfficialIdTypeConverter = (type: any, intl: any) => {
  const idTypeDefinition: any = defineMessages({
    tax: {
      id: "id.type.tax",
      description: "id type",
      defaultMessage: "Tax",
    },
    nat: {
      id: "id.type.national",
      description: "id type",
      defaultMessage: "National",
    },
    ppt: {
      id: "id.type.passport",
      description: "id type",
      defaultMessage: "Passport",
    },
    dl: {
      id: "id.type.driversLicense",
      description: "id type",
      defaultMessage: "Driver's License",
    },
    suppl: {
      id: "id.type.supplementary",
      description: "id type",
      defaultMessage: "Supplementary",
    },
    alt: {
      id: "id.type.alternate",
      description: "id type",
      defaultMessage: "Alternate",
    },
    other: {
      id: "id.type.other",
      description: "id type",
      defaultMessage: "Other",
    },
  });

  return intl.formatMessage(idTypeDefinition[type]);
};

export default OfficialIdTypeConverter;
