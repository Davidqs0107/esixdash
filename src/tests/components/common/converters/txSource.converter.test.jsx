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
import TxSourceConverter from "../../../../components/common/converters/TxSourceConverter";
import { shallowIntl } from "../../../test-utils";

describe("Tx Source Converter", () => {
  it("should handle unexpected values gracefully", () => {
    const test = 1 / 0;
    const txSource = shallowIntl(<TxSourceConverter txSourceCode={test} />);
    expect(txSource.render().text()).toEqual("");
  });

  it("should convert 0 to unknown", () => {
    const txSource = shallowIntl(<TxSourceConverter txSourceCode={0} />);
    expect(txSource.render().text()).toEqual("Unknown");
  });

  it("should convert 6 to partner", () => {
    const txSource = shallowIntl(<TxSourceConverter txSourceCode={6} />);
    expect(txSource.render().text()).toEqual("Partner");
  });
});
