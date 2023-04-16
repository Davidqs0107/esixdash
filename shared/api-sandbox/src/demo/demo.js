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
import SwitchSimulatorAPI from './SwitchSimulatorAPI';
import PartnerSandboxAPI from './PartnerSandboxAPI';

const {
    authToken, initApi, saveTokenId, reqRejected,
} = apiUtil;


const provideAuth = {};

const requireAuth = {
    PartnerSandboxAPI,
    SwitchSimulatorAPI,
};

const noAuthRequired = {};

export const sandboxAuthSessionKey = 'sandboxApiToken';

const apiByUrl = {};

const get = (baseURL) => {
    if (baseURL in apiByUrl) return apiByUrl[baseURL];

    const internalSandbox = {};

    const basicConfig = {
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    // eslint-disable-next-line no-undef
    internalSandbox.isLoggedIn = () => sessionStorage.getItem(sandboxAuthSessionKey) != null;

    const onLogoutFunctions = [];
    internalSandbox.logout = () => {
        onLogoutFunctions.forEach(l => l());
        // eslint-disable-next-line no-undef
        sessionStorage.removeItem(sandboxAuthSessionKey);
    };

    initApi(internalSandbox, provideAuth, basicConfig, (api) => {
        api.interceptors.response.use(saveTokenId(sandboxAuthSessionKey));
        api.interceptors.response.use(r => r.data);
    });
    initApi(internalSandbox, requireAuth, basicConfig, (api) => {
        api.interceptors.request.use(authToken(sandboxAuthSessionKey));
        api.interceptors.response.use(r => r.data, reqRejected(internalSandbox.logout));
    });
    initApi(internalSandbox, noAuthRequired, basicConfig, (api) => {
        api.interceptors.response.use(r => r.data);
    });


    const demo = createCache(internalSandbox, {
        expiry: 15 * 60 * 1000,
        allowCache: [],
    });
    onLogoutFunctions.push(() => demo.invalidateCache());

    apiByUrl[baseURL] = demo;

    return demo;
};

export { get };
