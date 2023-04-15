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

import React, { lazy, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import Label from "../../components/common/elements/Label";

const TextRender = lazy(() => import("../../components/common/TextRender"));
const ClickableRender = lazy(
  () => import("../../components/common/ClickableRender")
);
const TableStandard = lazy(
  () => import("../../components/common/table/StandardTable")
);

interface IAuditFilterTable {
  dataList: any;
  pageSize: number;
  totalCount: number;
  setAuditDetails: Function | any;
  filters:
    | {
        customDateRange: boolean;
        startTime: string | number;
        endTime: string | number;
        startIndex: number;
        ascending: boolean;
        partnerUser: string;
        customerNumber: string;
        pageSize: number;
      }
    | undefined;
  setFilters: Function | any;
}

const AuditFilterTable: React.FC<IAuditFilterTable> = ({
  dataList,
  pageSize,
  totalCount,
  setAuditDetails,
  filters,
  setFilters,
}) => {
  // its okay to destructure here because new data gets fed every time...otherwise bad practice
  const locale =
    localStorage.getItem("locale") || navigator.language.split(/[-_]/)[0];

  const [offsetPaginationElements, setOffsetPaginationElements] = useState({
    paginationSize: 5,
    currentPage: 0,
    startIndex: 0,
    endIndex: 5,
    rangeStart: 1,
    rangeEnd: pageSize,
    pageSize,
    pagesCount: Math.ceil(totalCount / pageSize),
    totalCount,
  });

  useEffect(() => {
    setOffsetPaginationElements({
      paginationSize: 5,
      currentPage: 0,
      startIndex: 0,
      endIndex: 5,
      rangeStart: 1,
      rangeEnd: pageSize,
      pageSize,
      pagesCount: Math.ceil(totalCount / pageSize),
      totalCount,
    });
  }, [totalCount]);

  useEffect(() => {
    moment.locale(locale.replace("en", "en-gb"));
  }, [locale]);

  // @ts-ignore
  const AuditTableMetadata = [
    {
      header: (
        <FormattedMessage
          id="date"
          description="Date Entry"
          defaultMessage="Date"
        />
      ),
      width: "200px",
      render: (rowData: any) => {
        const { creationTime } = rowData;
        const convertedDate = moment(creationTime, "x").format(
          "DD MMM YYYY hh:mm a"
        );
        const justTheHHMM = moment(creationTime, "x").format("hh:mm a");
        const formattedDate = moment(creationTime, "x").fromNow();
        const prettyDate = `${formattedDate}, ${justTheHHMM}`;

        return creationTime > 0 ? (
          <TextRender
            data={
              <>
                <span>{prettyDate}</span>
              </>
            }
          />
        ) : null;
      },
    },
    {
      header: (
        <FormattedMessage
          id="action"
          description="Action"
          defaultMessage="Action"
        />
      ),
      render: (rowData: any) => (
        <ClickableRender
          onClickFunc={() => setAuditDetails(true, rowData)}
          id=""
          data=""
        >
          {/* eslint-disable-next-line react/destructuring-assignment */}
          <Label size="body" bold variant="link" noMargin>
            {rowData.method}
          </Label>
        </ClickableRender>
      ),
    },
    {
      header: (
        <FormattedMessage
          id="user"
          description="Username"
          defaultMessage="User"
        />
      ),
      width: "150px",
      render: (rowData: any) => {
        const { userName } = rowData;
        const prettyName = `@${userName}`;

        return (
          <ClickableRender
            onClickFunc={() => setAuditDetails(true, rowData)}
            id=""
            data=""
          >
            <Label size="body" bold variant="link" noMargin>
              {prettyName}
            </Label>
          </ClickableRender>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer"
          description="Customer"
          defaultMessage="Customer"
        />
      ),
      width: "150px",
      render: (rowData: any) => {
        const { customerNumber } = rowData;

        return (
          <ClickableRender
            onClickFunc={() => setAuditDetails(true, rowData)}
            id=""
            data=""
          >
            <Label size="body" bold variant="link" noMargin>
              {customerNumber}
            </Label>
          </ClickableRender>
        );
      },
    },
  ];

  return (
    <>
      <TableStandard
        id="audit-filter-table"
        tableRowPrefix="audit-filter-table"
        tableMetadata={AuditTableMetadata}
        dataList={dataList}
        setDto={setFilters}
        dto={filters}
        offsetPaginationElements={offsetPaginationElements}
        setOffsetPaginationElements={setOffsetPaginationElements}
      />
    </>
  );
};

export default AuditFilterTable;
