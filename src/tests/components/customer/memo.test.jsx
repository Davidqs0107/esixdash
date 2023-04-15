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

import { MemoDrawerMethods } from "../../../components/customer/MemoDrawerMethods";

const memoID = "0933DF610BBBB5E56BFF884CC3C32981-1000016000";
const memo = {
  creationTime: 1617979923273,
  modifiedTime: 1617979923273,
  id: memoID,
  memo: "This is a memo test",
  attributes: [
    {
      creationTime: 1617979923260,
      modifiedTime: 1617979923260,
      name: "externalReference",
      mimetype: "text/plain",
      value: "SomeoneNew",
      id: "0933DF610BBBB5E56BFF884CC3C32981-1000016000",
    },
    {
      creationTime: 1617979923260,
      modifiedTime: 1617979923260,
      name: "contactInfo",
      mimetype: "text/plain",
      value: "nowItsAnEmail@test.com",
      id: "45FCFFD5CCCB173EFC321454A696EF87-1000016000",
    },
    {
      creationTime: 1617979923260,
      modifiedTime: 1617979923260,
      name: "contactMethod",
      mimetype: "text/plain",
      value: "Email",
      id: "DF9BFD58DEEA4B76C8186F7C86CC208E-1000016000",
    },
  ],
  createdBy: {
    id: "B5723C0B9490E6772C9CBD431089C014-1000016000",
    userName: "h3-all-roles",
    firstName: "Joe",
    lastName: "AllRoles",
  },
};

describe("Test findAndAddAttr method to find and return given values from attribute arrays", () => {
  it("It should find the passed element in the attribute array and return it", () => {
    expect(
      MemoDrawerMethods().findAndAddAttr("externalReference", memo.attributes)
        .value
    ).toEqual("SomeoneNew");
    expect(
      MemoDrawerMethods().findAndAddAttr("contactInfo", memo.attributes).value
    ).toEqual("nowItsAnEmail@test.com");
    expect(
      MemoDrawerMethods().findAndAddAttr("contactMethod", memo.attributes).value
    ).toEqual("Email");
  });
});

describe("Test findAndUpdateAttr that find given values from attribute arrays and update them with new values", () => {
  const newExtRef = "newExternalReference";
  const newContactEmail = "newContactInfo@email.com";
  const contactM = "Phone";

  it("It should find the passed element in the attribute array and return it", () => {
    expect(
      MemoDrawerMethods().findAndUpdateAttr(
        "externalReference",
        newExtRef,
        memo.attributes
      ).value
    ).toEqual(newExtRef);
    expect(
      MemoDrawerMethods().findAndUpdateAttr(
        "contactInfo",
        newContactEmail,
        memo.attributes
      ).value
    ).toEqual(newContactEmail);
    expect(
      MemoDrawerMethods().findAndUpdateAttr(
        "contactMethod",
        contactM,
        memo.attributes
      ).value
    ).toEqual(contactM);
  });
});

describe("Test update memo method", () => {
  it("It should update the memoDTO attributes and memo while memoID and customerNumber remain the same", () => {
    expect(MemoDrawerMethods().updateMemo(memo, memoID).sameId).toEqual(memoID);
    expect(
      MemoDrawerMethods().updateMemo(memo, memoID).updatedMemoDto.memo
    ).toEqual("This is a memo test");
    expect(
      MemoDrawerMethods().updateMemo(memo, memoID).updatedMemoDto.attributes
    ).toEqual(memo.attributes);
  });
});

describe("Test the add memo method", () => {
  it("It should update the memoDTO attributes and memo while memoID and customerNumber remain the same", () => {
    /* The values are set in the addMemo method this test just validates that the DTO objects
     * are constructed correctly */
    expect(MemoDrawerMethods().addMemo().memo).toEqual("A Memo");
    expect(MemoDrawerMethods().addMemo().attributes).toEqual([
      { name: "externalReference", value: "A Reference" },
      {
        name: "contactInfo",
        value: "1231231234",
      },
      { name: "contactMethod", value: "Phone" },
    ]);
  });
});
