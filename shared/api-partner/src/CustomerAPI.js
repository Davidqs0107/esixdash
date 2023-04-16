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
const CustomerAPI = (config) => {
    const { baseURL, ...others } = config;
    const instance = axios.create({ baseURL: `${baseURL}/v1/customers/`, ...others });

    return {
        interceptors: instance.interceptors,
        addPerson: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/persons`, dto),
        adjust: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/adjustments`, dto),
        attachCardApproval: (customerIdentifier, personId) => instance.post(`${customerIdentifier}/persons/${personId}/attachCardApproval`),
        closeAccount: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/closeAccount`, dto),
        confirmWalletTransfer: (customerIdentifier, dto) => instance.put(`${customerIdentifier}/wallets/transfer/confirm`, dto),
        createCustomerBlock: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/blocks`, dto),
        createCustomerProfile: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/profile`, dto),
        createExtRef: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/extrefs`, dto),
        createOrUpdateFee: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/fees`, dto),
        // eslint-disable-next-line max-len
        createOrUpdateReferenceAttribute: (customerIdentifier, extRefId, dto) => instance.post(`${customerIdentifier}/extrefs/${extRefId}/attributes/`, dto),
        createRiskException: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/risk/exception`, dto),
        deleteExternalReference: (customerIdentifier, extRefId) => instance.delete(`${customerIdentifier}/extrefs/${extRefId}`),
        deleteFee: (customerIdentifier, feeEntryId) => instance.delete(`${customerIdentifier}/fees/${feeEntryId}`),
        // eslint-disable-next-line max-len
        deleteReferenceAttribute: (customerIdentifier, extRefId, attributeName) => instance.delete(`${customerIdentifier}/extrefs/${extRefId}/attributes/${attributeName}`),
        deleteRiskException: (customerIdentifier, riskExceptionId) => instance.delete(`${customerIdentifier}/risk/exception/${riskExceptionId}`),
        get: customerIdentifier => instance.get(`${customerIdentifier}`),
        getAuthorization: (customerIdentifier, authorizationId) => instance.get(`${customerIdentifier}/authholds/${authorizationId}`),
        getAuthorizations: customerIdentifier => instance.get(`${customerIdentifier}/authholds`),
        // eslint-disable-next-line object-curly-newline,max-len
        getAuthorizationsPaginated: (customerIdentifier, { startTime, endTime, mode, currency, minAmount, maxAmount, count, startIndex, ascending }) => instance.get(`${customerIdentifier}/authholds/page`, { params: { 'start-time': startTime, 'end-time': endTime, mode, currency, 'min-amount': minAmount, 'max-amount': maxAmount, count, 'start-index': startIndex, ascending } }),
        getCards: customerIdentifier => instance.get(`${customerIdentifier}/cards`),
        // eslint-disable-next-line max-len
        getCardsPaginated: (customerIdentifier, { count, startIndex, ascending }) => instance.get(`${customerIdentifier}/cards/paginated`, { params: { count, 'start-index': startIndex, ascending } }),
        getCurrencyList: customerIdentifier => instance.get(`${customerIdentifier}/currencies`),
        getCustomerBlock: (customerIdentifier, blockId) => instance.get(`${customerIdentifier}/blocks/${blockId}`),
        getCustomerBlocks: customerIdentifier => instance.get(`${customerIdentifier}/blocks`),
        // eslint-disable-next-line max-len
        getCustomerChildren: (customerIdentifier, { count, startIndex, ascending }) => instance.get(`${customerIdentifier}/children`, { params: { count, 'start-index': startIndex, ascending } }),
        getCustomerParent: customerIdentifier => instance.get(`${customerIdentifier}/parent`),
        getCustomerProfile: customerIdentifier => instance.get(`${customerIdentifier}/profile`),
        getCustomerRiskAlerts: customerIdentifier => instance.get(`${customerIdentifier}/risk/alerts`),
        getExchangeQuote: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/exchange/quote`, dto),
        getExchangeRates: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/exchange/rates`, dto),
        getExternalReference: (customerIdentifier, extRefId) => instance.get(`${customerIdentifier}/extrefs/${extRefId}`),
        // eslint-disable-next-line max-len
        getExternalReferenceAtTime: (customerIdentifier, time, partnerName) => instance.get(`${customerIdentifier}/extrefs/history/${time}`, { params: { 'partner-name': partnerName } }),
        // eslint-disable-next-line max-len
        getExternalReferenceHistory: (customerIdentifier, partnerName) => instance.get(`${customerIdentifier}/extrefs/history`, { params: { 'partner-name': partnerName } }),
        getExternalReferences: customerIdentifier => instance.get(`${customerIdentifier}/extrefs`),
        getFee: (customerIdentifier, feeEntryId) => instance.get(`${customerIdentifier}/fees/${feeEntryId}`),
        getFees: (customerIdentifier, currency) => instance.get(`${customerIdentifier}/fees`, { params: { currency } }),
        getISO8583Message: (customerIdentifier, isoMessageId) => instance.get(`${customerIdentifier}/iso8583/messages/${isoMessageId}`),
        // eslint-disable-next-line max-len
        getISO8583MessageByInboundMessageId: (customerIdentifier, inboundMessageId) => instance.get(`${customerIdentifier}/iso8583/messages/response/${inboundMessageId}`),
        getPendingTransaction: (customerIdentifier, pendingId) => instance.get(`${customerIdentifier}/transactions/pending/${pendingId}`),
        getPerson: (customerIdentifier, personId) => instance.get(`${customerIdentifier}/persons/${personId}`),
        getPersons: customerIdentifier => instance.get(`${customerIdentifier}/persons`),
        getReferenceBlocks: (customerIdentifier, extRefId) => instance.get(`${customerIdentifier}/extrefs/${extRefId}/blocks`),
        // eslint-disable-next-line max-len
        getRelatedChangeOrders: (customerIdentifier, transactionIdentifier) => instance.get(`${customerIdentifier}/transactions/${transactionIdentifier}/orders`),
        getRiskExceptions: customerIdentifier => instance.get(`${customerIdentifier}/risk/exception`),
        getRiskLevelHistory: customerIdentifier => instance.get(`${customerIdentifier}/risk/history`),
        getRiskMeasurements: customerIdentifier => instance.get(`${customerIdentifier}/risk/measurements`),
        // eslint-disable-next-line max-len
        getTransactionAlerts: (customerIdentifier, transactionIdentifier) => instance.get(`${customerIdentifier}/transactions/${transactionIdentifier}/alert`),
        // eslint-disable-next-line max-len
        getTransactionAttributes: (customerIdentifier, transactionIdentifier) => instance.get(`${customerIdentifier}/transactions/${transactionIdentifier}/attrs`),
        // eslint-disable-next-line max-len
        getTransactionByCallerReference: (customerIdentifier, callerReference) => instance.get(`${customerIdentifier}/transactions/callerReference/${callerReference}`),
        // eslint-disable-next-line max-len
        getTransactionById: (customerIdentifier, transactionIdentifier) => instance.get(`${customerIdentifier}/transactions/${transactionIdentifier}`),
        // eslint-disable-next-line max-len
        getTransactionEntry: (customerIdentifier, transactionEntryId) => instance.get(`${customerIdentifier}/transactionEntries/${transactionEntryId}`),
        // eslint-disable-next-line max-len
        getTransactionMessage: (customerIdentifier, transactionIdentifier) => instance.get(`${customerIdentifier}/transactions/${transactionIdentifier}/iso8583`),
        getWalletAuthorizations: (customerIdentifier, walletId) => instance.get(`${customerIdentifier}/wallets/${walletId}/authholds`),
        getWallets: customerIdentifier => instance.get(`${customerIdentifier}/wallets`),
        listAuthorizations: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/authholds/list`, dto),
        // eslint-disable-next-line object-curly-newline,max-len
        listMessages: (customerIdentifier, { startTime, endTime, transactionType, inbound, acquirer, terminal, success, sortField, count, startIndex, ascending }) => instance.get(`${customerIdentifier}/iso8583/messages`, { params: { 'start-time': startTime, 'end-time': endTime, 'transaction-type': transactionType, inbound, acquirer, terminal, success, 'sort-field': sortField, count, 'start-index': startIndex, ascending } }),
        // eslint-disable-next-line object-curly-newline,max-len
        listPendingTransactions: (customerIdentifier, { transactionState, transactionType, currentReleaseTime, releaseTime, startTime, endTime, externalReference, includeRequestingCustomerId, count, startIndex, ascending }) => instance.get(`${customerIdentifier}/transactions/pending`, { params: { 'transaction-state': transactionState, 'transaction-type': transactionType, 'current-release-time': currentReleaseTime, 'release-time': releaseTime, 'start-time': startTime, 'end-time': endTime, 'external-reference': externalReference, 'include-requesting-customer-id': includeRequestingCustomerId, count, 'start-index': startIndex, ascending } }),
        listReferenceAttributes: (customerIdentifier, extRefId) => instance.get(`${customerIdentifier}/extrefs/${extRefId}/attributes/`),
        // eslint-disable-next-line object-curly-newline,max-len
        listTransactionEntries: (customerIdentifier, { startTime, endTime, transactionType, extRefId, transactionSource, currency, minAmount, maxAmount, count, startIndex, ascending }) => instance.get(`${customerIdentifier}/transactionEntries`, { params: { 'start-time': startTime, 'end-time': endTime, 'transaction-type': transactionType, 'ext-ref-id': extRefId, 'transaction-source': transactionSource, currency, 'min-amount': minAmount, 'max-amount': maxAmount, count, 'start-index': startIndex, ascending } }),
        // eslint-disable-next-line object-curly-newline,max-len
        listTransactions: (customerIdentifier, { count, startIndex, ascending, startTime, endTime, transactionType, extRefId, transactionSource, currency }) => instance.get(`${customerIdentifier}/transactions`, { params: { count, 'start-index': startIndex, ascending, 'start-time': startTime, 'end-time': endTime, 'transaction-type': transactionType, 'ext-ref-id': extRefId, 'transaction-source': transactionSource, currency } }),
        orderPersonalized: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/cards/order`, dto),
        passcodeReset: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/passcode/reset`, dto),
        passwordReset: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/password/reset`, dto),
        releaseAuthorization: (customerIdentifier, authorizationId) => instance.put(`${customerIdentifier}/authholds/${authorizationId}`),
        releaseCustomerBlock: (customerIdentifier, blockId) => instance.post(`${customerIdentifier}/blocks/${blockId}/release`),
        reopenAccount: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/reopenAccount`, dto),
        safeDraft: (customerIdentifier, currency, dto) => instance.post(`${customerIdentifier}/safeDraft/${currency}`, dto),
        safeDraft2: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/safeDraft`, dto),
        search: dto => instance.post('search', dto),
        sendCustomerActivation: (customerIdentifier, dto) => instance.post(`${customerIdentifier}/send/activation`, dto),
        unlockCustomerProfile: customerIdentifier => instance.put(`${customerIdentifier}/profile/unlock`),
        updateCustomer: (customerIdentifier, dto) => instance.put(`${customerIdentifier}`, dto),
        updateCustomerProfile: (customerIdentifier, dto) => instance.put(`${customerIdentifier}/profile`, dto),
        updateExternalReference: (customerIdentifier, extRefId, dto) => instance.put(`${customerIdentifier}/extrefs/${extRefId}`, dto),
        validateCustomer: dto => instance.post('validate', dto),
    };
};

export default CustomerAPI;
