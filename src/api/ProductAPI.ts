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

const ProductAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    getAllProductTemplates: () => instance.get(`/offering-catalog`),
    getProductTemplate: (offeringClassName: any) =>
      instance.get(`/offering-catalog/${offeringClassName}`),
    getProductTemplateConfigurationSchema: (productTemplateName: any) =>
      instance.get(
        `/product-templates/${productTemplateName}/configuration-schema`
      ),
    getProductTemplateUISchema: (productTemplateName: any) =>
      instance.get(`/product-templates/${productTemplateName}/ui-schema`),
    createProgramProduct: (dto: any) => instance.post(`offering-programs`, dto),
    updateProgramProduct: (programName: any, dto: any) =>
      instance.put(
        `offering-programs/${encodeURIComponent(programName)}/config`,
        dto
      ),
    getProgramProduct: (programName: any) =>
      instance.get(`/offering-programs/${encodeURIComponent(programName)}`),
    createCustomerOfferingDefinition: (customerNumber: any) =>
      instance.post(`customers/${customerNumber}/product-configurations`),
    getOfferingCustomer: (customerNumber: any) =>
      instance.get(`offering-customers/${customerNumber}`),
    updateOfferingCustomer: (customerNumber: any, dto: any) =>
      instance.put(`offering-customers/${customerNumber}`, dto),
    getOfferingActions: (customerNumber: any, dto: any) =>
      instance.get(`offering-customers/${customerNumber}/actions`),
    executeOfferingAction: (customerNumber: any, dto: any) =>
      instance.post(`offering-customers/${customerNumber}/actions`, dto),
  };
};

export default ProductAPI;
