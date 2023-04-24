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
import { setup } from "axios-cache-adapter";

const CommonAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/common/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    getAddressTypes: () => instance.get("address/types"),
    getCardBlockReasons: () => instance.get("card/block/reasons"),
    getCardTypes: () => instance.get("card/types"),
    getCountryList: (lang: any) =>
      instance.get("countries", { params: { lang } }),
    getCountryList2: () => instance.get("countries"),
    getCurrencyDetailList: () => instance.get("currencies/detail"),
    getCurrencyList: () => instance.get("currencies"),
    getCustomerBlockReasons: () => instance.get("customer/block/reasons"),
    getCustomerEventTypes: () => instance.get("customer/event-types"),
    getEmailStates: () => instance.get("email/states"),
    getEmailTypes: () => instance.get("email/types"),
    getGenders: () => instance.get("genders"),
    getLocales: () => instance.get("locales"),
    getOfficialIdTypes: () => instance.get("officialid/types"),
    getPartnerUserEventTypes: () => instance.get("partner/user/eventTypes"),
    getPhoneTypes: () => instance.get("phone/types"),
    getRoles: () => instance.get("roles"),
    getTimeZoneList: () => instance.get("timezones"),
    getTransactionSources: () => instance.get("tx/sources"),
    getTransactionTypes: () => instance.get("tx/types"),
  };
};

export default CommonAPI;
