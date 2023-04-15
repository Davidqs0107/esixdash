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
 *
 */

import React, { useContext, useEffect, useState, lazy } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import StandardTable from "../../../common/table/StandardTable";
import YesNoConverter from "../../../common/converters/YesNoConverter";
import DateAndTimeConverter from "../../../common/converters/DateAndTimeConverter";
import api from "../../../../api/api";
import CurrencyRender from "../../../common/converters/CurrencyRender";
import TextRender from "../../../common/TextRender";
import {
  FormatTxSource,
  FormatTxType,
} from "../../../common/converters/FormatTxSource";
import { CustomerDetailContext } from "../../../../contexts/CustomerDetailContext";
import { CustomerFeePlanDrawerContext } from "../../../../contexts/CustomerFeePlanDrawerContext";
import QDFormattedCurrency from "../../../common/converters/QDFormattedCurrency";

const FeePlanEntriesLevelTwoDrawer: React.FC = () => {
  const intl = useIntl();
  const { programName } = useContext(CustomerDetailContext);
  const { selectedFeePlan } = useContext(CustomerFeePlanDrawerContext);
  const [fees, setFees] = useState([]);

  const getFees = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingFeesAPI.getFees(programName, selectedFeePlan, {})
      .then((result: any) => {
        setFees(result);
      })
      .catch((error: any) => error);
  };

  const FeeEntriesMetadata = [
    {
      header: (
        <FormattedMessage
          id="name"
          description="table header"
          defaultMessage="Name"
        />
      ),
      render: (rowData: any) => {
        const { transactionSourceCode, transactionTypeCode } = rowData;
        return (
          <TextRender
            data={`${FormatTxSource(
              transactionSourceCode,
              intl
            )} - ${FormatTxType(transactionTypeCode, intl)}`}
            color="#152C5B"
            truncated={false}
          />
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="currency"
          description="table header"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) => {
        const { currency } = rowData;
        return <CurrencyRender currencyCode={currency} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="fixedFeePercentage"
          description="table header"
          defaultMessage="Fixed Fee/Percentage"
        />
      ),
      render: (rowData: any) => {
        const { fixFee, currency, percentage } = rowData;
        return (
          <Grid container direction="column">
            <QDFormattedCurrency currency={currency} amount={fixFee} />
            <TextRender
              data={
                <FormattedNumber
                  value={percentage}
                  /* eslint-disable-next-line react/style-prop-object */
                  style="percent"
                  minimumFractionDigits={2}
                  maximumFractionDigits={2}
                />
              }
              variant="labelDark"
            />
          </Grid>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="chargeReceiver"
          description="table header"
          defaultMessage="Charge Receiver"
        />
      ),
      render: (rowData: any) => {
        const { chargeReceiver } = rowData;
        return <YesNoConverter bool={chargeReceiver} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="recFixedFeePercentage"
          description="table header"
          defaultMessage="Rec. Fixed Fee/Percentage"
        />
      ),
      render: (rowData: any) => {
        const { chargeReceiver, receiverFixFee, currency, receiverPercentage } =
          rowData;

        if (chargeReceiver) {
          return (
            <Grid container direction="column">
              <QDFormattedCurrency
                currency={currency}
                amount={receiverFixFee}
              />
              <TextRender
                data={
                  <FormattedNumber
                    value={receiverPercentage}
                    /* eslint-disable-next-line react/style-prop-object */
                    style="percent"
                    minimumFractionDigits={2}
                    maximumFractionDigits={2}
                  />
                }
                variant="labelDark"
              />
            </Grid>
          );
        } else {
          return <TextRender data={"--"} variant="labelDark" />;
        }
      },
    },
    {
      header: (
        <FormattedMessage
          id="created"
          description="table header"
          defaultMessage="Created"
        />
      ),
      width: "105px",
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return (
          <span>
            <DateAndTimeConverter epoch={creationTime} monthFormat="long" />
          </span>
        );
      },
    },
  ];

  useEffect(() => {
    getFees();
  }, [selectedFeePlan]);

  return (
    <Box style={{ minWidth: "auto" }}>
      <StandardTable
        id="fee-plan-configs-table"
        tableRowPrefix="program-risk-level-configs-table"
        dataList={fees}
        tableMetadata={FeeEntriesMetadata}
        customFooter="no-box-shadow"
      />
    </Box>
  );
};

export default FeePlanEntriesLevelTwoDrawer;
