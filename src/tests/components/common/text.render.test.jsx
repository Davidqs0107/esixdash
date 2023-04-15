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
import TextRender from "../../../components/common/TextRender";

describe("Text Render", () => {
  test("Should render text and icon if provided", () => {
    const TEXT_RENDER_TEXT = "Test Text Render";
    const TEXT_RENDER_CLASSNAME = "testClass";
    // eslint-disable-next-line max-len
    const container = shallow(
      <TextRender data={TEXT_RENDER_TEXT} className={TEXT_RENDER_CLASSNAME} />
    );
    expect(container.exists()).toBe(true);
    expect(container.html()).toMatch(TEXT_RENDER_TEXT);
  });
});
