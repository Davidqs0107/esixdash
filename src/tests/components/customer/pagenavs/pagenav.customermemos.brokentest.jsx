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
import { shallowIntl } from "../../../test-utils";
import PageNavCustomerMemos from "../../../../components/customer/pagenavs/pagenav.customermemos";

describe(" Customer Detail - Subnav - Customer Memos", () => {
  const subNav = shallowIntl(<PageNavCustomerMemos customerNumber="123456" />);
  it("should match the snapshot", () => {
    expect(subNav.html()).toMatchSnapshot();
  });
});
