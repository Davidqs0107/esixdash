/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
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
import React, { useState, FC } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useIntl } from "react-intl";
import newId from "../../util/NewId";
import {
  changeOrderNestedTableData,
  changeOrderTableData,
} from "./table-data/TableMataData";
import Icon from "../Icon";
import { provideWidth } from "../table/StandardTable";

interface INestedExpandableRow {
  tableRowPrefix: any;
  data: any;
  idx: any;
  nestedRowStatus: any;
  deleteChangeOrder: any;
  approveChangeOrder: any;
  approveResponse: any;
  nestedRowData: any;
  rowOnDisplay: any;
}

const NestedExpandableRow: FC<INestedExpandableRow> = ({
  tableRowPrefix,
  data,
  idx,
  nestedRowStatus,
  deleteChangeOrder,
  approveChangeOrder,
  approveResponse,
}) => {
  const [expanded, setExpanded] = useState(false);
  const intl = useIntl();

  const icon = expanded ? Icon.collapseIcon : Icon.expandIcon;
  const rowData = data.expandableData;

  const clean = rowData.filter(
    (arr: { id: any }, index: any, self: any[]) =>
      index === self.findIndex((t) => t.id === arr.id)
  );

  const noOfColumns = changeOrderTableData.length;

  return (
    <>
      <TableRow
        id={`${tableRowPrefix}-${idx}`}
        key={newId()}
        className={`${expanded ? "source-expanded" : ""}`}
        sx={{
          "&.source-expanded": {
            transform: "scale(1)",
            boxShadow: "0 10px 30px -10px rgb(33 31 64 / 10%)",
            position: "relative",
            zIndex: "1",
          },
        }}
      >
        {changeOrderTableData.map((column: any, index) => {
          const widthSx = provideWidth(column);
          return (
            <TableCell
              headers={column.header.props.id}
              key={column.key}
              sx={{
                padding: "0 !important",
                ...widthSx,
              }}
            >
              <Box
                className="MuiBox-wrapper"
                sx={{
                  padding: column.cellPadding,
                }}
              >
                {column.render(
                  data,
                  index === 0 && clean.length > 0 ? icon : "",
                  () => {
                    setExpanded(!expanded);
                    nestedRowStatus(!expanded, data.id, data.pendingChange);
                  },
                  deleteChangeOrder,
                  approveChangeOrder,
                  approveResponse
                )}
              </Box>
            </TableCell>
          );
        })}
      </TableRow>

      <TableRow className={`${expanded ? "row-expanded" : ""}`}>
        <TableCell colSpan={noOfColumns} sx={{ padding: "0px !important" }}>
          <Accordion
            expanded={expanded}
            sx={{ padding: "0px", boxShadow: "none !important" }}
          >
            <AccordionSummary
              aria-controls="panel1bh-content"
              id="panel1bh-header"
              sx={{ display: "none" }}
            ></AccordionSummary>
            <AccordionDetails sx={{ padding: "0px" }}>
              <Table
                padding="none"
                sx={{
                  boxShadow: "none",
                  backgroundColor: "#fff",
                }}
              >
                <TableBody
                  sx={{
                    "&::before": {
                      lineHeight: "0px !important",
                    },
                    "&::after": {
                      lineHeight: "0px !important",
                    },
                  }}
                >
                  {clean.map((item: any) => (
                    <TableRow key={newId()}>
                      {changeOrderNestedTableData.map((column: any) => {
                        const widthSx = provideWidth(column);
                        return (
                          // eslint-disable-next-line jsx-a11y/scope
                          <TableCell
                            key={newId()}
                            sx={{
                              padding: "18px 16px !important",
                              ...widthSx,
                            }}
                          >
                            {column.render(
                              {
                                ...item,
                                ...{
                                  banks: data.banks,
                                  pendingChange: data.pendingChange,
                                },
                              },
                              item.partner === "h3" ? icon : "",
                              // eslint-disable-next-line @typescript-eslint/no-empty-function
                              () => {},
                              //intl,
                              deleteChangeOrder,
                              approveChangeOrder,
                              approveResponse
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </Accordion>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow sx={{ background: "transparent !important", height: "15px" }}>
          <TableCell
            colSpan={noOfColumns}
            sx={{ padding: "0px !important" }}
          ></TableCell>
        </TableRow>
      )}
    </>
  );
};

export default NestedExpandableRow;
