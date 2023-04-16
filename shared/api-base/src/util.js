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


const saveTokenId = sessionStorageName => (response) => {
    if (response && response.data && response.data.tokenId) {
        // eslint-disable-next-line no-undef
        sessionStorage.setItem(sessionStorageName, response.data.tokenId);
    }
    return response;
};

const authToken = sessionStorageName => (config) => {
    // eslint-disable-next-line no-undef
    const token = sessionStorage.getItem(sessionStorageName);
    if (token) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

const reqRejected = logoutFunc => (error) => {
    // Check for Token expired errors -- If found logout
    if (error.response.data.responseCode === '205000' || error.response.data.responseCode === '205062') {
        logoutFunc();
        // eslint-disable-next-line no-restricted-globals,no-undef
        location.reload();
    }
    return Promise.reject(error.response.data);
};


const initApi = (client, apiByName, config, apiConsumer) => {
    Object.entries(apiByName).forEach((entry) => {
        const [key, val] = entry;
        // eslint-disable-next-line no-param-reassign
        client[key] = val(config);
        if (apiConsumer) apiConsumer(client[key]);
    });
};

const requestLogger = (config) => {
    // eslint-disable-next-line no-console
    console.log('Calling', config);
    return config;
};


export {
    saveTokenId, authToken, initApi, requestLogger, reqRejected,
};
