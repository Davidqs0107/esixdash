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

const CustomerAttributeAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/customers/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    createCustomerAttribute: (customerIdentifier: any, dto: any) =>
      instance.post(`${customerIdentifier}/attrs`, dto),
    deleteCustomerAttribute: (customerIdentifier: any, customerAttrId: any) =>
      instance.delete(`${customerIdentifier}/attrs/${customerAttrId}`),
    getCustomerAttribute: (customerIdentifier: any, customerAttrId: any) =>
      instance.get(`${customerIdentifier}/attrs/${customerAttrId}`),
    getCustomerAttributes: (customerIdentifier: any) =>
      instance.get(`${customerIdentifier}/attrs`),
    updateCustomerAttribute: (
      customerIdentifier: any,
      customerAttrId: any,
      dto: any
    ) => instance.put(`${customerIdentifier}/attrs/${customerAttrId}`, dto),
  };
};

export default CustomerAttributeAPI;
