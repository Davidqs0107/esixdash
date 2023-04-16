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

import { createCache, apiUtil } from '@e6tech/api-base';
import CardAPI from './CardAPI';
import CommonAPI from './CommonAPI';
import MobileAuthAPI from './MobileAuthAPI';
import CustomerAPI from './CustomerAPI';
import MobileActionAPI from './MobileActionAPI';
import MobileHierarchyAPI from './MobileHierarchyAPI';
import MobileNotificationAPI from './MobileNotificationAPI';

const {
    authToken, initApi, saveTokenId, reqRejected,
} = apiUtil;


const provideAuth = {
    MobileAuthAPI,
};

const requireAuth = {
    MobileActionAPI,
    CustomerAPI,
    CardAPI,
    MobileNotificationAPI,
    MobileHierarchyAPI,
};

const noAuthRequired = {
    CommonAPI,
};

export const mobileAuthSessionKey = 'mobileApiToken';

const apiByUrl = {};

const get = (baseURL) => {
    if (baseURL in apiByUrl) return apiByUrl[baseURL];

    const internalMobile = {};

    const basicConfig = {
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    // eslint-disable-next-line no-undef
    internalMobile.isLoggedIn = () => sessionStorage.getItem(mobileAuthSessionKey) != null;

    const onLogoutFunctions = [];
    internalMobile.logout = () => {
        onLogoutFunctions.forEach(l => l());
        // eslint-disable-next-line no-undef
        sessionStorage.removeItem(mobileAuthSessionKey);
    };

    initApi(internalMobile, provideAuth, basicConfig, (api) => {
        api.interceptors.response.use(saveTokenId(mobileAuthSessionKey));
        api.interceptors.response.use(r => r.data);
    });
    initApi(internalMobile, requireAuth, basicConfig, (api) => {
        api.interceptors.request.use(authToken(mobileAuthSessionKey));
        api.interceptors.response.use(r => r.data, reqRejected(internalMobile.logout));
    });
    initApi(internalMobile, noAuthRequired, basicConfig, (api) => {
        api.interceptors.response.use(r => r.data);
    });


    const mobile = createCache(internalMobile, {
        expiry: 15 * 60 * 1000,
        allowCache: [
            /CommonAPI/,
            /MobileAuthAPI\.getPartnerProgramNames/,
            /CustomerAPI\.get$/,
        ],
    });
    onLogoutFunctions.push(() => mobile.invalidateCache());


    apiByUrl[baseURL] = mobile;

    return mobile;
};

export { get };
