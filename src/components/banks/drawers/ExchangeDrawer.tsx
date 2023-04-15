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

import React, { useEffect, useState, lazy } from "react";
import * as Yup from "yup";
import { Box, Grid, Container, FormGroup } from "@mui/material";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import { FieldArray, Formik } from "formik";
import { useQueries } from "@tanstack/react-query";
import api from "../../../api/api";
import emitter from "../../../emitter";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import CurrencyRender from "../../common/converters/CurrencyRender";
import Icon from "../../common/Icon";
import getDecimalFractionalPercentage from "../../common/converters/DecimalFractionalPercentageConverter";
import newid from "../../util/NewId";
import Label from "../../common/elements/Label";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Header from "../../common/elements/Header";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

interface IExchangeDrawer {
  toggleDrawer?: any;
  exchange?: any;
  edit?: boolean;
}

const ExchangeDrawer: React.FC<IExchangeDrawer> = ({
  toggleDrawer = () => {
    /* function provided by drawercomp */
  },
  exchange = {},
  edit = false,
}) => {
  const intl = useIntl();

  const [initialValues, setInitialValues] = useState({
    providerName: "",
    crossTradeCurrency: "",
    intermediateCurrency: "",
    externalIdCode: "",
    name: "",
    country: "",
    newCurrencies: [],
    tPlusDay: "1",
    tPlusHour: "0",
    tPlusMinute: "0",
    bankName: "",
    margins: [],
    newMargins: [{}],
    pairs: [],
    newPairs: [],
  });

  const [countries, setCountries] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [exchangeProviders, setExchangeProviders] = useState([]);
  const [providerInfo, setProviderInfo] = useState({});
  const [providerMap, setProviderMap] = useState(new Map());

  const [getCountryListQuery, getTimeZoneListQuery] = useQueries({
    queries: [
      {
        queryKey: ["getCountryList"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getCountryList(null),
      },
      {
        queryKey: ["getTimeZoneList"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getTimeZoneList(),
      },
    ],
  });

  const getSupportedCurrencies = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.BankAPI.supportedCurrencyList().catch((error) => error);
  const getExchangeProviders = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.ExchangeProviderAPI.list().catch((error) => error);
  const [formattedCountries, setFormattedCountries] = useState([]);
  const updateExchangeMargin = (name: any, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.updateExchangeMargin(name, dto).catch((error) => error);
  const insertOrUpdateExchangeCurrencyPairRate = (name: any, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.insertOrUpdateExchangeCurrencyPairRate(name, dto).catch(
      (error: any) => error
    );

  const deleteExchangeCurrencyPairRate = (name: any, pairId: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.deleteExchangeCurrencyPairRate(name, pairId).catch(
      (error: any) => error
    );

  const getCountryName = (code: any, mapping: any) => {
    const entry = mapping.find((m: any) => code === m.code);
    return entry.name;
  };

  const getCountryCode = (countryName: any) => {
    const entry: any = countries.find((c: any) => c.name === countryName);
    return entry.code;
  };

  const generateNumberList = (size: any) =>
    Array(size)
      .fill(null)
      .map((i, index) => index);

  const getDropdownCurrencyList = (selectedCurrencies: any) => {
    const list = selectedCurrencies.map((s: any) => s.currency);
    list.unshift("");
    return list;
  };

  const buildFormValues = () => {
    const promises = [
      getExchangeProviders(),
      getSupportedCurrencies(),
    ];
    Promise.all(promises).then((results) => {
      const list = results[0].map((provider: any) => provider.name);
      list.unshift("");
      setExchangeProviders(list);

      const map = new Map();
      results[0].map((provider: any) => map.set(provider.name, provider));
      setProviderMap(map);

      const currencies = results[1];
      currencies.unshift("");
      setSupportedCurrencies(currencies);
    });
  };

  const buildFormPostExchangeProviderSelection = (name: any) => {
    setProviderInfo({
      crossTradeCurrency: providerMap.get(name).crossTradeCurrency,
      intermediateCurrency: providerMap.get(name).intermediateCurrency,
      externalIdentifierCode: providerMap.get(name).externalIdentifierCode,
    });
  };

  useEffect(() => {
    buildFormValues();
  }, []);

  useEffect(() => {
    if (getCountryListQuery.data && getTimeZoneListQuery.data) {
      const result0 = getCountryListQuery.data;
      result0.unshift("");
      setTimeZones(result0);

      const formatted = getTimeZoneListQuery.data.map((c: any) => c.name);
      setCountries(getTimeZoneListQuery.data);
      formatted.unshift("");
      setFormattedCountries(formatted);
    }
  }, [getCountryListQuery.data, getTimeZoneListQuery.data]);

  const hasMarginChanged = (newValue: any, originalList: any) => {
    const original = originalList.find(
      (o: any) => o.currency === newValue.currency
    );
    return (
      original.sellExchMargin !== newValue.sellExchMargin ||
      original.buyExchMargin !== newValue.buyExchMargin
    );
  };

  const hasPairChanged = (newValue: any, originalList: any) => {
    const original = originalList.find(
      (o: any) =>
        o.sellCurrency === newValue.sellCurrency &&
        o.buyCurrency === newValue.buyCurrency
    );
    return original.sellExchMargin !== newValue.sellExchMargin;
  };

  const findDeletedPairs = (mofiedList: any, originalList: any) => {
    const deletedList = [];
    for (const original of originalList) {
      const item = mofiedList.find(
        (mod: any) =>
          original.buyCurrency === mod.buyCurrency &&
          original.sellCurrency === mod.sellCurrency
      );
      if (!item) {
        // if undefined, then pair from originalList was deleted
        deletedList.push(original);
      }
    }
    return deletedList;
  };

  const addOrUpdateExchange = async (values: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.create2({
      country: getCountryCode(values.country),
      timeZone: values.timeZone,
      currencies: values.newMargins.map((margin: any) => margin.currency),
      name: values.name,
      tPlusMinute: values.tPlusMinute,
      tPlusHour: values.tPlusHour,
      tPlusDay: values.tPlusDay,
      providerName: values.providerName,
    })
      .then((result: any) => {
        const noDefaultMargins = values.newMargins.filter(
          (margin: any) =>
            (margin.buyExchMargin && margin.buyExchMargin !== "0") ||
            (margin.sellExchMargin && margin.sellExchMargin !== "0")
        );

        const promises: any = [];
        noDefaultMargins.map((margin: any) =>
          promises.push(
            updateExchangeMargin(values.name, {
              sellExchMargin: getDecimalFractionalPercentage(
                margin.sellExchMargin
              ),
              buyExchMargin: getDecimalFractionalPercentage(
                margin.buyExchMargin
              ),
              currency: margin.currency,
            })
          )
        );

        values.newPairs.map((pair: any) =>
          promises.push(
            insertOrUpdateExchangeCurrencyPairRate(values.name, {
              sellCurrency: pair.sellCurrency,
              buyCurrency: pair.buyCurrency,
              sellExchMargin: getDecimalFractionalPercentage(
                pair.sellExchMargin
              ),
            })
          )
        );

        Promise.all(promises).then((results) => {
          toggleDrawer();
          emitter.emit("banks.page.update", {});
        });
      })
      .catch((error: any) => error);
  };

  const ExchangeScheme = Yup.object().shape({
    name: Yup.string()
      .min(1)
      .required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Exchange Name is a required field",
          },
          {
            fieldName: intl.formatMessage({
              id: "exchangeName",
              defaultMessage: "Exchange Name",
            }),
          }
        )
      ),
    tPlusDay: Yup.string().required(),
    tPlusHour: Yup.string().required(),
    tPlusMinute: Yup.string().required(),
    timeZone: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Time Zone is a required field",
        },
        {
          fieldName: intl.formatMessage({
            id: "timeZone",
            defaultMessage: "Time Zone",
          }),
        }
      )
    ),
    country: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Location is a required field",
        },
        {
          fieldName: intl.formatMessage({
            id: "location",
            defaultMessage: "Location",
          }),
        }
      )
    ),
    newMargins: Yup.array().of(
      Yup.object().shape({
        currency: Yup.string().required(
          intl.formatMessage(
            {
              id: "error.field.required",
              defaultMessage: "Currency is a required field",
            },
            {
              fieldName: intl.formatMessage({
                id: "currency",
                defaultMessage: "Currency",
              }),
            }
          )
        ),
        buyExchMargin: Yup.number()
          .typeError(
            intl.formatMessage(
              {
                id: "error.field.numberType",
                defaultMessage: "Buy Margin must be a number",
              },
              {
                fieldName: intl.formatMessage({
                  id: "buyMargin",
                  defaultMessage: "Buy Margin",
                }),
              }
            )
          )
          .min(
            0,
            intl.formatMessage(
              {
                id: "error.field.number0and100",
                defaultMessage: "Buy Margin must a number between 0 and 100",
              },
              {
                fieldName: intl.formatMessage({
                  id: "buyMargin",
                  defaultMessage: "Buy Margin",
                }),
              }
            )
          )
          .max(
            100,
            intl.formatMessage(
              {
                id: "error.field.number0and100",
                defaultMessage: "Buy Margin must a number between 0 and 100",
              },
              {
                fieldName: intl.formatMessage({
                  id: "buyMargin",
                  defaultMessage: "Buy Margin",
                }),
              }
            )
          ), //error.field.number0and100
        sellExchMargin: Yup.number()
          .typeError(
            intl.formatMessage(
              {
                id: "error.field.numberType",
                defaultMessage: "Sell Margin must be a number",
              },
              {
                fieldName: intl.formatMessage({
                  id: "sellMargin",
                  defaultMessage: "Sell Margin",
                }),
              }
            )
          )
          .min(
            0,
            intl.formatMessage(
              {
                id: "error.field.number0and100",
                defaultMessage: "Sell Margin must a number between 0 and 100",
              },
              {
                fieldName: intl.formatMessage({
                  id: "sellMargin",
                  defaultMessage: "Sell Margin",
                }),
              }
            )
          )
          .max(
            100,
            intl.formatMessage(
              {
                id: "error.field.number0and100",
                defaultMessage: "Buy Margin must a number between 0 and 100",
              },
              {
                fieldName: intl.formatMessage({
                  id: "sellMargin",
                  defaultMessage: "Sell Margin",
                }),
              }
            )
          ),
      })
    ),
    newPairs: Yup.array().of(
      Yup.object().shape({
        buyCurrency: Yup.string().required(
          intl.formatMessage(
            {
              id: "error.field.required",
              defaultMessage: "Buy Currency is a required field",
            },
            {
              fieldName: intl.formatMessage({
                id: "buyCurrency",
                defaultMessage: "Buy Currency",
              }),
            }
          )
        ),
        sellCurrency: Yup.string().required(
          intl.formatMessage(
            {
              id: "error.field.required",
              defaultMessage: "Sell Currency is a required field",
            },
            {
              fieldName: intl.formatMessage({
                id: "sellCurrency",
                defaultMessage: "Sell Currency",
              }),
            }
          )
        ),
        sellExchMargin: Yup.number()
          .typeError(
            intl.formatMessage(
              {
                id: "error.field.numberType",
                defaultMessage: "Sell Margin must be a number",
              },
              {
                fieldName: intl.formatMessage({
                  id: "sellMargin",
                  defaultMessage: "Sell Margin",
                }),
              }
            )
          )
          .min(
            0,
            intl.formatMessage(
              {
                id: "error.field.number0and100",
                defaultMessage: "Buy Margin must a number between 0 and 100",
              },
              {
                fieldName: intl.formatMessage({
                  id: "sellMargin",
                  defaultMessage: "Sell Margin",
                }),
              }
            )
          )
          .max(
            100,
            intl.formatMessage(
              {
                id: "error.field.number0and100",
                defaultMessage: "Buy Margin must a number between 0 and 100",
              },
              {
                fieldName: intl.formatMessage({
                  id: "sellMargin",
                  defaultMessage: "Sell Margin",
                }),
              }
            )
          ),
      })
    ),
    providerName: Yup.string()
      .min(1)
      .required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Exchange Provider is a required field",
          },
          {
            fieldName: intl.formatMessage({
              id: "exchangeProvider",
              defaultMessage: "Exchange Provider",
            }),
          }
        )
      ),
  });

  // @ts-ignore
  return (
    <Container sx={{ minWidth: "350px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={ExchangeScheme}
        onSubmit={(values) => addOrUpdateExchange(values)}
        enableReinitialize
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} noValidate>
            <Grid>
              <Header
                value={intl.formatMessage({
                  id: "addExchange",
                  description: "drawer header",
                  defaultMessage: "Add New Exchange",
                })}
                level={2}
                color="white"
                bold
                drawerTitle
              />

              <FormGroup>
                <Box sx={{ mb: 2 }}>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  @ts-ignore */}
                  <DropdownFloating
                    required
                    {...props}
                    name="providerName"
                    placeholder={
                      <FormattedMessage
                        id="exchangeProvider"
                        description="Input Label"
                        defaultMessage="Exchange Provider"
                      />
                    }
                    list={exchangeProviders}
                    value={props.values.providerName}
                    handleChange={(e: any) => {
                      props.handleChange(e);
                      buildFormPostExchangeProviderSelection(e.target.value);
                    }}
                  />
                </Box>
                {props.values.providerName.length > 0 && (
                  <FormGroup sx={{ mb: 4 }}>
                    <FormGroup>
                      <Label htmlFor="crossTradeCurrencyGroup">
                        <FormattedMessage
                          id="crossTradeCurrency"
                          description="Section Label"
                          defaultMessage="Cross Trade Currency"
                        />
                      </Label>
                      <div>
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        @ts-ignore */}
                        {providerInfo.crossTradeCurrency && (
                          <CurrencyRender
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            currencyCode={providerInfo.crossTradeCurrency}
                          />
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="intermediateCurrencyGroup">
                        <FormattedMessage
                          id="intermediateCurrency"
                          description="Section Label"
                          defaultMessage="Intermediate Currency"
                        />
                      </Label>
                      <div>
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        @ts-ignore */}
                        {providerInfo.intermediateCurrency && (
                          <CurrencyRender
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            currencyCode={providerInfo.intermediateCurrency}
                          />
                        )}
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="externalIdCodeGroup">
                        <FormattedMessage
                          id="externalIdCode"
                          description="Section Label"
                          defaultMessage="External ID Code"
                        />
                      </Label>
                      <div>
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        @ts-ignore */}
                        {providerInfo.externalIdentifierCode && (
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          <span>{providerInfo.externalIdentifierCode}</span>
                        )}
                      </div>
                    </FormGroup>
                  </FormGroup>
                )}

                <FormGroup>
                  <Box sx={{ mb: 2 }}>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    @ts-ignore */}
                    <InputWithPlaceholder
                      required
                      name="name"
                      autoComplete="off"
                      type="text"
                      placeholder={
                        <FormattedMessage
                          id="exchangeName"
                          description="Input Label"
                          defaultMessage="Exchange Name"
                        />
                      }
                      value={props.values.name}
                      {...props}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    @ts-ignore */}
                    <DropdownFloating
                      required
                      name="timeZone"
                      placeholder={
                        <FormattedMessage
                          id="timeZone"
                          description="Input Label"
                          defaultMessage="Time Zone"
                        />
                      }
                      list={timeZones}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      value={props.values.timeZone}
                      {...props}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    @ts-ignore */}
                    <DropdownFloating
                      required
                      name="country"
                      placeholder={
                        <FormattedMessage
                          id="location"
                          description="Input Label"
                          defaultMessage="Location"
                        />
                      }
                      list={formattedCountries}
                      value={props.values.country}
                      {...props}
                    />
                  </Box>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="settlementTimeGroup">
                    <FormattedMessage
                      id="settlementTime"
                      description="Section Label"
                      defaultMessage="Settlement Time"
                    />
                  </Label>
                  <Box>
                    <Grid container columnSpacing={1}>
                      <Grid item flexGrow={1}>
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        @ts-ignore */}
                        <DropdownFloating
                          name="tPlusDay"
                          placeholder={
                            <FormattedMessage
                              id="day"
                              description="Input Label"
                              defaultMessage="Day"
                            />
                          }
                          list={generateNumberList(31)}
                          value={props.values.tPlusDay}
                          {...props}
                        />
                      </Grid>
                      <Grid item flexGrow={1}>
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        @ts-ignore */}
                        <DropdownFloating
                          name="tPlusHour"
                          placeholder={
                            <FormattedMessage
                              id="hour"
                              description="Input Label"
                              defaultMessage="Hour"
                            />
                          }
                          list={generateNumberList(24)}
                          value={props.values.tPlusHour}
                          {...props}
                        />
                      </Grid>
                      <Grid item flexGrow={1}>
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        @ts-ignore */}
                        <DropdownFloating
                          name="tPlusMinute"
                          placeholder={
                            <FormattedMessage
                              id="minute"
                              description="Input Label"
                              defaultMessage="Minute"
                            />
                          }
                          list={generateNumberList(60)}
                          value={props.values.tPlusMinute}
                          {...props}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="currencyGroup">
                    <FormattedMessage
                      id="individualCurrencyMarginOptional"
                      description="Section Label"
                      defaultMessage="Individual Currency Margin (optional)"
                    />
                  </Label>
                  <FieldArray
                    name="newMargins"
                    render={({ remove, push }) => (
                      <Box>
                        {props.values.newMargins &&
                          props.values.newMargins.map((newMargin, index) => (
                            <Box>
                              <Grid container key={`div.newMargins.${index}`}>
                                <Grid
                                  item
                                  sx={{ pt: 1 }}
                                  key={newid("btn.newMargins.")}
                                >
                                  <QDButton
                                    type="button"
                                    variant="icon"
                                    onClick={() => remove(index)}
                                    id="exchange-delete-margin"
                                  >
                                    <img
                                      key={newid("img.newMargins.")}
                                      height={16}
                                      width={16}
                                      src={Icon.deleteIcon}
                                      alt="delete icon"
                                    />
                                  </QDButton>
                                </Grid>
                                <Grid item flexGrow={1}>
                                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  @ts-ignore */}
                                  <DropdownFloating
                                    required
                                    key={`dropdown.newMargins[${index}].currency`}
                                    name={`newMargins.${index}.currency`}
                                    placeholder={
                                      <FormattedMessage
                                        id="currency"
                                        description="Input Label"
                                        defaultMessage="Currency"
                                      />
                                    }
                                    list={supportedCurrencies}
                                    value={
                                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      // @ts-ignore
                                      props.values.newMargins[index].currency
                                    }
                                    {...props}
                                  />
                                </Grid>
                              </Grid>

                              {props.errors.newMargins &&
                                props.errors.newMargins[index] && (
                                  <Box sx={{ ml: 3.7 }}>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                   @ts-ignore */}
                                    {props.errors.newMargins[index].buyExchMargin && (
                                      <Label variant="error">
                                        {
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          // @ts-ignore
                                          props.errors.newMargins[index].buyExchMargin
                                        }
                                      </Label>
                                    )}
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                     @ts-ignore */}
                                    {props.errors.newMargins[index].sellExchMargin && (
                                      <Label variant="error">
                                        {
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          // @ts-ignore
                                          props.errors.newMargins[index].sellExchMargin
                                        }
                                      </Label>
                                    )}
                                  </Box>
                                )}

                              <Grid
                                container
                                key={`div.newMargins.${index}.buyExchMargin`}
                                columnSpacing={2}
                                justifyContent="flex-end"
                                marginBottom={4}
                              >
                                <Grid item xs={6}>
                                  <Box sx={{ display: "flex", width: "135px" }}>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    @ts-ignore */}
                                    <InputWithPlaceholder
                                      name={`newMargins.${index}.buyExchMargin`}
                                      autoComplete="off"
                                      type="text"
                                      placeholder={
                                        <FormattedMessage
                                          id="buyMargin"
                                          description="Input Label"
                                          defaultMessage="Buy Margin"
                                        />
                                      }
                                      value={
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        props.values.newMargins[index].buyExchMargin
                                      }
                                      {...props}
                                    />
                                    <Box sx={{ pt: 1, ml: 1 }}>
                                      <Label htmlFor="buyMargin" color="white">
                                        %
                                      </Label>
                                    </Box>
                                  </Box>
                                </Grid>
                                <Grid item xs={6}>
                                  <Box sx={{ display: "flex", width: "135px" }}>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    @ts-ignore */}
                                    <InputWithPlaceholder
                                      name={`newMargins.${index}.sellExchMargin`}
                                      autoComplete="off"
                                      type="text"
                                      placeholder={
                                        <FormattedMessage
                                          id="sellMargin"
                                          description="Input Label"
                                          defaultMessage="Sell Margin"
                                        />
                                      }
                                      value={
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        props.values.newMargins[index].sellExchMargin
                                      }
                                      {...props}
                                    />
                                    <Box sx={{ pt: 1, ml: 1 }}>
                                      <Label htmlFor="sellMargin" color="white">
                                        %
                                      </Label>
                                    </Box>
                                  </Box>
                                </Grid>
                              </Grid>
                            </Box>
                          ))}

                        <Grid container justifyContent="right" sx={{ mb: 6 }}>
                          <QDButton
                            onClick={() => push("")}
                            id="exchanges-add-currency-margin"
                            color="primary"
                            variant="contained"
                            size="small"
                            label={intl.formatMessage(
                              defineMessage({
                                id: "button.addAdditionalCurrency",
                                defaultMessage: "ADD ADDITIONAL CURRENCY",
                                description: "header",
                              })
                            )}
                          />
                        </Grid>
                      </Box>
                    )}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="currencyPairGroup">
                    <FormattedMessage
                      id="currencyPairMarginOptional"
                      description="Section Label"
                      defaultMessage="Currency Pair Margin (optional)"
                    />
                  </Label>
                  <FieldArray
                    name="newPairs"
                    render={({ remove, push }) => (
                      <Box>
                        {props.values.newPairs &&
                          props.values.newPairs.map((currency, index) => (
                            <Grid container key={`div.newPairs.${index}`}>
                              <Grid
                                item
                                sx={{ pt: 1 }}
                                key={`btn.newPairs.${index}`}
                              >
                                <QDButton
                                  type="button"
                                  onClick={() => remove(index)}
                                  id="exchange-delete-newPair"
                                  variant="icon"
                                >
                                  <img
                                    /* eslint-disable-next-line react/no-array-index-key */
                                    key={`img.newPairs.${index}`}
                                    height={16}
                                    width={16}
                                    src={Icon.deleteIcon}
                                    alt="delete icon"
                                  />
                                </QDButton>
                              </Grid>
                              <Grid item flexGrow={1}>
                                <Box>
                                  <Grid>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    @ts-ignore */}
                                    <DropdownFloating
                                      required
                                      key={`dropdown.newPairs.${index}`}
                                      name={`newPairs.${index}.buyCurrency`}
                                      placeholder={
                                        <FormattedMessage
                                          id="buyCurrency"
                                          description="Input Label"
                                          defaultMessage="Buy Currency"
                                        />
                                      }
                                      list={getDropdownCurrencyList(
                                        props.values.newMargins
                                      )}
                                      value={
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        props.values.newPairs[index].buyCurrency
                                      }
                                      {...props}
                                    />
                                  </Grid>
                                  <Grid>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    @ts-ignore */}
                                    <DropdownFloating
                                      required
                                      key={`dropdown.newPairs.${index}`}
                                      name={`newPairs.${index}.sellCurrency`}
                                      placeholder={
                                        <FormattedMessage
                                          id="sellCurrency"
                                          description="Input Label"
                                          defaultMessage="Sell Currency"
                                        />
                                      }
                                      list={getDropdownCurrencyList(
                                        props.values.newMargins
                                      )}
                                      value={
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        props.values.newPairs[index].sellCurrency
                                      }
                                      {...props}
                                    />
                                  </Grid>
                                  <Grid>
                                    {props.errors.newPairs &&
                                      props.errors.newPairs[index] &&
                                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      // @ts-ignore
                                      props.errors.newPairs[index].sellExchMargin && (
                                        <Box>
                                          <Label variant="error">
                                            {
                                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                              // @ts-ignore
                                              props.errors.newPairs[index].sellExchMargin
                                            }
                                          </Label>
                                        </Box>
                                      )}
                                    <Box
                                      sx={{ display: "flex", width: "135px" }}
                                    >
                                      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      @ts-ignore */}
                                      <InputWithPlaceholder
                                        name={`newPairs.${index}.sellExchMargin`}
                                        autoComplete="off"
                                        type="text"
                                        placeholder={
                                          <FormattedMessage
                                            id="sellMargin"
                                            description="Input Label"
                                            defaultMessage="Sell Margin"
                                          />
                                        }
                                        value={
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          // @ts-ignore
                                          props.values.newPairs[index].sellExchMargin
                                        }
                                        {...props}
                                      />
                                      <Box
                                        sx={{ pt: 1, color: "white", ml: 1 }}
                                      >
                                        <Label htmlFor="pairSellMargin">
                                          %
                                        </Label>
                                      </Box>
                                    </Box>
                                  </Grid>
                                </Box>
                              </Grid>
                            </Grid>
                          ))}
                        <Grid container justifyContent="right" sx={{ mb: 6 }}>
                          <QDButton
                            onClick={() => push("")}
                            id="exchanges-add-currency-pair"
                            color="primary"
                            variant="contained"
                            size="small"
                            label={intl.formatMessage(
                              defineMessage({
                                id: "addAdditionalCurrencyPair",
                                defaultMessage: "ADD ADDITIONAL CURRENCY PAIR",
                                description: "header",
                              })
                            )}
                          />
                        </Grid>
                      </Box>
                    )}
                  />
                </FormGroup>

                <Grid container rowSpacing={1} justifyContent="center">
                  <Grid item xs={4}>
                    <CancelButton
                      onClick={() => toggleDrawer()}
                      id="exchanges-cancel-changes"
                    >
                      <FormattedMessage
                        id="cancel"
                        description="Cancel button"
                        defaultMessage="Cancel"
                      />
                    </CancelButton>
                  </Grid>
                  <Grid item xs={7}>
                    <SubmitButton
                      id="exchanges-save-changes"
                      disabled={!props.dirty}
                    >
                      <FormattedMessage
                        id="saveChanges"
                        description="Save changes button"
                        defaultMessage="Save Changes"
                      />
                    </SubmitButton>
                  </Grid>
                </Grid>
              </FormGroup>
            </Grid>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default ExchangeDrawer;
