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

const CustomerChangeOrderAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/customers/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    approveChangeOrder: (
      customerIdentifier: any,
      changeOrderId: any,
      dto: any
    ) =>
      instance.post(
        `${customerIdentifier}/change-orders/${changeOrderId}`,
        dto
      ),
    // eslint-disable-next-line max-len
    createAdjustmentRequest: (
      customerIdentifier: any,
      changeOrderId: any,
      dto: any
    ) =>
      instance.post(
        `${customerIdentifier}/change-orders/${changeOrderId}/adjustment`,
        dto
      ),
    createChangeOrder: (customerIdentifier: any, dto: any) =>
      instance.post(`${customerIdentifier}/change-orders`, dto),
    // eslint-disable-next-line max-len
    createUpdateChargeoffRequest: (
      customerIdentifier: any,
      changeOrderId: any,
      dto: any
    ) =>
      instance.put(
        `${customerIdentifier}/change-orders/${changeOrderId}/chargeoff`,
        dto
      ),
    // eslint-disable-next-line max-len
    discardAdjustmentRequest: (
      customerIdentifier: any,
      changeOrderId: any,
      changeRequestId: any,
      memo: any
    ) =>
      instance.delete(
        `${customerIdentifier}/change-orders/${changeOrderId}/adjustment/${changeRequestId}`,
        {
          params: { memo },
        }
      ),
    // eslint-disable-next-line max-len
    discardChangeOrder: (
      customerIdentifier: any,
      changeOrderId: any,
      memo: any
    ) =>
      instance.delete(`${customerIdentifier}/change-orders/${changeOrderId}`, {
        params: { memo },
      }),
    getChangeOrder: (customerIdentifier: any, changeOrderId: any) =>
      instance.get(`${customerIdentifier}/change-orders/${changeOrderId}`),
    // eslint-disable-next-line object-curly-newline,max-len
    getChangeOrders: (
      customerIdentifier: any,
      { state, count, startIndex, ascending }: any
    ) =>
      instance.get(`${customerIdentifier}/change-orders`, {
        params: { state, count, "start-index": startIndex, ascending },
      }),
    // eslint-disable-next-line object-curly-newline,max-len
    getChangeOrdersByLinkedPartner: ({
      partnerName,
      state,
      count,
      startIndex,
      ascending,
    }: any) =>
      instance.get("change-orders", {
        params: {
          "partner-name": partnerName,
          state,
          count,
          "start-index": startIndex,
          ascending,
        },
      }),
    // eslint-disable-next-line max-len
    getChangeRequest: (
      customerIdentifier: any,
      changeOrderId: any,
      changeRequestId: any
    ) =>
      instance.get(
        `${customerIdentifier}/change-orders/${changeOrderId}/change-requests/${changeRequestId}`
      ),
    getChangeRequests: (customerIdentifier: any, changeOrderId: any) =>
      instance.get(
        `${customerIdentifier}/change-orders/${changeOrderId}/change-requests`
      ),
  };
};

export default CustomerChangeOrderAPI;
