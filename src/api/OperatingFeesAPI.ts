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

const OperatingFeesAPI = (config: any) => {
  const { partnerEndpoint, ...others } = config;

  const instance = setup({
    baseURL: `${partnerEndpoint}/v1/programs/`,
    ...others,
  });

  return {
    interceptors: instance.interceptors,
    createFeePlan: (programName: any, dto: any) =>
      instance.post(`${encodeURIComponent(programName)}/feeplans`, dto),
    createOrUpdateFee: (programName: any, feePlanName: any, dto: any) =>
      instance.post(
        `${encodeURIComponent(programName)}/feeplans/${feePlanName}/fees`,
        dto
      ),
    deleteFee: (programName: any, feePlanName: any, id: any) =>
      instance.delete(
        `${encodeURIComponent(programName)}/feeplans/${feePlanName}/fees/${id}`
      ),
    deleteFeePlan: (programName: any, feePlanName: any) =>
      instance.delete(
        `${encodeURIComponent(programName)}/feeplans/${feePlanName}`
      ),
    getFee: (programName: any, feePlanName: any, id: any) =>
      instance.get(
        `${encodeURIComponent(programName)}/feeplans/${feePlanName}/fees/${id}`
      ),
    getFeePlan: (programName: any, feePlanName: any) =>
      instance.get(
        `${encodeURIComponent(programName)}/feeplans/${feePlanName}`
      ),
    getFeePlans: (programName: any) =>
      instance.get(`${encodeURIComponent(programName)}/feeplans`),
    // eslint-disable-next-line max-len
    getFees: (
      programName: any,
      feePlanName: any,
      { currency, transactionSource, transactionType }: any
    ) =>
      instance.get(
        `${encodeURIComponent(programName)}/feeplans/${feePlanName}/fees`,
        {
          params: {
            currency,
            "transaction-source": transactionSource,
            "transaction-type": transactionType,
          },
        }
      ),
    getOperatingProgramFeeEntries: () => instance.get("fees"),
  };
};

export default OperatingFeesAPI;
