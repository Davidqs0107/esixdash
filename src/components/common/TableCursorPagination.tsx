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
import React from "react";
import Avatar from "@mui/material/Avatar";
import usePagination from "@mui/material/usePagination";
import { styled } from "@mui/material/styles";
import Icon from "./Icon";

interface ITableCursorPagination {
  hasNext: boolean;
  hasPrevious: boolean;
  handlePreviousCursorClick: Function;
  handleNextCursorClick: Function;
}

const List = styled("ul")({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  justifyContent: "flex-end",
  "& .MuiAvatar-root": {
    boxShadow: "none",
    padding: "8px",
    border: "1px solid #EEEEEE",
    borderRadius: "4px",
    marginRight: "4px",
    marginBottom: "10px",
  },
  "& a.disabled": {
    opacity: 0.5,
  },
});

const TableCursorPagination: React.FC<ITableCursorPagination> = (props) => {
  const {
    hasPrevious,
    hasNext,
    handlePreviousCursorClick,
    handleNextCursorClick,
  } = props;

  const { items } = usePagination({
    count: 0,
  });

  return (
    <>
      <List>
        <>
          {items.map(({ page, type, selected, ...item }, index) => {
            let children = null;

            if (type === "start-ellipsis" || type === "end-ellipsis") {
              children = "…";
            } else if (type === "page") {
              children = (
                <button
                  type="button"
                  style={{
                    fontWeight: selected ? "bold" : undefined,
                  }}
                  {...item}
                >
                  {page}
                </button>
              );
            } else if (type === "previous") {
              children = (
                <a
                  href="#"
                  {...item}
                  onClick={(e) => handlePreviousCursorClick(e)}
                  className={!hasPrevious ? "disabled" : undefined}
                >
                  <Avatar src={Icon.caretLeftDark} />
                </a>
              );
            } else if (type === "next") {
              children = (
                <a
                  href="#"
                  {...item}
                  onClick={(e) => handleNextCursorClick(e)}
                  className={!hasNext ? "disabled" : undefined}
                >
                  <Avatar src={Icon.caretRightDark} />
                </a>
              );
            } else {
              children = (
                <a href="#" {...item} data-type2={type}>
                  {type}
                </a>
              );
            }

            return <li key={index}>{children}</li>;
          })}
        </>
      </List>
    </>
  );
};

export default TableCursorPagination;
