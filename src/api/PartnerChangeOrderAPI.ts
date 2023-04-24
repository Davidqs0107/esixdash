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

const PartnerChangeOrderAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/change-orders/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    approveChangeOrder: (changeOrderId: any, dto: any) =>
      instance.post(`${changeOrderId}`, dto),
    createChangeOrder: (dto: any) => instance.post("", dto),
    createUpdateFeeEntryRequest: (changeOrderId: any, dto: any) =>
      instance.post(`${changeOrderId}/fees`, dto),
    createUpdateRiskConfigRequest: (changeOrderId: any, dto: any) =>
      instance.post(`${changeOrderId}/risk/configs`, dto),
    createUpdateRiskLevelRequest: (changeOrderId: any, dto: any) =>
      instance.post(`${changeOrderId}/risk/levels`, dto),
    discardChangeOrder: (changeOrderId: any, memo: any) =>
      instance.delete(`${changeOrderId}`, { params: { memo } }),
    discardFeeEntry: (changeOrderId: any, requestId: any, memo: any) =>
      instance.delete(`${changeOrderId}/fees/${requestId}`, {
        params: { memo },
      }),
    // eslint-disable-next-line max-len
    discardRiskConfigRequest: (changeOrderId: any, requestId: any, memo: any) =>
      instance.delete(`${changeOrderId}/risk/configs/${requestId}`, {
        params: { memo },
      }),
    discardRiskLevelRequest: (changeOrderId: any, requestId: any, memo: any) =>
      instance.delete(`${changeOrderId}/risk/levels/${requestId}`, {
        params: { memo },
      }),
    getChangeOrder: (changeOrderId: any) => instance.get(`${changeOrderId}`),
    // eslint-disable-next-line object-curly-newline,max-len
    getChangeOrders: ({ state, count, startIndex, ascending }: any) =>
      instance.get("", {
        params: { state, count, "start-index": startIndex, ascending },
      }),
    getChangeRequest: (changeOrderId: any, requestId: any) =>
      instance.get(`${changeOrderId}/change-requests/${requestId}`),
    getChangeRequests: (changeOrderId: any) =>
      instance.get(`${changeOrderId}/change-requests`),
  };
};

export default PartnerChangeOrderAPI;
