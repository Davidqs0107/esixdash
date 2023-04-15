/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import { defineMessages } from "react-intl";

const capitalizeFirst = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const InternationalizeGender = (gender, intl) => {
  const genderDefinition = defineMessages({
    female: {
      id: "gender.female",
      description: "female gender",
      defaultMessage: "Female",
    },
    male: {
      id: "gender.male",
      description: "male gender",
      defaultMessage: "Male",
    },
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return capitalizeFirst(intl.formatMessage(genderDefinition[gender]));
};

export default InternationalizeGender;
