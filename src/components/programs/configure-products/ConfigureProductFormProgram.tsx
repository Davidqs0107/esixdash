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

import React, {
  lazy,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { Box, Grid } from "@mui/material";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import { Formik, Field, FieldArray } from "formik";
import InputAdornment from "@mui/material/InputAdornment";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import Typography from "@mui/material/Typography";
import Icon from "../../common/Icon";
import { PartnerUserContext } from "../../../contexts/PartnerUserContext";
import CurrencyRender from "../../common/converters/CurrencyRender";
import { programFormSchema } from "../../../yup";
import { useQueries } from "@tanstack/react-query";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fields: {
      marginBottom: "8px",
      "& .MuiTextField-root": {
        boxShadow: "0 15px 5px -10px #0b0d100a",
      },
    },
    checkBox: {
      "& Label": { marginBottom: 0 },
    },
    dropdown: {
      borderRadius: "5px",
      backgroundColor: "#FFFFFF",
      boxShadow: "0 10px 10px -5px rgba(33,31,64,0.1)",
      marginBottom: "22px",
    },
  })
);

interface IConfigureProductFormProgram {
  submitForm?: any;
  refId?: any;
  program?: any;
  isOtherProduct?: boolean;
}

const ConfigureProductFormProgram: React.FC<IConfigureProductFormProgram> = ({
  submitForm,
  refId,
  program,
  isOtherProduct = false,
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const [currenciesByPartner, setCurrenciesByPartner] = useState<
    Map<string, string[]>
  >(new Map());
  const { setErrorMsg } = useContext(MessageContext);
  const { partnerName } = useContext(PartnerUserContext);
  const [partners, setPartners] = useState([]);
  useState<string[]>([]);
  const [homeCurrenciesList, setHomeCurrenciesList] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [timeZones, setTimeZones] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [partner, setPartner] = useState<any>();
  const [day, setDay] = useState([...Array(31).keys()]);
  const [hour, setHour] = useState([...Array(24).keys()]);
  const [minute, setMinute] = useState([...Array(60).keys()]);

  const getDefaultPartner = () => {
    let tmpName =
      program && program.partnerName
        ? program.partnerName
        : partnerName
        ? partnerName
        : "";
    return tmpName;
  };

  const [initialValues, setInitialValues] = useState({
    productNameInput: "",
    partner: getDefaultPartner(),
    language: program ? program.language || "" : "",
    location: "",
    timeZone: "",
    homeCurrency: program ? program.defaultHomeCurrency || "" : "",
    day: 1,
    hour: 0,
    minute: 0,
    exchange: "",
    newCurrencies: [""],
  });

  const [getCountryListQuery, getLocalesQuery, getTimeZoneListQuery] =
    useQueries({
      queries: [
        {
          queryKey: ["getCountryList"],
          queryFn: () =>
            // @ts-ignore
            api.CommonAPI.getCountryList(null),
          onError: (error: any) => setErrorMsg(error),
        },
        {
          queryKey: ["getLocales"],
          queryFn: () =>
            // @ts-ignore
            api.CommonAPI.getLocales(),
          onError: (error: any) => setErrorMsg(error),
        },
        {
          queryKey: ["getTimeZoneList"],
          queryFn: () =>
            // @ts-ignore
            api.CommonAPI.getTimeZoneList(),
          onError: (error: any) => setErrorMsg(error),
        },
      ],
    });

  const initializeHomeCurrencies = (partnerList: any) => {
    const currenciesByPartnerList = new Map();
    partnerList.forEach((partner: any) =>
      currenciesByPartnerList.set(partner.name, partner.currencies)
    );
    setCurrenciesByPartner(currenciesByPartnerList);

    const allPartnerCurrencies = partnerList
      .flatMap((partner: any) => partner.currencies)
      .reduce(
        (currencies: Set<string>, currency: string) => currencies.add(currency),
        new Set()
      );
    setHomeCurrenciesList(Array.from(allPartnerCurrencies));
  };

  const getPartners = () =>
    // @ts-ignore
    api.PartnerAPI.listLinkedPartners()
      .then((res: any) => {
        const results = res.map((p: any) => p.name);
        setPartners(results);
        initializeHomeCurrencies(res);
      })
      .catch((e: any) => setErrorMsg(e));

  const getPartner = (partnerName: string, productNameInput: string) =>
    // @ts-ignore
    api.PartnerAPI.getPartner(partnerName)
      .then((partner: any) => {
        setPartner(partner);

        setInitialValues({
          ...initialValues,
          partner: partner.name,
          timeZone: partner.timeZone,
          location: partner.country,
          language: partner.language.replace("en-US", "en"),
          productNameInput: productNameInput,
        });
      })
      .catch((error: any) => setErrorMsg(error));

  const getExchangesList = () =>
    // @ts-ignore
    api.PartnerAPI.listExchanges()
      .then((results: any) => {
        const exchangeList = results.map((p: any) => p.name);
        exchangeList.unshift("");
        setExchanges(exchangeList);
      })
      .catch((error: any) => setErrorMsg(error));

  // We should only show the currencies configured under the selected partner.
  const onPartnerSelect = (
    handleChange: any,
    e: React.SyntheticEvent,
    productNameInput: any
  ) => {
    handleChange(e);

    // @ts-ignore
    const partnerName = e.target.value;

    // @ts-ignore
    setHomeCurrenciesList(currenciesByPartner.get(partnerName));

    getPartner(partnerName, productNameInput).catch((error: any) =>
      setErrorMsg(error)
    );
  };

  const istMultiCurrencyProduct = program.category == "multi-currency";

  useEffect(() => {
    getPartners().catch((error: any) => setErrorMsg(error));

    if (isOtherProduct || initialValues.partner) {
      getPartner(partnerName || initialValues.partner, "").catch((error: any) =>
        setErrorMsg(error)
      );
    }

    if (istMultiCurrencyProduct) {
      getExchangesList().catch((error: any) => setErrorMsg(error));
    }
  }, []);

  useEffect(() => {
    if (
      getCountryListQuery.data &&
      getLocalesQuery.data &&
      getTimeZoneListQuery.data
    ) {
      const countryList = getCountryListQuery.data.map((l: any) => ({
        text: l.name,
        code: l.code,
      }));
      setCountries(countryList);

      const list = getLocalesQuery.data.map((l: any) => ({
        text: l.displayName,
        code: l.code,
      }));
      setLanguages(list);

      const timeZoneList = getTimeZoneListQuery.data;
      timeZoneList.unshift("");
      setTimeZones(timeZoneList);
    }
  }, [
    getCountryListQuery.data,
    getLocalesQuery.data,
    getTimeZoneListQuery.data,
  ]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={programFormSchema}
      enableReinitialize={true}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={(values) => submitForm(values)}
    >
      {(props) => {
        return (
          <form id="form-mattic" onSubmit={props.handleSubmit} noValidate>
            <Grid container direction="row">
              <Grid className={classes.fields} item xs={12} md={12} lg={12}>
                <Box className={classes.dropdown}>
                  {/* @ts-ignore */}
                  <InputWithPlaceholder
                    name="productNameInput"
                    type="text"
                    placeholder={
                      <FormattedMessage
                        id="configure.form.base.label.productName"
                        description="Input Label"
                        defaultMessage="Product Name"
                      />
                    }
                    id="productNameInput"
                    required
                    autoComplete="off"
                    value={props.values.productNameInput}
                    margin="none"
                    {...props}
                  />
                </Box>
              </Grid>
              <Grid className={classes.fields} item xs={12} md={12} lg={12}>
                <Box className={classes.dropdown}>
                  <DropdownFloating
                    placeholder={
                      <FormattedMessage
                        id="configure.form.base.label.partner"
                        description="Input Label"
                        defaultMessage="Partner"
                      />
                    }
                    list={partners}
                    id="partnerInput"
                    required
                    name="partner"
                    value={props.values.partner}
                    {...props}
                    handleChange={(e: SyntheticEvent) =>
                      onPartnerSelect(
                        props.handleChange,
                        e,
                        props.values.productNameInput
                      )
                    }
                    margin="none"
                    isVerified={props.values.partner != ""}
                  />
                </Box>
              </Grid>
              <Grid container spacing={3}>
                <Grid item xs={4} md={4} lg={4} className={classes.fields}>
                  <Box className={classes.dropdown}>
                    <DropdownFloating
                      id="languageInput"
                      required
                      name="language"
                      placeholder={
                        <FormattedMessage
                          id="configure.form.base.label.language"
                          description="Input Label"
                          defaultMessage="Language"
                        />
                      }
                      list={languages}
                      valueKey="code"
                      value={props.values.language}
                      {...props}
                      margin="none"
                      isVerified={props.values.language != ""}
                    />
                  </Box>
                </Grid>
                <Grid item xs={4} md={4} lg={4} className={classes.fields}>
                  <Box className={classes.dropdown}>
                    <DropdownFloating
                      id="locationInput"
                      required
                      name="location"
                      placeholder={
                        <FormattedMessage
                          id="drawer.addProgram.label.location"
                          description="Input Label"
                          defaultMessage="Location"
                        />
                      }
                      list={countries}
                      valueKey="code"
                      value={props.values.location}
                      {...props}
                      margin="none"
                      isVerified={props.values.location != ""}
                    />
                  </Box>
                </Grid>
                <Grid item xs={4} md={4} lg={4} className={classes.fields}>
                  <Box className={classes.dropdown}>
                    <DropdownFloating
                      id="timeZoneInput"
                      required
                      name="timeZone"
                      placeholder={
                        <FormattedMessage
                          id="configure.form.base.label.timeZone"
                          description="Input Label"
                          defaultMessage="Time Zone"
                        />
                      }
                      list={timeZones}
                      value={props.values.timeZone}
                      {...props}
                      margin="none"
                      isVerified={props.values.timeZone != ""}
                    />
                  </Box>
                </Grid>
              </Grid>
              {partner && (
                <Grid container>
                  <Grid item xs={12} md={12} lg={12}>
                    <Typography
                      sx={{
                        color: "#8995AD",
                        fontSize: "12px",
                        letterSpacing: "-0.2px",
                        lineHeight: "13px",
                        marginBottom: "20px",
                      }}
                    >
                      Settlement Time
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid
                        className={classes.fields}
                        item
                        xs={2}
                        md={2}
                        lg={2}
                      >
                        <Box className={classes.dropdown}>
                          <DropdownFloating
                            name="day"
                            placeholder={
                              <FormattedMessage
                                id="configure.form.base.label.day"
                                description="Input Label"
                                defaultMessage="Day"
                              />
                            }
                            list={day}
                            value={props.values.day}
                            {...props}
                            margin="none"
                          />
                        </Box>
                      </Grid>
                      <Grid
                        className={classes.fields}
                        item
                        xs={2}
                        md={2}
                        lg={2}
                      >
                        <Box className={classes.dropdown}>
                          <DropdownFloating
                            name="hour"
                            placeholder={
                              <FormattedMessage
                                id="configure.form.base.label.hour"
                                description="Input Label"
                                defaultMessage="Hour"
                              />
                            }
                            list={hour}
                            value={props.values.hour}
                            {...props}
                            margin="none"
                          />
                        </Box>
                      </Grid>
                      <Grid
                        className={classes.fields}
                        item
                        xs={2}
                        md={2}
                        lg={2}
                      >
                        <Box className={classes.dropdown}>
                          <DropdownFloating
                            name="minute"
                            placeholder={
                              <FormattedMessage
                                id="configure.form.base.label.minute"
                                description="Input Label"
                                defaultMessage="Minute"
                              />
                            }
                            list={minute}
                            value={props.values.minute}
                            {...props}
                            margin="none"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
              <Grid container xs={12} md={12} lg={12} direction="row">
                <Grid className={classes.fields} item xs={12} lg={3}>
                  <Box className={classes.dropdown}>
                    <DropdownFloating
                      id="homeCurrencyInput"
                      required
                      name="homeCurrency"
                      placeholder={
                        <FormattedMessage
                          id="drawer.addProgram.label.homeCurrency"
                          description="Input Label"
                          defaultMessage="Home Currency"
                        />
                      }
                      list={homeCurrenciesList}
                      value={props.values.homeCurrency}
                      {...props}
                      margin="none"
                    />
                  </Box>
                  {istMultiCurrencyProduct && partner && (
                    <>
                      <Box className={classes.dropdown}>
                        <DropdownFloating
                          name="exchange"
                          placeholder={`${intl.formatMessage({
                            id: "exchange",
                            defaultMessage: "Exchange",
                          })}*`}
                          list={exchanges}
                          value={props.values.exchange}
                          {...props}
                          margin="none"
                        />
                      </Box>
                      <Box>
                        <Typography
                          sx={{
                            color: "#8995AD",
                            fontSize: "12px",
                            letterSpacing: "-0.2px",
                            lineHeight: "13px",
                            marginBottom: "20px",
                          }}
                        >
                          <FormattedMessage
                            id="additionalCurrencies"
                            description="Section Label"
                            defaultMessage="Additional Currencies"
                          />
                        </Typography>
                        <FieldArray
                          name="newCurrencies"
                          render={({ remove, push }) => (
                            <Box>
                              {props.values.newCurrencies.length > 0 &&
                                props.values.newCurrencies.map(
                                  (newCurrency: any, index: number) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <Grid
                                      container
                                      // eslint-disable-next-line react/no-array-index-key
                                      key={`div.newCurrency.${index}`}
                                      sx={{ marginBottom: "20px" }}
                                    >
                                      <Grid
                                        item
                                        sx={{
                                          pt: !props.values.newCurrencies[index]
                                            ? 1
                                            : 0,
                                        }}
                                      >
                                        <QDButton
                                          /* eslint-disable-next-line react/no-array-index-key */
                                          key={`btn.newCurrencies.${index}`}
                                          type="button"
                                          onClick={() => remove(index)}
                                          id="bank-delete-currency"
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
                                        {!props.values.newCurrencies[index] ? (
                                          <DropdownFloating
                                            /* eslint-disable-next-line react/no-array-index-key */
                                            key={`dropdown.newCurrencies.${index}`}
                                            name={`newCurrencies.${index}`}
                                            placeholder={`${intl.formatMessage({
                                              id: "addNewCurrency",
                                              defaultMessage:
                                                "Add New Currency",
                                            })}*`}
                                            list={partner.currencies}
                                            value={
                                              props.values.newCurrencies[index]
                                            }
                                            {...props}
                                          />
                                        ) : (
                                          <CurrencyRender
                                            currencyCode={
                                              props.values.newCurrencies[index]
                                            }
                                          />
                                        )}
                                      </Grid>
                                    </Grid>
                                  )
                                )}

                              <Grid
                                container
                                justifyContent="right"
                                sx={{ mb: 6 }}
                              >
                                <QDButton
                                  onClick={() => push("")}
                                  id="program-add-currency"
                                  variant="contained"
                                  size="small"
                                  label={intl.formatMessage(
                                    defineMessage({
                                      id: "button.addAdditionalCurrency",
                                      defaultMessage: "ADD ADDITIONAL CURRENCY",
                                      description: "ADD ADDITIONAL CURRENCY",
                                    })
                                  )}
                                />
                              </Grid>
                            </Box>
                          )}
                        />
                      </Box>
                    </>
                  )}
                </Grid>
              </Grid>
              <button
                ref={refId}
                id="buttonB"
                type="submit"
                style={{ display: "none" }}
                value="Validate"
              >
                Submit form
              </button>
            </Grid>
          </form>
        );
      }}
    </Formik>
  );
};

export default ConfigureProductFormProgram;
