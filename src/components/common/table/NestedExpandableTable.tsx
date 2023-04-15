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
// eslint-disable-next-line no-use-before-define
import React, { lazy, FC } from "react";
import Table from "@mui/material/Table";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { FormattedMessage } from "react-intl";
import newId from "../../util/NewId";
import { changeOrderTableData } from "./table-data/TableMataData";
import { provideWidth } from "../table/StandardTable";
import Label from "../elements/Label";

const NestedExpandableTableRow = lazy(
  () => import("./NestedExpandableTableRow")
);

interface INestedExpandableTable {
  dataList: any;
  tableRowPrefix: string;
  showApproved: any;
  nestedRowStatus: any;
  nestedRowData: any;
  rowOnDisplay: any;
  deleteChangeOrder: any;
  approveChangeOrder: any;
  approveResponse: any;
}

// @ts-ignore
const NestedExpandableTable: FC<INestedExpandableTable> = ({
  dataList,
  tableRowPrefix,
  showApproved,
  nestedRowStatus,
  nestedRowData,
  rowOnDisplay,
  deleteChangeOrder,
  approveChangeOrder,
  approveResponse,
}) => {
  return (
    <>
      <Table
        size="small"
        aria-label="StandardTable"
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
        }}
      >
        <TableHead>
          <TableRow>
            {changeOrderTableData.map((metadata: any) => {
              const widthSx = provideWidth(metadata);
              return (
                <TableCell
                  key={newId()}
                  id={metadata.header.props.id}
                  className={`${metadata.flex}`}
                  sx={{
                    padding: "10px 15px",
                    ...widthSx,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#8995AD !important",
                      fontSize: "12px",
                      letterSpacing: "-0.2px",
                      lineHeight: "15px",
                    }}
                  >
                    {metadata.header}
                  </Typography>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {dataList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={changeOrderTableData.length}>
                <Label size="body">
                  <FormattedMessage
                    id="standardtable.emptyrow"
                    defaultMessage="There are no results to display."
                  />
                </Label>
              </TableCell>
            </TableRow>
          ) : null}
          {dataList.map(
            (data: { expandableData: undefined; state: string }, idx: number) =>
              data.expandableData !== undefined ? (
                <NestedExpandableTableRow
                  data={data}
                  idx={idx}
                  tableRowPrefix={tableRowPrefix}
                  nestedRowStatus={nestedRowStatus}
                  nestedRowData={nestedRowData}
                  rowOnDisplay={rowOnDisplay}
                  deleteChangeOrder={deleteChangeOrder}
                  approveChangeOrder={approveChangeOrder}
                  approveResponse={approveResponse}
                />
              ) : (
                // note: need to check this as col.className does not resolve anything
                <TableRow id={`${tableRowPrefix}-${idx}`} key={newId()}>
                  {changeOrderTableData.map((col: any) => (
                    <TableCell key={col.key}>
                      {col.render(data, col.className, col.icon)}
                    </TableCell>
                  ))}
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default NestedExpandableTable;
