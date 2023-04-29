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

import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import moment from "moment";
import { defineMessage, useIntl } from "react-intl";
import TransactionsTable from "../TransactionsTable";
import api from "../../../api/api";
import TransactionFilterForm from "./transactions/TransactionFilterForm";
import flattentxs from "../../util/FlattenTxs";
import Header from "../../common/elements/Header";
import { MessageContext } from "../../../contexts/MessageContext";
import emitter from "../../../emitter";
import { convertDateWithPattern } from "../../util/ConvertEpochToDate";

interface IPageNavTransactions {
  portfolioId: string;
  customerNumber: string;
}

interface ITransactionFilter {
  txType?: string;
  pageSize: string;
  fromDate?: string | number;
  toDate?: string | number;
}

const PageNavTransactions: React.FC<IPageNavTransactions> = ({
  portfolioId,
  customerNumber,
}) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
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
      dto.startTime = moment(`${filters.fromDate} 00:00`).unix() * 1000;
    }
    if (filters.toDate) {
      dto.endTime = moment(`${filters.toDate} 23:59`).unix() * 1000;
    }
    return dto;
  };

  const getTransactions = () => {
    // TO DO: remove these mock data once we can generate multiple txn items
    const mockTxnItem = {"creationTime":1679995252611,"modifiedTime":1679995252611,"id":"0918C5C715C10C1DC082069328CC6446-1000002204","transactionSourceCode":1,"transactionTypeCode":5,"reversal":false,"fee":false,"tax":false,"amount":50.00000,"amountText":"50.00000","memo":"Mock only","currency":"HKD","callerReference":"D57777273D20E0AC311CBBE9A229CEF0"};
    const mockTxnItem2 = {"creationTime":1679995252611,"modifiedTime":1679995252611,"id":"0918C5C715C10C1DC082069328CC6446-1000002204","transactionSourceCode":1,"transactionTypeCode":5,"reversal":false,"fee":false,"tax":false,"amount":60.00000,"amountText":"60.00000","memo":"Mock only","currency":"HKD","callerReference":"D57777273D20E0AC311CBBE9A229CEF0"};
    // @ts-ignore
    api.TransactionAPI.listTransactions(buildFilterDTO())
      .then((txList: any) => {
        const { results } = txList;
        if (results.length && results[0].transactionEntries) {
          results[0].transactionEntries.push(mockTxnItem);
          results[0].transactionEntries.push(mockTxnItem2);
        }
        const flattenedTx: any = flattentxs(results);
        setTransactions(flattenedTx);
      })
      .catch((error: any) => setErrorMsg(error)); // TODO Handle error case
  }

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
              id: "transactions",
              description: "Transactions section header",
              defaultMessage: "Transactions",
            })
          )}
          color="primary"
        />
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={3} md={3} lg={3}>
          { filters && (
            <TransactionFilterForm id="transaction" filterFunc={setFilters} />
          )}
        </Grid>
        <Grid item xs={9} md={9} lg={9}>
          <Box>
            <TransactionsTable customerNumber={customerNumber} txList={transactions} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageNavTransactions;
