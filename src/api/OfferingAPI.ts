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

const OfferingAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    createOffering: (catalogName: any, defName: any, dto: any) =>
      instance.post(
        `offeringCatalogs/${catalogName}/offeringDefs/${defName}/offerings`,
        dto
      ),
    createOfferingDef: (catalogName: any, dto: any) =>
      instance.post(`offeringCatalogs/${catalogName}/offeringDefs`, dto),
    executeOfferingAction: (offeringNumber: any, dto: any) =>
      instance.post(`offerings/${offeringNumber}/actions`, dto),
    getAvailableOfferingDefs: (catalogName: any) =>
      instance.get(`offeringCatalogs/${catalogName}/offeringDefs`),
    getAvailableOfferingSpecs: (catalogName: any) =>
      instance.get(`offeringCatalogs/${catalogName}/offeringSpecs`),
    getOffering: (offeringNumber: any) =>
      instance.get(`offerings/${offeringNumber}`),
    getOfferingActions: (offeringNumber: any) =>
      instance.get(`offerings/${offeringNumber}/actions`),
    getOfferingConfig: (offeringNumber: any) =>
      instance.get(`offerings/${offeringNumber}/config`),
    getOfferingDef: (catalogName: any, defName: any) =>
      instance.get(`offeringCatalogs/${catalogName}/offeringDefs/${defName}`),
    getOfferingSpec: (catalogName: any, specName: any) =>
      instance.get(`offeringCatalogs/${catalogName}/offeringSpecs/${specName}`),
    updateOfferingDefConfig: (catalogName: any, defName: any, dto: any) =>
      instance.put(
        `offeringCatalogs/${catalogName}/offeringDefs/${defName}/config`,
        dto
      ),
  };
};

export default OfferingAPI;
