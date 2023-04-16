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

import axios from 'axios';


// This file has been auto generated by the java class GenerateAxiosClient
const CardProfileAPI = (config) => {
    const { baseURL, ...others } = config;
    const instance = axios.create({ baseURL: `${baseURL}/v1/programs/`, ...others });

    return {
        interceptors: instance.interceptors,
        createCardProfile: (programName, dto) => instance.post(`${programName}/card/profiles`, dto),
        deleteCardProfile: (programName, cardProfileName) => instance.delete(`${programName}/card/profiles/${cardProfileName}`),
        getCardProfile: (programName, cardProfileName) => instance.get(`${programName}/card/profiles/${cardProfileName}`),
        getCardProfiles: (programName, cardType) => instance.get(`${programName}/card/profiles`, { params: { 'card-type': cardType } }),
    };
};

export default CardProfileAPI;
