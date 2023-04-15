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
import Typography from "@mui/material/Typography";
import { Field, Formik } from "formik";
import { defineMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import moment from "moment";
import { useQueries } from "@tanstack/react-query";
import DropdownFloating from "../../../common/forms/dropdowns/DropdownFloating";
import DatePicker from "../../../common/forms/inputs/DatePicker";
import api from "../../../../api/api";
import {
  FormatTxSource,
  FormatTxType,
} from "../../../common/converters/FormatTxSource";
import { MessageContext } from "../../../../contexts/MessageContext";
import QDButton from "../../../common/elements/QDButton";
import emitter from "../../../../emitter";
import { convertDateWithPattern } from "../../../util/ConvertEpochToDate";

interface ITransactionFilterForm {
  id: string;
  filterFunc: Function;
  showTxSourceDropdown?: boolean;
}

interface ITransactionSource {
  source: string;
  text: string;
}

interface ITransactionType {
  type: string;
  text: string;
}

const TransactionFilterForm: React.FC<ITransactionFilterForm> = ({
  id,
  filterFunc,
  showTxSourceDropdown = false,
}) => {
  const intl = useIntl();
  const [pageSizes] = useState([25, 50, 100, 250]);
  const [transactionSources, setTransactionSources] = useState<
    ITransactionSource[]
  >([]);
  const [transactionTypes, setTransactionTypes] = useState<ITransactionType[]>(
    []
  );
  const { setErrorMsg } = useContext(MessageContext);

  const [getTxSourcesQuery, getTxTypesQuery] = useQueries({
    queries: [
      {
        queryKey: ["getTransactionSources"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getTransactionSources(),
        onError: (error: any) => setErrorMsg(error),
      },

      {
        queryKey: ["getTransactionTypes"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getTransactionTypes(),
        onError: (error: any) => setErrorMsg(error),
      },
    ],
  });

  useEffect(() => {
    emitter.on("customer.preset.transaction.filters", (data: any) => {
      const newFilter = {
        ...initialValues,
        fromDate: convertDateWithPattern(data.startDate, "YYYY-MM-DD"),
        toDate: convertDateWithPattern(data.endDate, "YYYY-MM-DD"),
      };
      setInitialValues(newFilter);
      filterFunc(newFilter);
    });
  }, []);

  const [initialValues, setInitialValues] = useState({
    txType: "all",
    txSource: "",
    pageSize: 25,
    fromDate: "",
    toDate: "",
  });

  const buildFilterForm = (results: any[]) => {
    const txSourceList = results[0];
    const formattedTxSource = txSourceList.map((txSource: any) => ({
      text: FormatTxSource(txSource.code, intl),
      source: txSource.code,
    }));
    formattedTxSource.unshift({
      text: intl.formatMessage({
        id: "allTransactionSources",
        defaultMessage: "All Transaction Sources",
      }),
      source: "all",
    });
    setTransactionSources(formattedTxSource);

    const txTypes = results[1];
    const formattedTxType = txTypes.map((txType: any) => ({
      text: FormatTxType(txType.code, intl),
      type: txType.code,
    }));
    formattedTxType.unshift({
      text: intl.formatMessage({
        id: "allTransactionTypes",
        defaultMessage: "All Transaction Types",
      }),
      type: "all",
    });
    setTransactionTypes(formattedTxType);

    setInitialValues({
      txType: formattedTxType.length > 0 ? formattedTxType[0].type : "",
      txSource: formattedTxSource.length > 0 ? formattedTxSource[0].source : "",
      pageSize: 25,
      fromDate: moment().subtract(24, "hours").format("YYYY-MM-DD"),
      toDate: moment().format("YYYY-MM-DD"),
    });
  };

  const clearFilters = async (props: any) => {
    props.resetForm();
    filterFunc({
      pageSize: "25",
      txSource: "all",
      txType: "all",
    });
  };

  const TransactionsDatePickerSchema = Yup.object().shape({
    toDate: Yup.date()
      .nullable()
      .min(
        Yup.ref("fromDate"),
        intl.formatMessage({
          id: "error.toDate.greaterThan.FromDate",
          defaultMessage: `To Date Must Be Greater "than From Date"`,
        })
      ),
    fromDate: Yup.date()
      .nullable()
      .max(
        Yup.ref("toDate"),
        intl.formatMessage({
          id: "error.FromDate.lessThan.toDate",
          defaultMessage: `From Date Must Be Less than "To date"`,
        })
      ),
  });

  useEffect(() => {
    if (getTxSourcesQuery.data && getTxTypesQuery.data) {
      buildFilterForm([getTxSourcesQuery.data, getTxTypesQuery.data]);
    }
  }, [getTxSourcesQuery.data, getTxTypesQuery.data]);

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => filterFunc(values)}
        validationSchema={TransactionsDatePickerSchema}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
            <Field
              id="transactions-from-date-picker"
              name="fromDate"
              label={intl.formatMessage({
                id: "fromDate",
                defaultMessage: "From Date",
              })}
              component={DatePicker}
              value={props.values.fromDate}
              helperText={props.errors.fromDate}
              error={props.errors.fromDate}
              maxDate="4100-01-01"
            />
            <Field
              id="transactions-to-date-picker"
              name="toDate"
              label={intl.formatMessage({
                id: "toDate",
                defaultMessage: "To Date",
              })}
              helperText={props.errors.toDate}
              value={props.values.toDate}
              component={DatePicker}
              error={props.errors.toDate}
              maxDate="4100-01-01"
            />
            <DropdownFloating
              id={`${id}-transaction-types-dropdown`}
              list={transactionTypes}
              valueKey="type"
              name="txType"
              placeholder={intl.formatMessage({
                id: "type",
                defaultMessage: "Type",
              })}
              value={props.values.txType}
              {...props}
            />
            {showTxSourceDropdown && (
              <DropdownFloating
                id={`${id}-transaction-sources-dropdown`}
                className="w-100 login-input"
                list={transactionSources}
                valueKey="source"
                name="txSource"
                placeholder={intl.formatMessage({
                  id: "source",
                  defaultMessage: "Source",
                })}
                value={props.values.txSource}
                {...props}
              />
            )}
            <DropdownFloating
              id={`${id}-transactions-page-size-dropdown`}
              list={pageSizes}
              name="pageSize"
              placeholder={intl.formatMessage({
                id: "limitResultsTo",
                defaultMessage: "Limit Results To",
              })}
              value={props.values.pageSize}
              {...props}
            />
            <Box sx={{ textAlign: "right", marginBottom: "40px" }}>
              <QDButton
                id={`${id}-transactions-search-clear-button`}
                onClick={() => clearFilters(props)}
                color="info"
                variant="text"
                label={
                  <Typography
                    sx={{
                      color: "#433AA8",
                      fontSize: "12px",
                      fontWeight: "600",
                      lineHeight: "15px",
                    }}
                  >
                    {intl.formatMessage(
                      defineMessage({
                        id: "clearFilters",
                        defaultMessage: "Clear filters",
                        description: "Clear filters",
                      })
                    )}
                  </Typography>
                }
              />
            </Box>
            <Box>
              <QDButton
                id={`${id}-transactions-search-submit-button`}
                onClick={props.handleSubmit}
                color="primary"
                variant="contained"
                size="large"
                textCase="provided"
                label={intl.formatMessage(
                  defineMessage({
                    id: "searchTransactions",
                    defaultMessage: "Search Transactions",
                  })
                )}
              />
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default TransactionFilterForm;
