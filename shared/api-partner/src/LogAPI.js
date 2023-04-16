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
const LogAPI = (config) => {
    const { baseURL, ...others } = config;
    const instance = axios.create({ baseURL: `${baseURL}/v1/logs/`, ...others });

    return {
        interceptors: instance.interceptors,
        getApiLog: id => instance.get(`${id}`),
        // eslint-disable-next-line object-curly-newline,max-len
        search: ({ partnerName, api, path, method, partnerUserName, customerNumber, externalReference, customerId, partnerUserId, partnerStoreId, startTime, endTime, startIndex, count }) => instance.get('', { params: { 'partner-name': partnerName, api, path, method, 'partner-user-name': partnerUserName, 'customer-number': customerNumber, 'external-reference': externalReference, 'customer-id': customerId, 'partner-user-id': partnerUserId, 'partner-store-id': partnerStoreId, 'start-time': startTime, 'end-time': endTime, 'start-index': startIndex, count } }),
        // eslint-disable-next-line object-curly-newline,max-len
        searchByCustomer: (customerNumber, { startTime, endTime, count, startIndex, ascending }) => instance.get(`/customer/${customerNumber}`, { params: { 'start-time': startTime, 'end-time': endTime, count, 'start-index': startIndex, ascending } }),
        // eslint-disable-next-line object-curly-newline,max-len
        searchByPartnerUser: ({ partnerUser, startTime, endTime, count, startIndex, ascending }) => instance.get('/partneruser/', { params: { 'partner-user': partnerUser, 'start-time': startTime, 'end-time': endTime, count, 'start-index': startIndex, ascending } }),
    };
};

export default LogAPI;
