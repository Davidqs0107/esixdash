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
import TxTypeConverter from "../../../../components/common/converters/TxTypeConverter";
import { shallowIntl } from "../../../test-utils";

describe("Tx Type Converter", () => {
  it("should handle unexpected values gracefully", () => {
    const test = 1 / 0;
    const txType = shallowIntl(<TxTypeConverter txTypeCode={test} />);
    expect(txType.render().text()).toEqual("");
  });

  it("should convert 0 to unknown", () => {
    const txType = shallowIntl(<TxTypeConverter txTypeCode={0} />);
    expect(txType.render().text()).toEqual("Unknown");
  });

  it("should convert 1 to New Account", () => {
    const txType = shallowIntl(<TxTypeConverter txTypeCode={1} />);
    expect(txType.render().text()).toEqual("New Account");
  });

  it("should convert 6 to partner", () => {
    const txType = shallowIntl(<TxTypeConverter txTypeCode={6} />);
    expect(txType.render().text()).toEqual("Withdraw");
  });

  it("should convert 20 to Reward", () => {
    const txType = shallowIntl(<TxTypeConverter txTypeCode={20} />);
    expect(txType.render().text()).toEqual("Reward");
  });

  it("should convert 21 to Shipping", () => {
    const txType = shallowIntl(<TxTypeConverter txTypeCode={21} />);
    expect(txType.render().text()).toEqual("Shipping");
  });

  it("should convert 27 to Cashback", () => {
    const txType = shallowIntl(<TxTypeConverter txTypeCode={27} />);
    expect(txType.render().text()).toEqual("Cashback");
  });

  it("should convert 28 to Fee", () => {
    const txType = shallowIntl(<TxTypeConverter txTypeCode={28} />);
    expect(txType.render().text()).toEqual("Fee");
  });
});
