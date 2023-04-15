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
 */

// eslint-disable-next-line import/prefer-default-export
export const MemoDrawerMethods = () => {
  // eslint-disable-next-line no-return-assign,no-param-reassign
  const findAndUpdateAttr = (name: string, newData: any, attrs: any[]) =>
    attrs.find((i) => (i.name === name ? (i.value = newData) : ""));
  const findAndAddAttr = (name: string, attrs: any[]) =>
    attrs.find((i) => (i.name === name ? i.value : ""));

  const updateMemo = (data: any) => {
    const existingMemoData = {
      memo: "before",
      attributes: [
        {
          creationTime: 1617979923260,
          modifiedTime: 1617979923260,
          name: "externalReference",
          mimetype: "text/plain",
          value: "Someone",
          id: "0933DF610BBBB5E56BFF884CC3C32981-1000016000",
        },
        {
          creationTime: 1617979923260,
          modifiedTime: 1617979923260,
          name: "contactInfo",
          mimetype: "text/plain",
          value: "1231231234",
          id: "45FCFFD5CCCB173EFC321454A696EF87-1000016000",
        },
        {
          creationTime: 1617979923260,
          modifiedTime: 1617979923260,
          name: "contactMethod",
          mimetype: "text/plain",
          value: "Phone",
          id: "DF9BFD58DEEA4B76C8186F7C86CC208E-1000016000",
        },
      ],
    };
    /* Need to find the attribute values for the new data */
    const externalReference = findAndAddAttr(
      "externalReference",
      data.attributes
    ).value;
    const contactInfo = findAndAddAttr("contactInfo", data.attributes).value;
    const contactMethod = findAndAddAttr(
      "contactMethod",
      data.attributes
    ).value;

    /* Update the existing memo to not change the ID's */
    findAndUpdateAttr(
      "externalReference",
      externalReference,
      existingMemoData.attributes
    );
    findAndUpdateAttr("contactInfo", contactInfo, existingMemoData.attributes);
    findAndUpdateAttr(
      "contactMethod",
      contactMethod,
      existingMemoData.attributes
    );
    existingMemoData.memo = data.memo;

    return {
      updatedMemoDto: existingMemoData,
      sameId: data.id,
    };
  };

  const addMemo = () => {
    const inputValues = {
      memo: "A Memo",
      contactMethod: "Phone",
      contactInfo: "1231231234",
      externalReference: "A Reference",
    };
    const attributes = [];
    attributes.push({
      name: "externalReference",
      value: inputValues.externalReference,
    });
    attributes.push({ name: "contactInfo", value: inputValues.contactInfo });
    attributes.push({
      name: "contactMethod",
      value: inputValues.contactMethod,
    });

    return {
      attributes,
      memo: inputValues.memo,
    };
  };

  return {
    findAndAddAttr,
    findAndUpdateAttr,
    updateMemo,
    addMemo,
  };
};
