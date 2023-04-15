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

import React from "react";
import { shallow } from "enzyme";
import ClickableRender from "../../../components/common/ClickableRender";

describe("Clickable Render", () => {
  const LABEL = "Clickable Render";
  const TEST_CLASS = "testClass";
  const mockCallBack = jest.fn();
  // eslint-disable-next-line max-len
  const container = shallow(
    <ClickableRender
      className={TEST_CLASS}
      data={LABEL}
      onClickFunc={mockCallBack}
    />
  );

  test("Should render clickable text that executes a function on click", () => {
    expect(container.exists()).toBe(true);
    expect(container.getElement().props.onClick).toBeDefined();
    expect(container.find(".testClass").getElement().props.className).toEqual(
      TEST_CLASS
    );
    expect(container.find(".testClass").text()).toEqual(LABEL);
    // Simulate onclick event
    container.simulate("click");
    expect(mockCallBack.mock.calls.length).toEqual(1);
  });
});
