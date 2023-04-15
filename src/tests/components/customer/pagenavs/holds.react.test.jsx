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
import PageNavHolds from "../../../../components/customer/pagenavs/PageNavHolds";
import { shallowIntl } from "../../../test-utils";

describe(" Holds subnav", () => {
  it("should match the snapshot", () => {
    // We use the test-utils render here to use react-intl with the English locale
    const subnav = shallowIntl(<PageNavHolds customerNumber="123456" />);
    expect(subnav.html()).toMatchSnapshot();
  });
});
