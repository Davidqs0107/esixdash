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
import emitter from "../../../emitter";
import api from "../../../api/api";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import CurrencyRender from "../../common/converters/CurrencyRender";
import Icon from "../../common/Icon";
import TextRender from "../../common/TextRender";
import SubmitButton from "../../common/elements/SubmitButton";
import CancelButton from "../../common/elements/CancelButton";
import Header from "../../common/elements/Header";
import Label from "../../common/elements/Label";
import { useQueries } from "@tanstack/react-query";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

interface IInterchangeDrawer {
  toggleDrawer?: any;
  interchange?: any;
  edit?: boolean;
}

const InterchangeDrawer: React.FC<IInterchangeDrawer> = ({
  toggleDrawer = () => {
    /* function provided by drawercomp */
  },
  interchange = {},
  edit,
}) => {
  const intl = useIntl();

  const [initialValues, setInitialValues] = useState({
    edit,
    name: "",
    timeZone: "",
    country: "",
    currencies: [], // for existing currencies
    newCurrencies: [],
    iins: [], // for existing iins
    tPlusDay: "1",
    tPlusHour: "0",
    tPlusMinute: "0",
    newIINs: [],
    bankName: "",
  });
  const [currencyList, setCurrencyList] = useState([]);
  const [iinList, setIINList] = useState([]);
  const [countries, setCountries] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [banks, setBanks] = useState([]);
  const [bankName, setBankName] = useState(
    edit && interchange ? interchange.bankName : ""
  );

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

  const getBankIINs = (name: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.BankAPI.getIINs(name).catch((error) => error);
  const getBankCurrencies = (name: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.BankAPI.getCurrencies(name).catch((error) => error);
  const getBanks = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.BankAPI.list().catch((error) => error);
  const [formattedCountries, setFormattedCountries] = useState([]);

  const getCountryName = (code: any, mapping: any) => {
    const entry = mapping.find((m: any) => code === m.code);
    return entry !== undefined ? entry.code : "";
  };

  const getCountryCode = (countryName: any) => {
    const entry: any = countries.find((c: any) => c.name === countryName);
    return entry !== undefined ? entry.code : "";
  };

  const generateNumberList = (size: any) =>
    Array(size)
      .fill(null)
      .map((i, index) => index);

  const buildFormValues = () => {
    const promises = [getBanks()];
    Promise.all(promises).then((results) => {
      const list = results[0].map((bank: any) => bank.name);
      list.unshift("");
      setBanks(list);

      setInitialValues({
        edit,
        name: edit ? interchange.name : "",
        timeZone: edit ? interchange.timeZone : "",
        country: edit ? getCountryName(interchange.country, results[1]) : "",
        currencies: edit ? interchange.currencies : [],
        newCurrencies: (edit ? [] : [""]) as any,
        iins: (edit ? [...interchange.iins] : []) as any,
        tPlusDay: edit ? interchange.tPlusDay : 1,
        tPlusHour: edit ? interchange.tPlusHour : 0,
        tPlusMinute: edit ? interchange.tPlusMinute : 0,
        newIINs: (edit ? [] : [""]) as any,
        bankName: edit ? interchange.bankName : "",
      });
    });
  };

  const buildFormPostBankSelection = (name: any) => {
    const promises = [getBankCurrencies(name), getBankIINs(name)];
    Promise.all(promises).then((results) => {
      const currencies = results[0] ? results[0] : [];
      currencies.unshift("");
      setCurrencyList(currencies);

      const iins = results[1] ? results[1] : [];
      iins.unshift("");
      setIINList(iins);
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

  const addOrUpdateInterchange = async (values: any) => {
    if (!edit) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.InterchangeAPI.create({
        country: getCountryCode(values.country),
        timeZone: values.timeZone,
        bankName,
        currencies: values.newCurrencies,
        iins: values.newIINs,
        name: values.name,
        tPlusMinute: values.tPlusMinute,
        tPlusHour: values.tPlusHour,
        tPlusDay: values.tPlusDay,
      })
        .then((result: any) => {
          toggleDrawer();
          emitter.emit("banks.page.update", {});
        })
        .catch((error: any) => error);
    } else {
      values.newIINs.map(async (iin: any) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await api.InterchangeAPI.addIIN(values.name, bankName, {
          iin,
        }).catch((error: any) => error);
      });

      emitter.emit("banks.page.update", {});
      toggleDrawer();
    }
  };

  const InterchangeScheme = Yup.object().shape({
    name: Yup.string()
      .min(1)
      .required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Interchange Name is a required field",
          },
          {
            fieldName: intl.formatMessage({
              id: "interchangeName",
              defaultMessage: "Interchange Name",
            }),
          }
        )
      ),
    edit: Yup.bool(),
    newIINs: Yup.array()
      .of(Yup.string())
      .when("edit", {
        is: false,
        then: Yup.array()
          .of(
            Yup.string()
              .min(3)
              .required(
                intl.formatMessage(
                  {
                    id: "error.field.required",
                    defaultMessage: "IIN is a required field",
                  },
                  {
                    fieldName: intl.formatMessage({
                      id: "iin",
                      defaultMessage: "IIN",
                    }),
                  }
                )
              )
          )
          .min(
            1,
            intl.formatMessage({
              id: "error.iin.minRequired",
              defaultMessage: "At least one IIN is required",
            })
          ),
        otherwise: Yup.array().of(Yup.string()),
      }),
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
    newCurrencies: Yup.array()
      .of(Yup.string())
      .when("edit", {
        is: false,
        then: Yup.array()
          .of(
            Yup.string()
              .min(3)
              .required(
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
              )
          )
          .min(
            1,
            intl.formatMessage({
              id: "error.currency.minRequired",
              defaultMessage: "At least one currency is required",
            })
          ),
        otherwise: Yup.array().of(Yup.string()),
      }),
    bankName: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Bank Name is a required field",
        },
        {
          fieldName: intl.formatMessage({
            id: "bankName",
            defaultMessage: "Bank Name",
          }),
        }
      )
    ),
  });

  return (
    <Container sx={{ minWidth: "350px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={InterchangeScheme}
        onSubmit={(values) => addOrUpdateInterchange(values)}
        enableReinitialize
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} noValidate>
            <Grid>
              <Header
                value={
                  edit
                    ? intl.formatMessage({
                        id: "editInterchange",
                        description: "drawer header",
                        defaultMessage: "Edit Interchange",
                      })
                    : intl.formatMessage({
                        id: "addInterchange",
                        description: "drawer header",
                        defaultMessage: "Add New Interchange",
                      })
                }
                level={2}
                color="white"
                bold
                drawerTitle
              />

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
                        id="interchangeName"
                        description="Input Label"
                        defaultMessage="Interchange Name"
                      />
                    }
                    value={props.values.name}
                    disabled={edit}
                    {...props}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
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
                    value={props.values.timeZone}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    disabled={edit}
                    {...props}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
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
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    disabled={edit}
                    {...props}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <DropdownFloating
                    required
                    {...props}
                    name="bankName"
                    placeholder={
                      <FormattedMessage
                        id="bankName"
                        description="Input Label"
                        defaultMessage="Bank Name"
                      />
                    }
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    disabled={edit}
                    list={banks}
                    value={props.values.bankName}
                    handleChange={(e: any) => {
                      props.handleChange(e);
                      setBankName(e.target.value);
                      buildFormPostBankSelection(e.target.value);
                    }}
                  />
                </Box>

                <FormGroup>
                  <Label htmlFor="currencyGroup">
                    <FormattedMessage
                      id="currencies"
                      description="Section Label"
                      defaultMessage="Currencies"
                    />
                  </Label>
                  {interchange.currencies
                    ? interchange.currencies.map((currency: any) => (
                        <Box
                          key={`currency-${currency}`}
                          sx={{
                            margin: "10px 0",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <CurrencyRender
                            currencyCode={currency}
                            key={`currency-${currency}`}
                          />
                        </Box>
                      ))
                    : null}
                  <FieldArray
                    name="newCurrencies"
                    render={({ remove, push }) => (
                      <Box>
                        {props.values.newCurrencies.length > 0 &&
                          props.values.newCurrencies.map(
                            (newCurrency, index) => (
                              <Grid
                                container
                                // eslint-disable-next-line react/no-array-index-key
                                key={`div.newCurrency.${index}`}
                              >
                                <Grid
                                  item
                                  sx={{ pt: 1 }}
                                  key={`btn.newCurrencies.${index}`}
                                >
                                  <QDButton
                                    type="button"
                                    onClick={() => remove(index)}
                                    id="interchange-delete-currency"
                                    variant="icon"
                                  >
                                    <img
                                      /* eslint-disable-next-line react/no-array-index-key */
                                      key={`img.newCurrencies.${index}`}
                                      height={16}
                                      width={16}
                                      src={Icon.deleteIcon}
                                      alt="delete icon"
                                    />
                                  </QDButton>
                                </Grid>
                                <Grid item sx={{ flexGrow: 1 }}>
                                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  @ts-ignore */}
                                  <DropdownFloating
                                    required
                                    key={`dropdown.newCurrencies.${index}`}
                                    name={`newCurrencies.${index}`}
                                    placeholder={
                                      <FormattedMessage
                                        id="newCurrency"
                                        description="Input Label"
                                        defaultMessage="New Currency"
                                      />
                                    }
                                    list={currencyList}
                                    value={props.values.newCurrencies[index]}
                                    {...props}
                                  />
                                </Grid>
                              </Grid>
                            )
                          )}
                        <Grid container justifyContent="right" sx={{ mb: 6 }}>
                          {!edit && (
                            <QDButton
                              type="button"
                              onClick={() => push("")}
                              id="interchange-add-currency"
                              color="primary"
                              variant="contained"
                              size="small"
                              label={intl.formatMessage(
                                defineMessage({
                                  id: "addCurrency",
                                  defaultMessage: "ADD CURRENCY",
                                  description: "Input Label",
                                })
                              )}
                            />
                          )}
                        </Grid>
                      </Box>
                    )}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="iinGroup">
                    <FormattedMessage
                      id="IINs"
                      description="Section Label"
                      defaultMessage="IINs"
                    />
                  </Label>
                  {interchange.iins &&
                    interchange.iins.map((iin: any, index: any) => (
                      <TextRender data={iin} key={`label.iins.${index}`} />
                    ))}
                  <FieldArray
                    name="newIINs"
                    render={({ remove, push }) => (
                      <Box>
                        {props.values.newIINs && props.values.newIINs.length > 0
                          ? props.values.newIINs.map((newIIN, index) => (
                              <Grid
                                container
                                // eslint-disable-next-line react/no-array-index-key
                                key={`div.iins.${index}`}
                              >
                                <Grid
                                  item
                                  sx={{ pt: 1 }}
                                  key={`btn.iins.${index}`}
                                >
                                  <QDButton
                                    type="button"
                                    onClick={() => remove(index)}
                                    id="interchange-remove-iin"
                                    variant="icon"
                                  >
                                    <img
                                      /* eslint-disable-next-line react/no-array-index-key */
                                      key={`img.iins.${index}`}
                                      height={16}
                                      width={16}
                                      src={Icon.deleteIcon}
                                      alt="delete icon"
                                    />
                                  </QDButton>
                                </Grid>
                                {edit ? (
                                  <Grid item sx={{ flexGrow: 1 }}>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  @ts-ignore */}
                                    <InputWithPlaceholder
                                      required
                                      type="text"
                                      key={`input.iins.${index}`}
                                      name={`newIINs.${index}`}
                                      autoComplete="off"
                                      placeholder={
                                        <FormattedMessage
                                          id="newIIN"
                                          description="Input Label"
                                          defaultMessage="New IIN"
                                        />
                                      }
                                      value={props.values.newIINs[index]}
                                      index={index}
                                      altName="newIINs"
                                      {...props}
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item sx={{ flexGrow: 1 }}>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  @ts-ignore */}
                                    <DropdownFloating
                                      required
                                      key={`dropdown.iins.${index}`}
                                      name={`newIINs.${index}`}
                                      placeholder={
                                        <FormattedMessage
                                          id="newIIN"
                                          description="Input Label"
                                          defaultMessage="New IIN"
                                        />
                                      }
                                      list={iinList}
                                      value={props.values.newIINs[index]}
                                      {...props}
                                    />
                                  </Grid>
                                )}
                              </Grid>
                            ))
                          : null}
                        <Grid container justifyContent="right" sx={{ mb: 6 }}>
                          <QDButton
                            onClick={() => {
                              push("");
                            }}
                            id="interchange-add-iin"
                            color="primary"
                            variant="contained"
                            size="small"
                            label={intl.formatMessage(
                              defineMessage({
                                id: "addIIN",
                                defaultMessage: "ADD IIN",
                                description: "Input Label",
                              })
                            )}
                          />
                        </Grid>
                      </Box>
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="settlementTimeGroup">
                    <FormattedMessage
                      id="settlementTime"
                      description="Section Label"
                      defaultMessage="Settlement Time"
                    />
                  </Label>
                  <Box sx={{ mb: 3 }}>
                    <Grid container columnSpacing={1}>
                      <Grid item flexGrow={1}>
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
                          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          disabled={edit}
                          {...props}
                        />
                      </Grid>
                      <Grid item flexGrow={1}>
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
                          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          disabled={edit}
                          {...props}
                        />
                      </Grid>
                      <Grid item flexGrow={1}>
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
                          //eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          disabled={edit}
                          {...props}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </FormGroup>

                <Grid container rowSpacing={1} justifyContent="center">
                  <Grid item xs={4}>
                    <CancelButton
                      onClick={() => toggleDrawer()}
                      id="interchanges-cancel-changes"
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
                      id="interchanges-save-changes"
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

export default InterchangeDrawer;
