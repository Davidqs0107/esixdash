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

import React, { useContext, useEffect, useState, lazy } from "react";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import StandardTable from "../../../common/table/StandardTable";
import YesNoConverter from "../../../common/converters/YesNoConverter";
import DateAndTimeConverter from "../../../common/converters/DateAndTimeConverter";
import api from "../../../../api/api";
import emitter from "../../../../emitter";
import { ProgramDetailContext } from "../../../../contexts/ProgramDetailContext";
import CurrencyRender from "../../../common/converters/CurrencyRender";
import TextRender from "../../../common/TextRender";
import {
  FormatTxSource,
  FormatTxType,
} from "../../../common/converters/FormatTxSource";
import { MessageContext } from "../../../../contexts/MessageContext";
import QDFormattedCurrency from "../../../common/converters/QDFormattedCurrency";

const QDButton = lazy(() => import("../../../common/elements/QDButton"));

const ProgramFeeLevelTwo: React.FC = () => {
  const intl = useIntl();
  const { programName, feePlan } = useContext(ProgramDetailContext);
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const [fees, setFees] = useState([]);

  const createUpdateFeeEntryRequest = (program: string, id: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingChangeOrderAPI.createUpdateFeeEntryRequest(
      program,
      id,
      dto
    ).catch((e: any) => setErrorMsg(e));

  const deleteFeeEntry = (values: any) => {
    const {
      transactionSourceCode,
      transactionTypeCode,
      currency,
      fixFee,
      percentage,
      chargeReceiver,
      receiverFixFee,
      receiverPercentage,
    } = values;
    const changeOrderDto = {
      type: "OperatingFee",
      partnerProgramName: programName,
      memo: `Deleting '${FormatTxSource(
        transactionSourceCode,
        intl
      )} - ${FormatTxType(
        transactionTypeCode,
        intl
      )} (${currency})' fee from ${feePlan} fee plan.`,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingChangeOrderAPI.createChangeOrder(
      programName,
      changeOrderDto
    ).then(async (orderResult: any) => {
      // new Risk Level
      const feeEntryDto = {
        memo: `Deleting '${FormatTxSource(
          transactionSourceCode,
          intl
        )} - ${FormatTxType(
          transactionTypeCode,
          intl
        )} (${currency})' fee from ${feePlan} fee plan.`,
        feePlanName: feePlan,
        currency,
        transactionTypeCode,
        transactionSourceCode,
        fixFee,
        percentage,
        chargeReceiver,
        receiverFixFee,
        receiverPercentage,
        action: "Delete",
      };

      await createUpdateFeeEntryRequest(
        programName,
        orderResult.id,
        feeEntryDto
      ).then(() => {
        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "changeOrder.success.created",
            defaultMessage: "A change order was created successfully.",
          }),
        });
      });
    });
  };

  const getFees = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingFeesAPI.getFees(programName, feePlan, {})
      .then((result: any) => {
        setFees(result);
      })
      .catch((error: any) => error);
  };

  const getCalculationMethod = (
    value: number,
    fixedFeeAmount: any,
    feePercentage: any
  ) => {
    let calculationMethod = "";
    switch (value) {
      case 0:
        if (fixedFeeAmount !== 0 && feePercentage !== 0) {
          calculationMethod = "Flat + Percentage";
        } else if (fixedFeeAmount !== 0) {
          calculationMethod = "Flat Amount";
        } else {
          calculationMethod = "Percentage";
        }
        break;
      case 1:
        calculationMethod = "Greater Of";
        break;
      case 2:
        calculationMethod = "Lesser Of";
        break;
      default:
        calculationMethod = "Flat + Percentage";
        break;
    }
    return calculationMethod;
  };

  const RiskLevelMetaData = [
    {
      width: "15%",
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
      width: "15%",
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
                  minimumFractionDigits={3}
                  maximumFractionDigits={3}
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
      width: "15%",
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
                    minimumFractionDigits={3}
                    maximumFractionDigits={3}
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
      width: "12.5%",
      header: (
        <FormattedMessage
          id="drawer.fees.table.header.calculation.method"
          description="The calculation method to calculate how to charge the fee"
          defaultMessage="Calculation method"
        />
      ),
      render: (rowData: any) => {
        const { calculationMethod, fixFee, percentage } = rowData;
        return getCalculationMethod(calculationMethod, fixFee, percentage);
      },
    },
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="created"
          description="table header"
          defaultMessage="Created"
        />
      ),
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return <DateAndTimeConverter epoch={creationTime} monthFormat="long" />;
      },
    },
    {
      header: <> </>,
      width: "5%",
      render: (rowData: any) => {
        const { currency, transactionTypeCode, transactionSourceCode } =
          rowData;
        return (
          <QDButton
            id={`programs-fees-param-delete-${currency}-${transactionSourceCode}-${transactionTypeCode}`}
            label={intl.formatMessage({
              id: "delete",
              defaultMessage: "Delete",
            })}
            className="float-right"
            onClick={() => deleteFeeEntry(rowData)}
            color="primary"
            variant="contained"
            size="small"
          />
        );
      },
    },
  ];

  useEffect(() => {
    emitter.on("feePlan.fees.changed", () => getFees());
  }, []);

  useEffect(() => {
    getFees();
  }, [feePlan]);

  return (
    <Box sx={{ mt: 13 }}>
      <StandardTable
        id="program-fees-drawer-table"
        tableRowPrefix="program-risk-level-configs-table"
        dataList={fees}
        tableMetadata={RiskLevelMetaData}
        customFooter="no-box-shadow"
      />
    </Box>
  );
};

export default ProgramFeeLevelTwo;
