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
import { shallow } from "enzyme";
import ContactInfoWithPill from "../../../components/customer/ContactInfoWithPill";

describe("Creating pill from Customer Detail and Row Data", () => {
  it("It should create a pill with the label of the Phone type", () => {
    const contactInfo = {
      creationTime: 1617816430580,
      modifiedTime: 1617816430580,
      name: "contactInfo",
      mimetype: "text/plain",
      value: "5126779999",
      id: "3A2A565651F35ABD2ED336286BF0C9B6-1000014001",
    };
    const contactMethod = {
      creationTime: 1617816430580,
      modifiedTime: 1617816430580,
      name: "contactMethod",
      mimetype: "text/plain",
      value: "Phone",
      id: "93E7559C217568B22B778410B7882080-1000014001",
    };
    const phones = [
      {
        creationTime: 1617662337624,
        modifiedTime: 1617662337624,
        id: "32CC29B9D43CE14CEA2534A853EDA214-1000014001",
        type: "home",
        phoneNumber: "5126779999",
        countryCode: "1",
      },
      {
        creationTime: 1617662337624,
        modifiedTime: 1617662337624,
        id: "EA042B5F0FB77B33D7475C36C0B59848-1000014001",
        type: "mob",
        phoneNumber: "5125551212",
        countryCode: "1",
      },
    ];

    const contactInfoTest = shallow(
      <ContactInfoWithPill
        contactInfo={contactInfo}
        contactMethod={contactMethod}
        phones={phones}
        emails={[]}
      />
    );
    expect(contactInfoTest.prop("label")).toEqual("home");
  });
});

describe("Creating pill from Customer Detail and Row Data", () => {
  it("It should create a pill with the label of the Email type", () => {
    const contactInfo = {
      creationTime: 1617816444615,
      modifiedTime: 1617816444615,
      name: "contactInfo",
      mimetype: "text/plain",
      value: "nobody16176623376250@nowhere.com",
      id: "A03BF9A42E37746615DA9C4BC7568702-1000014001",
    };
    const contactInfo2 = {
      creationTime: 1617816444615,
      modifiedTime: 1617816444615,
      name: "contactInfo",
      mimetype: "text/plain",
      value: "nobody16176623376251@nowhere.com",
      id: "A03BF9A42E37746615DA9C4BC7568702-1000014001",
    };
    const contactMethod = {
      creationTime: 1617816444615,
      modifiedTime: 1617816444615,
      name: "contactMethod",
      mimetype: "text/plain",
      value: "Email",
      id: "19A10559D5F1AAC5AE8D616A7C25EB55-1000014001",
    };
    const email = [
      {
        creationTime: 1617662337624,
        modifiedTime: 1617662337624,
        id: "5BC4D53BEC13590921F1F5CFFCC5D0D6-1000015001",
        type: "personal",
        email: "nobody16176623376250@nowhere.com",
        state: "verified",
      },
      {
        creationTime: 1617662337633,
        modifiedTime: 1617662337633,
        id: "5BC4D53BEC13590921F1F5CFFCC5D0D6-1000015002",
        type: "work",
        email: "nobody16176623376251@nowhere.com",
        state: "verified",
      },
    ];
    const contactInfoTest = shallow(
      <ContactInfoWithPill
        contactInfo={contactInfo}
        contactMethod={contactMethod}
        phones={[]}
        emails={email}
      />
    );
    const contactInfoTest2 = shallow(
      <ContactInfoWithPill
        contactInfo={contactInfo2}
        contactMethod={contactMethod}
        phones={[]}
        emails={email}
      />
    );
    expect(contactInfoTest.prop("label")).toEqual("personal");
    expect(contactInfoTest2.prop("label")).toEqual("work");
  });
});
