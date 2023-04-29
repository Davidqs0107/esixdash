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

import React, { useState } from "react";
import { Table, TableBody } from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { SortableElement, SortableElementProps } from "react-sortable-hoc";
import { FormattedMessage } from "react-intl";
import TablePagination from "../TablePagination";
import newId from "../../util/NewId";
import TableCursorPagination from "../TableCursorPagination";
import Label from "../elements/Label";
import Header from "../elements/Header";

const previousCursorMap = new Map();

interface IStandardTable {
  id: string;
  tableMetadata: any;
  dataList?: object[];
  setDto?(...args: unknown[]): unknown;
  dto?: {
    startIndex?: number;
  };
  isSortable?: boolean;
  setCursor?(...args: unknown[]): unknown;
  cursor?:
    | {
        portfolioId: string;
      }
    | undefined
    | any;
  nextCursor?: Record<string, object>;
  tableRowPrefix?: string;
  offsetPaginationElements?: {
    paginationSize: number;
    currentPage: number;
    startIndex: number;
    endIndex: number;
    rangeStart: number;
    rangeEnd: number;
    pageSize: number;
    pagesCount: number;
    totalCount: number;
  };
  setOffsetPaginationElements?(...args: unknown[]): unknown;
  customFooter?: string;
  customStyle?: any;
  className?: string;
  tableTitle?: string;
}

export const provideWidth = (metadata: any) => {
  const { width } = metadata;
  if (width) {
    return {
      minWidth: width,
      width: width,
    };
  }
};

const StandardTable: React.FC<IStandardTable> = ({
  id,
  tableMetadata,
  dataList = [],
  dto = {},
  setDto = () => {},
  isSortable = false,
  tableRowPrefix = null,
  setCursor = () => {},
  cursor = undefined,
  nextCursor = undefined,
  customFooter = undefined,
  customStyle = undefined,
  offsetPaginationElements = {
    paginationSize: 0,
    currentPage: 0,
    startIndex: 0,
    endIndex: 0,
    rangeStart: 0,
    rangeEnd: 0,
    pageSize: 0,
    pagesCount: 0,
    totalCount: 0,
  },
  setOffsetPaginationElements = () => {},
  className = "",
  tableTitle,
}) => {
  const {
    paginationSize,
    currentPage,
    startIndex,
    endIndex,
    rangeStart,
    rangeEnd,
    pageSize,
    pagesCount,
    totalCount,
  } = offsetPaginationElements;

  const odd = paginationSize % 2 === 1;
  const PAGINATION_MIDDLE = Math.ceil(paginationSize / 2);

  /* used in paginated cursor search */
  const [previousCursor, setPreviousCursor] = useState(undefined);

  const calculateDisplayRanges = (currentIndex: any) => {
    let end = currentIndex * pageSize + pageSize;
    end = end > totalCount ? totalCount : end;
    return {
      newRangeStart: currentIndex * pageSize + 1,
      newRangeEnd: end,
    };
  };

  const calculateIndexes = (currentIndex: any) => {
    let startPage;
    let endPage;
    if (pagesCount <= paginationSize) {
      // less than PAGINATION_SIZE total pages so show all
      startPage = 0;
      endPage = pagesCount;
    } else {
      // more than PAGINATION_SIZE total pages so calculate start and end pages
      // eslint-disable-next-line no-lonely-if
      if (startIndex > 0 && currentIndex < startIndex + PAGINATION_MIDDLE) {
        startPage = odd
          ? currentIndex - PAGINATION_MIDDLE + 1
          : currentIndex - PAGINATION_MIDDLE;
        endPage = currentIndex + PAGINATION_MIDDLE;
        if (startPage < 0) {
          endPage -= startPage;
          startPage = 0;
        }
      } else if (currentIndex < startIndex + PAGINATION_MIDDLE) {
        startPage = startIndex;
        endPage = endIndex;
      } else if (currentIndex + (PAGINATION_MIDDLE - 1) >= pagesCount) {
        startPage = pagesCount - paginationSize;
        endPage = pagesCount;
      } else {
        startPage = odd
          ? currentIndex - PAGINATION_MIDDLE + 1
          : currentIndex - PAGINATION_MIDDLE;
        endPage = currentIndex + PAGINATION_MIDDLE;
      }
    }

    const newRanges = calculateDisplayRanges(currentIndex);

    const newPaginationElement = { ...offsetPaginationElements };
    newPaginationElement.startIndex = startPage;
    newPaginationElement.endIndex = endPage;
    newPaginationElement.rangeStart = newRanges.newRangeStart;
    newPaginationElement.rangeEnd = newRanges.newRangeEnd;
    newPaginationElement.currentPage = currentIndex;
    setOffsetPaginationElements(newPaginationElement);
  };

  const handlePageClick = (e: any, currentIndex: any) => {
    e.preventDefault();

    calculateIndexes(currentIndex);

    const newDto = { ...dto };
    newDto.startIndex = currentIndex * pageSize;
    setDto(newDto);
  };

  const handlePreviousClick = (e: any, index: any) => {
    e.preventDefault();

    calculateIndexes(index - 1);

    const newDto = { ...dto };
    newDto.startIndex = (index - 1) * pageSize;
    setDto(newDto);
  };

  const handleNextClick = (e: any, index: any) => {
    e.preventDefault();

    calculateIndexes(index + 1);

    const newDto = { ...dto };
    newDto.startIndex = (index + 1) * pageSize;
    setDto(newDto);
  };

  const handlePreviousCursorClick = (e: any) => {
    e.preventDefault();
    setCursor(previousCursor);
    setPreviousCursor(previousCursorMap.get(previousCursor));
  };

  const handleNextCursorClick = (e: any) => {
    e.preventDefault();
    previousCursorMap.set(nextCursor, cursor);
    setPreviousCursor(cursor);
    setCursor(nextCursor);
  };

  const SortableEntry: React.ComponentClass<
    SortableElementProps & { id: string; value: any; ctr: number },
    any
  > = SortableElement(
    ({ value: data, id, ctr }: { value: any; id: string; ctr: number }) => (
      <TableRow id={id} style={{ cursor: "grab" }} key={newId()}>
        {tableMetadata.map((col: any) => {
          return col.header.props.defaultMessage !== "" ? (
            // eslint-disable-next-line max-len
            <TableCell
              key={col.key}
              headers={col.header.props.id}
              className={`${col.flex}`}
              sx={provideWidth(col)}
              style={{
                wordBreak: "break-word",
              }}
            >
              {col.render(data, col.className, col.icon, ctr)}
            </TableCell>
          ) : (
            <TableCell
              key={col.key}
              headers={col.header.props.id}
              className={`${col.flex}`}
              sx={provideWidth(col)}
              style={{
                wordBreak: "break-word",
              }}
            >
              {col.render(data, col.className, col.icon, ctr)}
            </TableCell>
          );
        })}
      </TableRow>
    )
  );

  return (
    <>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Grid item>
          {tableTitle && (
            <Box sx={{ mb: "18px" }}>
              <Header value={tableTitle} level={1} bold />
            </Box>
          )}
        </Grid>
        <Grid item>
          {pagesCount > 1 ? (
            <TablePagination
              pagesCount={pagesCount}
              currentPage={currentPage}
              handlePageClick={handlePageClick}
              handlePreviousClick={handlePreviousClick}
              handleNextClick={handleNextClick}
              startIndex={startIndex}
              endIndex={endIndex}
              totalCount={totalCount}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
            />
          ) : (
            ""
          )}
        </Grid>
      </Grid>
      {previousCursor !== undefined || nextCursor !== undefined ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "15px",
          }}
        >
          <TableCursorPagination
            hasNext={nextCursor !== undefined}
            hasPrevious={previousCursor !== undefined}
            handlePreviousCursorClick={handlePreviousCursorClick}
            handleNextCursorClick={handleNextCursorClick}
          />
        </Box>
      ) : (
        ""
      )}
      <Table
        component="table"
        id={`${id}-thead`}
        size="small"
        aria-label="StandardTable"
        sx={{
          [`& .${tableCellClasses.root}`]: {
            borderBottom: "none",
          },
          [`& .MuiTableCell-root .buttonAsLink button`]: {
            textAlign: "left",
          },
          marginBottom: "70px",
        }}
        style={customStyle !== undefined ? customStyle : null}
        className={className}
      >
        <TableHead>
          <TableRow>
            {tableMetadata.map((metadata: any) => (
              <TableCell
                key={newId(metadata.header.props.id)}
                id={metadata.header.props.id}
                sx={provideWidth(metadata)}
                style={{
                  wordBreak: "break-word",
                }}
              >
                <Label variant="grey">{metadata.header}</Label>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataList.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={tableMetadata.length}
                sx={{ textAlign: "center" }}
              >
                <Label size="body">
                  <FormattedMessage
                    id="standardtable.emptyrow"
                    defaultMessage="There are no results to display."
                  />
                </Label>
              </TableCell>
            </TableRow>
          ) : null}
          {dataList.map((data: any, idx) =>
            data.id !== undefined && data.id.includes("SEPARATOR") ? (
              <TableRow
                id={`${tableRowPrefix}-${idx}`}
                key={newId(`${tableRowPrefix}-${idx}`)}
                sx={{
                  ...(data.hidden && {
                    display: "none",
                  }),
                }}
              >
                {tableMetadata.map((col: any, _idx: number) => (
                  <TableCell
                    headers={col.header.props.id}
                    key={`${tableRowPrefix}-${idx}-${data.key || _idx}`}
                    sx={provideWidth(col)}
                    style={{
                      wordBreak: "break-word",
                    }}
                    // colSpan={`${data.id.split(" ")[1]}`}
                  />
                ))}
              </TableRow>
            ) : isSortable ? (
              <SortableEntry
                id={`${tableRowPrefix}-${idx}`}
                key={newId()}
                ctr={idx}
                index={idx}
                value={data}
              />
            ) : (
              <TableRow
                id={`${tableRowPrefix}-${idx}`}
                key={`${tableRowPrefix}-${idx}`}
                sx={{
                  ...(data.hidden && {
                    display: "none",
                  }),
                }}
              >
                {tableMetadata.map((col: any, _idx: number) =>
                  col.header.props.defaultMessage !== "" ? (
                    // eslint-disable-next-line max-len
                    <TableCell
                      // style={provideWidth(col, false)}
                      key={newId(`${tableRowPrefix}-${idx}-${col.key || _idx}`)}
                      headers={col.header.props.id}
                      sx={provideWidth(col)}
                      style={{
                        wordBreak: "break-word",
                      }}
                    >
                      {col.render(data, col.className, col.icon, "heya", _idx)}
                    </TableCell>
                  ) : (
                    <TableCell
                      key={newId(`${tableRowPrefix}-${idx}-${col.key || _idx}`)}
                      headers={col.header.props.id}
                      // style={provideWidth(col)}
                      sx={provideWidth(col)}
                      style={{
                        wordBreak: "break-word",
                      }}
                    >
                      {col.render(data, col.className, col.icon, "heya", _idx)}
                    </TableCell>
                  )
                )}
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
      <div
        className={
          customFooter !== undefined
            ? `tableFooter ${customFooter}`
            : "tableFooter"
        }
      />
    </>
  );
};

export default StandardTable;
