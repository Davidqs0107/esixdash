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

import { shallow } from "enzyme";
import React from "react";
import Login from "../pages/authentication/Login";
import { shallowIntl } from "./test-utils";

describe(" </Login/> with other props", () => {
  const history = {
    push: jest.fn(),
  };

  const container = shallowIntl(<Login history={history} />); // loading the container

  it("should have proper login screen components", () => {
    expect(container.find("#partnerNameInput").exists());
    expect(container.find("#userNameInput").exists());
    expect(container.find("#passwordInput").exists());
    expect(container.find("#rememberMe").exists());
    expect(container.find("#Login").exists());
  });

  it("should have correct default states", () => {
    const rememberMeCheckbox = shallow(<remember-me />);
    rememberMeCheckbox.find(".checked").forEach((node) => {
      expect(node.props.checked).toEqual(true);
    });
  });
});
