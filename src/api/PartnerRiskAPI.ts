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

const PartnerRiskAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/risk/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    createRiskLevel: (dto: any) => instance.post("levels", dto),
    createUpdateRiskConfig: (securityLevel: any, dto: any) =>
      instance.post(`levels/${securityLevel}/configs`, dto),
    deleteRiskConfig: (securityLevel: any, paramName: any) =>
      instance.delete(`levels/${securityLevel}/configs/${paramName}`),
    deleteRiskLevel: (securityLevel: any) =>
      instance.delete(`levels/${securityLevel}`),
    getRiskConfig: (securityLevel: any, paramName: any) =>
      instance.get(`levels/${securityLevel}/configs/${paramName}`),
    getRiskConfigs: (securityLevel: any) =>
      instance.get(`levels/${securityLevel}/configs`),
    getRiskLevel: (securityLevel: any) =>
      instance.get(`levels/${securityLevel}`),
    getRiskLevels: () => instance.get("levels"),
    getRiskParams: (partnerName: any) => instance.get(`${partnerName}/params`),
  };
};

export default PartnerRiskAPI;
