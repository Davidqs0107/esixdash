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

import React, { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import { FormattedMessage } from "react-intl";

interface ITablePagination {
  pagesCount: number;
  currentPage: number;
  handlePageClick: (e: any, currentIndex: any) => void;
  handlePreviousClick: (e: any, index: any) => void;
  handleNextClick: (e: any, index: any) => void;
  startIndex: number;
  endIndex: number;
  totalCount: number;
  rangeStart: number;
  rangeEnd: number;
}

const TablePagination: FC<ITablePagination> = (props) => {
  const {
    pagesCount,
    currentPage,
    handlePageClick,
    handlePreviousClick,
    handleNextClick,
    startIndex,
    endIndex,
    totalCount,
    rangeStart,
    rangeEnd,
  } = props;

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    handlePageClick(event, value - 1);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ marginRight: "17px" }}>
        <Typography
          sx={{
            color: "#152C5B",
            fontSize: "10px",
            lineHeight: "12px",
          }}
        >
          <FormattedMessage
            id="table.pagination.results"
            defaultMessage="Showing {rangeStart}-{rangeEnd} of {totalCount} results"
            values={{
              rangeStart: rangeStart,
              rangeEnd: rangeEnd,
              totalCount: totalCount,
            }}
          />
        </Typography>
      </Box>
      <Box>
        <Pagination
          count={pagesCount}
          page={currentPage + 1}
          onChange={handlePageChange}
          variant="text"
          sx={{
            ".MuiPaginationItem-page": {
              color: "#433EA5",
              fontSize: "10px",
              fontWeight: "600",
              letterSpacing: "0.1px",
              lineHeight: "12px",
              minWidth: "10px",
            },
            ".Mui-disabled .MuiSvgIcon-root": {
              color: "#8995AD",
            },
            ".Mui-selected": {
              color: "#8995AD",
              fontSize: "10px",
              fontWeight: "600",
              letterSpacing: "0.1px",
              lineHeight: "12px",
              backgroundColor: "transparent !important",
            },
            ".Mui-focusVisible": {
              backgroundColor: "transparent !important",
            },
            ".MuiPaginationItem-page:hover": {
              backgroundColor: "transparent !important",
              fontWeight: "700",
            },
            ".MuiPaginationItem-icon": {
              color: "#433AA8",
              fontSize: "24px",
            },
            ".MuiPaginationItem-previousNext": {
              minWidth: "10px",
              padding: "0px",
            },
          }}
        />
      </Box>
    </Box>
  );
};
export default TablePagination;
