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

import Typography from "@mui/material/Typography";
import { FormGroup, Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import { MessageContext } from "../../../contexts/MessageContext";

const useStyles = makeStyles(() =>
  createStyles({
    fields: {
      boxShadow: "0 15px 5px -10px #0b0d100a",
    },
  })
);

interface CreditInput {
  initialValues: any;
}

/**
 * Temporarily copy pasted from configure form base
 * This is only the credit portion and ideally can be injected into the base form.
 * @param initialValues
 * @constructor
 */
const ConfigureProductFormLoan: React.FC<CreditInput> = ({ initialValues }) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const classes = useStyles();
  const [balanceType, setBalanceType] = useState<any>("");
  const [purchaseConfig, setPurchaseConfig] = useState<any>(null);
  const [interestConfig, setInterestConfig] = useState<any>(null);

  const [previousPrincipleRatio, setPreviousPrincipleRatio] = useState<
    number | string
  >(0);
  const [previousInterestRatio, setPreviousInterestRatio] = useState<
    number | string
  >(0);
  const [owedInterestRatio, setOwedInterestRatio] = useState<number | string>(
    0
  );
  const [owedPrincipleRatio, setOwedPrincipleRatio] = useState<number | string>(
    0
  );

  const setProductInformation = () => {
    setPurchaseConfig("true");
  };

  useEffect(() => {}, [initialValues]);

  const createInputGridItem = (
    inputName: string,
    inputPlaceholder: any,
    inputValue: any,
    props: any
  ) => (
    <Grid className={classes.fields} item xs={4} md={4} lg={4} direction="row">
      <InputWithPlaceholder
        name={inputName}
        autoComplete="off"
        type="text"
        placeholder={inputPlaceholder}
        value={inputValue}
        className="login-input"
        {...props}
      />
    </Grid>
  );

  return (
    <Formik
      initialValues={initialValues}
      // validationSchema={PartnerUserSchema}
      onSubmit={async (values) => {
        // setDTO(values);
        // setPlugInObject(values);
      }}
      enableReinitialize
    >
      {(props: any) => (
        <form onSubmit={props.handleSubmit}>
          <FormGroup>
            <Grid container spacing={3} xs={12} md={12} lg={12} direction="row">
              {createInputGridItem(
                "installments",
                `{${intl.formatMessage({
                  id: "installments",
                  defaultMessage: "Installments",
                })}*`,
                "",
                props
              )}
            </Grid>
            <Typography className="label-regular mt-4">Loan Period:</Typography>
            <Grid container spacing={3} xs={12} md={12} lg={12} direction="row">
              {createInputGridItem(
                "loanPeriod",
                `{${intl.formatMessage({
                  id: "loanPeriod",
                  defaultMessage: "Loan Period",
                })}*`,
                "",
                props
              )}
              {createInputGridItem(
                "loanPeriodDays",
                `{${intl.formatMessage({
                  id: "loanPeriodDays",
                  defaultMessage: "Loan Period Days",
                })}*`,
                "",
                props
              )}
            </Grid>
            <Grid container spacing={3} xs={12} md={12} lg={12} direction="row">
              {createInputGridItem(
                "interestApplicationDay",
                `{${intl.formatMessage({
                  id: "interestApplicationDay",
                  defaultMessage: "Interest Application Day",
                })}*`,
                "",
                props
              )}
            </Grid>
            <Grid container spacing={3} xs={12} md={12} lg={12} direction="row">
              {createInputGridItem(
                "annualInterestRateOnLoanAmount",
                `{${intl.formatMessage({
                  id: "annualInterestRateOnLoanAmount",
                  defaultMessage: "Annual Interest Rate On Loan Amount",
                })}*`,
                "",
                props
              )}
            </Grid>
            <Grid container spacing={3} xs={12} md={12} lg={12} direction="row">
              {createInputGridItem(
                "dayCountPerYear",
                `{${intl.formatMessage({
                  id: "dayCountPerYear",
                  defaultMessage: "Day Count Per Year",
                })}*`,
                "",
                props
              )}
            </Grid>
            <Grid container spacing={3} xs={12} md={12} lg={12} direction="row">
              {createInputGridItem(
                "annualInterestRateMaxLimit",
                `{${intl.formatMessage({
                  id: "annualInterestRateMaxLimit",
                  defaultMessage: "Annual Interest Rate Max Limit",
                })}*`,
                "",
                props
              )}
            </Grid>
          </FormGroup>
        </form>
      )}
    </Formik>
  );
};

export default ConfigureProductFormLoan;
