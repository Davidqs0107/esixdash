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

import axios from "axios";

/* Importing from 'axios-cache-plugin' used the axios-cache-plugin/dist/index.js file. This file does not have all
*  the functions as the non-minified version (i.e. does not have the __clearCache() method). To be able to use
*  __addFilter for caching we'll need to use __clearCache() to remove the cached data when logging out.
*/
import wrapper from "axios-cache-plugin/src";

const CurrentUserAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;
  const instance = axios.create({
    baseURL: `${partnerEndpoint}/v1/`,
    ...others,
  });
  const httpProxy = wrapper(instance, {
    maxCacheSize: 15,
  });

  // eslint-disable-next-line no-underscore-dangle
  httpProxy.__addFilter(/me/); // Cached

  return {
    interceptors: instance.interceptors,
    changePassword: (dto: any) => instance.post("changepassword", dto),
    getCurrentUserInfo: () => httpProxy.get("me"),
    logout: () => instance.get("logout"),
    clearCache: () => httpProxy.__clearCache()
  };
};

export default CurrentUserAPI;
