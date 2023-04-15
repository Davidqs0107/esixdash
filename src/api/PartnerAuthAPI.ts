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

import axios from "axios";
import wrapper from "axios-cache-plugin";

const PartnerAuthAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;
  const instance = axios.create({
    baseURL: `${partnerEndpoint}/v1/`,
    ...others,
  });
  const httpProxy = wrapper(instance, {
    maxCacheSize: 15,
  });

  return {
    interceptors: instance.interceptors,
    forgotPassword: (dto: any) => instance.post("/auth/forgot/password", dto),
    login: (dto: any) => instance.post("/auth/login", dto),
    ping: () => instance.get("ping"),
    resetPassword: (dto: any) => instance.post("/auth/password/reset", dto),
    resetPassword2: (dto: any) =>
      instance.post("/auth/password/reset/validate", dto),
    storeLogin: (dto: any) => instance.post("/auth/store", dto),
  };
};

export default PartnerAuthAPI;
