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

import React, { useEffect, useState } from "react";
import moment from "moment";
import { defineMessage, useIntl } from "react-intl";
import api from "../../../api/api";
import TransactionFilterForm from "./transactions/TransactionFilterForm";
import ProgressTransactionsTable from "../ProgressTransactionsTable";
import Header from "../../common/elements/Header";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

interface IPageNavProgressTransactions {
  portfolioId: string;
}

interface ITransactionFilter {
  txType?: string;
  pageSize: string;
  fromDate?: string | number;
  toDate?: string | number;
}

const PageNavProgressTransactions: React.FC<IPageNavProgressTransactions> = ({
  portfolioId,
}) => {
  const intl = useIntl();
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState<ITransactionFilter>({
    pageSize: "25",
    fromDate: moment().subtract(24, "hours").format("YYYY-MM-DD"),
    toDate: moment().format("YYYY-MM-DD").toString(),
  });
  const [pageSize, setPageSize] = useState(25);

  const buildFilterDTO = () => {
    const dto: any = {
      limit: pageSize,
    };
    dto.portfolioId = portfolioId;
    if (filters.txType && filters.txType !== "all") {
      dto.transactionTypeCode = filters.txType;
    }
    if (filters.pageSize) {
      // eslint-disable-next-line radix
      const numberCount = parseInt(filters.pageSize);
      dto.limit = numberCount;
      setPageSize(numberCount);
    }
    if (filters.fromDate) {
      dto.startTime = moment(filters.fromDate).unix() * 1000;
    }
    if (filters.toDate) {
      dto.endTime = moment(filters.toDate).add(1, 'days').unix() * 1000;
    }
    return dto;
  };

  const getTransactions = () =>
    // @ts-ignore
    api.TransactionAPI.listPendingTransactions(buildFilterDTO())
      .then((txList: any) => {
        const { results } = txList;
        setTransactions(results);
      })
      .catch((error: any) => error); // TODO Handle error case

  useEffect(() => {
    getTransactions();
  }, [filters]);

  return (
    <Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Header
          level={2}
          bold
          value={intl.formatMessage(
            defineMessage({
              id: "inProgressTransactions",
              description: "In Progress Transactions section header",
              defaultMessage: "In Progress Transactions",
            })
          )}
          color="primary"
        />
      </Box>
      <Grid container spacing={3}>
        <Grid item lg={3}>
          {/* <ProgramsFilterAccordion filterFunc={setFilters} /> */}
          {/* <ProductsFilterAccordion filterFunc={setFilters} /> */}
          <TransactionFilterForm id="progress-tx" filterFunc={setFilters} />
        </Grid>
        <Grid item lg={9}>
          <Box>
            <ProgressTransactionsTable txList={transactions} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageNavProgressTransactions;
