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
import { Avatar, FormGroup, Grid, TextField, Box } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { Field, FieldArray, FieldProps, Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import QDCheckbox from "../../common/forms/inputs/QDCheckbox";
import SubmitButton from "../../common/elements/SubmitButton";
import { installmentsFormSchema } from "../../../yup";
import Label from "../../common/elements/Label";

import {
  ProgramInstallmentsConfig,
} from "../../../types/program";
import FormikInputField from "../../common/forms/formikWrapper/FormikInputField";
import { FormikSelect } from "../../common/forms/formikWrapper/FormikSelect";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    smallCircle: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      margin: "0 20px 0 0",
      fontSize: "13px",
    },
    checkbox: {
      fontSize: "13px",
      lineHeight: "14px",
      color: "#152C5B",
    },
  })
);

interface CreditInput {
  initialValues: ProgramInstallmentsConfig;
  submitForm?: any;
  refId?: any;
  programName?: any;
  edit: boolean;
}

/**
 * Temporarily copy pasted from configure form base
 * This is only the credit portion and ideally can be injected into the base form.
 * @param initialValues
 * @constructor
 */
const ConfigureProductFormInstallments: React.FC<CreditInput> = ({
  initialValues,
  submitForm,
  refId,
  programName,
  edit,
}) => {
  const classes = useStyles();
  const [rendered, setRendered] = useState<any>(null);

  const [installmentsPeriodLength, setInstallmentsPeriodLength] = useState([
    { label: "DAY", value: "DAY" },
    { label: "WEEK", value: "WEEK" },
    { label: "FORTNIGHT", value: "FORTNIGHT" },
    { label: "MONTH", value: "MONTH" },
    { label: "QUARTER", value: "QUARTER" },
    { label: "YEAR", value: "YEAR" },
  ]);

  const updateConfig = (config: ProgramInstallmentsConfig) => {
    if (!config.firstPaymentDaysOffset) {
      config.firstPaymentDaysOffset = null;
    }
    setRendered(true);
  };

  useEffect(() => {
    updateConfig(initialValues);
  }, [initialValues, installmentsPeriodLength]);

  const createInputGridItem = (
    name: string,
    placeHolder: string,
    xs: any = 4
  ) => (
    <Grid item xs={xs} lg={xs} direction="row">
      <FormikInputField name={name} placeholder={placeHolder} />
    </Grid>
  );

  const onSubmitFunc = (config: ProgramInstallmentsConfig) => {
    submitForm(
      config,
      "net.e6tech.h3.middletier.model.offering.banking.installments.Installments"
    );
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={installmentsFormSchema}
      enableReinitialize={true}
      onSubmit={(values) => {
        onSubmitFunc(values);
      }}
    >
      {(props: any) => (
        <Form noValidate>
          <FormGroup>
            <Grid container xs={12} direction="row">
              <button
                ref={refId}
                id="submitBtn"
                type="submit"
                style={{ display: "none" }}
                value="Validate"
              />

              <Label variant="grey" size="field-label" bMargin="15px">
                Credit Limits
              </Label>
              <Grid container spacing={3} xs={12} direction="row">
                {createInputGridItem("minCreditLimit", "Minimum Allowed", 3)}

                {createInputGridItem("maxCreditLimit", "Maximum Allowed", 3)}

                {programName ? (
                  <Grid item xs={4} lg={4} textAlign="center">
                    <SubmitButton id="save-changes" disabled={false}>
                      <FormattedMessage
                        id="configure.form.button.setPlugins"
                        description="Save Button"
                        defaultMessage="Save"
                      />
                    </SubmitButton>
                  </Grid>
                ) : null}
              </Grid>

              <Grid container xs={2}>
                <Grid container xs={12}>
                  <Label variant="grey" size="field-label" bMargin="15px">
                    Pre-Configured Loans
                  </Label>
                </Grid>
                <Grid container xs={12} spacing={3} direction="row">
                  {createInputGridItem("minimumPrincipal", "Minimum Principal", 3)}
                </Grid>
                <Grid container xs={12} spacing={3} direction="row">
                  {createInputGridItem(
                    "firstPaymentDaysOffset",
                    "Payment Offset Days",
                    3
                  )}
                </Grid>
                <Grid container xs={12} spacing={3} direction="row">
                  {createInputGridItem("periodCount", "Period Count", 3)}
                </Grid>

                <Grid container spacing={2} xs={12} direction="row">
                  <Grid item xs={12} lg={3} direction="row">
                    {props.values.periodLength !== undefined && (
                      <Field name="periodLength">
                        {({ field, form, meta }: FieldProps) => {
                          return (
                            <FormikSelect
                              required
                              field={field}
                              form={form}
                              meta={meta}
                              label={"Period Length"}
                              options={installmentsPeriodLength}
                            />
                          );
                        }}
                      </Field>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </Form>
      )}
    </Formik>
  );
};

export default ConfigureProductFormInstallments;
