/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
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
import { setup } from "axios-cache-adapter";

const CustomerAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/customers/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    activity: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/activity`),
    addPerson: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/persons`, dto),
    adjust: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/adjustments`, dto),
    attachCardApproval: (customerIdentifier: string, personId: any) =>
      instance.post(
        `${customerIdentifier}/persons/${personId}/attachCardApproval`
      ),
    closeAccount: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/closeAccount`, dto),
    confirmWalletTransfer: (customerIdentifier: string, dto: any) =>
      instance.put(`${customerIdentifier}/wallets/transfer/confirm`, dto),
    createCustomerBlock: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/blocks`, dto),
    createCustomerProfile: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/profile`, dto),
    createExtRef: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/extrefs`, dto),
    createOrUpdateFee: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/fees`, dto),
    // eslint-disable-next-line max-len
    createOrUpdateReferenceAttribute: (
      customerIdentifier: string,
      extRefId: any,
      dto: any
    ) =>
      instance.post(
        `${customerIdentifier}/extrefs/${extRefId}/attributes/`,
        dto
      ),
    createRiskException: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/risk/exception`, dto),
    deleteExternalReference: (customerIdentifier: string, extRefId: any) =>
      instance.delete(`${customerIdentifier}/extrefs/${extRefId}`),
    deleteFee: (customerIdentifier: string, feeEntryId: any) =>
      instance.delete(`${customerIdentifier}/fees/${feeEntryId}`),
    // eslint-disable-next-line max-len
    deleteReferenceAttribute: (
      customerIdentifier: string,
      extRefId: any,
      attributeName: any
    ) =>
      instance.delete(
        `${customerIdentifier}/extrefs/${extRefId}/attributes/${attributeName}`
      ),
    deleteRiskException: (customerIdentifier: string, riskExceptionId: any) =>
      instance.delete(
        `${customerIdentifier}/risk/exception/${riskExceptionId}`
      ),
    get: (customerIdentifier: string) => instance.get(`${customerIdentifier}`),
    getAuthorization: (customerIdentifier: string, authorizationId: any) =>
      instance.get(`${customerIdentifier}/authholds/${authorizationId}`),
    getAuthorizations: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/authholds`),
    // eslint-disable-next-line object-curly-newline,max-len
    getAuthorizationsPaginated: (
      customerIdentifier: string,
      {
        startTime,
        endTime,
        mode,
        currency,
        minAmount,
        maxAmount,
        count,
        startIndex,
        ascending,
      }: any
    ) =>
      instance.get(`${customerIdentifier}/authholds/page`, {
        params: {
          "start-time": startTime,
          "end-time": endTime,
          mode,
          currency,
          "min-amount": minAmount,
          "max-amount": maxAmount,
          count,
          "start-index": startIndex,
          ascending,
        },
      }),
    getCards: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/cards`),
    // eslint-disable-next-line max-len
    getCardsPaginated: (
      customerIdentifier: string,
      { count, startIndex, ascending }: any
    ) =>
      instance.get(`${customerIdentifier}/cards/paginated`, {
        params: { count, "start-index": startIndex, ascending },
      }),
    getCurrencyList: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/currencies`),
    getCustomerBlock: (customerIdentifier: string, blockId: any) =>
      instance.get(`${customerIdentifier}/blocks/${blockId}`),
    getCustomerBlocks: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/blocks`),
    // eslint-disable-next-line max-len
    getCustomerChildren: (
      customerIdentifier: string,
      { count, startIndex, ascending }: any
    ) =>
      instance.get(`${customerIdentifier}/children`, {
        params: { count, "start-index": startIndex, ascending },
      }),
    getCustomerParent: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/parent`),
    getCustomerProfile: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/profile`),
    getCustomerRiskAlerts: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/risk/alerts`),
    getExchangeQuote: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/exchange/quote`, dto),
    getExchangeRates: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/exchange/rates`, dto),
    getExternalReference: (customerIdentifier: string, extRefId: any) =>
      instance.get(`${customerIdentifier}/extrefs/${extRefId}`),
    // eslint-disable-next-line max-len
    getExternalReferenceAtTime: (
      customerIdentifier: string,
      time: any,
      partnerName: any
    ) =>
      instance.get(`${customerIdentifier}/extrefs/history/${time}`, {
        params: { "partner-name": partnerName },
      }),
    // eslint-disable-next-line max-len
    getExternalReferenceHistory: (
      customerIdentifier: string,
      partnerName: any
    ) =>
      instance.get(`${customerIdentifier}/extrefs/history`, {
        params: { "partner-name": partnerName },
      }),
    getExternalReferences: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/extrefs`),
    getFee: (customerIdentifier: string, feeEntryId: any) =>
      instance.get(`${customerIdentifier}/fees/${feeEntryId}`),
    getFees: (customerIdentifier: string, currency: any) =>
      instance.get(`${customerIdentifier}/fees`, { params: { currency } }),
    getISO8583Message: (customerIdentifier: string, isoMessageId: any) =>
      instance.get(`${customerIdentifier}/iso8583/messages/${isoMessageId}`),
    // eslint-disable-next-line max-len
    getISO8583MessageByInboundMessageId: (
      customerIdentifier: string,
      inboundMessageId: any
    ) =>
      instance.get(
        `${customerIdentifier}/iso8583/messages/response/${inboundMessageId}`
      ),
    getPendingTransaction: (customerIdentifier: string, pendingId: any) =>
      instance.get(`${customerIdentifier}/transactions/pending/${pendingId}`),
    getPerson: (customerIdentifier: string, personId: any) =>
      instance.get(`${customerIdentifier}/persons/${personId}`),
    getPersons: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/persons`),
    getReferenceBlocks: (customerIdentifier: string, extRefId: any) =>
      instance.get(`${customerIdentifier}/extrefs/${extRefId}/blocks`),
    // eslint-disable-next-line max-len
    getRelatedChangeOrders: (
      customerIdentifier: string,
      transactionIdentifier: any
    ) =>
      instance.get(
        `${customerIdentifier}/transactions/${transactionIdentifier}/orders`
      ),
    getRiskExceptions: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/risk/exception`),
    getRiskLevelHistory: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/risk/history`),
    getRiskMeasurements: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/risk/measurements`),
    // eslint-disable-next-line max-len
    getTransactionAlerts: (
      customerIdentifier: string,
      transactionIdentifier: any
    ) =>
      instance.get(
        `${customerIdentifier}/transactions/${transactionIdentifier}/alert`
      ),
    // eslint-disable-next-line max-len
    getTransactionAttributes: (
      customerIdentifier: string,
      transactionIdentifier: any
    ) =>
      instance.get(
        `${customerIdentifier}/transactions/${transactionIdentifier}/attrs`
      ),
    // eslint-disable-next-line max-len
    getTransactionByCallerReference: (
      customerIdentifier: string,
      callerReference: any
    ) =>
      instance.get(
        `${customerIdentifier}/transactions/callerReference/${callerReference}`
      ),
    getTransactionById: (
      customerIdentifier: string,
      transactionIdentifier: any
    ) =>
      instance.get(
        `${customerIdentifier}/transactions/${transactionIdentifier}`
      ),
    getTransactionEntry: (
      customerIdentifier: string,
      transactionEntryId: any
    ) =>
      instance.get(
        `${customerIdentifier}/transactionEntries/${transactionEntryId}`
      ),
    // eslint-disable-next-line max-len
    getTransactionMessage: (
      customerIdentifier: string,
      transactionIdentifier: any
    ) =>
      instance.get(
        `${customerIdentifier}/transactions/${transactionIdentifier}/iso8583`
      ),
    getWalletAuthorizations: (customerIdentifier: string, walletId: any) =>
      instance.get(`${customerIdentifier}/wallets/${walletId}/authholds`),
    getWallets: (customerIdentifier: string) =>
      instance.get(`${customerIdentifier}/wallets`),
    listAuthorizations: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/authholds/list`, dto),
    // eslint-disable-next-line object-curly-newline,max-len
    listMessages: (
      customerIdentifier: string,
      {
        startTime,
        endTime,
        transactionType,
        inbound,
        acquirer,
        terminal,
        success,
        sortField,
        count,
        startIndex,
        ascending,
      }: any
    ) =>
      instance.get(`${customerIdentifier}/iso8583/messages`, {
        params: {
          "start-time": startTime,
          "end-time": endTime,
          "transaction-type": transactionType,
          inbound,
          acquirer,
          terminal,
          success,
          "sort-field": sortField,
          count,
          "start-index": startIndex,
          ascending,
        },
      }),
    // eslint-disable-next-line object-curly-newline,max-len
    listPendingTransactions: (
      customerIdentifier: string,
      {
        transactionState,
        transactionType,
        currentReleaseTime,
        releaseTime,
        startTime,
        endTime,
        externalReference,
        includeRequestingCustomerId,
        count,
        startIndex,
        ascending,
      }: any
    ) =>
      instance.get(`${customerIdentifier}/transactions/pending`, {
        params: {
          "transaction-state": transactionState,
          "transaction-type": transactionType,
          "current-release-time": currentReleaseTime,
          "release-time": releaseTime,
          "start-time": startTime,
          "end-time": endTime,
          "external-reference": externalReference,
          "include-requesting-customer-id": includeRequestingCustomerId,
          count,
          "start-index": startIndex,
          ascending,
        },
      }),
    listReferenceAttributes: (customerIdentifier: string, extRefId: any) =>
      instance.get(`${customerIdentifier}/extrefs/${extRefId}/attributes/`),
    // eslint-disable-next-line object-curly-newline,max-len
    listTransactionEntries: (
      customerIdentifier: string,
      {
        startTime,
        endTime,
        transactionType,
        extRefId,
        transactionSource,
        currency,
        minAmount,
        maxAmount,
        count,
        startIndex,
        ascending,
      }: any
    ) =>
      instance.get(`${customerIdentifier}/transactionEntries`, {
        params: {
          "start-time": startTime,
          "end-time": endTime,
          "transaction-type": transactionType,
          "ext-ref-id": extRefId,
          "transaction-source": transactionSource,
          currency,
          "min-amount": minAmount,
          "max-amount": maxAmount,
          count,
          "start-index": startIndex,
          ascending,
        },
      }),
    // eslint-disable-next-line object-curly-newline,max-len
    listTransactions: (
      customerIdentifier: string,
      {
        count,
        startIndex,
        ascending,
        startTime,
        endTime,
        transactionType,
        extRefId,
        transactionSource,
        currency,
      }: any
    ) =>
      instance.get(`${customerIdentifier}/transactions`, {
        params: {
          count,
          "start-index": startIndex,
          ascending,
          "start-time": startTime,
          "end-time": endTime,
          "transaction-type": transactionType,
          "ext-ref-id": extRefId,
          "transaction-source": transactionSource,
          currency,
        },
      }),
    orderPersonalized: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/cards/order`, dto),
    passcodeReset: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/passcode/reset`, dto),
    passwordReset: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/password/reset`, dto),
    releaseAuthorization: (customerIdentifier: string, authorizationId: any) =>
      instance.put(`${customerIdentifier}/authholds/${authorizationId}`),
    // eslint-disable-next-line max-len
    releaseAuthorizationWithMemo: (
      customerIdentifier: string,
      authorizationId: any,
      dto: any
    ) =>
      instance.put(
        `${customerIdentifier}/authholds/${authorizationId}/release`,
        dto
      ),
    releaseCustomerBlock: (customerIdentifier: string, blockId: any) =>
      instance.post(`${customerIdentifier}/blocks/${blockId}/release`),
    releaseCustomerBlockWithMemo: (
      customerIdentifier: string,
      blockId: any,
      dto: any
    ) => instance.post(`${customerIdentifier}/blocks/${blockId}`, dto),
    reopenAccount: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/reopenAccount`, dto),
    safeDraft: (customerIdentifier: string, currency: any, dto: any) =>
      instance.post(`${customerIdentifier}/safeDraft/${currency}`, dto),
    safeDraft2: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/safeDraft`, dto),
    search: (dto: any) => instance.post("search", dto),
    searchByName: (dto: any) => instance.post("search/name", dto),
    searchByCustomerNumber: (dto: any) =>
      instance.post("search/customernumber", dto),
    searchByExternalReference: (dto: any) =>
      instance.post("search/externalreference", dto),
    searchByCard: (dto: any) => instance.post("search/cardnumber", dto),
    searchByPAN: (dto: any) => instance.post("search/pan", dto),
    sendCustomerActivation: (customerIdentifier: string, dto: any) =>
      instance.post(`${customerIdentifier}/send/activation`, dto),
    unlockCustomerProfile: (customerIdentifier: string) =>
      instance.put(`${customerIdentifier}/profile/unlock`),
    updateCustomer: (customerIdentifier: string, dto: any) =>
      instance.put(`${customerIdentifier}`, dto),
    updateCustomerProfile: (customerIdentifier: string, dto: any) =>
      instance.put(`${customerIdentifier}/profile`, dto),
    updateExternalReference: (
      customerIdentifier: string,
      extRefId: any,
      dto: any
    ) => instance.put(`${customerIdentifier}/extrefs/${extRefId}`, dto),
    validateCustomer: (dto: any) => instance.post("validate", dto),
    // eslint-disable-next-line max-len
    getAllCardCustomerBlocksPaginated: (
      customerIdentifier: string,
      { count, startIndex, ascending, activeOnly, singleUse }: any
    ) =>
      instance.get(`${customerIdentifier}/blocks/paginated`, {
        params: {
          count,
          "start-index": startIndex,
          ascending,
          activeOnly,
          singleUse,
        },
      }),
  };
};

export default CustomerAPI;
