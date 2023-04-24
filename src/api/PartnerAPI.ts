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

const PartnerAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/partners/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    addBlockedReferenceNumber: (partnerName: any, dto: any) =>
      instance.post(`${partnerName}/blockedReferences`, dto),
    addLinkedPartner: (partnerName: any, dto: any) =>
      instance.post(`${partnerName}/linked-partners`, dto),
    addPartnerIINs: (partnerName: any, dto: any) =>
      instance.post(`${partnerName}/iin`, dto),
    create: (dto: any) => instance.post("", dto),
    create2: (dto: any) => instance.post("exchanges", dto),
    createPartnerProgram: (partnerName: any, dto: any) =>
      instance.post(`${partnerName}/programs`, dto),
    getPartner: (partnerName: any) => instance.get(`${partnerName}`),
    deleteExchange: (exchangeName: any) =>
      instance.delete(`exchanges/${exchangeName}`),
    deleteExchangeCurrencyPairRate: (exchangeName: any, exchangePairId: any) =>
      instance.delete(`exchanges/${exchangeName}/pairs/${exchangePairId}`),
    deleteExchangeMargin: (exchangeName: any, currency: any) =>
      instance.delete(`exchanges/${exchangeName}/margins/${currency}`),
    // eslint-disable-next-line max-len
    deleteExchangeMargin2: (
      exchangeName: any,
      currency: any,
      programName: any,
      feePlanName: any
    ) =>
      instance.delete(
        `exchanges/${exchangeName}/margins/${currency}/${encodeURIComponent(
          programName
        )}/${feePlanName}`
      ),
    deletePartnerProgram: (partnerName: any, partnerProgramId: any) =>
      instance.delete(`${partnerName}/programs/${partnerProgramId}`),
    get: (exchangeName: any) => instance.get(`exchanges/${exchangeName}`),
    // eslint-disable-next-line max-len
    getBlockedReferences: (
      partnerName: any,
      { count, startIndex, ascending }: any
    ) =>
      instance.get(`${partnerName}/blockedReferences`, {
        params: { count, "start-index": startIndex, ascending },
      }),
    getExchangeCurrencyPairRate: (exchangeName: any, exchangePairId: any) =>
      instance.get(`exchanges/${exchangeName}/pairs/${exchangePairId}`),
    getExchangeCurrencyPairRates: (exchangeName: any) =>
      instance.get(`exchanges/${exchangeName}/pairs`),
    getExchangeMargin: (exchangeName: any, currency: any) =>
      instance.get(`exchanges/${exchangeName}/margins/${currency}`),
    // eslint-disable-next-line max-len
    getExchangeMargin2: (
      exchangeName: any,
      currency: any,
      programName: any,
      feePlanName: any
    ) =>
      instance.get(
        `exchanges/${exchangeName}/margins/${currency}/${encodeURIComponent(
          programName
        )}/${feePlanName}`
      ),
    getExchangeMargins: (exchangeName: any) =>
      instance.get(`exchanges/${exchangeName}/margins`),
    getExchangePrograms: (exchangeName: any) =>
      instance.get(`exchanges/${exchangeName}/programs`),
    getPartnerIINs: (partnerName: any) => instance.get(`${partnerName}/iins`),
    getPartnerDTO: (partnerName: any) => instance.get(`${partnerName}`),
    getPartnerProfile: (partnerName: any) =>
      instance.get(`${partnerName}/profile`),
    getPartnerPrograms: (partnerName: any) =>
      instance.get(`${partnerName}/programs`),
    insertOrUpdateExchangeCurrencyPairRate: (exchangeName: any, dto: any) =>
      instance.post(`exchanges/${exchangeName}/pairs`, dto),
    list: () => instance.get(""),
    listExchanges: () => instance.get("exchanges"),
    listLinkedPartners: () => instance.get("linked-partners"),
    listLinkedPartners2: (partnerName: any) =>
      instance.get(`${partnerName}/linked-partners`),
    removePartnerIIN: (partnerName: any, inn: any) =>
      instance.delete(`${partnerName}/iin/${inn}`),
    removeLinkedPartner: (partnerName: any, linkedPartnerName: any) =>
      instance.delete(`${partnerName}/linked-partners/${linkedPartnerName}`),
    removedBlockedReferenceNumber: (partnerName: any, dto: any) =>
      instance.post(`${partnerName}/blockedReferences/remove`, dto),
    updateExchangeMargin: (exchangeName: any, dto: any) =>
      instance.post(`exchanges/${exchangeName}/margins`, dto),
  };
};

export default PartnerAPI;
