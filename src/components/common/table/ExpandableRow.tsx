/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import React, { useState, FC } from "react";
import Collapse from "@mui/material/Collapse";
import newId from "../../util/NewId";
import Icon from "../Icon";

interface IExpandableRow {
  tableMetadata: any;
  data: any;
  tableRowPrefix: string;
  idx: number;
}

const ExpandableRow: FC<IExpandableRow> = ({
  tableRowPrefix = "",
  tableMetadata,
  data,
  idx,
}) => {
  const [expanded, setExpanded] = useState(false);
  const icon = expanded ? Icon.collapseIcon : Icon.expandIcon;

  return (
    <>
      <tr
        id={`${tableRowPrefix}-${idx}`}
        key={newId()}
        className={expanded ? "row-shadow" : ""}
      >
        {tableMetadata.map((col: any, index: number) => (
          <td key={col.key} className={`body-normal flex-1 ${col.flex}`}>
            {col.render(data, index === 0 ? icon : "", () =>
              setExpanded(!expanded)
            )}
          </td>
        ))}
      </tr>

      <Collapse in={expanded}>
        {data.expandableData.map((expand: any, index: any) => (
          <tr id={`${tableRowPrefix}-${index}`} key={newId()}>
            {tableMetadata.map((col: any) => (
              <td key={col.key} className={`body-normal flex-1 ${col.flex}`}>
                {col.render(expand)}
              </td>
            ))}
          </tr>
        ))}
        <tr key={newId()}>
          <td key={data.key} colSpan={10} />
        </tr>
      </Collapse>
    </>
  );
};

export default ExpandableRow;
