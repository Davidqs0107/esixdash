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

const CardAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/cards/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    changeCardState: (cardId: any, dto: any) =>
      instance.put(`${cardId}/state`, dto),
    createCardBlock: (cardId: any, dto: any) =>
      instance.post(`${cardId}/blocks`, dto),
    createCardOrder: (dto: any) => instance.post("order", dto),
    get: (cardId: any) => instance.get(`${cardId}`),
    getAllCardBlocks: (cardId: any, dto: any) =>
      instance.post(`${cardId}/blocks/all`, dto),
    getCardBlock: (cardId: any, blockId: any) =>
      instance.get(`${cardId}/blocks/${blockId}`),
    getCardBlocks: (cardId: any) => instance.get(`${cardId}/blocks`),
    getCardCustomer: (cardId: any) => instance.get(`${cardId}/customer`),
    getCardHistory: (cardId: any) => instance.get(`${cardId}/history`),
    getCardOrder: (cardId: any) => instance.get(`${cardId}/order`),
    getCardPerson: (cardId: any) => instance.get(`${cardId}/person`),
    getCardProfile: (cardId: any) => instance.get(`${cardId}/profile`),
    getPan: (cardId: any) => instance.get(`${cardId}/pan`),
    getSecure: (cardId: any) => instance.get(`${cardId}/secure`),
    listCards: (personId: any) => instance.get(`person/${personId}`),
    releaseCardBlock: (cardId: any, blockId: any) =>
      instance.post(`${cardId}/blocks/${blockId}/release`),
    releaseCardBlockWithMemo: (cardId: any, blockId: any, dto: any) =>
      instance.post(`${cardId}/blocks/${blockId}`, dto),
    getUniquePanCounts: (programName: any, profileName: any) =>
      instance.get(
        `program/${encodeURIComponent(
          programName
        )}/profile/${profileName}/uniquePanCounts`
      ),
    getUniquePanCountsByProgram: (programName: any) =>
      instance.get(
        `program/${encodeURIComponent(programName)}/uniquePanCounts`
      ),
  };
};

export default CardAPI;
