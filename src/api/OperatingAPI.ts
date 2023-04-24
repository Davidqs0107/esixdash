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

const OperatingAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/programs/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    addExchange: (programName: any, exchangeName: any) =>
      instance.post(
        `${encodeURIComponent(programName)}/exchanges/${exchangeName}`
      ),
    create: (dto: any) => instance.post("", dto),
    createCustodialAccount: (programName: any, dto: any) =>
      instance.post(`${encodeURIComponent(programName)}/custodial`, dto),
    get: (programName: any) =>
      instance.get(`${encodeURIComponent(programName)}`),
    getCustodialPortfolioAccount: (programName: any, currency: any) =>
      instance.get(`${encodeURIComponent(programName)}/custodial/${currency}`),
    getCustodialPortfolioAccountList: (programName: any) =>
      instance.get(`${encodeURIComponent(programName)}/custodial`),
    getExchanges: (programName: any) =>
      instance.get(`${encodeURIComponent(programName)}/exchanges`),
    getInvoice: (programName: any, invoiceId: any) =>
      instance.get(`${encodeURIComponent(programName)}/invoices/${invoiceId}`),
    getInvoiceSummaries: (programName: any, invoiceId: any) =>
      instance.get(
        `${encodeURIComponent(programName)}/invoices/${invoiceId}/summaries`
      ),
    // eslint-disable-next-line max-len
    getInvoiceSummary: (
      programName: any,
      invoiceId: any,
      invoiceSummaryId: any
    ) =>
      instance.get(
        `${encodeURIComponent(
          programName
        )}/invoices/${invoiceId}/summaries/${invoiceSummaryId}`
      ),
    // eslint-disable-next-line object-curly-newline,max-len
    getInvoices: (
      programName: any,
      currency: any,
      { state, count, startIndex, ascending }: any
    ) =>
      instance.get(
        `${encodeURIComponent(programName)}/custodial/${currency}/invoices`,
        {
          params: { state, count, "start-index": startIndex, ascending },
        }
      ),
    getProgramReport: (programName: any) =>
      instance.get(`${encodeURIComponent(programName)}/report`),
    list: () => instance.get(""),
    // eslint-disable-next-line max-len
    listInvoices: (programName: any, { count, startIndex, ascending }: any) =>
      instance.get(`${encodeURIComponent(programName)}/invoices`, {
        params: { count, "start-index": startIndex, ascending },
      }),
    removeExchange: (programName: any, exchangeName: any) =>
      instance.delete(
        `${encodeURIComponent(programName)}/exchanges/${exchangeName}`
      ),
    // eslint-disable-next-line max-len
    updateInvoiceSummary: (
      programName: any,
      invoiceId: any,
      invoiceSummaryId: any,
      dto: any
    ) =>
      instance.post(
        `${encodeURIComponent(
          programName
        )}/invoices/${invoiceId}/summaries/${invoiceSummaryId}`,
        dto
      ),
    updateProgramReport: (programName: any, dto: any) =>
      instance.post(`${encodeURIComponent(programName)}/report`, dto),
  };
};

export default OperatingAPI;
