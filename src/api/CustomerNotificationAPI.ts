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

const CustomerNotificationAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/customers/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    createCustomerConfiguration: (customerIdentifier: any, dto: any) =>
      instance.post(`${customerIdentifier}/notifications`, dto),
    deleteCustomerConfiguration: (customerIdentifier: any, dto: any) =>
      instance.put(`${customerIdentifier}/notifications/delete`, dto),
    getCustomerAvailableConfigurations: (customerIdentifier: any) =>
      instance.get(`${customerIdentifier}/notifications/available`),
    getCustomerConfigurations: (customerIdentifier: any) =>
      instance.get(`${customerIdentifier}/notifications`),
    updateCustomerConfiguration: (customerIdentifier: any, dto: any) =>
      instance.put(`${customerIdentifier}/notifications`, dto),
  };
};

export default CustomerNotificationAPI;
