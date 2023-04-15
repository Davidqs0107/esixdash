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
import { NavLink } from "react-router-dom";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import api from "../../../../api/api";
// eslint-disable-next-line import/no-cycle
import Header from "../../../common/elements/Header";
import { MessageContext } from "../../../../contexts/MessageContext";
import QDFormattedCurrency from "../../../common/converters/QDFormattedCurrency";
import {
  OfferingCustomerSummary,
  OfferingCustomerInstallmentsSummary,
  InstallmentLoanItem,
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
    "& .cardBody p.MuiTypography-labelDark": {
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

const ProductInstallments = (props: any) => {
  const { customerNumber, homeCurrency, programName, programProduct } = props;
  const intl = useIntl();
  const [product, setProduct] = useState<OfferingCustomerInstallmentsSummary>();
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const [isOfferingProgram, setIsOfferingProgram] = useState(false);
  const [loansList, setLoansList] = useState<any>([]);
  const [balanceCalculated, setBalanceCalculated] = useState(false);

  const [programConfig, setProgramConfig] =
    useState<ProgramInstallmentsConfig>();

  const getLoanSummary = (
    customerNumber: string,
    loans: InstallmentLoanItem[]
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.ProductAPI.getOfferingActions(customerNumber).then((res: any) => {
      if (res.length > 0) {
        let req = res.filter(
          (a: { name: string }) => a.name == "getLoanSummary"
        )[0];

        if (req) {
          let attribute = req.attributes.filter(
            (attribute: { name: string }) =>
              (attribute.name = "loanCustomerNumber")
          )[0];

          const promises: any = [];
          loans.forEach((loan, index) => {

            const attrDto = {
                ...attribute,
                value: loan.customerNumber
            }

            const reqDto = {
                ...req,
                attributes: [attrDto]
            };
            promises.push(
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              api.ProductAPI.executeOfferingAction(customerNumber, reqDto)
            );
          });

          Promise.all(promises).then((results: any) => {
            const loansList = results.map((r: any) => {
                const amortizationSchedule = r.amortizationSchedule;
                const paidItems = amortizationSchedule.filter((a: any) => a.principalDueAmount == a.principalRepaidAmount)
                const unpaidItems = amortizationSchedule.filter((a: any) => a.principalRepaidAmount == 0)
                const repaidTotal = amortizationSchedule.reduce((total: number, a: any) => a.principalRepaidAmount + total,0)

                const sortedUnpaidItems = unpaidItems.sort((a: any, b: any) => a.endTime - b.endTime);
                let nextDueDate = 0;
                if (sortedUnpaidItems.length > 0 && typeof sortedUnpaidItems[0] !== undefined) {
                    nextDueDate = sortedUnpaidItems[0].endTime;
                }
                console.log("sortedUnpaidItems", sortedUnpaidItems)
                const loanBalance = r.balances.PRINCIPAL + r.balances.INTEREST + r.balances.FEE;

                r.paymentsCount = paidItems.length;
                r.repaidTotal = repaidTotal;
                r.nextDueDate = nextDueDate;
                r.status = repaidTotal >= r.originalAmount ? "Closed" : "Open";
                r.loanBalance = loanBalance;
                return r;
            });
            setLoansList(loansList);
          });
        }
      }
    });
  };

  const setCustomerProduct = (product: OfferingCustomerSummary) => {
    const customerSummary: OfferingCustomerInstallmentsSummary = {
      ...product,
      totalBalance: 0,
      pendingBalance: 0,
      availableBalance: 0,
    };
    setProduct(customerSummary);

    if (customerSummary.loans) {
      getLoanSummary(customerSummary.customerNumber, customerSummary.loans);
    }
  };

  const getCustomerProduct = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.ProductAPI.getOfferingCustomer(customerNumber)
      .then((product: OfferingCustomerSummary) => {
        setCustomerProduct(product);
      })
      .catch((error: any) => console.log(error));

  const updateOfferingConfig = (programProduct: Program) => {
    setIsOfferingProgram(true);
    setProgramConfig(programProduct.config as ProgramInstallmentsConfig);
  };

  const calculateBalances = () => {
    if ( product ) {
      const totalBalance = loansList.reduce((total: number, a: any) => a.loanBalance + total,0)
      product.totalBalance = Math.abs(totalBalance);
      product.availableBalance = product.availableCredit;
      setBalanceCalculated(true);
    }
  };

  useEffect(() => {
    if (programProduct) {
      updateOfferingConfig(programProduct);
    }
  }, [programProduct]);

  useEffect(() => {
    isOfferingProgram ? getCustomerProduct() : null;
  }, [isOfferingProgram]);

  useEffect(() => {
    calculateBalances();
  }, [loansList]);

  const loansTableMetadata = [
    {
      width: "14.2%",
      header: <FormattedMessage id="loanNumber" defaultMessage="Loan Number" />,
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
      width: "14.2%",
      header: (
        <FormattedMessage
          id="originalPrincipal"
          defaultMessage="Original Principal"
        />
      ),
      render: (rowData: any) => {
        const { originalAmount } = rowData;
        return (
          <QDFormattedCurrency
            currency={homeCurrency}
            amount={originalAmount}
          />
        );
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage id="madePayments" defaultMessage="Made Payments" />
      ),
      render: (rowData: any) => {
        const { paymentsCount, periodCount } = rowData;
        return <TextRender data={paymentsCount + "/" + periodCount} />;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage id="repaidTotal" defaultMessage="Repaid Total" />
      ),
      render: (rowData: any) => {
        const { repaidTotal } = rowData;
        return (
          <QDFormattedCurrency
            currency={homeCurrency}
            amount={repaidTotal}
          />
        );
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage id="nextDueDate" defaultMessage="Next Due Date" />
      ),
      render: (rowData: any) => {
        const { nextDueDate } = rowData;
        return nextDueDate !== 0 ? (
          <DateAndTimeConverter epoch={nextDueDate} monthFormat="long" />
        ) : null;
      },
    },
    {
      width: "14.2%",
      header: <FormattedMessage id="status" defaultMessage="Status" />,
      render: (rowData: any) => {
        const { status } = rowData;
        return <TextRender data={status} />;
      },
    },
    {
      width: "14.2%",
      header: (
        <FormattedMessage id="creationDate" defaultMessage="Creation Date" />
      ),
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return creationTime !== 0 ? (
          <DateAndTimeConverter epoch={creationTime} monthFormat="long" />
        ) : null;
      },
    },
  ];

  return product && balanceCalculated ? (
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
                  <Label regular>Total Balance</Label>
                  <QDFormattedCurrency
                    currency={homeCurrency}
                    amount={product.totalBalance}
                    bold
                    variant="labelDark"
                    forceVariant
                  />
                </Grid>
                <Grid item lg={6}>
                  {/* <Label regular>Pending Balance</Label>
                  <QDFormattedCurrency
                    currency={homeCurrency}
                    amount={product.pendingBalance}
                    bold
                  /> */}
                </Grid>
              </Grid>
            </Box>
          </StyledCard>
        </Grid>
        <Grid item>
          <StyledCard>
            <Grid container className="cardHeader">
              <Grid item flexGrow="1">
                <Header
                  value={intl.formatMessage(
                    defineMessage({
                      id: "creditLimit",
                      description: "Credit Limit",
                      defaultMessage: "Credit Limit",
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
                  <Label regular>Available Credit</Label>
                  <QDFormattedCurrency
                    currency={homeCurrency}
                    amount={product.availableBalance}
                    bold
                    variant="labelDark"
                    forceVariant
                  />
                </Grid>
                <Grid item lg={6}>
                  <Label regular>Credit Limit</Label>
                  <QDFormattedCurrency
                    currency={homeCurrency}
                    amount={product.overallCreditLimit}
                    bold
                    variant="labelDark"
                    forceVariant
                  />
                </Grid>
              </Grid>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>
      <Box>
        <StandardTable
          id="customer-loans-table"
          tableRowPrefix="customer-loans-table"
          tableMetadata={loansTableMetadata}
          dataList={loansList}
        />
      </Box>
    </Box>
  ) : (
    <Typography
      className="label-regular weighted"
      style={{
        fontFamily: "Montserrat",
        opacity: 0.8,
        marginLeft: "100px",
      }}
    >
      No configured product
    </Typography>
  );
};

export default ProductInstallments;
