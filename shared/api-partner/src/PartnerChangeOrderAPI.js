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
const PartnerChangeOrderAPI = (config) => {
    const { baseURL, ...others } = config;
    const instance = axios.create({ baseURL: `${baseURL}/v1/change-orders/`, ...others });

    return {
        interceptors: instance.interceptors,
        approveChangeOrder: (changeOrderId, dto) => instance.post(`${changeOrderId}`, dto),
        createChangeOrder: dto => instance.post('', dto),
        createUpdateFeeEntryRequest: (changeOrderId, dto) => instance.post(`${changeOrderId}/fees`, dto),
        createUpdateRiskConfigRequest: (changeOrderId, dto) => instance.post(`${changeOrderId}/risk/configs`, dto),
        createUpdateRiskLevelRequest: (changeOrderId, dto) => instance.post(`${changeOrderId}/risk/levels`, dto),
        discardChangeOrder: (changeOrderId, memo) => instance.delete(`${changeOrderId}`, { params: { memo } }),
        discardFeeEntry: (changeOrderId, requestId, memo) => instance.delete(`${changeOrderId}/fees/${requestId}`, { params: { memo } }),
        // eslint-disable-next-line max-len
        discardRiskConfigRequest: (changeOrderId, requestId, memo) => instance.delete(`${changeOrderId}/risk/configs/${requestId}`, { params: { memo } }),
        // eslint-disable-next-line max-len
        discardRiskLevelRequest: (changeOrderId, requestId, memo) => instance.delete(`${changeOrderId}/risk/levels/${requestId}`, { params: { memo } }),
        getChangeOrder: changeOrderId => instance.get(`${changeOrderId}`),
        // eslint-disable-next-line object-curly-newline,max-len
        getChangeOrders: ({ state, count, startIndex, ascending }) => instance.get('', { params: { state, count, 'start-index': startIndex, ascending } }),
        getChangeRequest: (changeOrderId, requestId) => instance.get(`${changeOrderId}/changeRequests/${requestId}`),
        getChangeRequests: changeOrderId => instance.get(`${changeOrderId}/changeRequests`),
    };
};

export default PartnerChangeOrderAPI;
