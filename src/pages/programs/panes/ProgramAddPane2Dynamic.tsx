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
 */

import React, {
  useEffect,
  useState,
  useRef,
  MutableRefObject,
  useContext,
} from "react";
import Helmet from "react-helmet";
import { useHistory } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Header from "../../../components/common/elements/Header";
import BrandingWrapper from "../../../app/BrandingWrapper";
import api from "../../../api/api";
import ConfigureProductFormProgram from "../../../components/programs/configure-products/ConfigureProductFormProgram";
import ConfigureProductFormCredit from "../../../components/programs/configure-products/ConfigureProductFormCredit";
import ConfigureProductFormLoan from "../../../components/programs/configure-products/ConfigureProductFormLoan";
import ConfigureProductFormSavings from "../../../components/programs/configure-products/ConfigureProductFormSavings";
import ConfigureProductFormTermDeposit from "../../../components/programs/configure-products/ConfigureProductFormTermDeposit";
import ConfigureProductFormLineOfCredit from "../../../components/programs/configure-products/ConfigureProductFormLineOfCredit";
import ConfigureProductFormInstallments from "../../../components/programs/configure-products/ConfigureProductFormInstallments";

import SubmitButton from "../../../components/common/elements/SubmitButton";
import { MessageContext } from "../../../contexts/MessageContext";
import { ProgramConfig, ProgramCreditCardConfig, ProgramInstallmentsConfig } from "../../../types/program";

interface IProgramAddPane2 {
  setPlugins: any;
  product: any;
}

const defaultConfig: ProgramCreditCardConfig = {
  drawTypes: ["PURCHASE", "CASH_ADVANCE", "FEE"],
  interestConfig: {
    PURCHASE: {
      daysPerYear: null,
      minAnnualRate: null,
      maxAnnualRate: null,
      defaultAnnualRate: null,
      interestMode: "",
    },
    CASH_ADVANCE: {
      daysPerYear: null,
      minAnnualRate: null,
      maxAnnualRate: null,
      defaultAnnualRate: null,
      interestMode: "",
    },
    FEE: {
      daysPerYear: null,
      minAnnualRate: null,
      maxAnnualRate: null,
      defaultAnnualRate: null,
      interestMode: "",
    },
  },
  repaymentPeriodLength: null,
  repaymentHierarchy: [
    {
      drawType: "PURCHASE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "PRINCIPAL",
      name: "PURCHASE_OWED_PRINCIPAL",
    },
    {
      drawType: "PURCHASE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "INTEREST",
      name: "PURCHASE_OWED_INTEREST",
    },
    {
      drawType: "PURCHASE",
      drawBalanceType: "PREVIOUS",
      drawBalanceSubType: "PRINCIPAL",
      name: "PURCHASE_PREVIOUS_PRINCIPAL",
    },
    {
      drawType: "PURCHASE",
      drawBalanceType: "CURRENT",
      drawBalanceSubType: "PRINCIPAL",
      name: "PURCHASE_CURRENT_PRINCIPAL",
    },
    {
      drawType: "CASH_ADVANCE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "PRINCIPAL",
    },
    {
      drawType: "CASH_ADVANCE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "INTEREST",
    },
    {
      drawType: "CASH_ADVANCE",
      drawBalanceType: "CURRENT",
      drawBalanceSubType: "PRINCIPAL",
    },
    {
      drawType: "CASH_ADVANCE",
      drawBalanceType: "CURRENT",
      drawBalanceSubType: "INTEREST",
    },
    {
      drawType: "FEE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "PRINCIPAL",
      name: "FEE_OWED_PRINCIPAL",
    },
    {
      drawType: "FEE",
      drawBalanceType: "OWED",
      drawBalanceSubType: "INTEREST",
      name: "FEE_OWED_INTEREST",
    },
    {
      drawType: "FEE",
      drawBalanceType: "PREVIOUS",
      drawBalanceSubType: "PRINCIPAL",
      name: "FEE_PREVIOUS_PRINCIPAL",
    },
    {
      drawType: "FEE",
      drawBalanceType: "CURRENT",
      drawBalanceSubType: "PRINCIPAL",
      name: "FEE_CURRENT_PRINCIPAL",
    },
  ],
  minSpendLimit: null,
  maxSpendLimit: null,
  minimumPaymentStandardThreshold: null,
  minimumPaymentPercentages: {
    PURCHASE: {
      PREVIOUS: {
        INTEREST: null,
        PRINCIPAL: null,
      },
      CURRENT: {
        INTEREST: null,
        PRINCIPAL: null,
      },
      OWED: {
        INTEREST: null,
        PRINCIPAL: null,
      },
    },
    CASH_ADVANCE: {
      CURRENT: {
        INTEREST: null,
        PRINCIPAL: null,
      },
      OWED: {
        INTEREST: null,
        PRINCIPAL: null,
      },
    },
    FEE: {
      PREVIOUS: {
        INTEREST: null,
        PRINCIPAL: null,
      },
      CURRENT: {
        INTEREST: null,
        PRINCIPAL: null,
      },
      OWED: {
        INTEREST: null,
        PRINCIPAL: null,
      },
    },
  },
  minimumPaymentOverallBalancePercentage: null,
  minimumPaymentOwedPastDuePercentage: null,
  latePaymentFee: 0,
  repaymentDueShiftSetting: "NONE",
  automaticLoadShiftSetting: "NONE",
  currentPeriodGraceReturnBilling: "NONE",
  repaymentAssessmentRequirement: "MINIMUM_DUE",
};

const ProgramAddPane2: React.FC<IProgramAddPane2> = (props) => {
  const intl = useIntl();
  const history = useHistory();
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);

  const { product } = props;

  const [formData, setFormData] = useState({
    formA: { productNameInput: null, values: null, validated: false, homeCurrency: null },
    formB: { values: null, validated: false },
  });

  const formARef = useRef() as MutableRefObject<HTMLDivElement>;
  const formBRef = useRef() as MutableRefObject<HTMLDivElement>;
  const otherCategories = ["deposits", "multi-currency"];

  const createProgram = (dto: any) =>
    // @ts-ignore
    api.OperatingProgramSetupAPI.create(dto).catch((e: any) => setErrorMsg(e));

  const addProgram = async (values: any) => {
    return createProgram({
      partnerName: values.partner,
      createOperatingProgramDTO: {
        name: values.productNameInput,
        defaultHomeCurrency: values.homeCurrency,
        currencies:
          values.newCurrencies && values.newCurrencies.length > 1
            ? values.newCurrencies
            : null,
        language: values.language,
        country: values.location,
        timeZone: values.timeZone,
        tPlusDay: values.day,
        tPlusHour: values.hour,
        tPlusMinute: values.minute,
      },
      exchanges:
        values.exchange && values.exchange.length ? [values.exchange] : [],
    });
  };

  const handleChangeFormA = (data: any) => {
    setFormData({ ...formData, formA: data });
    if (
      product.category !== "Credit" &&
      (product.config === undefined || product.category === "deposits")
    )
      addProgram(data)
        .then(() => {
          history.push(`/programs/` + data.productNameInput);
        })
        .then(() =>
          setSuccessMsg({
            responseCode: "200000",
            message: intl.formatMessage({
              id: "program.success.created",
              defaultMessage: `Program has been Created Successfully`,
            }),
          })
        )
        .catch((error: any) => setErrorMsg(error));
  };
  const handleChangeFormB = (data: any, offeringClassName: string) => {
    if (data.category === "deposits" || formData.formA.validated == false)
      return;
    addProgram(formData.formA)
      .then(() => {
        if (!data.currency) {
          data.currency = formData.formA.homeCurrency;
        }
        const req = {
          programName: formData.formA.productNameInput,
          offeringClassName: offeringClassName,
          config: data,
        };
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        api.ProductAPI.createProgramProduct(req)
          .then(() => {
            history.push(`/programs/` + req.programName);
          })
          .then(() =>
            setSuccessMsg({
              responseCode: "200000",
              message: intl.formatMessage({
                id: "program.success.created",
                defaultMessage: `Program has been Created Successfully`,
              }),
            })
          )
          .catch((error: any) => setErrorMsg(error));
      })
      .catch((error: any) => setErrorMsg(error));
  };

  useEffect(() => {}, [product]); // this `product` key only fires when Pane1 button is clicked

  const handleSubmit = () => {
    formARef.current.click();
    if (formBRef.current) formBRef.current.click();
  };

  const createProductForm = (product: any, config: ProgramConfig | ProgramCreditCardConfig) => {
    if (product.offeringType.indexOf("CreditCard") != -1) {
      if (!config) {
        config = defaultConfig;
      }
      return (
        <ConfigureProductFormCredit
          refId={formBRef}
          submitForm={handleChangeFormB}
          initialValues={config as ProgramCreditCardConfig}
          edit={false}
        />
      );
    } else if (product.offeringType.indexOf("Loan") != -1) {
      return <ConfigureProductFormLoan initialValues={config} />;
    } else if (product.offeringType.indexOf("Savings") != -1) {
      return <ConfigureProductFormSavings initialValues={config} />;
    } else if (product.offeringType.indexOf("TermDeposit") != -1) {
      return <ConfigureProductFormTermDeposit initialValues={config} />;
    } else if (product.offeringType.indexOf("LineOfCredit") != -1) {
      return <ConfigureProductFormLineOfCredit initialValues={config} />;
    } else if (product.offeringType.indexOf("Installments") != -1) {
      if (!config) {
        const installmentsConfig: ProgramInstallmentsConfig = {
          minCreditLimit: null,
          maxCreditLimit: null,
          periodCount: null,
          periodLength: null,
          minimumPrincipal: null,
          firstPaymentDaysOffset: null,
          currency: null
        };
        config = installmentsConfig;
      }
      return (
        <ConfigureProductFormInstallments
          refId={formBRef}
          submitForm={handleChangeFormB}
          initialValues={config as ProgramInstallmentsConfig}
          edit={false}
        />
      );
    }
  };

  const isOtherProduct = () => {
    return otherCategories.includes(product.category);
  };

  const getTitle = () => {
    return product.title
      ? `Configure Your ${product.title}.`
      : isOtherProduct()
      ? `Configure your ${product.displayName} Product.`
      : product.displayName
      ? `Configure your ${product.displayName}.`
      : "Configure Your Product";
  };

  return (
    <Container disableGutters>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "page.title.configure.product",
            defaultMessage: "Configure Product",
          })}`}
        </title>
      </Helmet>
      <Grid container>
        <Grid item md={12} lg={12} sx={{ marginBottom: "10px" }}>
          <Header
            value={intl.formatMessage({
              id: "programs.header.configure.product",
              description: "Configure Programs header",
              defaultMessage: getTitle(),
            })}
            level={1}
            bold
          />
        </Grid>
      </Grid>
      <Grid container sx={{ marginBottom: "60px" }}>
        <Grid item md={12} lg={12}>
          <Typography
            sx={{
              color: "#152C5B",
              fontSize: "13px",
              lineHeight: "16px",
              fontWeight: "500",
            }}
          >
            {intl.formatMessage({
              id: "programs.section.configure.product",
              defaultMessage:
                "Setup your base program attributes and customize your product behavior.",
            })}
          </Typography>
        </Grid>
      </Grid>
      <Grid container>
        <Grid container direction="row">
          <Grid item lg={8}>
            {isOtherProduct() ? (
              <ConfigureProductFormProgram
                submitForm={handleChangeFormA}
                refId={formARef}
                program={product}
                isOtherProduct={isOtherProduct()}
              />
            ) : (
              <ConfigureProductFormProgram
                submitForm={handleChangeFormA}
                refId={formARef}
                program={product}
              />
            )}
          </Grid>
          <Grid textAlign="center" item lg={3}>
            <SubmitButton
              id="drawer-add-fee-button-save-changes"
              className="mt-1 mr-0"
              disabled={false}
              onClick={handleSubmit}
            >
              <FormattedMessage
                id="finish"
                description="Set Plugins Button"
                defaultMessage="Finish"
              />
            </SubmitButton>
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={12}>
          {createProductForm(product, product.config)}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProgramAddPane2;
