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

const StoreAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/stores/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    create: (dto: any) => instance.post("", dto),
    deleteStore: (storeNumber: any) => instance.delete(`${storeNumber}`),
    get: (storeNumber: any) => instance.get(`${storeNumber}`),
    getCurrentStore: () => instance.get("current"),
    list: ({ count, startIndex, ascending }: any) =>
      instance.get("", {
        params: { count, "start-index": startIndex, ascending },
      }),
    updateAddress: (storeNumber: any, dto: any) =>
      instance.post(`${storeNumber}/address`, dto),
    updatePerson: (storeNumber: any, dto: any) =>
      instance.post(`${storeNumber}/person`, dto),
    updatePhone: (storeNumber: any, dto: any) =>
      instance.post(`${storeNumber}/phone`, dto),
    updateStoreState: (storeNumber: any, active: any) =>
      instance.put(`${storeNumber}/state`, { params: { active } }),
  };
};

export default StoreAPI;
