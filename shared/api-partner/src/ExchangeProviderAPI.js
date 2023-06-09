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
const ExchangeProviderAPI = (config) => {
    const { baseURL, ...others } = config;
    const instance = axios.create({ baseURL: `${baseURL}/v1/exchange/`, ...others });

    return {
        interceptors: instance.interceptors,
        create: dto => instance.post('/providers', dto),
        get: providerName => instance.get(`/providers/${providerName}`),
        list: () => instance.get('/providers'),
    };
};

export default ExchangeProviderAPI;
