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
const ChargebackAPI = (config) => {
    const { baseURL, ...others } = config;
    const instance = axios.create({ baseURL: `${baseURL}/v1/customers/`, ...others });

    return {
        interceptors: instance.interceptors,
        cancelChargeback: (customerIdentifier, chargebackId) => instance.put(`${customerIdentifier}/chargebacks/${chargebackId}/cancel`),
        createChargeback: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/chargebacks`, dto),
        // eslint-disable-next-line max-len
        getAvailableChargebackReasons: (customerIdentifier, isoMessageId) => instance.get(`${customerIdentifier}/chargebacks/chargebackReasons/${isoMessageId}`),
        getChargeback: (customerIdentifier, chargebackId) => instance.get(`${customerIdentifier}/chargebacks/${chargebackId}`),
        getChargebackMemos: (customerIdentifier, chargebackId) => instance.get(`${customerIdentifier}/chargebacks/${chargebackId}/memos`),
        // eslint-disable-next-line max-len
        getChargebackMessage: (customerIdentifier, chargebackId, chargebackMessageId) => instance.get(`${customerIdentifier}/chargebacks/${chargebackId}/messages/${chargebackMessageId}`),
        getChargebackMessages: (customerIdentifier, chargebackId) => instance.get(`${customerIdentifier}/chargebacks/${chargebackId}/messages`),
        getChargebacks: customerIdentifier => instance.get(`${customerIdentifier}/chargebacks`),
        // eslint-disable-next-line max-len
        getTransactionChain: (customerIdentifier, transactionId) => instance.get(`${customerIdentifier}/chargebacks/${transactionId}/transactionChain`),
        reverseChargeback: (customerIdentifier, chargebackId) => instance.put(`${customerIdentifier}/chargebacks/${chargebackId}/reverse`),
    };
};

export default ChargebackAPI;