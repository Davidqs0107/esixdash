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

import { defineMessages, MessageDescriptor } from "react-intl";

const TransactionStateConverter = (status: string, intl: any) => {
  const transactionStateDefinition = defineMessages<string, MessageDescriptor>({
    PENDING: {
      id: "transaction.state.pending",
      description: "transaction state",
      defaultMessage: "Pending",
    },
    SUBMITTED: {
      id: "transaction.state.submitted",
      description: "transaction state",
      defaultMessage: "Submitted",
    },
    SUCCESS: {
      id: "transaction.state.success",
      description: "transaction state",
      defaultMessage: "Success",
    },
    CANCELLED: {
      id: "transaction.state.cancelled",
      description: "transaction state",
      defaultMessage: "Cancelled",
    },
    FAIL: {
      id: "transaction.state.fail",
      description: "transaction state",
      defaultMessage: "Fail",
    },
    EXPIRED: {
      id: "transaction.state.expired",
      description: "transaction state",
      defaultMessage: "Expired",
    },
    COMPLETED: {
      id: "transaction.state.completed",
      description: "transaction state",
      defaultMessage: "Completed",
    },
  });
  if (transactionStateDefinition[status] !== null)
    return intl.formatMessage(transactionStateDefinition[status]);
  console.debug(`No transaction state definition is found for ${status}`);
  return status;
};

export default TransactionStateConverter;
