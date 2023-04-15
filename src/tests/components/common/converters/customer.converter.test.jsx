/*
 * Copyright (c) 2015-2021, Episode Six and/or its affiliates. All rights reserved.
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

import React from "react";
import toCustomerUI from "../../../../components/common/converters/CustomerConverter";
import toCustomerName from "../../../../components/common/converters/CustomerNameConverter";

const customerList = {
  count: 1,
  startIndex: 0,
  endIndex: 2,
  lastPage: false,
  totalCount: 2,
  data: [
    {
      creationTime: 1617810590031,
      modifiedTime: 1617810590031,
      customerNumber: "10000161310295",
      securityLevel: 0,
      feePlanName: "default",
      programName: "h3",
      person: {
        creationTime: 1617810590031,
        modifiedTime: 1617810590031,
        id: "148A1AB4B5C261ADD59B4B2424A7C714-1000020000",
        firstName: "Joe",
        lastName: "Test",
        gender: "male",
        dob: "19900101",
        embossedName: "JOE TEST",
      },
      address: {
        creationTime: 1617810591063,
        modifiedTime: 1617810591063,
        id: "B3D2B523533549C601B3C9D23CFA1CCB-1000020000",
        type: "home",
        line1: "211 Walter Seaholm Dr.",
        postalCode: "787-0199",
        city: "Austin",
        state: "TX",
        country: "US",
      },
      emails: [
        {
          creationTime: 1617810590032,
          modifiedTime: 1617810590032,
          id: "1367408B3849F2554A17F68D51AF5A91-1000020000",
          type: "personal",
          email: "nobody16178105900320@nowhere.com",
          state: "verified",
        },
      ],
      phones: [
        {
          creationTime: 1617810590032,
          modifiedTime: 1617810590032,
          id: "43F276B53BAB25049C2261D09973AB0B-1000020000",
          type: "mob",
          phoneNumber: "5125551212",
          countryCode: "1",
        },
      ],
      extRefs: [
        {
          creationTime: 1617810590050,
          modifiedTime: 1617810590050,
          id: "9D22B8406D1A8AC9A56678D37044B665-1000020000",
          customerId: "148A1AB4B5C261ADD59B4B2424A7C714-1000020000",
          partnerId: "8F1924B680C0333A7D938905CE8FEBA0-1000020000",
          referenceNumber: "h3-ext-ref-1617810589927",
          identifierCode: "h3-id-code-1617810589927",
          partnerName: "h3",
          customerNumber: "10000161310295",
          attributes: [],
          history: "current",
        },
      ],
      cards: [],
    },
    {
      creationTime: 1617810589767,
      modifiedTime: 1617810589767,
      customerNumber: "10000161290620",
      securityLevel: 0,
      feePlanName: "default",
      programName: "h3",
      person: {
        creationTime: 1617810589767,
        modifiedTime: 1617810589767,
        id: "4EFB76D2F66305DCB91C8D744D77C22F-1000020000",
        firstName: "Another",
        lastName: "Customer",
        gender: "male",
        dob: "19900101",
        embossedName: "JOE TEST",
      },
      address: {
        creationTime: 1617810589767,
        modifiedTime: 1617810589767,
        id: "2E526C0D4154A6CE681FDCBE264C5BC4-1000020000",
        type: "home",
        line1: "211 Walter Seaholm Dr.",
        postalCode: "787-0199",
        city: "Austin",
        state: "TX",
        country: "US",
      },
      emails: [
        {
          creationTime: 1617810589767,
          modifiedTime: 1617810589767,
          id: "B55D68F5A833915999AB64CCCCA17774-1000020000",
          type: "personal",
          email: "nobody1280@nowhere.com",
          state: "verified",
        },
      ],
      phones: [
        {
          creationTime: 1617810589767,
          modifiedTime: 1617810589767,
          id: "72606ECE86A699A7FC03047A1C40B58B-1000020000",
          type: "mob",
          phoneNumber: "5125551414",
          countryCode: "1",
        },
      ],
      extRefs: [],
      cards: [
        {
          creationTime: 1617810589875,
          modifiedTime: 1617815979853,
          id: "D8ADB096BFF64C1F80DD10372FE70253-1000020000",
          cardNumber: "1157769587284680042",
          panFirst6: "555555",
          panLast4: "0100",
          type: "phy",
          state: "shipped",
          sequenceNumber: 1,
          cardProfileName: "h3-personalized-card",
          pinFailCount: 0,
          reissue: false,
          expiry: "202804",
          customerNumber: "10000161290620",
          embossedName: "JOE TEST",
        },
      ],
    },
  ],
};
describe("Customer Converter", () => {
  it("Convert customer data into a list", () => {
    expect(toCustomerUI(customerList)[0].id).toEqual("10000161310295");
    expect(toCustomerUI(customerList)[0].email).toEqual(
      "nobody16178105900320@nowhere.com"
    );
    expect(toCustomerUI(customerList)[0].givenName).toEqual("Joe");
    expect(toCustomerUI(customerList)[0].familyName).toEqual("Test");
    expect(toCustomerUI(customerList)[0].contact).toEqual("+1 5125551212");
    expect(toCustomerUI(customerList)[1].id).toEqual("10000161290620");
    expect(toCustomerUI(customerList)[1].email).toEqual(
      "nobody1280@nowhere.com"
    );
    expect(toCustomerUI(customerList)[1].givenName).toEqual("Another");
    expect(toCustomerUI(customerList)[1].familyName).toEqual("Customer");
    expect(toCustomerUI(customerList)[1].contact).toEqual("+1 5125551414");
  });
});

const maleCustomer = {
  creationTime: 1617810590031,
  modifiedTime: 1617810590031,
  id: "6790DB53240D01A628B52A160989C27E-1000021000",
  customerNumber: "10000161310295",
  primaryPerson: {
    creationTime: 1617810590031,
    modifiedTime: 1617810590031,
    id: "6790DB53240D01A628B52A160989C27E-1000021000",
    firstName: "Joe",
    lastName: "Test",
    gender: "male",
    dob: "19900101",
    embossedName: "JOE TEST",
  },
  securityLevel: 0,
  language: "en-US",
  homeCurrency: "JPY",
  programName: "h3",
  feePlanName: "default",
};
describe("Customer name converter", () => {
  it("Should return customers with the appropriate prefix in the name", () => {
    expect(toCustomerName(maleCustomer)).toEqual("Joe Test");
  });
});
