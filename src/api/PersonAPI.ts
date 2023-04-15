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
import axios from "axios";
import wrapper from "axios-cache-plugin";

const PersonAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;
  const instance = axios.create({
    baseURL: `${partnerEndpoint}/v1/persons/`,
    ...others,
  });
  const httpProxy = wrapper(instance, {
    maxCacheSize: 15,
  });

  return {
    interceptors: instance.interceptors,
    get: (personIdentifier: any) => httpProxy.get(`${personIdentifier}`),
    getAddress: (personIdentifier: any) =>
      httpProxy.get(`${personIdentifier}/addresses`),
    getEmailList: (personIdentifier: any) =>
      httpProxy.get(`${personIdentifier}/emails`),
    getPhones: (personIdentifier: any) =>
      httpProxy.get(`${personIdentifier}/phones`),
    getOfficialIds: (personIdentifier: any) =>
      httpProxy.get(`${personIdentifier}/official-ids`),
    getNameHistory: (personIdentifier: any) =>
      httpProxy.get(`${personIdentifier}/person/history`),
    getPhoneHistory: (personIdentifier: any) =>
      httpProxy.get(`${personIdentifier}/phones/history`),
    getEmailHistory: (personIdentifier: any) =>
      httpProxy.get(`${personIdentifier}/emails/history`),
    getAddressHistory: (personIdentifier: any) =>
      httpProxy.get(`${personIdentifier}/addresses/history`),
    getIdentificationHistory: (personIdentifier: any) =>
      httpProxy.get(`${personIdentifier}/official-ids/history`),
    update: (personIdentifier: any, dto: any) =>
      httpProxy.post(`${personIdentifier}`, dto),
    updateAddress: (personIdentifier: any, dto: any) =>
      httpProxy.post(`${personIdentifier}/addresses`, dto),
    updateEmail: (personIdentifier: any, dto: any) =>
      httpProxy.post(`${personIdentifier}/emails`, dto),
    updatePhone: (personIdentifier: any, dto: any) =>
      httpProxy.post(`${personIdentifier}/phones`, dto),
    updateOfficialId: (personIdentifier: any, dto: any) =>
      httpProxy.post(`${personIdentifier}/official-ids`, dto),
    deleteAddress: (personIdentifier: any, addressId: string) =>
      httpProxy.delete(`${personIdentifier}/addresses/` + addressId),
    deleteEmail: (personIdentifier: any, emailId: string) =>
      httpProxy.delete(`${personIdentifier}/emails/` + emailId),
    deletePhone: (personIdentifier: any, phoneId: string) =>
      httpProxy.delete(`${personIdentifier}/phones/` + phoneId),
    deleteOfficialId: (personIdentifier: any, officialId: string) =>
      httpProxy.delete(`${personIdentifier}/official-ids/` + officialId),
  };
};

export default PersonAPI;
