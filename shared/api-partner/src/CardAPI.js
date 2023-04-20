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

import axios from 'axios';


// This file has been auto generated by the java class GenerateAxiosClient
const CardAPI = (config) => {
    const { baseURL, ...others } = config;
    const instance = axios.create({ baseURL: `${baseURL}/v1/cards/`, ...others });

    return {
        interceptors: instance.interceptors,
        changeCardState: (cardId, dto) => instance.put(`${cardId}/state`, dto),
        createCardBlock: (cardId, dto) => instance.post(`${cardId}/blocks`, dto),
        createCardOrder: dto => instance.post('order', dto),
        get: cardId => instance.get(`${cardId}`),
        getAllCardBlocks: (cardId, dto) => instance.post(`${cardId}/blocks/all`, dto),
        getCardBlock: (cardId, blockId) => instance.get(`${cardId}/blocks/${blockId}`),
        getCardBlocks: cardId => instance.get(`${cardId}/blocks`),
        getCardCustomer: cardId => instance.get(`${cardId}/customer`),
        getCardHistory: cardId => instance.get(`${cardId}/history`),
        getCardOrder: cardId => instance.get(`${cardId}/order`),
        getCardPerson: cardId => instance.get(`${cardId}/person`),
        getCardProfile: cardId => instance.get(`${cardId}/profile`),
        getPan: cardId => instance.get(`${cardId}/pan`),
        getSecure: cardId => instance.get(`${cardId}/secure`),
        listCards: personId => instance.get(`person/${personId}`),
        // eslint-disable-next-line max-len
        listOrders: (programName, { count, startIndex, ascending }) => instance.get(`order/${programName}`, { params: { count, 'start-index': startIndex, ascending } }),
        releaseCardBlock: (cardId, blockId) => instance.post(`${cardId}/blocks/${blockId}/release`),
        resetPinFailCount: cardId => instance.put(`${cardId}/resetpinfailcount`),
        search: dto => instance.post('search', dto),
        setPin: (cardId, dto) => instance.post(`${cardId}/setpin`, dto),
    };
};

export default CardAPI;