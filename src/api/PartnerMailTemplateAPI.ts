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

// This file has been auto generated by the java class GenerateAxiosClient
const PartnerMailTemplateAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;
  const instance = axios.create({
    baseURL: `${partnerEndpoint}/v1/mail/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    createMailTemplate: (language: any, dto: any) =>
      instance.post(`${language}/templates`, dto),
    createMailTemplateSet: (dto: any) => instance.post("", dto),
    deleteMailTemplate: (language: any, mailTemplateId: any) =>
      instance.delete(`${language}/templates/${mailTemplateId}`),
    deleteMailTemplateSet: (language: any) => instance.delete(`${language}`),
    getMailTemplate: (language: any, mailTemplateId: any) =>
      instance.get(`${language}/templates/${mailTemplateId}`),
    getMailTemplateSet: (language: any) => instance.get(`${language}`),
    getMailTemplateSets: () => instance.get(""),
    getMailTemplates: (language: any) => instance.get(`${language}/templates`),
  };
};

export default PartnerMailTemplateAPI;
