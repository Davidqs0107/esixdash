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

const MemoAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/programs/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    createMemoTemplate: (programName: any, language: any, dto: any) =>
      instance.post(
        `${encodeURIComponent(programName)}/memos/${language}/templates`,
        dto
      ),
    createMemoTemplateSet: (programName: any, dto: any) =>
      instance.post(`${encodeURIComponent(programName)}/memos`, dto),
    deleteMemoTemplate: (
      programName: any,
      language: any,
      memoTemplateId: any
    ) =>
      instance.delete(
        `${encodeURIComponent(
          programName
        )}/memos/${language}/templates/${memoTemplateId}`
      ),
    deleteMemoTemplateSet: (programName: any, language: any) =>
      instance.delete(`${encodeURIComponent(programName)}/memos/${language}`),
    getMemoTemplate: (programName: any, language: any, memoTemplateId: any) =>
      instance.get(
        `${encodeURIComponent(
          programName
        )}/memos/${language}/templates/${memoTemplateId}`
      ),
    getMemoTemplateSet: (programName: any, language: any) =>
      instance.get(`${encodeURIComponent(programName)}/memos/${language}`),
    getMemoTemplateSets: (programName: any) =>
      instance.get(`${encodeURIComponent(programName)}/memos`),
    getMemoTemplates: (programName: any, language: any) =>
      instance.get(
        `${encodeURIComponent(programName)}/memos/${language}/templates`
      ),
  };
};

export default MemoAPI;
