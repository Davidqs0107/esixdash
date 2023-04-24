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

const OperatingChangeOrderAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/programs/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    approveChangeOrder: (programName: any, changeOrderId: any, dto: any) =>
      instance.post(
        `${encodeURIComponent(programName)}/change-orders/${changeOrderId}`,
        dto
      ),
    createChangeOrder: (programName: any, dto: any) =>
      instance.post(`${encodeURIComponent(programName)}/change-orders`, dto),
    // eslint-disable-next-line max-len
    createUpdateExchangeMarginRequest: (
      programName: any,
      changeOrderId: any,
      dto: any
    ) =>
      instance.post(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/exchanges/margins`,
        dto
      ),

    createUpdateFeeEntryRequest: (
      programName: any,
      changeOrderId: any,
      dto: any
    ) =>
      instance.post(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/fees`,
        dto
      ),
    createUpdateFeePlanRequest: (
      programName: any,
      changeOrderId: any,
      dto: any
    ) =>
      instance.post(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/feeplans`,
        dto
      ),
    // eslint-disable-next-line max-len
    createUpdateProgramAdjustmentRequest: (
      programName: any,
      changeOrderId: any,
      dto: any
    ) =>
      instance.post(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/adjustment`,
        dto
      ),
    // eslint-disable-next-line max-len
    createUpdateRiskConfigRequest: (
      programName: any,
      changeOrderId: any,
      dto: any
    ) =>
      instance.post(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/risk/configs`,
        dto
      ),
    // eslint-disable-next-line max-len
    createUpdateRiskLevelRequest: (
      programName: any,
      changeOrderId: any,
      dto: any
    ) =>
      instance.post(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/risk/levels`,
        dto
      ),
    discardChangeOrder: (programName: any, changeOrderId: any, memo: any) =>
      instance.delete(
        `${encodeURIComponent(programName)}/change-orders/${changeOrderId}`,
        {
          params: { memo },
        }
      ),
    // eslint-disable-next-line max-len
    discardExchangeMarginRequest: (
      programName: any,
      changeOrderId: any,
      requestId: any,
      memo: any
    ) =>
      instance.delete(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/exchanges/margins/${requestId}`,
        {
          params: { memo },
        }
      ),
    // eslint-disable-next-line max-len
    discardFeeEntry: (
      programName: any,
      changeOrderId: any,
      requestId: any,
      memo: any
    ) =>
      instance.delete(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/fees/${requestId}`,
        { params: { memo } }
      ),
    // eslint-disable-next-line max-len
    discardFeePlanRequest: (
      programName: any,
      changeOrderId: any,
      requestId: any,
      memo: any
    ) =>
      instance.delete(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/feeplans/${requestId}`,
        {
          params: { memo },
        }
      ),
    // eslint-disable-next-line max-len
    discardProgramAdjustmentRequest: (
      programName: any,
      changeOrderId: any,
      requestId: any,
      memo: any
    ) =>
      instance.delete(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/adjustment/${requestId}`,
        {
          params: { memo },
        }
      ),
    // eslint-disable-next-line max-len
    discardRiskConfigRequest: (
      programName: any,
      changeOrderId: any,
      requestId: any,
      memo: any
    ) =>
      instance.delete(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/risk/configs/${requestId}`,
        {
          params: { memo },
        }
      ),
    // eslint-disable-next-line max-len
    discardRiskLevelRequest: (
      programName: any,
      changeOrderId: any,
      requestId: any,
      memo: any
    ) =>
      instance.delete(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/risk/levels/${requestId}`,
        {
          params: { memo },
        }
      ),
    getChangeOrder: (programName: any, changeOrderId: any) =>
      instance.get(
        `${encodeURIComponent(programName)}/change-orders/${changeOrderId}`
      ),
    // eslint-disable-next-line object-curly-newline,max-len
    getChangeOrders: (
      programName: any,
      { state, count, startIndex, ascending }: any
    ) =>
      instance.get(`${encodeURIComponent(programName)}/change-orders`, {
        params: { state, count, "start-index": startIndex, ascending },
      }),
    // eslint-disable-next-line object-curly-newline,max-len
    getChangeOrdersByProgram: ({
      programName,
      state,
      count,
      startIndex,
      ascending,
    }: any) =>
      instance.get("change-orders", {
        params: {
          "program-name": programName,
          state,
          count,
          "start-index": startIndex,
          ascending,
        },
      }),
    // eslint-disable-next-line max-len
    getChangeRequest: (
      programName: any,
      changeOrderId: any,
      changeRequestId: any
    ) =>
      instance.get(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/changeRequests/${changeRequestId}`
      ),
    getChangeRequests: (programName: any, changeOrderId: any) =>
      instance.get(
        `${encodeURIComponent(
          programName
        )}/change-orders/${changeOrderId}/change-requests`
      ),
  };
};

export default OperatingChangeOrderAPI;
