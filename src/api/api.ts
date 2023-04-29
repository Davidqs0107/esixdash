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

import CardAPI from "./CardAPI";
import CustomerAPI from "./CustomerAPI";
import CustomerChangeOrderAPI from "./CustomerChangeOrderAPI";
import CustomerMemoAPI from "./CustomerMemoAPI";
import CurrentUserAPI from "./CurrentUserAPI";
import PartnerAuthAPI from "./PartnerAuthAPI";
import PersonAPI from "./PersonAPI";
import OperatingAPI from "./OperatingAPI";
import OperatingFeesAPI from "./OperatingFeesAPI";
import BankAPI from "./BankAPI";
import PartnerAPI from "./PartnerAPI";
import PartnerChangeOrderAPI from "./PartnerChangeOrderAPI";
import TransactionAPI from "./TransactionAPI";
import UserAPI from "./UserAPI";
import PartnerRiskAPI from "./PartnerRiskAPI";
import LogAPI from "./LogAPI";
import ProductAPI from "./ProductAPI";
import OperatingChangeOrderAPI from "./OperatingChangeOrderAPI";
import MerchantAPI from "./MerchantAPI";

import RiskAPI from "./RiskAPI";
import CommonAPI from "./CommonAPI";
import OfferingAPI from "./OfferingAPI";
import CardProfileAPI from "./CardProfileAPI";
import MemoAPI from "./MemoAPI";
import MailTemplateAPI from "./MailTemplateAPI";
import ExchangeProviderAPI from "./ExchangeProviderAPI";
import InterchangeAPI from "./InterchangeAPI";
import OperatingProgramSetupAPI from "./OperatingProgramSetupAPI";
import authService from "../services/authService";
import CustomerGraphAPI from "./CustomerGraphAPI";
import CustomerNotificationAPI from "./CustomerNotificationAPI";
import CardTokenManagementAPI from "./CardTokenManagementAPI";
import AutoloadAPI from "./AutoloadAPI";

const partnerEndpoint = process.env.REACT_APP_PARTNER_ENDPOINT;
const quarterdeckSessionKey =
  process.env.QUARTERDECK_SESSION_KEY || "quarterdeckToken";
const provideAuth = {
  PartnerAuthAPI,
};
const requireAuth = {
  CardAPI,
  CommonAPI,
  CurrentUserAPI,
  CustomerAPI,
  CustomerChangeOrderAPI,
  CustomerMemoAPI,
  PersonAPI,
  LogAPI,
  OfferingAPI,
  OperatingAPI,
  OperatingChangeOrderAPI,
  OperatingFeesAPI,
  BankAPI,
  PartnerAPI,
  PartnerChangeOrderAPI,
  RiskAPI,
  TransactionAPI,
  UserAPI,
  PartnerRiskAPI,
  ExchangeProviderAPI,
  InterchangeAPI,
  CardProfileAPI,
  MemoAPI,
  MailTemplateAPI,
  ProductAPI,
  OperatingProgramSetupAPI,
  CustomerGraphAPI,
  CustomerNotificationAPI,
  CardTokenManagementAPI,
  AutoloadAPI,
  MerchantAPI,
};

const internalPartner = {};

const axiosHeaders = {
  partnerEndpoint,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const initApi = (
  client: any,
  authApiGuard: any,
  config: any,
  apiConsumer: any
) => {
  Object.entries(authApiGuard).forEach((entry) => {
    const [key, val] = entry;
    // eslint-disable-next-line no-param-reassign
    // @ts-ignore
    client[key] = val(config);
    if (apiConsumer) apiConsumer(client[key]);
  });
};

const authToken = () => (config: any) => {
  // eslint-disable-next-line no-undef
  const token = sessionStorage.getItem(quarterdeckSessionKey);

  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const reqRejected = () => (error: any) => {
  if (error.response.data.responseCode === "205000") {
    // not authorized
  } else if (error.response.data.responseCode === "205062") {
    // timeout function
    authService.logout();
    // eslint-disable-next-line no-restricted-globals,no-undef
    location.reload();
  }
  return Promise.reject(error.response.data);
};

//
// API interceptors
//

initApi(internalPartner, provideAuth, axiosHeaders, (api: any) => {
  api.interceptors.response.use((r: any) => r.data, reqRejected());
});

initApi(internalPartner, requireAuth, axiosHeaders, (api: any) => {
  // @ts-ignore
  api.interceptors.request.use(authToken(quarterdeckSessionKey));
  api.interceptors.response.use((r: any) => r.data, reqRejected());
});

const api = internalPartner;

export default api;
