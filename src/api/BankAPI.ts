/*
 * Copyright (c) 2015-2021, Episode Six and/or its affiliates. All rights reserved.
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

const BankAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/banks/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    addBankAccount: (bankName: any, dto: any) =>
      instance.post(`${bankName}/accounts`, dto),
    addIIN: (bankName: any, dto: any) => instance.post(`${bankName}/iins`, dto),
    create: (dto: any) => instance.post("", dto),
    get: (bankName: any) => instance.get(`${bankName}`),
    getCurrencies: (bankName: any) => instance.get(`${bankName}/currencies`),
    getIINs: (bankName: any) => instance.get(`${bankName}/iins`),
    list: () => instance.get(""),
    removeIIN: (bankName: any, iin: any) =>
      instance.delete(`${bankName}/iin/${iin}`),
    supportedCurrencyList: () => instance.get("currencies"),
  };
};

export default BankAPI;
