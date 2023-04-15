/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * THIS IS CONFIDENTIAL AND PROPRIETARY TO EPISODE SIX, and any
 * copying, reproduction, redistribution, dissemination, modification, or
 * other use, in whole or in part, is strictly prohibited without the prior
 * written consent of (or as may be specifically permitted in a fully signed
 * agreement with) Episode Six.   Violations may result in severe civil and/or
 * criminal penalties, and Episode Six will enforce its rights to the maximum
 * extent permitted by law.
 *
 */

import { defineMessage } from "react-intl";

const MailTypeConverter = (type: any, intl: any) => {
  const mailTemplateTypeDefinition: any = {
    accountBalanceChange: defineMessage({
      id: "mail.template.type.accountBalanceChange",
      description: "Mail template type",
      defaultMessage: "Account Balance Change",
    }),
    accountBalanceChangePurchase: defineMessage({
      id: "mail.template.type.accountBalanceChangePurchase",
      description: "Mail template type",
      defaultMessage: "Account Balance Change Purchase",
    }),
    accountBalanceChangeWithdraw: defineMessage({
      id: "mail.template.type.accountBalanceChangeWithdraw",
      description: "Mail template type",
      defaultMessage: "Account Balance Change Withdraw",
    }),
    accountBlock: defineMessage({
      id: "mail.template.type.accountBlock",
      description: "Mail template type",
      defaultMessage: "Account Block",
    }),
    accountOpeningAcceptance: defineMessage({
      id: "mail.template.type.accountOpeningAcceptance",
      description: "Mail template type",
      defaultMessage: "Account Opening Acceptance",
    }),
    accountSetupComplete: defineMessage({
      id: "mail.template.type.accountSetupComplete",
      description: "Mail template type",
      defaultMessage: "Account Setup Complete",
    }),
    addressChanged: defineMessage({
      id: "mail.template.type.addressChanged",
      description: "Mail template type",
      defaultMessage: "Address Changed",
    }),
    authorization: defineMessage({
      id: "mail.template.type.authorization",
      description: "Mail template type",
      defaultMessage: "Authorization",
    }),
    authorizationError: defineMessage({
      id: "mail.template.type.authorizationError",
      description: "Mail template type",
      defaultMessage: "Authorization Error",
    }),
    autoTopUp: defineMessage({
      id: "mail.template.type.autoTopUp",
      description: "Mail template type",
      defaultMessage: "Auto Top Up",
    }),
    autoTopUpRemoved: defineMessage({
      id: "mail.template.type.autoTopUpRemoved",
      description: "Mail template type",
      defaultMessage: "Auto Top Up Removed",
    }),
    autoTopUpSet: defineMessage({
      id: "mail.template.type.autoTopUpSet",
      description: "Mail template type",
      defaultMessage: "Auto Top Up Set",
    }),
    availableBalance: defineMessage({
      id: "mail.template.type.availableBalance",
      description: "Mail template type",
      defaultMessage: "Available Balance",
    }),
    background: defineMessage({
      id: "mail.template.type.background",
      description: "Mail template type",
      defaultMessage: "Background",
    }),
    cardActivation: defineMessage({
      id: "mail.template.type.cardActivation",
      description: "Mail template type",
      defaultMessage: "Card Activation",
    }),
    cardBlock: defineMessage({
      id: "mail.template.type.cardBlock",
      description: "Mail template type",
      defaultMessage: "Card Block",
    }),
    cardBlockRelease: defineMessage({
      id: "mail.template.type.cardBlockRelease",
      description: "Mail template type",
      defaultMessage: "Card Block Release",
    }),
    cardExternalTokenActivated: defineMessage({
      id: "mail.template.type.cardExternalTokenActivated",
      description: "Mail template type",
      defaultMessage: "Card External Token Activated",
    }),
    cardExternalTokenUpdated: defineMessage({
      id: "mail.template.type.cardExternalTokenUpdated",
      description: "Mail template type",
      defaultMessage: "Card External Token Updated",
    }),
    cashWithdraw: defineMessage({
      id: "mail.template.type.cashWithdraw",
      description: "Mail template type",
      defaultMessage: "Cash Withdraw",
    }),
    closeCustomerAccount: defineMessage({
      id: "mail.template.type.closeCustomerAccount",
      description: "Mail template type",
      defaultMessage: "Close Customer Account",
    }),
    creditLimit: defineMessage({
      id: "mail.template.type.creditLimit",
      description: "Mail template type",
      defaultMessage: "Credit Limit",
    }),
    customerActivation: defineMessage({
      id: "mail.template.type.customerActivation",
      description: "Mail template type",
      defaultMessage: "Customer Activation",
    }),
    customerBlock: defineMessage({
      id: "mail.template.type.customerBlock",
      description: "Mail template type",
      defaultMessage: "Customer Block",
    }),
    customerPasscodeReset: defineMessage({
      id: "mail.template.type.customerPasscodeReset",
      description: "Mail template type",
      defaultMessage: "Customer Passcode Reset",
    }),
    customerPasscodeResetCompleted: defineMessage({
      id: "mail.template.type.customerPasscodeResetCompleted",
      description: "Mail template type",
      defaultMessage: "Customer Passcode Reset Completed",
    }),
    customerRisk: defineMessage({
      id: "mail.template.type.customerRisk",
      description: "Mail template type",
      defaultMessage: "Customer Risk",
    }),
    customerRiskChangeFailed: defineMessage({
      id: "mail.template.type.customerRiskChangeFailed",
      description: "Mail template type",
      defaultMessage: "Customer Risk Change Failed",
    }),
    customerRiskChangeOK: defineMessage({
      id: "mail.template.type.customerRiskChangeOK",
      description: "Mail template type",
      defaultMessage: "Customer Risk Change OK",
    }),
    debitLimit: defineMessage({
      id: "mail.template.type.debitLimit",
      description: "Mail template type",
      defaultMessage: "Debit Limit",
    }),
    deliverTokenActivationCode: defineMessage({
      id: "mail.template.type.deliverTokenActivationCode",
      description: "Mail template type",
      defaultMessage: "Deliver Token Activation Code",
    }),
    emailChangeRequest: defineMessage({
      id: "mail.template.type.emailChangeRequest",
      description: "Mail template type",
      defaultMessage: "Email Change Request",
    }),
    emailChanged: defineMessage({
      id: "mail.template.type.emailChanged",
      description: "Mail template type",
      defaultMessage: "Email Changed",
    }),
    foreignTransaction: defineMessage({
      id: "mail.template.type.foreignTransaction",
      description: "Mail template type",
      defaultMessage: "Foreign Transaction",
    }),
    loadComplete: defineMessage({
      id: "mail.template.type.loadComplete",
      description: "Mail template type",
      defaultMessage: "Load Complete",
    }),
    loginLocked: defineMessage({
      id: "mail.template.type.loginLocked",
      description: "Mail template type",
      defaultMessage: "Login Locked",
    }),
    lowBalance: defineMessage({
      id: "mail.template.type.lowBalance",
      description: "Mail template type",
      defaultMessage: "Low Balance",
    }),
    negativeBalance: defineMessage({
      id: "mail.template.type.negativeBalance",
      description: "Mail template type",
      defaultMessage: "Negative Balance",
    }),
    newAccount: defineMessage({
      id: "mail.template.type.newAccount",
      description: "Mail template type",
      defaultMessage: "New Account",
    }),
    passwordReset: defineMessage({
      id: "mail.template.type.passwordReset",
      description: "Mail template type",
      defaultMessage: "Password Reset",
    }),
    passwordResetCompleted: defineMessage({
      id: "mail.template.type.passwordResetCompleted",
      description: "Mail template type",
      defaultMessage: "Password Reset Completed",
    }),
    phoneChanged: defineMessage({
      id: "mail.template.type.phoneChanged",
      description: "Mail template type",
      defaultMessage: "Phone Changed",
    }),
    pinChanged: defineMessage({
      id: "mail.template.type.pinChanged",
      description: "Mail template type",
      defaultMessage: "Pin Changed",
    }),
    transaction: defineMessage({
      id: "mail.template.type.transaction",
      description: "Mail template type",
      defaultMessage: "Transaction",
    }),
    transactionComplete: defineMessage({
      id: "mail.template.type.transactionComplete",
      description: "Mail template type",
      defaultMessage: "Transaction Complete",
    }),
    transactionFailure: defineMessage({
      id: "mail.template.type.transactionFailure",
      description: "Mail template type",
      defaultMessage: "Transaction Failure",
    }),
    verifyEmail: defineMessage({
      id: "mail.template.type.verifyEmail",
      description: "Mail template type",
      defaultMessage: "Verify Email",
    }),
    verifyEmailCompleted: defineMessage({
      id: "mail.template.type.verifyEmailCompleted",
      description: "Mail template type",
      defaultMessage: "Verify Email Completed",
    }),
    walletTransfer: defineMessage({
      id: "mail.template.type.walletTransfer",
      description: "Mail template type",
      defaultMessage: "Wallet Transfer",
    }),
    withdrawal: defineMessage({
      id: "mail.template.type.withdrawal",
      description: "Mail template type",
      defaultMessage: "Withdrawal",
    }),
  };
  if (mailTemplateTypeDefinition.hasOwnProperty(type))
    return intl.formatMessage(mailTemplateTypeDefinition[type]);
  else {
    console.debug(`No mail type definition is found for ${type}`);
    return type;
  }
};

export default MailTypeConverter;
