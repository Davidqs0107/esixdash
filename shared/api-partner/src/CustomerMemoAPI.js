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
const CustomerMemoAPI = (config) => {
    const { baseURL, ...others } = config;
    const instance = axios.create({ baseURL: `${baseURL}/v1/customers/`, ...others });

    return {
        interceptors: instance.interceptors,
        createCustomerMemo: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/memos`, dto),
        deleteCustomerMemo: (customerIdentifier, customerMemoId) => instance.delete(`${customerIdentifier}/memos/${customerMemoId}`),
        getCustomerMemo: (customerIdentifier, customerMemoId) => instance.get(`${customerIdentifier}/memos/${customerMemoId}`),
        // eslint-disable-next-line max-len
        getCustomerMemos: (customerIdentifier, { count, startIndex, ascending }) => instance.get(`${customerIdentifier}/memos`, { params: { count, 'start-index': startIndex, ascending } }),
        updateCustomerMemo: (customerIdentifier, customerMemoId, dto) => instance.put(`${customerIdentifier}/memos/${customerMemoId}`, dto),
    };
};

export default CustomerMemoAPI;