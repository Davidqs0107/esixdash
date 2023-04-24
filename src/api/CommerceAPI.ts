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
import { setup } from "axios-cache-adapter";

const CommerceAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/commerce/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    attachCard: (customerIdentifier: any, approvalNumber: any, dto: any) =>
      instance.post(
        `customers/${customerIdentifier}/attachCard/${approvalNumber}`,
        dto
      ),
    create: (dto: any) => instance.post("accounts", dto),
    estimateCreate: (dto: any) => instance.put("accounts/estimate", dto),
    estimateLoad: (customerIdentifier: any, dto: any) =>
      instance.put(`customers/${customerIdentifier}/load/estimate`, dto),
    // eslint-disable-next-line max-len
    estimateP2P: (
      customerIdentifier: any,
      { fromCurrency, amount, toCustomerNumber }: any
    ) =>
      instance.put(`customers/${customerIdentifier}/p2p/estimate`, {
        params: {
          "from-currency": fromCurrency,
          amount,
          "to-customer-number": toCustomerNumber,
        },
      }),
    // eslint-disable-next-line max-len
    estimatePurchase: (
      customerIdentifier: any,
      { fromCurrency, amount }: any
    ) =>
      instance.put(`customers/${customerIdentifier}/purchase/estimate`, {
        params: { "from-currency": fromCurrency, amount },
      }),
    // eslint-disable-next-line max-len
    estimateWithdraw: (
      customerIdentifier: any,
      { fromCurrency, amount }: any
    ) =>
      instance.put(`customers/${customerIdentifier}/withdraw/estimate`, {
        params: { "from-currency": fromCurrency, amount },
      }),
    load: (customerIdentifier: any, dto: any) =>
      instance.post(`customers/${customerIdentifier}/load`, dto),
    // eslint-disable-next-line max-len
    p2p: (
      customerIdentifier: any,
      { fromCurrency, amount, toCustomerNumber }: any
    ) =>
      instance.post(`customers/${customerIdentifier}/p2p`, {
        params: {
          "from-currency": fromCurrency,
          amount,
          "to-customer-number": toCustomerNumber,
        },
      }),
    // eslint-disable-next-line max-len
    purchase: (customerIdentifier: any, { fromCurrency, amount }: any) =>
      instance.post(`customers/${customerIdentifier}/purchase`, {
        params: { "from-currency": fromCurrency, amount },
      }),
    // eslint-disable-next-line max-len
    reversal: (customerIdentifier: any, transactionId: any) =>
      instance.post(`customers/${customerIdentifier}/reversal`, {
        params: { "transaction-id": transactionId },
      }),
    // eslint-disable-next-line max-len
    withdraw: (customerIdentifier: any, { fromCurrency, amount }: any) =>
      instance.post(`customers/${customerIdentifier}/withdraw`, {
        params: { "from-currency": fromCurrency, amount },
      }),
  };
};

export default CommerceAPI;
