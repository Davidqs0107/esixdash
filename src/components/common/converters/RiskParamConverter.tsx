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

import { defineMessage, IntlShape } from "react-intl";

const RiskParamConverter = (code: string, intl: IntlShape) => {
  const riskParamDefinition = {
    activation_time_limit: defineMessage({
      id: "risk.param.activation_time_limit",
      description: "Risk Param",
      defaultMessage: "Activation Time Limit",
    }),
    adjustment_30d: defineMessage({
      id: "risk.param.adjustment_30d",
      description: "Risk Param",
      defaultMessage: "Adjustment 30 day",
    }),
    atm_limit: defineMessage({
      id: "risk.param.atm_limit",
      description: "Risk Param",
      defaultMessage: "ATM withdrawal limit",
    }),
    atm_1d: defineMessage({
      id: "risk.param.atm_1d",
      description: "Risk Param",
      defaultMessage: "ATM withdrawal limit for 1 day",
    }),
    atm_7d: defineMessage({
      id: "risk.param.atm_7d",
      description: "Risk Param",
      defaultMessage: "ATM withdrawal limit for 7 days",
    }),
    atm_30d: defineMessage({
      id: "risk.param.atm_30d",
      description: "Risk Param",
      defaultMessage: "ATM withdrawal limit for 30 days",
    }),
    auto_top_up_count_1d: defineMessage({
      id: "risk.param.auto_top_up_count_1d",
      description: "Risk Param",
      defaultMessage: "Auto top up count for 1 day",
    }),
    auto_top_up_limit: defineMessage({
      id: "risk.param.auto_top_up_limit",
      description: "Risk Param",
      defaultMessage: "Auto top up limit",
    }),
    auto_top_up_limit_1d: defineMessage({
      id: "risk.param.auto_top_up_limit_1d",
      description: "Risk Param",
      defaultMessage: "Auto top up limit 1 day",
    }),
    balance_floor: defineMessage({
      id: "risk.param.balance_floor",
      description: "Risk Param",
      defaultMessage: "Balance floor",
    }),
    exchange_quote_duration: defineMessage({
      id: "risk.param.exchange_quote_duration",
      description: "Risk Param",
      defaultMessage: "Exchange quote duration",
    }),
    hierarchy_max_level: defineMessage({
      id: "risk.param.hierarchy_max_level",
      description: "Risk Param",
      defaultMessage: "Heirarchy max level",
    }),
    online_purchase_limit: defineMessage({
      id: "risk.param.online_purchase_limit",
      description: "Risk Param",
      defaultMessage: "Online purchase limit",
    }),
    online_purchase_1d: defineMessage({
      id: "risk.param.online_purchase_1d",
      description: "Risk Param",
      defaultMessage: "Online purchase limit for 1 day",
    }),
    online_purchase_7d: defineMessage({
      id: "risk.param.online_purchase_7d",
      description: "Risk Param",
      defaultMessage: "Online purchase limit for 7 days",
    }),
    p2p_limit: defineMessage({
      id: "risk.param.p2p_limit",
      description: "Risk Param",
      defaultMessage: "P2P transfer limit",
    }),
    p2p_1d: defineMessage({
      id: "risk.param.p2p_1d",
      description: "Risk Param",
      defaultMessage: "P2P transfer limit for 1 day",
    }),
    p2p_7d: defineMessage({
      id: "risk.param.p2p_7d",
      description: "Risk Param",
      defaultMessage: "P2P transfer limit for 7 days",
    }),
    p2p_30d: defineMessage({
      id: "risk.param.p2p_30d",
      description: "Risk Param",
      defaultMessage: "P2P transfer limit for 30 days",
    }),
    p2p_1y: defineMessage({
      id: "risk.param.p2p_1y",
      description: "Risk Param",
      defaultMessage: "P2P transfer limit for 1 year",
    }),
    pos_purchase_limit: defineMessage({
      id: "risk.param.pos_purchase_limit",
      description: "Risk Param",
      defaultMessage: "POS purchase limit",
    }),
    pos_purchase_1d: defineMessage({
      id: "risk.param.pos_purchase_1d",
      description: "Risk Param",
      defaultMessage: "POS purchase limit for 1 day",
    }),
    pos_purchase_7d: defineMessage({
      id: "risk.param.pos_purchase_7d",
      description: "Risk Param",
      defaultMessage: "POS purchase limit for 7 days",
    }),
    passcode_reset_time_limit: defineMessage({
      id: "risk.param.passcode_reset_time_limit",
      description: "Risk Param",
      defaultMessage: "Passcode reset time limit",
    }),
    password_history_count: defineMessage({
      id: "risk.param.password_history_count",
      description: "Risk Param",
      defaultMessage: "Password history count",
    }),
    pre_approval_interval_begin: defineMessage({
      id: "risk.param.pre_approval_interval_begin",
      description: "Risk Param",
      defaultMessage: "Pre-approval interval begin",
    }),
    pre_approval_interval_end: defineMessage({
      id: "risk.param.pre_approval_interval_end",
      description: "Risk Param",
      defaultMessage: "Pre-approval interval end",
    }),
    p2p_limit_recv: defineMessage({
      id: "risk.param.p2p_limit_recv",
      description: "Risk Param",
      defaultMessage: "P2P limit received",
    }),
    p2p_recv_1y: defineMessage({
      id: "risk.param.p2p_recv_1y",
      description: "Risk Param",
      defaultMessage: "P2P received limit for 1 year",
    }),
    p2p_recv_30d: defineMessage({
      id: "risk.param.p2p_recv_30d",
      description: "Risk Param",
      defaultMessage: "P2P received limit for 30 days",
    }),
    p2p_recv_1d: defineMessage({
      id: "risk.param.p2p_recv_1d",
      description: "Risk Param",
      defaultMessage: "P2P received limit for 1 day",
    }),
    purchase_1d: defineMessage({
      id: "risk.param.purchase_1d",
      description: "Risk Param",
      defaultMessage: "Purchase limit for 1 day",
    }),
    purchase_7d: defineMessage({
      id: "risk.param.purchase_7d",
      description: "Risk Param",
      defaultMessage: "Purchase limit for 7 days",
    }),
    purchase_30d: defineMessage({
      id: "risk.param.purchase_30d",
      description: "Risk Param",
      defaultMessage: "Purchase limit for 30 days",
    }),
    purchase_1y: defineMessage({
      id: "risk.param.purchase_1y",
      description: "Risk Param",
      defaultMessage: "Purchase limit for 1 year",
    }),
    purchase_limit: defineMessage({
      id: "risk.param.purchase_limit",
      description: "Risk Param",
      defaultMessage: "Purchase limit",
    }),
    combined_purchase_1d: defineMessage({
      id: "risk.param.combined_purchase_1d",
      description: "Risk Param",
      defaultMessage: "Combined online and POS purchase limit for 1 day",
    }),
    purchase_limit_recv: defineMessage({
      id: "risk.param.purchase_limit_recv",
      description: "Risk Param",
      defaultMessage: "Purchase limit received",
    }),
    withdraw_limit: defineMessage({
      id: "risk.param.withdraw_limit",
      description: "Risk Param",
      defaultMessage: "Withdrawal limit",
    }),
    withdraw_1d: defineMessage({
      id: "risk.param.withdraw_1d",
      description: "Risk Param",
      defaultMessage: "Withdrawal limit for 1 day",
    }),
    withdraw_7d: defineMessage({
      id: "risk.param.withdraw_7d",
      description: "Risk Param",
      defaultMessage: "Withdrawal limit for 7 days",
    }),
    adjustment_limit: defineMessage({
      id: "risk.param.adjustment_limit",
      description: "Risk Param",
      defaultMessage: "Adjustment limit",
    }),
    adjustment_1d: defineMessage({
      id: "risk.param.adjustment_1d",
      description: "Risk Param",
      defaultMessage: "Adjustment limit for 1 day",
    }),
    adjustment_7d: defineMessage({
      id: "risk.param.adjustment_7d",
      description: "Risk Param",
      defaultMessage: "Adjustment limit for 7 days",
    }),
    refund_purchase_period: defineMessage({
      id: "risk.param.refund_purchase_period",
      description: "Risk Param",
      defaultMessage: "Refund period",
    }),
    refund_count_1d: defineMessage({
      id: "risk.param.refund_count_1d",
      description: "Risk Param",
      defaultMessage: "Refund count limit for 1 day",
    }),
    refund_count_7d: defineMessage({
      id: "risk.param.refund_count_7d",
      description: "Risk Param",
      defaultMessage: "Refund count limit for 7 days",
    }),
    refund_1d: defineMessage({
      id: "risk.param.refund_1d",
      description: "Risk Param",
      defaultMessage: "Refund limit for 1 day",
    }),
    refund_7d: defineMessage({
      id: "risk.param.refund_7d",
      description: "Risk Param",
      defaultMessage: "Refund limit for 7 days",
    }),
    refund_30d: defineMessage({
      id: "risk.param.refund_30d",
      description: "Risk Param",
      defaultMessage: "Refund limit for 30 days",
    }),
    refund_1y: defineMessage({
      id: "risk.param.refund_1y",
      description: "Risk Param",
      defaultMessage: "Refund limit for 1 year",
    }),
    refund_limit: defineMessage({
      id: "risk.param.refund_limit",
      description: "Risk Param",
      defaultMessage: "Refund limit",
    }),
    refund_limit_recv: defineMessage({
      id: "risk.param.refund_limit_recv",
      description: "Risk Param",
      defaultMessage: "Refund limit received",
    }),
    minimum_load: defineMessage({
      id: "risk.param.minimum_load",
      description: "Risk Param",
      defaultMessage: "Minimum load",
    }),
    balance_limit: defineMessage({
      id: "risk.param.balance_limit",
      description: "Risk Param",
      defaultMessage: "Balance limit",
    }),
    load_limit: defineMessage({
      id: "risk.param.load_limit",
      description: "Risk Param",
      defaultMessage: "Load limit",
    }),
    load_limit_1d: defineMessage({
      id: "risk.param.load_limit_1d",
      description: "Risk Param",
      defaultMessage: "Load limit for 1 day",
    }),
    load_limit_30d: defineMessage({
      id: "risk.param.load_limit_30d",
      description: "Risk Param",
      defaultMessage: "Load limit for 30 days",
    }),
    load_limit_1y: defineMessage({
      id: "risk.param.load_limit_1y",
      description: "Risk Param",
      defaultMessage: "Load limit for 1 year",
    }),
    blocked_countries: defineMessage({
      id: "risk.param.blocked_countries",
      description: "Risk Param",
      defaultMessage: "Blocked countries",
    }),
    blocked_mcc: defineMessage({
      id: "risk.param.blocked_mcc",
      description: "Risk Param",
      defaultMessage: "Blocked MCC codes",
    }),
    pin_fail_count: defineMessage({
      id: "risk.param.pin_fail_count",
      description: "Risk Param",
      defaultMessage: "Failed PIN count limit",
    }),
    max_num_cards: defineMessage({
      id: "risk.param.max_num_cards",
      description: "Risk Param",
      defaultMessage: "Maximum number of cards per customer account",
    }),
    max_num_persons: defineMessage({
      id: "risk.param.max_num_persons",
      description: "Risk Param",
      defaultMessage: "Maximum number of persons per customer account",
    }),
    low_balance_threshold: defineMessage({
      id: "risk.param.low_balance_threshold",
      description: "Risk Param",
      defaultMessage: "Low balance threshold",
    }),
    max_cards_allowed: defineMessage({
      id: "risk.param.max_cards_allowed",
      description: "Risk Param",
      defaultMessage: "Maximum number of cards allowed",
    }),
    password_reset_time_limit: defineMessage({
      id: "risk.param.password_reset_time_limit",
      description: "Risk Param",
      defaultMessage: "Customer password reset time limit",
    }),
    verify_email_time_limit: defineMessage({
      id: "risk.param.verify_email_time_limit",
      description: "Risk Param",
      defaultMessage: "Verify email time limit",
    }),
    withdraw_1y: defineMessage({
      id: "risk.param.withdraw_1y",
      description: "Risk Param",
      defaultMessage: "Withdraw limit for 1 year",
    }),
    withdraw_30d: defineMessage({
      id: "risk.param.withdraw_30d",
      description: "Risk Param",
      defaultMessage: "Withdraw limit for 30 days",
    }),
    atm_reversal_count_1d: defineMessage({
      id: "risk.param.atm_reversal_count_1d",
      description: "Risk Param",
      defaultMessage: "ATM Reversal Count 1 day",
    }),
    purchase_same_merchant_3d: defineMessage({
      id: "risk.param.purchase_same_merchant_3d",
      description: "Risk Param",
      defaultMessage: "Purchase same merchant 3 day (Amount)",
    }),
    atm_count_7d: defineMessage({
      id: "risk.param.atm_count_7d",
      description: "Risk Param",
      defaultMessage: "ATM Count 7 day",
    }),
    not_allowed_first_transaction_types: defineMessage({
      id: "risk.param.not_allowed_first_transaction_types",
      description: "Risk Param",
      defaultMessage: "Not allowed first transaction types",
    }),
    allowed_mcc: defineMessage({
      id: "risk.param.allowed_mcc",
      description: "Risk Param",
      defaultMessage: "Allowed MCC",
    }),
    purchase_count_same_merchant_3d: defineMessage({
      id: "risk.param.purchase_count_same_merchant_3d",
      description: "Risk Param",
      defaultMessage: "Purchase same merchant 3 day (Count)",
    }),
    age_limit: defineMessage({
      id: "risk.param.age_limit",
      description: "Risk Param",
      defaultMessage: "Age limit",
    }),
    rejected_count_5d: defineMessage({
      id: "risk.param.rejected_count_5d",
      description: "Risk Param",
      defaultMessage: "Rejected count 5 day",
    }),
    pin_fail_count_temporary_lock: defineMessage({
      id: "risk.param.pin_fail_count_temporary_lock",
      description: "Risk Param",
      defaultMessage: "PIN fail count temporary lock",
    }),
    max_num_tokens_per_card: defineMessage({
      id: "risk.param.max_num_tokens_per_card",
      description: "Risk Param",
      defaultMessage: "Maximum number of tokens per card",
    }),
    purchase_no_cvm_1d: defineMessage({
      id: "risk.param.purchase_no_cvm_1d",
      description: "Risk Param",
      defaultMessage: "Purchase no CVM 1 day",
    }),
    purchase_no_cvm_limit: defineMessage({
      id: "risk.param.purchase_no_cvm_limit",
      description: "Risk Param",
      defaultMessage: "Purchase no CVM Limit",
    }),
    purchase_no_cvm_count_1d: defineMessage({
      id: "risk.param.purchase_no_cvm_count_1d",
      description: "Risk Param",
      defaultMessage: "Purchase no CVM Count 1 day",
    }),
    sg_withdraw: defineMessage({
      id: "risk.param.sg_withdraw",
      description: "Risk Param",
      defaultMessage: "Singapore ATM Debit Card Block",
    }),
    atm_international_limit: defineMessage({
      id: "risk.param.atm_international_limit",
      description: "Risk Param",
      defaultMessage: "International ATM Limit",
    }),
    atm_domestic_limit: defineMessage({
      id: "risk.param.atm_domestic_limit",
      description: "Risk Param",
      defaultMessage: "Domestic ATM debit card limit",
    }),
    disable_mag_stripe: defineMessage({
      id: "risk.param.disable_mag_stripe",
      description: "Risk Param",
      defaultMessage: "Card Swipe Block",
    }),
    limit_mag_stripe: defineMessage({
      id: "risk.param.limit_mag_stripe",
      description: "Risk Param",
      defaultMessage: "Card Swipe Limit",
    }),
    disable_card_not_present: defineMessage({
      id: "risk.param.disable_card_not_present",
      description: "Risk Param",
      defaultMessage: "Card Not Present Block",
    }),
    limit_card_not_present: defineMessage({
      id: "risk.param.limit_card_not_present",
      description: "Risk Param",
      defaultMessage: "Card Not Present Limit",
    }),
    accumulated_purchase_limit: defineMessage({
      id: "risk.param.accumulated_purchase_limit",
      description: "Risk Param",
      defaultMessage: "Accumulated Purchase Limit",
    }),
    reward_limit_1d: defineMessage({
      id: "risk.param.reward_limit_1d",
      description: "Risk Param",
      defaultMessage: "Reward limit for 1 day",
    }),
    reward_limit_7d: defineMessage({
      id: "risk.param.reward_limit_7d",
      description: "Risk Param",
      defaultMessage: "Reward limit for 7 days",
    }),
    reward_limit_30d: defineMessage({
      id: "risk.param.reward_limit_30d",
      description: "Risk Param",
      defaultMessage: "Reward limit for 30 days",
    }),
    combined_funds_out_1y: defineMessage({
      id: "risk.param.combined_funds_out_1y",
      description: "Risk Param",
      defaultMessage: "Combined funds out limit for 1 year",
    }),
    atm_count_1d: defineMessage({
      id: "risk.param.atm_count_1d",
      description: "Risk Param",
      defaultMessage: "ATM Count limit for 1 day",
    }),
    atm_count_30d: defineMessage({
      id: "risk.param.atm_count_30d",
      description: "Risk Param",
      defaultMessage: "ATM Count limit for 30 days",
    }),
    atm_domestic_1d: defineMessage({
      id: "risk.param.atm_domestic_1d",
      description: "Risk Param",
      defaultMessage: "Domestic ATM debit card limit for 1 day",
    }),
    atm_international_1d: defineMessage({
      id: "risk.param.atm_international_1d",
      description: "Risk Param",
      defaultMessage: "International ATM limit for 1 day",
    }),
    international_limit: defineMessage({
      id: "risk.param.international_limit",
      description: "Risk Param",
      defaultMessage: "International limit",
    }),
    nomatch_merchant_control_response: defineMessage({
      id: "risk.param.nomatch_merchant_control_response",
      description: "Risk Param",
      defaultMessage: "No Match Merchant Control Response",
    }),
    online_purchase_30d: defineMessage({
      id: "risk.param.online_purchase_30d",
      description: "Risk Param",
      defaultMessage: "Online purchase limit for 30 day",
    }),
    online_purchase_count_1d: defineMessage({
      id: "risk.param.online_purchase_count_1d",
      description: "Risk Param",
      defaultMessage: "Online purchase count limit for 1 day",
    }),
    online_purchase_count_30d: defineMessage({
      id: "risk.param.online_purchase_count_30d",
      description: "Risk Param",
      defaultMessage: "Online purchase count limit for 30 days",
    }),
    online_purchase_count_7d: defineMessage({
      id: "risk.param.online_purchase_count_7d",
      description: "Risk Param",
      defaultMessage: "Online purchase count limit for 7 days",
    }),
    online_purchase_mcc_limit: defineMessage({
      id: "risk.param.online_purchase_mcc_limit",
      description: "Risk Param",
      defaultMessage: "Online purchase MCC limit",
    }),
    pos_purchase_30d: defineMessage({
      id: "risk.param.pos_purchase_30d",
      description: "Risk Param",
      defaultMessage: "POS purchase limit for 30 days",
    }),
    pos_purchase_count_1d: defineMessage({
      id: "risk.param.pos_purchase_count_1d",
      description: "Risk Param",
      defaultMessage: "POS purchase count limit for 1 day",
    }),
    pos_purchase_count_30d: defineMessage({
      id: "risk.param.pos_purchase_count_30d",
      description: "Risk Param",
      defaultMessage: "POS purchase count limit for 30 days",
    }),
    pos_purchase_count_7d: defineMessage({
      id: "risk.param.pos_purchase_count_7d",
      description: "Risk Param",
      defaultMessage: "POS purchase count limit for 7 days",
    }),
    purchase_count_1d: defineMessage({
      id: "risk.param.purchase_count_1d",
      description: "Risk Param",
      defaultMessage: "Purchase count for 1 day",
    }),
    purchase_count_30d: defineMessage({
      id: "risk.param.purchase_count_30d",
      description: "Risk Param",
      defaultMessage: "Purchase count for 30 days",
    }),
    purchase_count_7d: defineMessage({
      id: "risk.param.purchase_count_7d",
      description: "Risk Param",
      defaultMessage: "Purchase count for 7 days",
    }),
    purchase_count_same_merchant_1d: defineMessage({
      id: "risk.param.purchase_count_same_merchant_1d",
      description: "Risk Param",
      defaultMessage: "Purchase same merchant 1 day (Count)",
    }),
    purchase_count_same_merchant_30d: defineMessage({
      id: "risk.param.purchase_count_same_merchant_30d",
      description: "Risk Param",
      defaultMessage: "Purchase same merchant 30 days (Count)",
    }),
    purchase_count_same_merchant_7d: defineMessage({
      id: "risk.param.purchase_count_same_merchant_7d",
      description: "Risk Param",
      defaultMessage: "Purchase same merchant 7 days (Count)",
    }),
    purchase_same_merchant_1d: defineMessage({
      id: "risk.param.purchase_same_merchant_1d",
      description: "Risk Param",
      defaultMessage: "Purchase same merchant 1 day (Amount)",
    }),
    purchase_same_merchant_30d: defineMessage({
      id: "risk.param.purchase_same_merchant_30d",
      description: "Risk Param",
      defaultMessage: "Purchase same merchant 30 days (Amount)",
    }),
    purchase_same_merchant_7d: defineMessage({
      id: "risk.param.purchase_same_merchant_7d",
      description: "Risk Param",
      defaultMessage: "Purchase same merchant 7 days (Amount)",
    }),
    withdraw_percentage_limit: defineMessage({
      id: "risk.param.withdraw_percentage_limit",
      description: "Risk Param",
      defaultMessage: "Withdraw percentage limit",
    })
  };

  // @ts-ignore
  if (riskParamDefinition[code] != null) {
    // @ts-ignore
    return intl.formatMessage(riskParamDefinition[code]);
  } else {
    console.debug("No risk param definition is found for " + code);
    return code;
  }
};

export default RiskParamConverter;
