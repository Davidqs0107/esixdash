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
import { defineMessage, useIntl } from "react-intl";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Field, FieldProps, Form, Formik } from "formik";
import * as Yup from "yup";
import { FormGroup } from "@mui/material";
import api from "../../../../api/api";
// eslint-disable-next-line import/no-cycle
import Header from "../../../common/elements/Header";
import { MessageContext } from "../../../../contexts/MessageContext";
import QDFormattedCurrency from "../../../common/converters/QDFormattedCurrency";
import DrawerComp from "../../../common/DrawerComp";
import PendingMinimumPayments from "../../drawers/PendingMinimumPayments";
import QDButton from "../../../common/elements/QDButton";
import Icon from "../../../common/Icon";
import BalanceAdjustment from "../../drawers/BalanceAdjustment";
import emitter from "../../../../emitter";
import {
  BillingHistory,
  CustomerExternalReference,
  OfferingCustomerSummary,
  OfferingCustomerSummaryExtend,
} from "../../../../types/customer";
import FormikInputField from "../../../common/forms/formikWrapper/FormikInputField";
import { FormikSelect } from "../../../common/forms/formikWrapper/FormikSelect";
import { Program, ProgramCreditCardConfig } from "../../../../types/program";
import { ContentVisibilityContext } from "../../../../contexts/ContentVisibilityContext";
import QDCheckbox from "../../../common/forms/inputs/QDCheckbox";
import DrawerBillingHistory from "../../drawers/DrawerBillingHistory";
import { convertDate } from "../../../util/ConvertEpochToDate";
import EllipseMenu from "../../../common/EllipseMenu";
import { withStyles } from "@mui/styles";
import Label from "../../../common/elements/Label";
import DrawerAutoload from "../../drawers/drawer.balance.autoload";
import toTitleCase from "../../../util/toTitleCase";

const StyledCard = withStyles((theme) => ({
  root: {
    "& .cardHeader": {
      borderBottom: "1px solid #D4E4EF",
    },
    "& .cardHeader h2, & .cardHeader .iconButtons > div": {
      marginBottom: "6px",
    },
    "& .cardBody": {
      padding: "22px 0",
    },
    "& .cardBody label.MuiTypography-grey": {
      marginTop: "4px",
    },
    "& .cardBody p, & .cardBody label": {
      display: "block",
    },
    "& .cardBody > .MuiGrid-container": {
      marginBottom: "25px",
    },
  },
}))(Box);

interface IProductCreditCard {
  customerNumber: string;
  primaryPersonId: string;
  homeCurrency: string;
  programName: string;
}

interface AutoloadRule {
  externalReferenceId: string;
  config: {
    frequency: string;
    dayOffset: number;
    autoLoadStrategy: string;
    fixedAmount: number;
  };
}

const ProductCreditCard = (props: any) => {
  const { customerNumber, homeCurrency, programName, programProduct } = props;
  const intl = useIntl();
  const [product, setProduct] = useState<OfferingCustomerSummaryExtend>();
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const { readOnly } = useContext(ContentVisibilityContext);
  const [editModeCredit, setEditModeCredit] = useState<boolean>();
  const [editModeInterestAccrual, setEditModeInterestAccrual] =
    useState<boolean>();

  const [anchorBillingHistoryMenu, setAnchorBillingHistoryMenu] =
    React.useState<null | HTMLElement>(null);
  const [anchorCreditMenu, setAnchorCreditMinimumPaymentMenu] =
    React.useState<null | HTMLElement>(null);
  const [anchorInterestAccrualMenu, setAnchorInterestAccrualMenu] =
    React.useState<null | HTMLElement>(null);
  const [anchorPurchaseBalancesMenu, setAnchorPurchaseBalancesMenu] =
    React.useState<null | HTMLElement>(null);
  const [anchorCashAdvanceBalancesMenu, setAnchorCashAdvanceBalancesMenu] =
    React.useState<null | HTMLElement>(null);
  const [anchorFeeBalancesMenu, setAnchorFeeBalancesMenu] =
    React.useState<null | HTMLElement>(null);
  const [lastBillingHistory, setLastBillingHistory] =
    React.useState<BillingHistory>();
  const [anchorAutoloadMenu, setAnchorAutoloadMenu] =
    React.useState<null | HTMLElement>(null);
  Boolean(anchorBillingHistoryMenu);
  Boolean(anchorCreditMenu);
  Boolean(anchorInterestAccrualMenu);
  Boolean(anchorPurchaseBalancesMenu);
  Boolean(anchorCashAdvanceBalancesMenu);
  Boolean(anchorAutoloadMenu);
  Boolean(anchorFeeBalancesMenu);
  const [isOfferingProgram, setIsOfferingProgram] = useState(false);
  const [interestConfigModes, setInterestConfigModes] = useState([
    {
      label: "DIRECT",
      value: "DIRECT",
    },
    {
      label: "TIER",
      value: "TIER",
    },
  ]);
  const [interestTierNames, setInterestTierNames] = useState([
    {
      label: "",
      value: "",
    },
  ]);
  const [programConfig, setProgramConfig] = useState<ProgramCreditCardConfig>();
  const [autoLoadRule, setAutoLoadRule] = useState<AutoloadRule>();
  const [externalRefList, setExternalRefList] = useState<
    CustomerExternalReference[]
  >([]);

  const handleCloseCreditMenu = () => {
    setAnchorCreditMinimumPaymentMenu(null);
  };

  const handleCloseInterestAccrualMenu = () => {
    setAnchorInterestAccrualMenu(null);
  };

  const handleClosePurchaseBalancesMenu = () => {
    setAnchorPurchaseBalancesMenu(null);
  };
  const handleCloseCashAdvanceBalancesMenu = () => {
    setAnchorCashAdvanceBalancesMenu(null);
  };
  const handleCloseFeeBalancesMenu = () => {
    setAnchorFeeBalancesMenu(null);
  };
  const handleCloseAutoloadMenu = () => {
    setAnchorAutoloadMenu(null);
  };

  const getLastBillingHistory = (customerNumber: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.ProductAPI.getOfferingActions(customerNumber).then((res: any) => {
      if (res.length > 0) {
        const req = res.filter(
          (a: { name: string }) => a.name == "billingHistory"
        )[0];

        if (req) {
          const attribute = req.attributes.filter(
            (attribute: { name: string }) => (attribute.name = "limit")
          )[0];
          attribute.value = 1;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          api.ProductAPI.executeOfferingAction(customerNumber, req)
            .then((res: any) => {
              setLastBillingHistory(res[0]);
            })
            .catch((error: any) => console.log(error));
        }
      }
    });
  };

  const getExternalReferences = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.getExternalReferences(customerNumber)
      .then((result: CustomerExternalReference[]) => {
        setExternalRefList(result);
      })
      .catch((error: any) => setErrorMsg(error));

  const getAutoLoadRules = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.AutoloadAPI.getAutoLoadRules(customerNumber)
      .then((result: any) => {
        setAutoLoadRule(result.shift());
      })
      .catch((error: any) => console.log(error));

  const setCustomerProduct = (product: OfferingCustomerSummary) => {
    const customerSummary: OfferingCustomerSummaryExtend = {
      ...product,
      totalPastDue: 0,
      unpaidMinimums: 0,
    };

    product.repaymentPeriods.forEach((r) => {
      customerSummary.totalPastDue += r.minimumPaymentAmount;
    });

    customerSummary.unpaidMinimums = product?.repaymentPeriods.filter(
      (r) => r?.periodBalanceAmount < 0
    ).length;

    setProduct(customerSummary);

    getLastBillingHistory(customerSummary.customerNumber);
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
    setProgramConfig(programProduct.config as ProgramCreditCardConfig);
    if (programProduct.config.interestTiers) {
      const tierNames: typeof interestTierNames = [];
      Object.keys(programProduct.config.interestTiers).forEach((tier) =>
        tierNames.push({
          label: tier,
          value: tier,
        })
      );
      setInterestTierNames(tierNames);
    }
  };

  useEffect(() => {
    if (programProduct) {
      updateOfferingConfig(programProduct);
    }
    getExternalReferences();
  }, [programProduct]);

  useEffect(() => {
    if (isOfferingProgram) {
      getCustomerProduct();
      getAutoLoadRules();
    }

    emitter.on("drawbalances.changed", () => {
      getCustomerProduct();
      handleClosePurchaseBalancesMenu();
      handleCloseCashAdvanceBalancesMenu();
      handleCloseFeeBalancesMenu();
    });
    emitter.on("autoload.changed", () => {
      getCustomerProduct();
      getAutoLoadRules();
      handleCloseAutoloadMenu();
    });
    emitter.on("drawbalances.cancel", () => {
      handleClosePurchaseBalancesMenu();
      handleCloseCashAdvanceBalancesMenu();
      handleCloseFeeBalancesMenu();
    });
    emitter.on("external.accounts.changed", () => getExternalReferences());
  }, [isOfferingProgram]);

  const hasAutoLoadRule = product && product?.autoLoadEndDate != undefined;

  const creditFormSchema = Yup.object().shape({
    overallCreditLimit: Yup.number()
      .min(
        0,
        intl.formatMessage({
          id: "error.invalid.input",
          defaultMessage: "Invalid input",
        })
      )
      .required(),
    annualInterestRate: Yup.object({
      PURCHASE: Yup.number()
        .min(
          0,
          intl.formatMessage({
            id: "error.invalid.input",
            defaultMessage: "Invalid input",
          })
        )
        .typeError(
          intl.formatMessage({
            id: "error.number.required",
            defaultMessage: "A number is required",
          })
        ),
      CASH_ADVANCE: Yup.number()
        .min(
          0,
          intl.formatMessage({
            id: "error.invalid.input",
            defaultMessage: "Invalid input",
          })
        )
        .typeError(
          intl.formatMessage({
            id: "error.number.required",
            defaultMessage: "A number is required",
          })
        ),
      FEE: Yup.number()
        .min(
          0,
          intl.formatMessage({
            id: "error.invalid.input",
            defaultMessage: "Invalid input",
          })
        )
        .typeError(
          intl.formatMessage({
            id: "error.number.required",
            defaultMessage: "A number is required",
          })
        ),
    }).default(undefined),
  });

  return product ? (
    <Formik
      initialValues={product}
      validationSchema={creditFormSchema}
      onSubmit={() => {}}
      enableReinitialize
    >
      {({ values, errors, isSubmitting, resetForm, setFieldValue }) => (
        <Form>
          <Box>
            <Grid container spacing={3}>
              {/* Summary Balances */}
              <Grid item lg={4}>
                <StyledCard>
                  <Grid container className="cardHeader">
                    <Grid item flexGrow="1">
                      <Header
                        value={intl.formatMessage(
                          defineMessage({
                            id: "product.section.header.summary",
                            description: "Summary section header",
                            defaultMessage: "Summary Balances",
                          })
                        )}
                        level={2}
                        bold
                        color="primary"
                      />
                    </Grid>
                    <Grid item>
                      {/* {!readOnly ? (
                        <EllipseMenu
                          anchorOriginVertical="top"
                          anchorOriginHorizontal="left"
                          transformOriginVertical={10}
                          transformOriginHorizontal={260}
                          icon="faEllipsisV"
                        ></EllipseMenu>
                      ) : null} */}
                    </Grid>
                  </Grid>

                  <Box className="cardBody">
                    <Grid container spacing={3}>
                      <Grid item lg={6}>
                        <QDFormattedCurrency
                          currency={homeCurrency}
                          amount={values.statementBalance}
                          bold
                        />
                        <Label variant="grey" regular>
                          Statement Balance
                        </Label>
                      </Grid>
                      <Grid item lg={6}>
                        <QDFormattedCurrency
                          currency={homeCurrency}
                          amount={values.totalBalance}
                          bold
                        />
                        <Label variant="grey" regular>
                          Total Balance
                        </Label>
                      </Grid>
                    </Grid>
                  </Box>
                </StyledCard>
              </Grid>
              {/* /Summary Balances */}

              {/* Billing */}
              <Grid item lg={4}>
                <StyledCard>
                  <Grid container className="cardHeader">
                    <Grid item flexGrow="1">
                      <Header
                        level={2}
                        bold
                        value={intl.formatMessage(
                          defineMessage({
                            id: "product.billing-history.header",
                            description: "Header for billing history section",
                            defaultMessage: "Billing",
                          })
                        )}
                      />
                    </Grid>
                    <Grid item>
                      <EllipseMenu
                        anchorOriginVertical="top"
                        anchorOriginHorizontal="left"
                        transformOriginVertical={10}
                        transformOriginHorizontal={260}
                        icon="faEllipsisV"
                      >
                        <DrawerComp
                          id="billing-history-link"
                          label={intl.formatMessage({
                            id: "product.button.billingDetails",
                            description: "Billing Details",
                            defaultMessage: "Billing Details",
                          })}
                          asLink
                          truncateAt={50}
                        >
                          <DrawerBillingHistory
                            customerSummary={values}
                            homeCurrency={homeCurrency}
                            toggleDrawer={() =>
                              setAnchorBillingHistoryMenu(null)
                            }
                          />
                        </DrawerComp>
                      </EllipseMenu>
                    </Grid>
                  </Grid>

                  <Box className="cardBody">
                    <Grid container spacing={3}>
                      <Grid item lg={6}>
                        <QDFormattedCurrency
                          currency={homeCurrency}
                          amount={
                            lastBillingHistory
                              ? lastBillingHistory.closingBalance
                              : "0"
                          }
                          bold
                        />

                        <Label variant="grey" regular>
                          Last Cycle Balance
                        </Label>
                      </Grid>
                      <Grid item lg={6}>
                        <QDFormattedCurrency
                          currency={homeCurrency}
                          amount={
                            lastBillingHistory
                              ? Math.ceil(lastBillingHistory.minimumDue)
                              : "0"
                          }
                          bold
                        />

                        <Label variant="grey" regular>
                          Minimum Due
                        </Label>
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item lg={6}>
                        <Label variant="labelDark" bold>
                          {lastBillingHistory
                            ? convertDate(lastBillingHistory.billingPeriodClose)
                            : "--"}
                        </Label>
                        <Label variant="grey" regular>
                          Last Cycle Close Date
                        </Label>
                      </Grid>
                      <Grid item lg={6}>
                        <Label variant="labelDark" bold>
                          {lastBillingHistory
                            ? convertDate(lastBillingHistory.repaymentPeriodEnd)
                            : "--"}
                        </Label>
                        <Label variant="grey" regular>
                          Payment Due Date
                        </Label>
                      </Grid>
                    </Grid>
                  </Box>
                </StyledCard>
              </Grid>
              {/* /Billing */}

              {/* Period Management */}
              <Grid item lg={4}>
                <StyledCard>
                  <Grid container className="cardHeader">
                    <Grid item flexGrow="1">
                      <Header
                        className="bottom-light-border"
                        level={2}
                        bold
                        value={intl.formatMessage(
                          defineMessage({
                            id: "product.repayment.header",
                            description: "Header for Fee section",
                            defaultMessage: "Period Management",
                          })
                        )}
                      />
                    </Grid>
                    <Grid item></Grid>
                  </Grid>

                  <Box className="cardBody">
                    <Grid container spacing={3}>
                      <Grid item lg={6}>
                        <Label variant="labelDark" bold>
                          {convertDate(product.currentRepaymentEndDate)}
                        </Label>
                        <Label variant="grey" regular>
                          Next Repayment End Date
                        </Label>
                      </Grid>
                      <Grid item lg={6} className="align-items-center">
                        <Label variant="labelDark" bold>
                          {values.creditCardConfig.repaymentPeriodLength
                            ? values.creditCardConfig.repaymentPeriodLength
                            : ""}{" "}
                          Days
                        </Label>
                        <Label variant="grey" regular>
                          Repayment Period Length
                        </Label>
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item lg={6} className="align-items-center">
                        <Label variant="labelDark" bold>
                          {convertDate(product.currentBillingEndDate)}
                        </Label>
                        <Label variant="grey" regular>
                          Next Billing Period End Date
                        </Label>
                      </Grid>
                      <Grid item lg={6} className="align-items-center">
                        <Label variant="labelDark" bold>
                          30 Days
                        </Label>
                        <Label variant="grey" regular>
                          Billing Period Length
                        </Label>
                      </Grid>
                    </Grid>
                  </Box>
                </StyledCard>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item lg={4}>
                <StyledCard>
                  <Grid container className="cardHeader">
                    <Grid item flexGrow="1">
                      <Header
                        value={intl.formatMessage(
                          defineMessage({
                            id: "product.section.header.summary",
                            description: "Summary section header",
                            defaultMessage: "Interest Accrual",
                          })
                        )}
                        level={2}
                        bold
                      />
                    </Grid>
                    <Grid item className="iconButtons">
                      {editModeInterestAccrual ? (
                        <Grid container flexDirection="row-reverse">
                          <QDButton
                            className="iconButton"
                            onClick={() => {
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              api.ProductAPI.updateOfferingCustomer(
                                customerNumber,
                                values
                              )
                                .then((product: OfferingCustomerSummary) => {
                                  setEditModeInterestAccrual(false);
                                  setCustomerProduct(product);
                                  setSuccessMsg({
                                    responseCode: "200000",
                                    message: `Customer has been Updated Successfully`,
                                  });
                                })
                                .catch((error: any) => setErrorMsg(error));
                            }}
                            size="small"
                            id="producteditsave.button"
                            color="primary"
                            variant="icon"
                            label=""
                          >
                            <img
                              src={Icon.checkmarkIcon}
                              alt="save icon"
                              height={11}
                              width={11}
                            />
                          </QDButton>
                          <QDButton
                            className="iconButton"
                            label=""
                            type="button"
                            onClick={() => {
                              setEditModeInterestAccrual(false);
                              resetForm();
                            }}
                            id="drawer-close-btn"
                            variant="icon"
                          >
                            <img
                              src={Icon.closeIconWhite}
                              alt="close icon"
                              height={11}
                              width={11}
                            />
                          </QDButton>
                        </Grid>
                      ) : !readOnly ? (
                        <EllipseMenu
                          anchorOriginVertical="top"
                          anchorOriginHorizontal="left"
                          transformOriginVertical={10}
                          transformOriginHorizontal={260}
                          icon="faEllipsisV"
                        >
                          <QDButton
                            onClick={() => {
                              setEditModeInterestAccrual(true);
                              handleCloseInterestAccrualMenu();
                            }}
                            size="small"
                            id="productedit.interest.accrual.button"
                            color="primary"
                            variant="text"
                            label={intl.formatMessage(
                              defineMessage({
                                id: "productedit.interest.accrual.button",
                                defaultMessage: "Edit",
                                description: "Input Label",
                              })
                            )}
                          />
                        </EllipseMenu>
                      ) : null}
                    </Grid>
                  </Grid>
                  <Box className="cardBody">
                    <Grid container spacing={3}>
                      <Grid item lg={6}>
                        {editModeInterestAccrual ? (
                          <Field name="interestConfigMode">
                            {({ field, form, meta }: FieldProps) => {
                              return (
                                <FormikSelect
                                  field={field}
                                  form={form}
                                  meta={meta}
                                  label="Rate Method"
                                  options={interestConfigModes}
                                />
                              );
                            }}
                          </Field>
                        ) : (
                          <>
                            <Label variant="labelDark" bold>
                              {values.interestConfigMode || "--"}
                            </Label>
                            <Label variant="grey" regular>
                              Rate Method
                            </Label>
                          </>
                        )}
                      </Grid>
                      <Grid item lg={6}>
                        {values.interestConfigMode === "TIER" ? (
                          editModeInterestAccrual &&
                          programConfig?.interestTiers &&
                          Object.keys(programConfig?.interestTiers).length !==
                            0 ? (
                            <>
                              <Field name="interestTierName">
                                {({ field, form, meta }: FieldProps) => {
                                  return (
                                    <FormikSelect
                                      field={field}
                                      form={form}
                                      meta={meta}
                                      label="Tier"
                                      options={interestTierNames}
                                    />
                                  );
                                }}
                              </Field>
                            </>
                          ) : (
                            <>
                              <Label variant="labelDark" bold>
                                {values.interestTierName || ("--" as any)}
                              </Label>
                              <Label variant="grey" regular>
                                Interest Rate Tier
                              </Label>
                            </>
                          )
                        ) : (
                          ""
                        )}
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item lg={6}>
                        {programConfig?.interestConfig.PURCHASE ? (
                          // programConfig?.interestConfig['PURCHASE']
                          editModeInterestAccrual &&
                          values.interestConfigMode === "DIRECT" ? (
                            <FormikInputField
                              name="annualInterestRate.PURCHASE"
                              placeholder="Purchase"
                            />
                          ) : (
                            <>
                              <Label variant="labelDark" bold>
                                {values.interestConfigMode === "TIER" &&
                                programConfig
                                  ? values.interestTierName
                                    ? programConfig.interestTiers![
                                        values.interestTierName
                                      ].PURCHASE
                                    : "--"
                                  : values.annualInterestRate &&
                                    values.annualInterestRate.PURCHASE}
                                %
                              </Label>
                              <Label variant="grey" regular>
                                Purchase rate
                              </Label>
                            </>
                          )
                        ) : null}
                      </Grid>
                      <Grid item lg={6}>
                        {programConfig?.interestConfig.CASH_ADVANCE ? (
                          editModeInterestAccrual &&
                          values.interestConfigMode === "DIRECT" &&
                          programConfig?.interestConfig.CASH_ADVANCE ? (
                            <FormikInputField
                              name="annualInterestRate.CASH_ADVANCE"
                              placeholder="Cash"
                            />
                          ) : (
                            <>
                              <Label variant="labelDark" bold>
                                {values.interestConfigMode === "TIER" &&
                                programConfig
                                  ? values.interestTierName
                                    ? programConfig.interestTiers![
                                        values.interestTierName
                                      ].CASH_ADVANCE
                                    : "--"
                                  : values.annualInterestRate &&
                                    values.annualInterestRate.CASH_ADVANCE}
                                %
                              </Label>
                              <Label variant="grey" regular>
                                Cash rate
                              </Label>
                            </>
                          )
                        ) : null}
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      {programConfig?.interestConfig.FEE ? (
                        <Grid item lg={6}>
                          {editModeInterestAccrual &&
                          values.interestConfigMode === "DIRECT" &&
                          programConfig?.interestConfig.FEE ? (
                            <FormikInputField
                              name="annualInterestRate.FEE"
                              placeholder="Fee"
                            />
                          ) : (
                            <>
                              <Label variant="labelDark" bold>
                                {values.interestConfigMode === "TIER" &&
                                programConfig
                                  ? values.interestTierName
                                    ? programConfig.interestTiers![
                                        values.interestTierName
                                      ].FEE
                                    : "--"
                                  : values.annualInterestRate &&
                                    values.annualInterestRate.FEE}
                                %
                              </Label>
                              <Label variant="grey" regular>
                                Fee rate
                              </Label>
                            </>
                          )}{" "}
                        </Grid>
                      ) : null}

                      <Grid item lg={6}>
                        <FormGroup>
                          <Field
                            name="interestForgivenessEligible"
                            as={QDCheckbox}
                            value={values.interestForgivenessEligible}
                            data={{
                              label: "Interest Forgiveness",
                              key: "interest-forgiveness-checkbox",
                              id: "interest-forgiveness-checkbox",
                              className: "interest-forgiveness",
                              checkbox: {
                                color: "primary",
                                size: "small",
                                checked: values.interestForgivenessEligible,
                              },
                            }}
                            onChange={() => {
                              values.interestForgivenessEligible =
                                !values.interestForgivenessEligible;
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              api.ProductAPI.updateOfferingCustomer(
                                customerNumber,
                                values
                              )
                                .then((product: OfferingCustomerSummary) => {
                                  setEditModeInterestAccrual(false);
                                  setCustomerProduct(product);
                                  setSuccessMsg({
                                    responseCode: `200${
                                      values.interestForgivenessEligible
                                        ? "001"
                                        : "002"
                                    }`,
                                    message: `This change will start affecting the account at the next billing period close.`,
                                  });
                                })
                                .catch((error: any) => setErrorMsg(error));
                            }}
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                  </Box>
                </StyledCard>
              </Grid>

              <Grid item lg={4}>
                <StyledCard>
                  <Grid container className="cardHeader">
                    <Grid item flexGrow="1">
                      <Header
                        className="bottom-light-border"
                        value={intl.formatMessage(
                          defineMessage({
                            id: "product.section.header.credit",
                            description: "Credit section header",
                            defaultMessage: "Credit",
                          })
                        )}
                        level={2}
                        bold
                      />
                    </Grid>
                    <Grid item className="iconButtons">
                      {editModeCredit ? (
                        <Grid container flexDirection="row-reverse">
                          <QDButton
                            className="iconButton"
                            onClick={() => {
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore
                              api.ProductAPI.updateOfferingCustomer(
                                customerNumber,
                                values
                              )
                                .then((product: OfferingCustomerSummary) => {
                                  setEditModeCredit(false);
                                  setCustomerProduct(product);
                                  setSuccessMsg({
                                    responseCode: "200000",
                                    message: `Customer has been Updated Successfully`,
                                  });
                                })
                                .catch((error: any) => setErrorMsg(error));
                            }}
                            size="small"
                            id="producteditsave.button"
                            color="primary"
                            variant="icon"
                            label=""
                          >
                            <img
                              src={Icon.checkmarkIcon}
                              alt="save icon"
                              height={11}
                              width={11}
                            />
                          </QDButton>
                          <QDButton
                            className="iconButton"
                            label=""
                            type="button"
                            onClick={() => {
                              setEditModeCredit(false);
                              resetForm();
                            }}
                            id="drawer-close-btn"
                            variant="icon"
                          >
                            <img
                              src={Icon.closeIconWhite}
                              alt="close icon"
                              height={11}
                              width={11}
                            />
                          </QDButton>
                        </Grid>
                      ) : !readOnly ? (
                        <EllipseMenu
                          anchorOriginVertical="top"
                          anchorOriginHorizontal="left"
                          transformOriginVertical={10}
                          transformOriginHorizontal={260}
                          icon="faEllipsisV"
                        >
                          <QDButton
                            id="productedit.credit.button"
                            className="mt-0 pl-0 pt-0 body-interactive"
                            onClick={() => {
                              setEditModeCredit(true);
                              handleCloseCreditMenu();
                            }}
                            label={intl.formatMessage(
                              defineMessage({
                                id: "productedit.credit.button",
                                defaultMessage: "Edit",
                                description: "Input Label",
                              })
                            )}
                            size="small"
                            variant="text"
                          />
                          <DrawerComp
                            id="pending-minimum-payments-link"
                            label={intl.formatMessage({
                              id: "product.button.pendingPayments",
                              description: "View pending minimum payments",
                              defaultMessage:
                                "View previous min payment history",
                            })}
                            asLink
                            truncateAt={50}
                          >
                            <PendingMinimumPayments
                              repaymentPeriods={product.repaymentPeriods}
                              currency={homeCurrency}
                            />
                          </DrawerComp>
                        </EllipseMenu>
                      ) : null}
                    </Grid>
                  </Grid>
                  <Box className="cardBody">
                    <Grid container spacing={3}>
                      <Grid item lg={6}>
                        <QDFormattedCurrency
                          className="label-dark-bold"
                          currency={homeCurrency}
                          amount={
                            product && product.availableCredit
                              ? product.availableCredit
                              : 0
                          }
                          bold
                        />
                        <Label variant="grey" regular>
                          Available Credit
                        </Label>
                      </Grid>
                      <Grid item lg={6}>
                        {editModeCredit ? (
                          <FormikInputField
                            name="overallCreditLimit"
                            placeholder="Credit limit"
                          />
                        ) : (
                          <>
                            <QDFormattedCurrency
                              className="label-dark-bold"
                              currency={homeCurrency}
                              amount={
                                product && product.overallCreditLimit
                                  ? product.overallCreditLimit
                                  : 0
                              }
                              bold
                            />
                            <Label variant="grey" regular>
                              Credit Limit
                            </Label>
                          </>
                        )}
                      </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item lg={6}>
                        <Label variant="labelDark" bold>
                          {product?.unpaidMinimums}
                        </Label>
                        <Label variant="grey" regular>
                          Unpaid Minimums
                        </Label>
                      </Grid>
                      <Grid item lg={6}></Grid>
                    </Grid>
                  </Box>
                </StyledCard>
              </Grid>

              {/* Automatic Load */}
              <Grid item lg={4}>
                <StyledCard>
                  <Grid container className="cardHeader">
                    <Grid item flexGrow="1">
                      <Header
                        className="bottom-light-border"
                        level={2}
                        bold
                        value={intl.formatMessage(
                          defineMessage({
                            id: "product.billing-period.header",
                            description: "Header for billing period section",
                            defaultMessage: "Automatic Load",
                          })
                        )}
                      />
                    </Grid>
                    <Grid item>
                      {!readOnly ? (
                        <EllipseMenu
                          anchorOriginVertical="top"
                          anchorOriginHorizontal="left"
                          transformOriginVertical={10}
                          transformOriginHorizontal={260}
                          icon="faEllipsisV"
                        >
                          <DrawerComp
                            id="balance-adjusment-link"
                            label={
                              hasAutoLoadRule
                                ? intl.formatMessage({
                                    id: "viewRule",
                                    defaultMessage: "View Rule ",
                                  })
                                : intl.formatMessage({
                                    id: "addRule",
                                    defaultMessage: "Add Rule ",
                                  })
                            }
                            asLink
                            truncateAt={50}
                          >
                            <DrawerAutoload
                              product={product}
                              customerNumber={customerNumber}
                              homeCurrency={homeCurrency}
                              toggleDrawer={() => setAnchorAutoloadMenu(null)}
                              view={hasAutoLoadRule}
                              autoLoadRule={autoLoadRule}
                            />
                          </DrawerComp>
                        </EllipseMenu>
                      ) : null}
                    </Grid>
                  </Grid>
                  <Box className="cardBody">
                    <Grid container spacing={3}>
                      <Grid item lg={12}>
                        {" "}
                        <Label variant="labelDark" bold>
                          {product?.autoLoadEndDate
                            ? convertDate(product.autoLoadEndDate)
                            : "N/A"}
                        </Label>
                        <Label variant="grey" regular>
                          Next Payment Date
                        </Label>
                      </Grid>

                      <Grid item lg={6}>
                        <Label variant="labelDark" bold>
                          {autoLoadRule
                            ? toTitleCase(autoLoadRule.config.frequency)
                            : "N/A"}
                        </Label>
                        <Label variant="grey" regular>
                          Frequency
                        </Label>
                      </Grid>
                      <Grid item lg={6}>
                        {" "}
                        <Label variant="labelDark" bold>
                          {autoLoadRule ? autoLoadRule.config.dayOffset : "N/A"}
                        </Label>
                        <Label variant="grey" regular>
                          {product?.autoLoadRuleDTO?.frequency === "WEEKLY"
                            ? "Day of Week"
                            : "Billing Day of Month"}
                        </Label>
                      </Grid>

                      <Grid item container spacing={3}>
                        <Grid item lg={6}>
                          <Label variant="labelDark" bold>
                            {autoLoadRule
                              ? toTitleCase(
                                  autoLoadRule.config.autoLoadStrategy.replace(
                                    "_",
                                    " "
                                  )
                                )
                              : "N/A"}
                          </Label>
                          <Label variant="grey" regular>
                            Amount Preference
                          </Label>
                        </Grid>
                        {autoLoadRule ? (
                          <Grid item lg={6}>
                            <QDFormattedCurrency
                              className="label-dark-bold"
                              currency={homeCurrency}
                              amount={autoLoadRule.config.fixedAmount}
                            />
                            <Label variant="grey" regular>
                              Custom Amount
                            </Label>
                          </Grid>
                        ) : null}
                      </Grid>

                      <Grid item lg={6}>
                        <Label variant="labelDark" bold>
                          {product && autoLoadRule
                            ? externalRefList.find(
                                (ref) =>
                                  ref.id === autoLoadRule.externalReferenceId
                              )!.partnerName
                            : "N/A"}
                        </Label>
                        <Label variant="grey" regular>
                          Partner
                        </Label>
                      </Grid>

                      <Grid item lg={6}>
                        <Label variant="labelDark" bold>
                          {autoLoadRule
                            ? externalRefList.find(
                                (ref) =>
                                  ref.id === autoLoadRule.externalReferenceId
                              )!.referenceNumber
                            : "N/A"}
                        </Label>
                        <Label variant="grey" regular>
                          External Reference
                        </Label>
                      </Grid>
                    </Grid>
                  </Box>
                </StyledCard>
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              {product && product.drawBalances.PURCHASE ? (
                <Grid item lg={4}>
                  <StyledCard>
                    <Grid container className="cardHeader">
                      <Grid item flexGrow="1">
                        <Header
                          className="bottom-light-border"
                          level={2}
                          bold
                          value={intl.formatMessage(
                            defineMessage({
                              id: "product.billing-period.header",
                              description: "Header for billing period section",
                              defaultMessage: "Purchase balances",
                            })
                          )}
                        />
                      </Grid>
                      <Grid item>
                        {anchorPurchaseBalancesMenu ? (
                          <div className="icon-btn">
                            <QDButton
                              className="float-right "
                              label=""
                              type="button"
                              onClick={handleClosePurchaseBalancesMenu}
                              id="drawer-close-btn"
                              variant="icon"
                            >
                              <img
                                src={Icon.closeIcon}
                                alt="close icon"
                                height={11}
                                width={11}
                              />
                            </QDButton>
                          </div>
                        ) : null}
                        {!readOnly ? (
                          <EllipseMenu
                            anchorOriginVertical="top"
                            anchorOriginHorizontal="left"
                            transformOriginVertical={10}
                            transformOriginHorizontal={260}
                            icon="faEllipsisV"
                          >
                            <DrawerComp
                              id="balance-adjusment-link"
                              label={intl.formatMessage({
                                id: "product.button.balanceAdjustment",
                                description: "Make an Adjustment",
                                defaultMessage: "Make an Adjustment",
                              })}
                              asLink
                              truncateAt={50}
                            >
                              <BalanceAdjustment
                                drawBalances={product.drawBalances}
                                currency={homeCurrency}
                                customerNumber={customerNumber}
                              />
                            </DrawerComp>
                          </EllipseMenu>
                        ) : null}
                      </Grid>
                    </Grid>
                    <Box className="cardBody">
                      <Grid container spacing={3}>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.PURCHASE.CURRENT!
                                    .principalBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Current Principal
                          </Label>
                        </Grid>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.PURCHASE.CURRENT!
                                    .interestBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Current Interest
                          </Label>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.PURCHASE.PREVIOUS!
                                    .principalBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Previous Principal
                          </Label>
                        </Grid>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.PURCHASE.PREVIOUS!
                                    .interestBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Previous Interest
                          </Label>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.PURCHASE.OWED!
                                    .principalBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Owed Principal
                          </Label>
                        </Grid>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.PURCHASE.OWED!
                                    .interestBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Owed Interest
                          </Label>
                        </Grid>
                      </Grid>
                    </Box>
                  </StyledCard>
                </Grid>
              ) : null}
              {product && product.drawBalances.CASH_ADVANCE ? (
                <Grid item lg={4}>
                  <StyledCard>
                    <Grid container className="cardHeader">
                      <Grid item flexGrow="1">
                        <Header
                          className="bottom-light-border"
                          level={2}
                          bold
                          value={intl.formatMessage(
                            defineMessage({
                              id: "product.billing-period.header",
                              description: "Header for billing period section",
                              defaultMessage: "Cash Advance balances",
                            })
                          )}
                        />
                      </Grid>
                      <Grid item>
                        {anchorCashAdvanceBalancesMenu ? (
                          <div className="icon-btn">
                            <QDButton
                              className="float-right "
                              label=""
                              type="button"
                              onClick={handleCloseCashAdvanceBalancesMenu}
                              id="drawer-close-btn"
                              variant="icon"
                            >
                              <img
                                src={Icon.closeIcon}
                                alt="close icon"
                                height={11}
                                width={11}
                              />
                            </QDButton>
                          </div>
                        ) : null}
                        {!readOnly ? (
                          <EllipseMenu
                            anchorOriginVertical="top"
                            anchorOriginHorizontal="left"
                            transformOriginVertical={10}
                            transformOriginHorizontal={260}
                            icon="faEllipsisV"
                          >
                            <DrawerComp
                              id="balance-adjusment-link"
                              label={intl.formatMessage({
                                id: "product.button.balanceAdjustment",
                                description: "Make an Adjustment",
                                defaultMessage: "Make an Adjustment",
                              })}
                              asLink
                              truncateAt={50}
                            >
                              <BalanceAdjustment
                                drawBalances={product.drawBalances}
                                currency={homeCurrency}
                                customerNumber={customerNumber}
                              />
                            </DrawerComp>
                          </EllipseMenu>
                        ) : null}
                      </Grid>
                    </Grid>
                    <Box className="cardBody">
                      <Grid container spacing={3}>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.CASH_ADVANCE.CURRENT!
                                    .principalBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Current Principal
                          </Label>
                        </Grid>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.CASH_ADVANCE.CURRENT!
                                    .interestBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Current Interest
                          </Label>
                        </Grid>
                      </Grid>

                      <Grid container spacing={3}>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.CASH_ADVANCE.OWED!
                                    .principalBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Owed Principal
                          </Label>
                        </Grid>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.CASH_ADVANCE.OWED!
                                    .interestBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Owed Interest
                          </Label>
                        </Grid>
                      </Grid>
                    </Box>
                  </StyledCard>
                </Grid>
              ) : null}

              {product && product.drawBalances.FEE ? (
                <Grid item lg={4}>
                  <StyledCard>
                    <Grid container className="cardHeader">
                      <Grid item flexGrow="1">
                        <Header
                          className="bottom-light-border"
                          level={2}
                          bold
                          value={intl.formatMessage(
                            defineMessage({
                              id: "product.billing-period.header",
                              description: "Header for billing period section",
                              defaultMessage: "Fee balances",
                            })
                          )}
                        />
                      </Grid>
                      <Grid item>
                        {anchorFeeBalancesMenu ? (
                          <div className="icon-btn">
                            <QDButton
                              className="float-right "
                              label=""
                              type="button"
                              onClick={handleCloseFeeBalancesMenu}
                              id="drawer-close-btn"
                              variant="icon"
                            >
                              <img
                                src={Icon.closeIcon}
                                alt="close icon"
                                height={11}
                                width={11}
                              />
                            </QDButton>
                          </div>
                        ) : null}
                        {!readOnly ? (
                          <EllipseMenu
                            anchorOriginVertical="top"
                            anchorOriginHorizontal="left"
                            transformOriginVertical={10}
                            transformOriginHorizontal={260}
                            icon="faEllipsisV"
                          >
                            <DrawerComp
                              id="balance-adjusment-link"
                              label={intl.formatMessage({
                                id: "product.button.balanceAdjustment",
                                description: "Make an Adjustment",
                                defaultMessage: "Make an Adjustment",
                              })}
                              asLink
                              truncateAt={50}
                            >
                              <BalanceAdjustment
                                drawBalances={product.drawBalances}
                                currency={homeCurrency}
                                customerNumber={customerNumber}
                              />
                            </DrawerComp>
                          </EllipseMenu>
                        ) : null}
                      </Grid>
                    </Grid>
                    <Box className="cardBody">
                      <Grid container spacing={3}>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.FEE.CURRENT!
                                    .principalBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Current Principal
                          </Label>
                        </Grid>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.FEE.CURRENT!
                                    .interestBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Current Interest
                          </Label>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.FEE.PREVIOUS!
                                    .principalBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Previous Principal
                          </Label>
                        </Grid>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.FEE.PREVIOUS!
                                    .interestBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Previous Interest
                          </Label>
                        </Grid>
                      </Grid>
                      <Grid container spacing={3}>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.FEE.OWED!
                                    .principalBalance
                                : 0
                            }
                          />
                          <Label variant="grey" regular>
                            Owed Principal
                          </Label>
                        </Grid>
                        <Grid item lg={6}>
                          <QDFormattedCurrency
                            className="label-dark-bold"
                            currency={homeCurrency}
                            amount={
                              product && product.drawBalances
                                ? product.drawBalances.FEE.OWED!.interestBalance
                                : 0
                            }
                            bold
                          />
                          <Label variant="grey" regular>
                            Owed Interest
                          </Label>
                        </Grid>
                      </Grid>
                    </Box>
                  </StyledCard>
                </Grid>
              ) : null}
            </Grid>
          </Box>
          {/* <pre>{JSON.stringify({values},null,2)}</pre> */}
          {/* <pre>{JSON.stringify({errors},null,2)}</pre> */}
        </Form>
      )}
    </Formik>
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

export default ProductCreditCard;
