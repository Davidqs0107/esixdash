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

import React, { Children } from "react";
import { SortableContainer } from "react-sortable-hoc";

// @ts-ignore
const Sortable = SortableContainer(({ items: list, ...rest }) => {
  const { children } = rest;
  return (
    <div>
      {Children.map(children, (child) =>
        React.cloneElement(child, { ...rest, dataList: list, isSortable: true })
      )}
    </div>
  );
});

export default Sortable;
