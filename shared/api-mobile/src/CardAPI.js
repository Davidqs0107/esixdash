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
        // eslint-disable-next-line max-len
        createCardBlock: (cardId, customerIdentifier, dto) => instance.post(`${cardId}/blocks`, dto, { params: { 'customer-identifier': customerIdentifier } }),
        get: (cardId, customerIdentifier) => instance.get(`${cardId}`, { params: { 'customer-identifier': customerIdentifier } }),
        // eslint-disable-next-line max-len
        getAllCardBlocks: (cardId, customerIdentifier, dto) => instance.post(`${cardId}/blocks/all`, dto, { params: { 'customer-identifier': customerIdentifier } }),
        // eslint-disable-next-line max-len
        getCardBlock: (cardId, blockId, customerIdentifier) => instance.get(`${cardId}/blocks/${blockId}`, { params: { 'customer-identifier': customerIdentifier } }),
        getCardBlocks: (cardId, customerIdentifier) => instance.get(`${cardId}/blocks`, { params: { 'customer-identifier': customerIdentifier } }),
        getCardProfile: (cardId, customerIdentifier) => instance.get(`${cardId}/profile`, { params: { 'customer-identifier': customerIdentifier } }),
        getCards: customerIdentifier => instance.get('', { params: { 'customer-identifier': customerIdentifier } }),
        getSecure: cardId => instance.get(`${cardId}/secure`),
        orderCard: (customerIdentifier, dto) => instance.post('order', dto, { params: { 'customer-identifier': customerIdentifier } }),
        // eslint-disable-next-line max-len
        releaseCardBlock: (cardId, blockId, customerIdentifier) => instance.post(`${cardId}/blocks/${blockId}/release`, { params: { 'customer-identifier': customerIdentifier } }),
        setPin: (cardId, dto) => instance.post(`${cardId}/setpin`, dto),
    };
};

export default CardAPI;