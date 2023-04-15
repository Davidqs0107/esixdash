/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import { defineMessages, MessageDescriptor } from "react-intl";

const RoleConverter = (roleName: string, intl: any) => {
  const roleDefinition = defineMessages<string, MessageDescriptor>({
    FinancialManager: {
      id: "roles.financialManager",
      description: "partner user role",
      defaultMessage: "Financial Manager",
    },
    PlatformManager: {
      id: "roles.platformManager",
      description: "partner user role",
      defaultMessage: "Platform Manager",
    },
    RiskManager: {
      id: "roles.riskManager",
      description: "partner user role",
      defaultMessage: "Risk Manager",
    },
    CustomerAgent: {
      id: "roles.customerAgent",
      description: "partner user role",
      defaultMessage: "Customer Agent",
    },
    System: {
      id: "roles.system",
      description: "partner user role",
      defaultMessage: "System",
    },
    StoreManager: {
      id: "roles.storeManager",
      description: "partner user role",
      defaultMessage: "Store Manager",
    },
    CustomerManager: {
      id: "roles.customerManager",
      description: "partner user role",
      defaultMessage: "Customer Manager",
    },
    RiskAgent: {
      id: "roles.riskAgent",
      description: "partner user role",
      defaultMessage: "Risk Agent",
    },
    Auditor: {
      id: "roles.auditor",
      description: "partner user role",
      defaultMessage: "Auditor",
    },
    Approver: {
      id: "roles.approver",
      description: "partner user role",
      defaultMessage: "Approver",
    },
    StoreAgent: {
      id: "roles.storeAgent",
      description: "partner user role",
      defaultMessage: "Store Agent",
    },
    ProgramManager: {
      id: "roles.programManager",
      description: "partner user role",
      defaultMessage: "Program Manager",
    },
    RetailManager: {
      id: "roles.retailManager",
      description: "partner user role",
      defaultMessage: "Retail Manager",
    },
    ReadOnly: {
      id: "roles.readOnly",
      description: "partner user role",
      defaultMessage: "Read Only",
    },
  });

  if (roleDefinition[roleName] != null)
    return intl.formatMessage(roleDefinition[roleName]);

  console.debug(`No role definition is found for ${roleName}`);
  return roleName;
};

export default RoleConverter;
