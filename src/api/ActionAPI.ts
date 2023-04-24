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

const ActionAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/actions/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    deleteSavedByName: (encryptedPortfolioId: any, actionName: any) =>
      instance.delete(`/${encryptedPortfolioId}/saved/${actionName}`),
    executeAction: (dto: any) => instance.post("execute", dto),
    listActions: (dto: any) => instance.post("list", dto),
    listSavableActions: (encryptedPortfolioId: any, dto: any) =>
      instance.post(`/${encryptedPortfolioId}/save/options`, dto),
    listSavedByName: (encryptedPortfolioId: any, actionName: any) =>
      instance.get(`/${encryptedPortfolioId}/saved/${actionName}`),
    saveAction: (encryptedPortfolioId: any, dto: any) =>
      instance.post(`/${encryptedPortfolioId}/save`, dto),
  };
};

export default ActionAPI;
