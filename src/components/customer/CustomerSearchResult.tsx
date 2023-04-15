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

import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import { FormattedMessage } from "react-intl";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import StandardTable from "../common/table/StandardTable";
import { CustomerSearchContext } from "../../contexts/CustomerSearchContext";
import Text from "../common/elements/Text";
import toCountryName from "../../components/common/converters/CountryNameConverter";
import api from "../../api/api";
import { MessageContext } from "../../contexts/MessageContext";

const CustomerSearchResult: React.FC = () => {
  const contextValue = useContext(CustomerSearchContext);
  const { setErrorMsg } = useContext(MessageContext);
  const { customerList, totalCount, pageSize, cursor, setCursor, nextCursor } =
    contextValue;
  const [countries, setCountries] = useState([]);

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

  const { data: getCountryList2Data } = useQuery({
    queryKey: ["getCountryList2"],
    queryFn: () =>
      // @ts-ignore
      api.CommonAPI.getCountryList2(),
    onError: (error: any) => setErrorMsg(error),
  });

  const formatAddress = (address: any) => {
    if (address) {
      const addressLines = [
        address.line1 || "",
        address.line2 || "",
        address.line3 || "",
      ]
        .filter((e) => String(e).trim())
        .join(", ");
      let lines = [
        address.neighborhood || "",
        address.city,
        address.state,
        address.postalCode,
      ]
        .filter((e) => String(e).trim())
        .join(", ");
      return (
        <>
          <Typography>{addressLines}</Typography>
          <Typography>{lines}</Typography>
          <Typography>{toCountryName(address.country, countries)}</Typography>
        </>
      );
    }
    return "";
  };

  useEffect(() => {
    setOffsetPaginationElements({
      /* size of pagination link at the top of the table */
      paginationSize: 5,
      currentPage: 0,
      /* startIndex and endIndex are used to determine the
      first and last entry numbers of the pagination display */
      startIndex: 0,
      endIndex: 5,
      /* rangeStart and range End are used in "Showing 1-10 of 100" */
      rangeStart: 1,
      rangeEnd: pageSize,

      /* how many rows in each page */
      pageSize,
      /* total number of pages */
      pagesCount: Math.ceil(totalCount / pageSize),
      /* total number of rows */
      totalCount,
    });
  }, [totalCount]);

  useEffect(() => {
    if (getCountryList2Data) {
      setCountries(
        getCountryList2Data.map((c: any) => ({ text: c.name, code: c.code }))
      );
    }
  }, [getCountryList2Data]);

  const tableMetadata = [
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="customer.search.result.name"
          description="Name of displayed Customers"
          defaultMessage="Name"
        />
      ),
      render: (rowData: any) => {
        const { familyName, givenName } = rowData;
        const fullName = `${familyName}, ${givenName}`;
        return <Text value={fullName} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.search.result.customerNumber"
          description="Customer Number for displayed Customers"
          defaultMessage="Customer Number"
        />
      ),
      width: "12.5%",
      render: (rowData: any) => {
        const { id } = rowData;
        return (
          <Link component={NavLink} to={`/customer/${id}/detail`}>
            {id}
          </Link>
        );
      },
    },
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="program"
          description="Program name for displayed Customers"
          defaultMessage="Program"
        />
      ),
      render: (rowData: any) => {
        const { program } = rowData;
        return <Typography>{program}</Typography>;
      },
    },
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="contactNumber"
          description="Contact number for displayed Customers"
          defaultMessage="Contact #"
        />
      ),
      render: (rowData: any) => {
        const { contact } = rowData;
        return <Typography>{contact}</Typography>;
      },
    },
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="emailAddress"
          description="Email Address for displayed Customers"
          defaultMessage="Email Address"
        />
      ),
      render: (rowData: any) => {
        const { email } = rowData;
        return <Typography>{email}</Typography>;
      },
    },
    {
      header: (
        <FormattedMessage
          id="customer.search.result.address"
          description="Address for displayed Customers"
          defaultMessage="Address"
        />
      ),
      width: "12.5%",
      render: (rowData: any) => {
        const { address } = rowData;
        return <Box>{formatAddress(address)}</Box>;
      },
    },
  ];

  return (
    <StandardTable
      id="customer-search-results"
      tableMetadata={tableMetadata}
      dataList={customerList}
      offsetPaginationElements={offsetPaginationElements}
      setOffsetPaginationElements={setOffsetPaginationElements}
      setCursor={setCursor}
      cursor={cursor}
      nextCursor={nextCursor}
      tableRowPrefix="search-result"
    />
  );
};

export default CustomerSearchResult;
