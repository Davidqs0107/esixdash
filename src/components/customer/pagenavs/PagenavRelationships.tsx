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
 *
 */

import { Box, Container } from "@mui/material";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import Header from "../../common/elements/Header";
import StandardTable from "../../common/table/StandardTable";
import api from "../../../api/api";
import emitter from "../../../emitter";
import TextRender from "../../common/TextRender";
import DateAndTimeConverter from "../../common/converters/DateAndTimeConverter";
import { MessageContext } from "../../../contexts/MessageContext";
import Link from "@mui/material/Link";

interface IPagenavRelationships {
  customerNumber: string;
}

const PagenavRelationships: React.FC<IPagenavRelationships> = ({
  customerNumber,
}) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const childAccountsSearchPageSize = 10;
  // eslint-disable-next-line max-len
  const [childAccountsSearchDto, setChildAccountsSearchDto] = useState({
    startIndex: 0,
    count: childAccountsSearchPageSize,
  });
  const [children, setChildren] = useState([]);
  const [graphConnections, setGraphConnections] = useState([]);

  const paginationInitialState = {
    /* size of pagination link at the top of the table */
    paginationSize: 10,
    currentPage: 0,
    /* startIndex and endIndex are used to determine the
    first and last entry numbers of the pagination display */
    startIndex: 0,
    endIndex: 5,
    /* rangeStart and range End are used in "Showing 1-10 of 100" */
    rangeStart: 1,
    rangeEnd: 10,

    /* how many rows in each page */
    pageSize: 10,
    /* total number of pages */
    pagesCount: 0,
    /* total number of rows */
    totalCount: 0,
  };

  const [offsetPaginationElements, setOffsetPaginationElements] = useState(
    paginationInitialState
  );

  const getInwardCustomerGraphs = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerGraphAPI.getInwardCustomerGraphs(customerNumber).catch(
      (error: any) => setErrorMsg(error)
    );

  const getOutwardCustomerGraphs = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerGraphAPI.getOutwardCustomerGraphs(customerNumber).catch(
      (error: any) => setErrorMsg(error)
    );

  const getGraphConnections = () => {
    Promise.all([getInwardCustomerGraphs(), getOutwardCustomerGraphs()]).then(
      (results) => {
        setGraphConnections(results[0]);
      }
    );
  };

  // eslint-disable-next-line max-len
  const getCustomerChildren = () =>
    // @ts-ignore
    api.CustomerAPI.getCustomerChildren(customerNumber, childAccountsSearchDto) // use api defaults
      .then((childList: any) => {
        const { data } = childList;
        setOffsetPaginationElements({
          ...offsetPaginationElements,
          totalCount: childList.totalCount,
          pagesCount: Math.ceil(childList.totalCount / 10),
        });

        setChildren(childList.data);
      })
      .catch((error: any) => error);

  const childAccountsMetadata = [
    {
      width: "25%",
      header: (
        <FormattedMessage
          id="customer.subAccounts.customerNumber"
          description="Customer Number"
          defaultMessage="Customer Number"
        />
      ),
      render: (rowData: any) => {
        const { customerNumber } = rowData;
        return (
          <Link component={NavLink} to={`/customer/${customerNumber}/detail`}>
            {customerNumber}
          </Link>
        );
      },
    },
    {
      width: "25%",
      header: (
        <FormattedMessage id="primaryPerson" defaultMessage="Primary Person" />
      ),
      render: (rowData: any) => (
        <TextRender
          data={`${rowData.primaryPerson.lastName} ${rowData.primaryPerson.firstName}`}
        />
      ),
    },
    {
      width: "25%",
      header: (
        <FormattedMessage
          id="program"
          description="Operating Program name"
          defaultMessage="Program"
        />
      ),
      render: (rowData: any) => rowData.programName,
    },
    {
      width: "25%",
      header: <FormattedMessage id="created" defaultMessage="Created" />,
      render: (rowData: any) => (
        <DateAndTimeConverter
          epoch={rowData.creationTime}
          monthFormat={undefined}
        />
      ),
    },
  ];

  const graphConnectionsMetadata = [
    {
      width: "25%",
      header: (
        <FormattedMessage
          id="customer.subAccounts.customerNumber"
          description="Customer Number"
          defaultMessage="Customer Number"
        />
      ),
      render: (rowData: any) => (
        <NavLink to={`/customer/${rowData.customerNumber}/detail`}>
          {rowData.customerNumber}
        </NavLink>
      ),
    },
    {
      width: "25%",
      header: <FormattedMessage id="name" defaultMessage="Name" />,
      render: (rowData: any) => (
        <TextRender
          data={`${rowData.primaryPerson.lastName} ${rowData.primaryPerson.firstName}`}
        />
      ),
    },
    {
      width: "25%",
      header: <FormattedMessage id="direction" defaultMessage="Direction" />,
      render: (rowData: any) => rowData.programName,
    },
    {
      width: "25%",
      header: <FormattedMessage id="created" defaultMessage="Created" />,
      render: (rowData: any) => (
        <DateAndTimeConverter
          epoch={rowData.creationTime}
          monthFormat={undefined}
        />
      ),
    },
  ];

  useEffect(() => {
    getCustomerChildren();
  }, [childAccountsSearchDto]);

  useEffect(() => {
    emitter.on("child.accounts.changed", () => getCustomerChildren());

    getGraphConnections();
    emitter.on("graph.connections.changed", () => getGraphConnections());
  }, []);

  return (
    <Box>
      <Box sx={{ marginBottom: "18px" }}>
        <Header
          level={2}
          bold
          value={intl.formatMessage(
            defineMessage({
              id: "childAccounts",
              defaultMessage: "Child Accounts",
            })
          )}
        />
      </Box>
      <StandardTable
        id="childaccounts-table"
        tableRowPrefix="childaccounts-table"
        dataList={children}
        setDto={setChildAccountsSearchDto}
        dto={childAccountsSearchDto}
        tableMetadata={childAccountsMetadata}
        offsetPaginationElements={offsetPaginationElements}
        setOffsetPaginationElements={setOffsetPaginationElements}
      />
      <Box sx={{ marginBottom: "18px" }}>
        <Header
          level={2}
          bold
          value={intl.formatMessage(
            defineMessage({
              id: "graphConnections",
              defaultMessage: "Graph Connections",
            })
          )}
        />
      </Box>
      <StandardTable
        id="graph-connections-table"
        tableRowPrefix="graph-connections-table"
        dataList={graphConnections}
        tableMetadata={graphConnectionsMetadata}
      />
    </Box>
  );
};

export default PagenavRelationships;
