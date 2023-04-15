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
 *
 */

const toCountryName = (countryCode: string, countryList: any) => {
  /* The supplied countryCode could be 2 characters (i.e "US") when this search is expecting 3 character (i.e "USA") */
  return countryList.find(
    (c: { code: any }) => c.code.substr(0, countryCode.length) === countryCode
  )?.text;
};

export default toCountryName;
