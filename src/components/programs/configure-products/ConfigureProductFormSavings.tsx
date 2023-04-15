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

import Typography from "@mui/material/Typography";
import { FormGroup, Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import { MessageContext } from "../../../contexts/MessageContext";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fields: {
      boxShadow: "0 15px 5px -10px #0b0d100a",
    },
  })
);

interface ICreditInput {
  initialValues: any;
}

/**
 * Temporarily copy pasted from configure form base
 * This is only the credit portion and ideally can be injected into the base form.
 * @param initialValues
 * @constructor
 */
const ConfigureProductFormSavings: React.FC<ICreditInput> = ({
  initialValues,
}) => {
  const { setErrorMsg } = useContext(MessageContext);
  const intl = useIntl();
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

  const createPaymentHierarchyEntry = (
    inputName: string,
    inputValue: any,
    text: string,
    props: any
  ) => (
    <Grid container xs={12} spacing={3} direction="row">
      <Grid className={classes.fields} item xs={1} direction="row">
        <InputWithPlaceholder
          name={inputName}
          autoComplete="off"
          type="text"
          value={inputValue}
          className="login-input"
          {...props}
        />
      </Grid>
      <Typography
        style={{
          fontSize: "13px",
          fontFamily: "Montserrat",
          marginTop: "35px",
          fontWeight: 500,
        }}
      >
        {text}
      </Typography>
    </Grid>
  );

  const createInputGridItem = (
    inputName: string,
    inputPlaceholder: any,
    inputValue: any,
    props: any
  ) => (
    <Grid className={classes.fields} item xs={4} direction="row">
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
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        // setDTO(values);
        // setPlugInObject(values);
      }}
      enableReinitialize
    >
      {(props: any) => (
        <form onSubmit={props.handleSubmit}>
          <FormGroup>
            <Grid container spacing={3} xs={12} direction="row">
              {createInputGridItem(
                "annualRate",
                `{${intl.formatMessage({
                  id: "annualRate",
                  defaultMessage: "Annual Rate",
                })}*`,
                "",
                props
              )}
            </Grid>
            <Grid container spacing={3} xs={12} direction="row">
              {createInputGridItem(
                "daysPerYear",
                `{${intl.formatMessage({
                  id: "daysPerYear",
                  defaultMessage: "Days Per Year",
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
            <Grid container spacing={3} xs={12} direction="row">
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
            <Grid container spacing={3} xs={12} direction="row">
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
            <Grid container spacing={3} xs={12} direction="row">
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
            <Grid container spacing={3} xs={12} direction="row">
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

export default ConfigureProductFormSavings;
