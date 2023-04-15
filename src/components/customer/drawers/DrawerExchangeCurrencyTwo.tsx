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

import React, { useContext, useEffect, useState, lazy, FC } from "react";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { Field, Formik } from "formik";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import api from "../../../api/api";
import Icon from "../../common/Icon";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import CurrencyCodeToFlag from "../../common/converters/CurrencyCodeToFlag";
import Symbols from "../../common/converters/CurrencySymbols";
import { MessageContext } from "../../../contexts/MessageContext";
import emitter from "../../../emitter";
import CustomerWalletsEvents from "../pagenavs/CustomerWalletEvents";
import Header from "../../common/elements/Header";
import RadioButton from "../../common/forms/buttons/RadioButton";
import CancelButton from "../../common/elements/CancelButton";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

/**
 * This is only here to make this page work for now, please remove
 * @deprecated
 */

const NoQuoteDisplay = () => (
  <Box style={{ opacity: 0.4, marginBottom: "20px" }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: "10px",
      }}
    >
      <Typography
        sx={{
          color: "#23C38E",
          fontSize: "18px",
          fontWeight: "600",
          lineHeight: "22px",
          marginBottom: "0px !important",
        }}
      >
        0.00
      </Typography>
      <img width="12px" height="12px" src={Icon.caretRightWhite} alt="icon" />
      <Typography
        sx={{
          color: "#23C38E",
          fontSize: "18px",
          fontWeight: "600",
          lineHeight: "22px",
          marginBottom: "0px !important",
        }}
      >
        0.00
      </Typography>
    </Box>
    <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
      <Box sx={{ display: "flex", alignItems: "center", marginRight: "60px" }}>
        <img
          width={45}
          height={45}
          src={Icon.mutedFlagIcon}
          alt="No Flag Specified"
        />
        <Typography
          sx={{
            color: "#23C38E",
            fontSize: "12px",
            lineHeight: "15px",
            marginBottom: "18px !important",
          }}
        >
          --- ( - )
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <img
          width={45}
          height={45}
          src={Icon.mutedFlagIcon}
          alt="No Flag Specified"
        />
        <Typography
          sx={{
            color: "#23C38E",
            fontSize: "12px",
            lineHeight: "15px",
            marginBottom: "18px !important",
          }}
        >
          --- ( - )
        </Typography>
      </Box>
    </Box>
  </Box>
);

interface IQuoteDisplay {
  fxQuote: any;
  timer: any;
}

const QuoteDisplay: FC<IQuoteDisplay> = ({ fxQuote, timer }) => {
  const intl = useIntl();
  return (
    <Box style={{ opacity: 0.4, marginBottom: "40px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Typography
          sx={{
            color: "#23C38E",
            fontSize: "18px",
            fontWeight: "600",
            lineHeight: "22px",
            marginBottom: "0px !important",
          }}
        >
          {Symbols[fxQuote.sellAmount.currencyCode as keyof typeof Symbols]}
          {fxQuote.sellAmount.amount}
        </Typography>
        <img
          width="12px"
          height="12px"
          src={Icon.caretRightWhite}
          alt="icon"
        />
        <Typography
          sx={{
            color: "#23C38E",
            fontSize: "18px",
            fontWeight: "600",
            lineHeight: "22px",
            marginBottom: "0px !important",
          }}
        >
          {Symbols[fxQuote.buyAmount.currencyCode as keyof typeof Symbols]}
          {fxQuote.buyAmount.amount}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          marginBottom: "20px",
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", marginRight: "60px" }}
        >
          <CurrencyCodeToFlag
            width="30px"
            height="30px"
            currencyCode={fxQuote.sellAmount.currencyCode}
          />
          <Typography
            sx={{
              color: "#23C38E",
              fontSize: "12px",
              lineHeight: "15px",
              marginLeft: "8px",
              marginBottom: "6px !important",
            }}
          >
            {Symbols[fxQuote.sellAmount.currencyCode as keyof typeof Symbols]} (
            {fxQuote.sellAmount.currencyCode})
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <CurrencyCodeToFlag
            width="30px"
            height="30px"
            currencyCode={fxQuote.buyAmount.currencyCode}
          />
          <Typography
            sx={{
              color: "#23C38E",
              fontSize: "12px",
              lineHeight: "15px",
              marginLeft: "8px",
              marginBottom: "6px !important",
            }}
          >
            {Symbols[fxQuote.buyAmount.currencyCode as keyof typeof Symbols]} (
            {fxQuote.buyAmount.currencyCode} )
          </Typography>
        </Box>
      </Box>
      {fxQuote && (
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              color: "#23C38E",
              fontSize: "12px",
              lineHeight: "15px",
            }}
          >
            {intl.formatMessage({
              id: "exchangeQuoteExpiresIn",
              defaultMessage: "Exchange quote expires in",
            })}{" "}
            <b>00:{timer}</b>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

interface IExchangeCurrencyTwo {
  currency?: string;
  toggleDrawer?: () => void;
}

const ExchangeCurrencyTwo: FC<IExchangeCurrencyTwo> = (props) => {
  const intl = useIntl();
  const { currency, toggleDrawer } = props;
  const [canConfirm, setCanConfirm] = useState(false);
  // @ts-ignore
  const customerNumber = useParams().id;
  const [initialValues] = useState({
    chooseAmount: "",
    sellCurrency: currency,
    buyCurrency: currency,
    type: "sellSide",
  });
  const { setErrorMsg } = useContext(MessageContext);
  const [fxQuote, setFxQuote] = useState(null);
  const [countdownTimer, setCountdownTimer] = useState<any>("15");
  const [exchangeCurrencies, setExchangeCurrencies] = useState([]);
  const [currencyInputBoxText, setCurrencyInputBoxText] = useState(
    intl.formatMessage({
      id: "sellCurrencyAmount",
      defaultMessage: "Sell Currency Amount",
    })
  );
  const [timerValue, setTimerValue] = useState<any>();
  const [upDatedFormValues, setUpDatedFormValues] = useState({
    chooseAmount: "",
    sellCurrency: currency,
    buyCurrency: currency,
    type: "sellSide",
  });

  const [stopTimer, setStopTimer] = useState(false);

  const refreshQuote = (values: any) => {
    if (!values.chooseAmount.length) {
      setFxQuote(null);
    } else {
      const quoteDTO = {
        type: values.type,
        amount: {
          amount: values.chooseAmount,
          currencyCode:
            values.type === "buySide"
              ? values.buyCurrency
              : values.sellCurrency,
        },
        counterCurrency:
          values.type === "buySide" ? values.sellCurrency : values.buyCurrency,
      };

      clearInterval(timerValue);

      // @ts-ignore
      api.CustomerAPI.getExchangeQuote(customerNumber, quoteDTO)
        .then((quote: any) => {
          setCanConfirm(false);
          const timer = stopTimer
            ? 0
            : quote.expirationTime - quote.creationTime;
          setFxQuote(quote);
          let tempTime = timer / 1000;

          const interval = stopTimer
            ? 0
            : setInterval(() => {
                tempTime -= 1;
                if (tempTime <= 0) {
                  // @ts-ignore
                  clearInterval(interval);
                }
                if (tempTime < 10) {
                  tempTime = Number(`0${tempTime}`);
                }
                setCountdownTimer(tempTime);
              }, 1000);
          setTimerValue(interval);
          setTimeout(() => {
            clearInterval(Number(interval));
            setCanConfirm(false);
          }, timer);
        })
        .catch((error: any) =>
          console.log("inputError on drawer.exchangeCurrencyTwo", error)
        );
    }
  };

  const getWallets = () =>
    // @ts-ignore
    api.CustomerAPI.getWallets(customerNumber)
      .then((walletList: any) => {
        const currencies = walletList.map((item: any) => item.currency);
        setExchangeCurrencies(currencies);
      })
      .catch((error: any) => setErrorMsg(error));

  // eslint-disable-next-line max-len
  const confirmExchange = (values: any, actions: any) => {
    // @ts-ignore
    api.CustomerAPI.confirmWalletTransfer(customerNumber, fxQuote)
      .then(() => {
        emitter.emit(CustomerWalletsEvents.CustomerWalletsChanged, {});
        if (toggleDrawer) toggleDrawer();
      })
      .catch((error: any) => setErrorMsg(error));
  };

  const onValueChange = (e: any, updatedValues: any) => {
    const { name, value } = e.target;
    setUpDatedFormValues({
      ...upDatedFormValues,
      [name]: value,
      sellCurrency: updatedValues.values.sellCurrency,
      buyCurrency: updatedValues.values.buyCurrency,
    });
  };

  const currencyTexBoxUpdate = (value: any) => {
    if (value === "buySide") {
      return setCurrencyInputBoxText(
        intl.formatMessage({
          id: "buyCurrencyAmount",
          defaultMessage: "Buy Currency Amount",
        })
      );
    }
    return setCurrencyInputBoxText(
      intl.formatMessage({
        id: "sellCurrencyAmount",
        defaultMessage: "Sell Currency Amount",
      })
    );
  };

  const currencyLookUp = (name: any, value: any) => {
    setUpDatedFormValues(() => ({
      ...upDatedFormValues,
      chooseAmount: value.length === 0 ? "" : value.replace(/[^0-9.]/g, ""),
    }));
  };

  const dropDownFocusTimerStop = (e: any) => {
    if (
      e.includes("buy-currency-dropdown") ||
      e.includes("sell-currency-dropdown")
    ) {
      setStopTimer(true);
      refreshQuote({ chooseAmount: "none" });
      setFxQuote(null);
    }
    return setStopTimer(false);
  };

  const cancel = () => {
    if (toggleDrawer) toggleDrawer();
  };

  useEffect(() => {
    refreshQuote(upDatedFormValues);
  }, [upDatedFormValues.chooseAmount, upDatedFormValues.type]);

  useEffect(() => {
    getWallets();
  }, []);

  useEffect(() => {
    currencyLookUp("chooseAmount", upDatedFormValues.chooseAmount);
  }, [upDatedFormValues.chooseAmount]);

  const ExchangeSchema = Yup.object().shape({
    sellCurrency: Yup.string().required(
      intl.formatMessage({
        id: "error.sellCurrency.required",
        defaultMessage: "Sell currency is required field.",
      })
    ),
    chooseAmount: Yup.number()
      .typeError(
        intl.formatMessage({
          id: "error.amount.mustBeA.number",
          defaultMessage: "Amount must be a number",
        })
      )
      .positive(
        intl.formatMessage({
          id: "error.amount.mustBeA.positiveValue",
          defaultMessage: "Amount must be a positive value",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.amount.required",
          defaultMessage: "Amount is a required field.",
        })
      ),
    buyCurrency: Yup.string().required(
      intl.formatMessage({
        id: "error.buyCurrency.required",
        defaultMessage: "Buy currency is a required field.",
      })
    ),
  });

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          bold
          color="white"
          value={intl.formatMessage({
            id: "exchangeCurrency",
            description: "drawer header",
            defaultMessage: "Exchange Currency",
          })}
        />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={ExchangeSchema}
          onSubmit={(values, actions) => confirmExchange(values, actions)}
          enableReinitialize
        >
          {(props) => (
            <form
              onChange={(e) => onValueChange(e, props)}
              onSubmit={props.handleSubmit}
              onFocus={(e) => dropDownFocusTimerStop(e.target.id)}
            >
              <Box sx={{ marginBottom: "60px" }}>
                {fxQuote === null ? (
                  <NoQuoteDisplay />
                ) : (
                  <QuoteDisplay fxQuote={fxQuote} timer={countdownTimer} />
                )}
                <Box>
                  <InputWithPlaceholder
                    id="exchange-two-sell-amount-input-field"
                    name="chooseAmount"
                    autoComplete="off"
                    type="text"
                    placeholder={currencyInputBoxText}
                    //handleChange={props.handleChange}
                    {...props}
                  />
                  {exchangeCurrencies.length > 0 ? (
                    <Box sx={{ display: "flex" }}>
                      <Box sx={{ marginTop: "6px" }}>
                        <Field
                          name="type"
                          as={RadioButton}
                          label={
                            <FormattedMessage
                              id="exchange-two-sell-currency-radio-text"
                              description="Exchange Two radio placeholder text sell"
                              defaultMessage="  "
                            />
                          }
                          id="exchange-two-sell-currency-radio-button"
                          value="sellSide"
                          {...props}
                        />
                      </Box>
                      <DropdownFloating
                        id="exchange-two-sell-currency-dropdown"
                        initialval={initialValues.sellCurrency}
                        name="sellCurrency"
                        placeholder={`${intl.formatMessage({
                          id: "sellCurrency",
                          defaultMessage: "Sell Currency",
                        })}*`}
                        list={exchangeCurrencies}
                        value={props.values.sellCurrency}
                        {...props}
                      />
                    </Box>
                  ) : null}
                  {exchangeCurrencies.length > 0 ? (
                    <Box sx={{ display: "flex" }}>
                      <Box sx={{ marginTop: "6px" }}>
                        <Field
                          name="type"
                          as={RadioButton}
                          label={
                            <FormattedMessage
                              id="exchange-two-buy-currency-radio-text"
                              description="Exchange Two radio placeholder text buy"
                              defaultMessage="  "
                            />
                          }
                          id="exchange-two-buy-currency-radio-button"
                          value="buySide"
                          {...props}
                        />
                      </Box>
                      <DropdownFloating
                        id="exchange-two-buy-currency-dropdown"
                        initialval={initialValues.buyCurrency}
                        name="buyCurrency"
                        placeholder={`${intl.formatMessage({
                          id: "buyCurrency",
                          defaultMessage: "Buy Currency",
                        })}*`}
                        list={exchangeCurrencies}
                        value={props.values.buyCurrency}
                        {...props}
                      />
                    </Box>
                  ) : null}
                  <Box sx={{ textAlign: "right" }}>
                    <QDButton
                      id="exchange-two-refresh-get-quote-button"
                      disabled={upDatedFormValues.chooseAmount === ""}
                      onClick={() => refreshQuote(props.values)}
                      label={
                        fxQuote
                          ? intl.formatMessage({
                              id: "button.refreshQuote",
                              defaultMessage: "REFRESH QUOTE",
                            })
                          : intl.formatMessage({
                              id: "button.getQuote",
                              defaultMessage: "GET QUOTE",
                            })
                      }
                      color="primary"
                      variant="contained"
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="drawer-cancel-memo-button"
                  onClick={() => cancel()}
                  style={{ marginRight: "14px" }}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <QDButton
                  id="exchange-two-confirm-exchange-button"
                  disabled={
                    upDatedFormValues.chooseAmount === "" ||
                    countdownTimer === "00"
                  }
                  type="submit"
                  variant="contained"
                  size="large"
                  color="primary"
                  label={intl.formatMessage(
                    defineMessage({
                      id: "confirmExchange",
                      description: "Button to confirm exchange",
                      defaultMessage: "Confirm Exchange",
                    })
                  )}
                />
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ExchangeCurrencyTwo;
