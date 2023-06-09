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
const StoreAPI = (config) => {
    const { baseURL, ...others } = config;
    const instance = axios.create({ baseURL: `${baseURL}/v1/stores/`, ...others });

    return {
        interceptors: instance.interceptors,
        create: dto => instance.post('', dto),
        deleteStore: storeNumber => instance.delete(`${storeNumber}`),
        get: storeNumber => instance.get(`${storeNumber}`),
        getCurrentStore: () => instance.get('current'),
        list: ({ count, startIndex, ascending }) => instance.get('', { params: { count, 'start-index': startIndex, ascending } }),
        updateAddress: (storeNumber, dto) => instance.post(`${storeNumber}/address`, dto),
        updatePerson: (storeNumber, dto) => instance.post(`${storeNumber}/person`, dto),
        updatePhone: (storeNumber, dto) => instance.post(`${storeNumber}/phone`, dto),
        updateStoreState: (storeNumber, active) => instance.put(`${storeNumber}/state`, { params: { active } }),
    };
};

export default StoreAPI;
