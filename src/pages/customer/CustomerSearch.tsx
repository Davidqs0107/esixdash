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
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import BrandingWrapper from "../../app/BrandingWrapper";
import CustomerSearchResult from "../../components/customer/CustomerSearchResult";
import { CustomerSearchContext } from "../../contexts/CustomerSearchContext";
import PageNav from "../../components/common/navigation/PageNav";
import nav from "../../components/customer/searchnavs/SearchnavIndex";

const CustomerSearch: React.FC = () => {
  const intl = useIntl();
  const [resultsMessage, setResultsMessage] = useState("");

  const { dto, totalCount } = useContext(CustomerSearchContext);

  const getResultsMessage = () => {
    if (!dto) {
      return "";
    }
    let searchTerm = "";

    if (Object.keys(dto).includes("cardNumber")) {
      searchTerm = dto.cardNumber;
    }

    if (Object.keys(dto).includes("customerNumber")) {
      if (dto.customerNumber && dto.customerNumber.length > 0) {
        searchTerm = dto.customerNumber;
      } else {
        searchTerm = `${dto.firstName} ${dto.lastName}`;
      }
    }

    if (Object.keys(dto).includes("extRefPartnerName")) {
      searchTerm = dto.extRefPartnerName;
    }

    if (Object.keys(dto).includes("pan")) {
      searchTerm = dto.pan;
    }

    return setResultsMessage(
      intl.formatMessage(
        {
          id: "search.results.showingMessage",
          defaultMessage:
            'Showing {totalCount, plural, =0 {no results} one {# result} other {# results}} for "{searchTerm}"',
          description:
            "Message describing how many results were found for customer search.",
        },
        { totalCount, searchTerm }
      )
    );
  };

  useEffect(() => {
    getResultsMessage();
  }, [dto, totalCount]);

  return (
    <>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "customerSearch",
            defaultMessage: "Customer Search",
          })}`}
        </title>
      </Helmet>
      <Box>
        <Box>
          <Box sx={{ marginBottom: "10px" }}>
            <Typography variant="h1">
              {intl.formatMessage({
                id: "customers",
                defaultMessage: "Customers",
              })}
            </Typography>
          </Box>
        </Box>
        <Box>
          <PageNav
            components={nav}
            sessionKey="customerSearchTab"
            defaultTab="customer-number"
          />
        </Box>
        <Box>
          <CustomerSearchResult />
        </Box>
      </Box>
    </>
  );
};

export default CustomerSearch;
