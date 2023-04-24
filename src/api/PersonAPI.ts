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

const PersonAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/persons/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    get: (personIdentifier: any) => instance.get(`${personIdentifier}`),
    getAddress: (personIdentifier: any) =>
      instance.get(`${personIdentifier}/addresses`),
    getEmailList: (personIdentifier: any) =>
      instance.get(`${personIdentifier}/emails`),
    getPhones: (personIdentifier: any) =>
      instance.get(`${personIdentifier}/phones`),
    getOfficialIds: (personIdentifier: any) =>
      instance.get(`${personIdentifier}/official-ids`),
    getNameHistory: (personIdentifier: any) =>
      instance.get(`${personIdentifier}/person/history`),
    getPhoneHistory: (personIdentifier: any) =>
      instance.get(`${personIdentifier}/phones/history`),
    getEmailHistory: (personIdentifier: any) =>
      instance.get(`${personIdentifier}/emails/history`),
    getAddressHistory: (personIdentifier: any) =>
      instance.get(`${personIdentifier}/addresses/history`),
    getIdentificationHistory: (personIdentifier: any) =>
      instance.get(`${personIdentifier}/official-ids/history`),
    update: (personIdentifier: any, dto: any) =>
      instance.post(`${personIdentifier}`, dto),
    updateAddress: (personIdentifier: any, dto: any) =>
      instance.post(`${personIdentifier}/addresses`, dto),
    updateEmail: (personIdentifier: any, dto: any) =>
      instance.post(`${personIdentifier}/emails`, dto),
    updatePhone: (personIdentifier: any, dto: any) =>
      instance.post(`${personIdentifier}/phones`, dto),
    updateOfficialId: (personIdentifier: any, dto: any) =>
      instance.post(`${personIdentifier}/official-ids`, dto),
    deleteAddress: (personIdentifier: any, addressId: string) =>
      instance.delete(`${personIdentifier}/addresses/` + addressId),
    deleteEmail: (personIdentifier: any, emailId: string) =>
      instance.delete(`${personIdentifier}/emails/` + emailId),
    deletePhone: (personIdentifier: any, phoneId: string) =>
      instance.delete(`${personIdentifier}/phones/` + phoneId),
    deleteOfficialId: (personIdentifier: any, officialId: string) =>
      instance.delete(`${personIdentifier}/official-ids/` + officialId),
  };
};

export default PersonAPI;
