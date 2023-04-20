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
const OperatingFeesAPI = (config) => {
    const { baseURL, ...others } = config;
    const instance = axios.create({ baseURL: `${baseURL}/v1/programs/`, ...others });

    return {
        interceptors: instance.interceptors,
        createFeePlan: (programName, dto) => instance.post(`${programName}/feeplans`, dto),
        createOrUpdateFee: (programName, feePlanName, dto) => instance.post(`${programName}/feeplans/${feePlanName}/fees`, dto),
        deleteFee: (programName, feePlanName, id) => instance.delete(`${programName}/feeplans/${feePlanName}/fees/${id}`),
        deleteFeePlan: (programName, feePlanName) => instance.delete(`${programName}/feeplans/${feePlanName}`),
        getFee: (programName, feePlanName, id) => instance.get(`${programName}/feeplans/${feePlanName}/fees/${id}`),
        getFeePlan: (programName, feePlanName) => instance.get(`${programName}/feeplans/${feePlanName}`),
        getFeePlans: programName => instance.get(`${programName}/feeplans`),
        // eslint-disable-next-line max-len
        getFees: (programName, feePlanName, { currency, transactionSource, transactionType }) => instance.get(`${programName}/feeplans/${feePlanName}/fees`, { params: { currency, 'transaction-source': transactionSource, 'transaction-type': transactionType } }),
        getOperatingProgramFeeEntries: () => instance.get('fees'),
    };
};

export default OperatingFeesAPI;