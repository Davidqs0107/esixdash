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
 *
 */

import { defineMessages } from "react-intl";

const OfferingTypeConverter = (
  programName: string,
  offeringType: any,
  intl?: any
) => {
  let programDetails: any = {};
//   const type = offeringType.split(".")[8];
  switch (offeringType) {
    case "LineOfCredit":
      programDetails.displayName = "Line of Credit Wallet";
      programDetails.description =
        "Provides a standing available balance of revolving credit that can be drawn upon as needed.";
      programDetails.category = "Credit";
      programDetails.pillColor = "success";
      break;
    case "Loan":
      programDetails.displayName = "Installment Wallet";
      programDetails.description =
        "Provides multiple amortized loans which handle interest and repayment independently.";
      programDetails.category = "Credit";
      programDetails.pillColor = "success";
      break;
    case "Savings":
      programDetails.displayName = "Savings Wallet";
      programDetails.description =
        "Provides open-ended interest accrual on deposited funds with limited access to withdrawal on a monthly basis.";
      programDetails.category = "Savings";
      programDetails.pillColor = "success";
      break;
    case "CreditCard":
      programDetails.displayName = "Revolving Credit Wallet";
      programDetails.description =
        "Provides access to multiple types of credit draw including purchase, cash advance, and balance transfer which accrue interest on unpaid balances.";
      programDetails.category = "Credit";
      programDetails.pillColor = "success";
      break;
    case "TermDeposit":
      programDetails.displayName = "Term Deposit Wallet";
      programDetails.description =
        "Provides interest accrual on deposited funds over a set period of time before money can bet withdrawn without penalty.";
      programDetails.category = "Savings";
      programDetails.pillColor = "success";
      break;
    default:
      programDetails.displayName = programName;
      programDetails.description = programName;
      programDetails.category = "Deposit";
      programDetails.pillColor = "primary";
      break;
  }

  return programDetails;
};

export default OfferingTypeConverter;
