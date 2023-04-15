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
import { render as reactRender } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { shallow, mount } from "enzyme";

const render = (ui, { locale = "en", ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => (
    <IntlProvider locale={locale}>{children}</IntlProvider>
  );
  return reactRender(ui, { wrapper: Wrapper, ...renderOptions });
};

const shallowIntl = (node, { context, ...options } = {}) =>
  shallow(<IntlProvider locale="en">{node}</IntlProvider>, {
    ...options,
    context: { ...context },
  });

const mountIntl = (node, { context, ...options } = {}) =>
  mount(<IntlProvider locale="en">{node}</IntlProvider>, {
    ...options,
    context: { ...context },
  });

export * from "@testing-library/react";

export { render, shallowIntl, mountIntl };
