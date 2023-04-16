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
import PartnerAuthAPI from './PartnerAuthAPI';

import ActionAPI from './ActionAPI';
import BankAPI from './BankAPI';
import CardAPI from './CardAPI';
import CardProfileAPI from './CardProfileAPI';
import ChargebackAPI from './ChargebackAPI';
import Commerce2API from './Commerce2API';
import CustomerAttributeAPI from './CustomerAttributeAPI';
import CustomerAPI from './CustomerAPI';
import CurrentUserAPI from './CurrentUserAPI';
import CommerceAPI from './CommerceAPI';
import CustomerChangeOrderAPI from './CustomerChangeOrderAPI';
import CustomerMemoAPI from './CustomerMemoAPI';
import ExchangeProviderAPI from './ExchangeProviderAPI';
import InterchangeAPI from './InterchangeAPI';
import LoadFailureAPI from './LoadFailureAPI';
import LogAPI from './LogAPI';
import MailTemplateAPI from './MailTemplateAPI';
import MemoAPI from './MemoAPI';
import OperatingAPI from './OperatingAPI';
import OperatingChangeOrderAPI from './OperatingChangeOrderAPI';
import OperatingFeesAPI from './OperatingFeesAPI';
import PartnerAPI from './PartnerAPI';
import PartnerChangeOrderAPI from './PartnerChangeOrderAPI';
import PartnerFeesAPI from './PartnerFeesAPI';
import PartnerMailTemplateAPI from './PartnerMailTemplateAPI';
import PartnerRiskAPI from './PartnerRiskAPI';
import PersonAPI from './PersonAPI';
import ReportAPI from './ReportAPI';
import RiskAPI from './RiskAPI';
import StoreAPI from './StoreAPI';
import UserAPI from './UserAPI';
import CommonAPI from './CommonAPI';

const {
    authToken, initApi, saveTokenId, reqRejected,
} = apiUtil;

const provideAuth = {
    PartnerAuthAPI,
};

const requireAuth = {
    ActionAPI,
    BankAPI,
    CardAPI,
    CardProfileAPI,
    ChargebackAPI,
    Commerce2API,
    CommerceAPI,
    CurrentUserAPI,
    CustomerAPI,
    CustomerAttributeAPI,
    CustomerChangeOrderAPI,
    CustomerMemoAPI,
    ExchangeProviderAPI,
    InterchangeAPI,
    LoadFailureAPI,
    LogAPI,
    MailTemplateAPI,
    MemoAPI,
    OperatingAPI,
    OperatingChangeOrderAPI,
    OperatingFeesAPI,
    PartnerAPI,
    PartnerChangeOrderAPI,
    PartnerFeesAPI,
    PartnerMailTemplateAPI,
    PartnerRiskAPI,
    PersonAPI,
    ReportAPI,
    RiskAPI,
    StoreAPI,
    UserAPI,
};

const noAuthRequired = {
    CommonAPI,
};

export const partnerAuthSessionKey = 'partnerApiToken';
const apiByUrl = {};

const get = (baseURL) => {
    if (baseURL in apiByUrl) return apiByUrl[baseURL];

    const internalPartner = {};

    const basicConfig = {
        baseURL,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    };

    // eslint-disable-next-line no-undef
    internalPartner.isLoggedIn = () => sessionStorage.getItem(partnerAuthSessionKey) != null;

    const onLogoutFunctions = [];
    internalPartner.logout = () => {
        onLogoutFunctions.forEach(l => l());
        // eslint-disable-next-line no-undef
        sessionStorage.removeItem(partnerAuthSessionKey);
    };

    initApi(internalPartner, provideAuth, basicConfig, (api) => {
        api.interceptors.response.use(saveTokenId(partnerAuthSessionKey));
        api.interceptors.response.use(r => r.data);
    });
    initApi(internalPartner, requireAuth, basicConfig, (api) => {
        api.interceptors.request.use(authToken(partnerAuthSessionKey));
        api.interceptors.response.use(r => r.data, reqRejected(internalPartner.logout));
    });
    initApi(internalPartner, noAuthRequired, basicConfig, (api) => {
        api.interceptors.response.use(r => r.data);
    });


    const partner = createCache(internalPartner, {
        expiry: 15 * 60 * 1000,
        allowCache: [
            /CommonAPI/,
        ],
    });
    onLogoutFunctions.push(() => partner.invalidateCache());
    apiByUrl[baseURL] = partner;

    return partner;
};

export { get };
