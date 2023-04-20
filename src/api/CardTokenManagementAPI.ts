/*
 * Copyright (c) 2019, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 */

import axios from "axios";

// This file has been auto generated by the java class GenerateAxiosClient
const CardTokenManagementAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;
  const instance = axios.create({
    baseURL: `${partnerEndpoint}/v1/card-token/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    activateToken: (cardId: any, dto: any) => instance.put(`/activate/${cardId}`, dto),
    deleteToken: (cardId: any, dto: any) => instance.put(`/delete/${cardId}`, dto),
    getActivationMethods: (externalReference: any, cardId: any) =>
      instance.get(`/${externalReference}/card/${cardId}/activationMethods`),
    getComments: (externalReference: any, cardId: any) =>
      instance.get(`/${externalReference}/card/${cardId}/comments`),
    getStatusHistory: (externalReference: any, cardId: any) =>
      instance.get(`/${externalReference}/card/${cardId}/history`),
    getTransactions: (externalReference: any, cardId: any) =>
      instance.get(`/${externalReference}/card/${cardId}/transactions`),
    // eslint-disable-next-line max-len
    resendActivationCode: (externalReference: any, cardId: any, activationId: any) =>
      instance.post(
        `/${externalReference}/card/${cardId}/resendActivationCode/${activationId}`
      ),
    searchTokens: (cardId: any) => instance.get(`${cardId}`),
    suspendToken: (cardId: any, dto: any) => instance.put(`/suspend/${cardId}`, dto),
    unsuspendToken: (cardId: any, dto: any) => instance.put(`/unsuspend/${cardId}`, dto),
  };
};

export default CardTokenManagementAPI;