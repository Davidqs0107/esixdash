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

// eslint-disable-next-line no-use-before-define
import React from "react";
import { FormattedDate } from "react-intl";
import CurrencyRender from "../../common/converters/CurrencyRender";
import CheckmarkConverter from "../../common/converters/CheckmarkConverter";
import QDFormattedCurrency from "../../common/converters/QDFormattedCurrency";
import Pill from "../../common/elements/PillLabel";

let orderDetails: any[] = [];

const drawerDetailContainer = [
  {
    requestType: "adjust",
    createDrawerDetail: (order: any, rowData: any, partnerName: any) => ({
      ...rowData,
      drawerData: {
        "For Type": (
          <Pill label={rowData.origin} color="info"/>
        ),
        for: rowData.changedFor,
        partner: partnerName,
        details: rowData.details,
        currency: (
          <CurrencyRender
            currencyCode={order.currency}
            labelClass="text-white"
          />
        ),
        amount: (
          <QDFormattedCurrency
            amount={order.amount}
            currency={order.currency}
          />
        ),
        "Created By": order.requestedBy,
        "Date Created": (
          <FormattedDate
            value={new Date(order.creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        ),
        status: order.state,
        "Approved By": "",
        memo: rowData.memo,
      },
      discardObj: {
        origin: rowData.origin,
        changeOrderId: rowData.changeOrderId,
        changeRequestId: rowData.id,
        customerNumber: rowData.customerNumber,
      },
    }),
  },
  {
    requestType: "chargeoff",
    createDrawerDetail: (order: any, rowData: any, partnerName: any) => ({
      ...rowData,
      drawerData: {
        "For Type": (
          <Pill label={rowData.origin} color="info" />
        ),
        for: rowData.changedFor,
        partner: partnerName,
        details: rowData.details,
        currency: (
          <CurrencyRender
            currencyCode={order.currency}
            labelClass="text-white"
          />
        ),
        amount: (
          <QDFormattedCurrency
            amount={order.amount}
            currency={order.currency}
          />
        ),
        "Created By": order.requestedBy,
        "Date Created": (
          <FormattedDate
            value={new Date(order.creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        ),
        status: order.state,
        "Approved By": "",
        memo: rowData.memo,
      },
      discardObj: {
        origin: rowData.origin,
        changeOrderId: rowData.changeOrderId,
        changeRequestId: rowData.id,
        customerNumber: rowData.customerNumber,
      },
    }),
  },
  // missing discardObj
  {
    requestType: "ExchangeMarginRequest",
    createDrawerDetail: (order: any, rowData: any, partnerName: any) => ({
      ...rowData,
      drawerData: {
        "For Type": (
          <Pill label={rowData.origin} color="info" />
        ),
        for: rowData.changedFor,
        partner: partnerName,
        details: rowData.details,
        amount: (
          <QDFormattedCurrency
            amount={order.amount}
            currency={order.currency}
          />
        ),
        action: order.action,
        exchange: order.exchangeName,
        currency: (
          <CurrencyRender
            currencyCode={order.sellCurrency}
            labelClass="text-white"
          />
        ),
        "fee plan": order.feePlan,
        "sell margin percentage": order.sellExchMargin,
        "buy margin percentage": order.buyExchMargin,
        "Created By": order.requestedBy,
        "Date Created": (
          <FormattedDate
            value={new Date(order.creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        ),
        status: order.state,
        "Approved By": "",
        memo: order.memo,
      },
      discardObj: {
        origin: rowData.origin,
        changeOrderId: rowData.changeOrderId,
        changeRequestId: rowData.id,
        partner: partnerName,
        programName: rowData.programName,
      },
    }),
  },
  // Aka: Partner Fee
  {
    requestType: "FeeEntryRequest",
    createDrawerDetail: (order: any, rowData: any, partnerName: any) => ({
      ...rowData,
      drawerData: {
        "For Type": (
          <Pill label={rowData.origin} color="info" />
        ),
        for: rowData.changedFor,
        partner: partnerName,
        details: rowData.details,
        currency: (
          <CurrencyRender
            currencyCode={order.currency}
            labelClass="text-white"
          />
        ),
        "fee amount": (
          <QDFormattedCurrency
            amount={order.fixFee}
            currency={order.currency}
          />
        ),
        "fee amount %": <label>{(order.percentage * 100).toFixed(3)}&#37;</label>,
        "charge receiver": (
          <CheckmarkConverter
            width="12"
            height="12"
            bool={order.chargeReceiver}
          />
        ),
        "receiver fee amount": (
          <QDFormattedCurrency
            amount={order.receiverFixFee}
            currency={order.currency}
          />
        ),
        "receiver fee amount %": <label>{order.receiverPercentage ?
          (order.receiverPercentage * 100).toFixed(3)
          :
          '0.00'}
          &#37;</label>,
        "Created By": order.requestedBy,
        "Date Created": (
          <FormattedDate
            value={new Date(order.creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        ),
        status: order.state,
        "Approved By": "",
        memo: <label style={{whiteSpace: "pre-wrap"}}>{order.memo}</label>,
      },
      discardObj: {
        origin: rowData.origin,
        changeOrderId: order.changeOrderId,
        changeRequestId: order.id,
        // customerNumber: rowData.customerNumber
      },
    }),
  },
  {
    // Fee Pan
    requestType: "FeePlanRequest",
    createDrawerDetail: (order: any, rowData: any, partnerName: any) => ({
      ...rowData,
      drawerData: {
        "For Type": (
          <Pill label={rowData.origin} color="info" />
        ),
        for: rowData.changedFor,
        partner: partnerName,
        details: rowData.details,
        "Fee Plan Name": order.feePlanName,
        "Created By": order.requestedBy,
        "Date Created": (
          <FormattedDate
            value={new Date(order.creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        ),
        status: order.state,
        "Approved By": "",
        memo: order.memo,
      },
      discardObj: {
        origin: rowData.origin,
        changeOrderId: order.changeOrderId,
        changeRequestId: order.id,
        partner: partnerName,
        programName: rowData.programName,
      },
    }),
  },
  {
    requestType: "ProgramAdjustmentRequest",
    createDrawerDetail: (order: any, rowData: any, partnerName: any) => ({
      ...rowData,
      drawerData: {
        "For Type": (
          <Pill label={rowData.origin} color="info" />
        ),
        for: rowData.changedFor,
        partner: partnerName,
        details: rowData.details,
        "Fee Plan Name": order.feePlanName,
        "Created By": order.requestedBy,
        "Date Created": (
          <FormattedDate
            value={new Date(order.creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        ),
        status: order.state,
        "Approved By": "",
        memo: order.memo,
      },
      discardObj: {
        origin: rowData.origin,
        changeOrderId: order.changeOrderId,
        changeRequestId: order.id,
        partner: partnerName,
        programName: rowData.programName,
      },
    }),
  },
  {
    requestType: "RiskConfigRequest",
    createDrawerDetail: (order: any, rowData: any, partnerName: any) => ({
      ...rowData,
      drawerData: {
        "For Type": (
          <Pill label={rowData.origin} color="info" />
        ),
        for: rowData.changedFor,
        partner: partnerName,
        details: rowData.details,
        "Risk Parameter": order.paramName,
        value: order.value,
        "Created By": order.requestedBy,
        "Date Created": (
          <FormattedDate
            value={new Date(order.creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        ),
        status: order.state,
        "Approved By": "",
        memo: order.memo,
      },
      discardObj: {
        origin: rowData.origin,
        changeOrderId: order.changeOrderId,
        changeRequestId: order.id,
        partner: partnerName,
        programName: rowData.programName,
      },
    }),
  },
  {
    requestType: "RiskLevelRequest",
    createDrawerDetail: (order: any, rowData: any, partnerName: any) => ({
      ...rowData,
      drawerData: {
        "For Type": (
          <Pill label={rowData.origin} color="info" />
        ),
        for: rowData.changedFor,
        partner: partnerName,
        details: rowData.details,
        "Risk Level": order.securityLevel,
        "Created By": order.requestedBy,
        "Date Created": (
          <FormattedDate
            value={new Date(order.creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        ),
        status: order.state,
        "Approved By": "",
        memo: order.memo,
      },
      discardObj: {
        origin: rowData.origin,
        changeOrderId: rowData.changeOrderId,
        changeRequestId: rowData.id,
        partner: partnerName,
        programName: rowData.programName,
      },
    }),
  },
  {
    requestType: "withholding",
    createDrawerDetail: (order: any, rowData: any, partnerName: any) => ({
      ...rowData,
      drawerData: {
        "For Type": (
          <Pill label={rowData.origin} color="info" />
        ),
        for: rowData.changedFor,
        partner: partnerName,
        details: rowData.details,
        currency: (
          <CurrencyRender
            currencyCode={order.currency}
            labelClass="text-white"
          />
        ),
        amount: (
          <QDFormattedCurrency
            amount={order.amount}
            currency={order.currency}
          />
        ),
        "Created By": order.requestedBy,
        "Date Created": (
          <FormattedDate
            value={new Date(order.creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        ),
        status: order.state,
        "Approved By": "",
        memo: order.memo,
      },
      discardObj: {
        origin: rowData.origin,
        changeOrderId: rowData.changeOrderId,
        changeRequestId: rowData.id,
        customerNumber: rowData.customerNumber,
      },
    }),
  },
];

const ChangeOrderDetails = (
  changeOrder: string | any[],
  type: string,
  origin: string,
  partnerName: string,
  stat: boolean,
  customerNumber: undefined,
  programName: undefined,
  topLevelMemo: string
) => {
  // To Add
  // fee plan
  // Risk Rule
  // Exchange Margin Pair
  // Program Adjustment Withholding
  if (stat) {
    // eslint-disable-next-line no-return-assign
    return (orderDetails = []);
  }

  if (changeOrder[0].state != "Open") {
    console.log("Approved CO", changeOrder[0])
  }

  let changedFor = "";
  if (origin == "Customer" && customerNumber) {
    changedFor = customerNumber;
  } else if (origin == "Partner" && partnerName) {
    changedFor = partnerName;
  } else if (origin == "Program" && programName) {
    changedFor = programName;
  }

  const rowData = {
    id: changeOrder[0].id,
    changedFor: changedFor,
    details: topLevelMemo,
    memo: changeOrder[0].memo,
    type: changeOrder[0].requestType,
    state: changeOrder[0].state,
    origin,
    createdDate: changeOrder[0].creationTime,
    changeOrderId: changeOrder[0].changeOrderId,
    action: changeOrder[0].action,
    partnerUserId: changeOrder[0].partnerUserId,
    customerNumber,
    programName,
  };

  // eslint-disable-next-line no-shadow
  const createRowObjects = (drawerDetailContainer: any) =>
    drawerDetailContainer
      .filter(
        (drawerDetailObject: any) =>
          drawerDetailObject.requestType === changeOrder[0].type ||
          drawerDetailObject.requestType === changeOrder[0].requestType
      )
      .map((detailObject: any) =>
        detailObject.createDrawerDetail(changeOrder[0], rowData, partnerName)
      );
  orderDetails.push(...createRowObjects(drawerDetailContainer));

  return orderDetails;
};

export default ChangeOrderDetails;
