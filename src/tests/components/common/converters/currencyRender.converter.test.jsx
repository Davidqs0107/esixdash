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
import { shallow, mount } from "enzyme";
import { shallowIntl, mountIntl } from "../../../test-utils";
import CurrencyRender from "../../../../components/common/converters/CurrencyRender";
import CurrencyCodeToFlag from "../../../../components/common/converters/CurrencyCodeToFlag";

describe("Currency Render Converter", () => {
  it("Currency Render should have a currencyCode prop passed in", () => {
    const container = shallow(<CurrencyRender currencyCode="USD" />);
    const currencyCodeToFlagComp = container.find(CurrencyCodeToFlag);
    expect(currencyCodeToFlagComp.get(0).props.currencyCode).toEqual("USD");
  });
  it("Currency Render should display flag img by default", () => {
    const container = mount(<CurrencyRender currencyCode="USD" />);
    expect(container.find("svg").exists()).toBeTruthy();
  });
  it("Currency Render should not display img flag when displayFlag prop is false", () => {
    const container = shallowIntl(
      <CurrencyRender currencyCode="USD" displayFlag={false} />
    );
    expect(container.children().get(0).props.displayFlag).toBeFalsy();
  });
});
