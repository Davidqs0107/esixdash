/*
 * Copyright (c) 2019-2023, Episode Six and/or its affiliates. All rights reserved.
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

const CustomerGraphAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/customer-graphs/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    createInwardCustomerGraph: (
      customerIdentifier: any,
      fromCustomerIdentifier: any,
      name: any,
      dto: any
    ) =>
      instance.post(
        `${customerIdentifier}/inward/${fromCustomerIdentifier}/${name}`,
        dto
      ),
    createOutwardCustomerGraph: (
      customerIdentifier: any,
      toCustomerIdentifier: any,
      name: any,
      dto: any
    ) =>
      instance.post(
        `${customerIdentifier}/outward/${toCustomerIdentifier}/${name}`,
        dto
      ),
    deleteCustomerGraph: (customerGraphIdentifier: any) =>
      instance.delete(`/${customerGraphIdentifier}`),
    getAvailableCustomerPlugins: (customerIdentifier: any) =>
      instance.get(`${customerIdentifier}/available`),
    getCustomerGraph: (customerGraphIdentifier: any) =>
      instance.get(`${customerGraphIdentifier}`),
    getInwardCustomerGraphs: (customerIdentifier: any) =>
      instance.get(`${customerIdentifier}/inward`),
    getInwardCustomerGraphsByName: (customerIdentifier: any, name: any) =>
      instance.get(`${customerIdentifier}/inward/${name}`),
    getOutwardCustomerGraphs: (customerIdentifier: any) =>
      instance.get(`${customerIdentifier}/outward`),
    getOutwardCustomerGraphsByName: (customerIdentifier: any, name: any) =>
      instance.get(`${customerIdentifier}/outward/${name}`),
    updateCustomerGraph: (customerGraphIdentifier: any, dto: any) =>
      instance.put(`/${customerGraphIdentifier}`, dto),
  };
};

export default CustomerGraphAPI;
