/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import { FormattedMessage } from "react-intl";
import React, { FC } from "react";
import newId from "../../util/NewId";
import { Table } from "@mui/material";
import { tableCellClasses } from "@mui/material/TableCell";
import ExpandableRow from "./ExpandableRow";

interface IExpandableTable {
  tableMetadata: any;
  dataList: any;
  tableRowPrefix: string;
  className?: string;
}

function testYou() {}

const ExpandableTable: FC<IExpandableTable> = ({
  tableMetadata,
  dataList,
  tableRowPrefix = "",
  className,
}) => (
  <>
    <Table
      component="table"
      id={`${tableRowPrefix}-thead`}
      size="small"
      aria-label="StandardTable"
      sx={{
        [`& .${tableCellClasses.root}`]: {
          borderBottom: "none",
        },
        marginBottom: "70px",
      }}
      className={className}
    >
      <thead>
        <tr>
          {tableMetadata.map((metadata: any) => (
            <th
              key={newId()}
              className={`label-regular flex-1 ${metadata.flex}`}
            >
              {metadata.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataList.length === 0 ? (
          <tr>
            <td colSpan={tableMetadata.length}>
              <span>
                <FormattedMessage
                  id="standardtable.emptyrow"
                  defaultMessage="There are no results to display."
                />
              </span>
            </td>
          </tr>
        ) : null}

        {dataList.map((data: any, idx: number) =>
          data.expandableData !== undefined ? (
            <ExpandableRow
              data={data}
              tableMetadata={tableMetadata}
              idx={idx}
              tableRowPrefix={tableRowPrefix}
            />
          ) : (
            <tr id={`${tableRowPrefix}-${idx}`} key={newId()}>
              {tableMetadata.map((col: any) => (
                // eslint-disable-next-line max-len
                <td key={col.key} style={{ wordBreak: "break-word" }}>
                  {col.render(data, col.className, col.icon, () => testYou())}
                </td>
              ))}
            </tr>
          )
        )}
      </tbody>
    </Table>
    <div />
  </>
);

export default ExpandableTable;
