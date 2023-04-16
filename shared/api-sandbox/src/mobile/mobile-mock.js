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
import MobileMockAPI from './MobileMockAPI';

const {
    authToken, initApi, reqRejected,
} = apiUtil;

const basicConfig = {
    baseURL: '',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
};

const requireAuth = {
    MobileMockAPI,
};

export const mobileAuthSessionKey = 'mobileApiToken';


const apiByUrl = {};

const get = (baseURL) => {
    if (baseURL in apiByUrl) return apiByUrl[baseURL];


    const internalMobileMock = {};


    // eslint-disable-next-line no-undef
    internalMobileMock.isLoggedIn = () => sessionStorage.getItem(mobileAuthSessionKey) != null;

    const onLogoutFunctions = [];
    internalMobileMock.logout = () => {
        onLogoutFunctions.forEach(l => l());
        // eslint-disable-next-line no-undef
        sessionStorage.removeItem(mobileAuthSessionKey);
    };

    initApi(internalMobileMock, requireAuth, basicConfig, (api) => {
        api.interceptors.request.use(authToken(mobileAuthSessionKey));
        api.interceptors.response.use(r => r.data, reqRejected(internalMobileMock.logout));
    });

    const mobilemock = createCache(internalMobileMock, {
        expiry: 15 * 60 * 1000,
        allowCache: [
            /MobileMockAPI/,
        ],
    });
    onLogoutFunctions.push(() => mobilemock.invalidateCache());


    apiByUrl[baseURL] = mobilemock;

    return mobilemock;
};

export { get };
