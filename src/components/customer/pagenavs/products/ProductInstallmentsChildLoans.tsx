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

// eslint-disable-next-line no-use-before-define
import React, { useContext, useEffect, useState } from "react";
import { defineMessage, useIntl, FormattedMessage } from "react-intl";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import api from "../../../../api/api";
// eslint-disable-next-line import/no-cycle
import Header from "../../../common/elements/Header";
import { MessageContext } from "../../../../contexts/MessageContext";
import QDFormattedCurrency from "../../../common/converters/QDFormattedCurrency";
import {
  OfferingCustomerChildInstallmentsSummary,
} from "../../../../types/customer";
import { Program, ProgramInstallmentsConfig } from "../../../../types/program";
import { withStyles } from "@mui/styles";
import Label from "../../../common/elements/Label";
import TextRender from "../../../common/TextRender";
import DateAndTimeConverter from "../../../common/converters/DateAndTimeConverter";
import StandardTable from "../../../common/table/StandardTable";

const StyledCard = withStyles((theme) => ({
  root: {
    width: "453px",
    marginBottom: "80px",
    "& .cardHeader": {
      borderBottom: "1px solid #D4E4EF",
    },
    "& .cardHeader h2": {
      lineHeight: "29px",
      fontWeight: 700,
    },
    "& .cardHeader h2, & .cardHeader .iconButtons > div": {
      marginBottom: "16px",
    },
    "& .cardBody": {
      paddingTop: "16px",
    },
    "& .cardBody label.MuiTypography-grey": {
      marginTop: "4px",
    },
    "& .cardBody label.MuiTypography-body1": {
      fontSize: "14px",
      lineHeight: "18px",
      marginBottom: "12px"
    },
    "& .cardBody p.MuiTypography-labelDark, & .cardBody p.labelDark": {
      fontSize: "24px",
      lineHeight: 1,
      fontWeight: 700,
    },
    "& .cardBody p, & .cardBody label": {
      display: "block",
    },
    "& .cardBody > .MuiGrid-container": {
      marginBottom: "25px",
    },
  },
}))(Box);

const ProductInstallmentsChildLoans = (props: any) => {
  const {
    customerNumber,
    homeCurrency,
    programName,
    programProduct,
    parentCustomerNumber,
  } = props;
  const intl = useIntl();
  const [childProduct, setChildProduct] =
    useState<OfferingCustomerChildInstallmentsSummary>();
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const [amortizationSchedule, setAmortizationSchedule] = useState<any>([]);

  const [programConfig, setProgramConfig] =
    useState<ProgramInstallmentsConfig>();

  const getChildLoans = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.ProductAPI.getOfferingActions(parentCustomerNumber).then((res: any) => {
      if (res.length > 0) {
        let req = res.filter(
          (a: { name: string }) => a.name == "getLoanSummary"
        )[0];

        if (req) {
          let attribute = req.attributes.filter(
            (attribute: { name: string }) =>
              (attribute.name = "loanCustomerNumber")
          )[0];

          attribute.value = customerNumber;

          // @ts-ignore
          api.ProductAPI.executeOfferingAction(parentCustomerNumber, req).then(
            (res: any) => {
              setChildProduct(res);
              setAmortizationSchedule(res.amortizationSchedule);
            }
          );
        }
      }
    });
  };
  const amortTableMetadata = [
    {
      width: "10%",
      header: <FormattedMessage id="payment" defaultMessage="Payment" />,
      render: (rowData: any) => {
        const { index } = rowData;
        return <TextRender data={ index + 1 } />;
      },
    },
    {
      width: "20%",
      header: (
        <FormattedMessage id="paymentDueDate" defaultMessage="Payment Due Date" />
      ),
      render: (rowData: any) => {
        const { endTime } = rowData;
        return endTime !== 0 ? (
          <DateAndTimeConverter epoch={endTime} monthFormat="long" inline={true} />
        ) : null;
      },
    },
    {
      width: "15%",
      header: (
        <FormattedMessage id="totalDue" defaultMessage="Total Due"
        />
      ),
      render: (rowData: any) => {
        const { principalDueAmount } = rowData;
        return (
          <QDFormattedCurrency currency={homeCurrency} amount={principalDueAmount} />
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage id="principal" defaultMessage="Principal"
        />
      ),
      render: (rowData: any) => {
        const { principalDueAmount } = rowData;
        return (
          <QDFormattedCurrency currency={homeCurrency} amount={principalDueAmount} />
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage id="interest" defaultMessage="Interest"
        />
      ),
      render: (rowData: any) => {
        return (
          <QDFormattedCurrency currency={homeCurrency} amount={0} />
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage id="fees" defaultMessage="Fees"
        />
      ),
      render: (rowData: any) => {
        return (
          <QDFormattedCurrency currency={homeCurrency} amount={0} />
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage id="repaid" defaultMessage="Repaid"
        />
      ),
      render: (rowData: any) => {
        const { principalRepaidAmount } = rowData;
        return (
          <QDFormattedCurrency currency={homeCurrency} amount={principalRepaidAmount} />
        );
      },
    },
  ];

  useEffect(() => {
    if (programProduct) {
      getChildLoans();
    }
  }, [programProduct, parentCustomerNumber]);

  return childProduct ? (
    <Box>
      <Grid container spacing={15}>
        <Grid item>
          <StyledCard>
            <Grid container className="cardHeader">
              <Grid item flexGrow="1">
                <Header
                  value={intl.formatMessage(
                    defineMessage({
                      id: "balanceSummary",
                      description: "Balance Summary",
                      defaultMessage: "Balance Summary",
                    })
                  )}
                  level={2}
                  bold
                  color="primary"
                />
              </Grid>
            </Grid>

            <Box className="cardBody">
              <Grid container spacing={3}>
                <Grid item lg={6} rowSpacing={3}>
                  <Label regular>Unpaid Principal</Label>
                  <QDFormattedCurrency
                    currency={homeCurrency}
                    amount={ Math.abs(childProduct.balances.PRINCIPAL) }
                    bold
                    variant="labelDark"
                    forceVariant
                  />
                </Grid>
                <Grid item lg={6}>
                  <Label regular>Original Principal</Label>
                  <QDFormattedCurrency
                    currency={homeCurrency}
                    amount={childProduct.originalAmount}
                    bold
                    variant="labelDark"
                    forceVariant
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item lg={6} rowSpacing={3}>
                  <Label regular>Interest</Label>
                  <QDFormattedCurrency
                    currency={homeCurrency}
                    amount={childProduct.balances.INTEREST}
                    bold
                    variant="labelDark"
                    forceVariant
                  />
                </Grid>
                <Grid item lg={6}>
                  <Label regular>Fees</Label>
                  <QDFormattedCurrency
                    currency={homeCurrency}
                    amount={childProduct.balances.FEE}
                    bold
                    variant="labelDark"
                    forceVariant
                  />
                </Grid>
              </Grid>
            </Box>
          </StyledCard>
        </Grid>
        <Grid item md={6} lg={6}>
          <StyledCard>
            <Grid container className="cardHeader">
              <Grid item flexGrow="1">
                <Header
                  value={intl.formatMessage(
                    defineMessage({
                      id: "loanConfigurations",
                      defaultMessage: "Loan Configurations",
                    })
                  )}
                  level={2}
                  bold
                  color="primary"
                />
              </Grid>
            </Grid>

            <Box className="cardBody">
              <Grid container spacing={3}>
                <Grid item lg={6} rowSpacing={3}>
                  <Label regular>Number of Periods</Label>
                  <TextRender
                    data={childProduct.periodCount}
                    size="large"
                    fontWeight={700}
                    lineHeight="1"
                  />
                </Grid>
                <Grid item lg={6}>
                  <Label regular>Period Length</Label>
                  <TextRender
                    data={childProduct.periodLength}
                    size="large"
                    fontWeight={700}
                    lineHeight="1"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3}>
                <Grid item lg={12} rowSpacing={3}>
                  <Label regular>Origination Date</Label>
                  <TextRender
                    data={
                      <DateAndTimeConverter
                        epoch={childProduct.creationTime}
                        monthFormat="long"
                        inline={true}
                        wrapped={false}
                      />
                    }
                    size="large"
                    fontWeight={700}
                    lineHeight="1"
                  />
                </Grid>
              </Grid>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>
      <Box>
        <StandardTable
          id="customer-amort-table"
          tableRowPrefix="customer-amort-table"
          tableMetadata={amortTableMetadata}
          dataList={amortizationSchedule}
        />
      </Box>
    </Box>
  ) : null;
};

export default ProductInstallmentsChildLoans;
