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

const Commerce2API = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/commerce2/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    estimateLoad: (customerIdentifier: any, dto: any) =>
      instance.post(`customers/${customerIdentifier}/load/estimate`, dto),
    load: (customerIdentifier: any, dto: any) =>
      instance.put(`customers/${customerIdentifier}/load`, dto),
    reversal: (customerIdentifier: any, dto: any) =>
      instance.put(`customers/${customerIdentifier}/reversal`, dto),
  };
};

export default Commerce2API;
