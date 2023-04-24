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

const LoadFailureAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/load/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    getLoadFailure: (loadFailureId: any) =>
      instance.get(`failure/${loadFailureId}`),
    // eslint-disable-next-line object-curly-newline,max-len
    list: ({
      programName,
      status,
      externalReference,
      minAmount,
      maxAmount,
      startTime,
      endTime,
      orderBy,
      count,
      startIndex,
      ascending,
    }: any) =>
      instance.get("failure", {
        params: {
          "program-name": programName,
          status,
          "external-reference": externalReference,
          "min-amount": minAmount,
          "max-amount": maxAmount,
          "start-time": startTime,
          "end-time": endTime,
          "order-by": orderBy,
          count,
          "start-index": startIndex,
          ascending,
        },
      }),
    resolve: (loadFailureId: any, dto: any) =>
      instance.post(`failure/${loadFailureId}/resolve`, dto),
  };
};

export default LoadFailureAPI;
