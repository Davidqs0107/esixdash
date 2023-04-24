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

const UserAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/users/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    blockUser: (partnerUserId: any) => instance.post(`${partnerUserId}/lock`),
    changePassword: (dto: any) => instance.post("changepassword", dto),
    create: (dto: any) => instance.post("", dto),
    get: (partnerUserId: any) => instance.get(`${partnerUserId}`),
    getRoles: (partnerUserId: any) => instance.get(`${partnerUserId}/roles`),
    getStores: (partnerUserId: any) => instance.get(`${partnerUserId}/stores`),
    // eslint-disable-next-line object-curly-newline,max-len
    list: ({
      userName,
      first,
      last,
      role,
      state,
      count,
      startIndex,
      ascending,
      inactiveLast,
    }: any) =>
      instance.get("", {
        params: {
          "user-name": userName,
          first,
          last,
          role,
          state,
          count,
          "start-index": startIndex,
          ascending,
          inactiveLast,
        },
      }),
    unlockUser: (partnerUserId: any) =>
      instance.post(`${partnerUserId}/unlock`),
    update: (partnerUserId: any, dto: any) =>
      instance.post(`${partnerUserId}`, dto),
    updateRoles: (partnerUserId: any, dto: any) =>
      instance.post(`${partnerUserId}/roles`, dto),
    updateStores: (partnerUserId: any, dto: any) =>
      instance.post(`${partnerUserId}/stores`, dto),
    getAssignableRoles: () => instance.get(`/roles/assignment`),
  };
};

export default UserAPI;
