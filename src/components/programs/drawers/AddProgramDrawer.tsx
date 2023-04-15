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

import React, { useEffect, useState, lazy, useContext } from "react";
import * as Yup from "yup";
import { Box, Container, Grid, FormGroup } from "@mui/material";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import { FieldArray, Formik } from "formik";
import emitter from "../../../emitter";
import api from "../../../api/api";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import Icon from "../../common/Icon";
import { MessageContext } from "../../../contexts/MessageContext";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Label from "../../common/elements/Label";
import Header from "../../common/elements/Header";
import { useQueries } from "@tanstack/react-query";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

interface IAddProgramDrawer {
  toggleDrawer?: Function;
  // marked as optional, but this function is always provided by the DrawerModal component
}

const AddProgramDrawer: React.FC<IAddProgramDrawer> = ({
  toggleDrawer = () => {},
}) => {
  const intl = useIntl();
  const context = useContext(MessageContext);
  const { setErrorMsg } = context;
  const [initialValues] = useState({
    name: "",
    language: "",
    timeZone: "",
    location: "",
    exchange: "",
    homeCurrency: "",
    newCurrencies: [""],
    tPlusDay: "",
    tPlusHour: "",
    tPlusMinute: "",
    partner: "",
  });
  const [exchanges, setExchanges] = useState([]);
  const [partners, setPartners] = useState([]);
  const [countries, setCountries] = useState([]);
  const [locales, setLocales] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [partnerNames, setPartnerNames] = useState([]);
  const [bankMap, setBankMap] = useState(new Map());

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

  const createProgram = (dto: any) =>
    // @ts-ignore
    api.OperatingProgramSetupAPI.create(dto).catch((e: any) => setErrorMsg(e));

  const listExchanges = () =>
    // @ts-ignore
    api.PartnerAPI.listExchanges().catch((error: any) => setErrorMsg(error));

  const getPartners = async () =>
    // @ts-ignore
    api.PartnerAPI.listLinkedPartners().catch((error: any) =>
      setErrorMsg(error)
    );

  const getCurrencies = (bankName: string) =>
    // @ts-ignore
    api.BankAPI.getCurrencies(bankName).catch((error: any) =>
      setErrorMsg(error)
    );

  const generateNumberList = (size: number) =>
    Array(size)
      .fill(null)
      .map((i, index) => index);

  const buildFormValues = () => {
    const promises = [
      // 0
      listExchanges(),
      // 1
      getPartners(),
    ];

    Promise.all(promises).then((results) => {
      const exchangeList = results[0].map((p: any) => p.name);
      exchangeList.unshift("");
      setExchanges(exchangeList);

      const partnerNameList = results[1].map((p: any) => p.name);
      partnerNameList.unshift("");
      setPartnerNames(partnerNameList);
      const partnerList = results[1];
      setPartners(partnerList);

      const bankPromises: any = [];
      results[1].map((p: any) => bankPromises.push(getCurrencies(p.bankName)));
      Promise.all(bankPromises).then((ba) => {
        const map = new Map();
        // eslint-disable-next-line array-callback-return
        results[1].map((p: any, index: number) => {
          const curr: any = ba[index];
          curr.unshift("");
          map.set(p.bankName, curr);
        });
        setBankMap(map);
      });
    });
  };

  const getPartnerBankName = (partnerName: string) => {
    if (partners) {
      const find: any = partners.find((p: any) => p.name === partnerName);
      return find ? find.bankName : "";
    }
    return "";
  };

  useEffect(() => {
    buildFormValues();
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
      setLocales(list);

      const timeZoneList = getTimeZoneListQuery.data;
      timeZoneList.unshift("");
      setTimeZones(timeZoneList);
    }
  }, [
    getCountryListQuery.data,
    getLocalesQuery.data,
    getTimeZoneListQuery.data,
  ]);

  const addProgram = async (values: any) => {
    createProgram({
      partnerName: values.partner,
      createOperatingProgramDTO: {
        name: values.name,
        defaultHomeCurrency: values.homeCurrency,
        currencies:
          values.newCurrencies.length > 1 ? values.newCurrencies : null,
        language: values.language,
        country: values.location,
        timeZone: values.timeZone,
        tPlusDay: values.tPlusDay,
        tPlusHour: values.tPlusHour,
        tPlusMinute: values.tPlusMinute,
      },
      exchanges: values.exchange.length ? [values.exchange] : [],
    }).then(() => {
      emitter.emit("programs.changed", {});
      toggleDrawer();
    });
  };

  const ProgramSchema = Yup.object().shape({
    name: Yup.string().required(
      intl.formatMessage({
        id: "error.name.required",
        defaultMessage: "Name is a required field",
      })
    ),
    homeCurrency: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.homeCurrency.required",
          defaultMessage: "Home Currency is a required field",
        })
      ),
    newCurrencies: Yup.array()
      .of(Yup.string().min(3))
      .min(
        1,
        intl.formatMessage({
          id: "error.minCurrency.required",
          defaultMessage: "At least one currency is required",
        })
      ),
    partner: Yup.string().required(
      intl.formatMessage({
        id: "error.partner.required",
        defaultMessage: "Partner is a required field",
      })
    ),
    language: Yup.string().required(
      intl.formatMessage({
        id: "error.language.required",
        defaultMessage: "Language is a required field",
      })
    ),
    timeZone: Yup.string().required(
      intl.formatMessage({
        id: "error.timeZone.required",
        defaultMessage: "Time Zone is a required field",
      })
    ),
    location: Yup.string().required(
      intl.formatMessage({
        id: "error.location.required",
        defaultMessage: "Location is a required field",
      })
    ),
    exchange: Yup.string(),
    tPlusDay: Yup.number(),
    tPlusHour: Yup.number(),
    tPlusMinute: Yup.number(),
  });

  return (
    <Container sx={{ width: "397px" }}>
      <Header
        value={intl.formatMessage({
          id: "addProgram",
          description: "drawer header",
          defaultMessage: "Add Program",
        })}
        level={2}
        color="white"
        bold
        drawerTitle
      />
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={ProgramSchema}
          onSubmit={(values) => addProgram(values)}
          enableReinitialize
        >
          {(props: any) => (
            <form onSubmit={props.handleSubmit}>
              <FormGroup>
                <InputWithPlaceholder
                  name="name"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "name",
                    defaultMessage: "Name",
                  })}*`}
                  value={props.values.name}
                  {...props}
                />
                <DropdownFloating
                  name="language"
                  placeholder={`${intl.formatMessage({
                    id: "language",
                    defaultMessage: "Language",
                  })}*`}
                  list={locales}
                  valueKey="code"
                  value={props.values.language}
                  {...props}
                />
                <DropdownFloating
                  name="location"
                  placeholder={`${intl.formatMessage({
                    id: "location",
                    defaultMessage: "Location",
                  })}*`}
                  list={countries}
                  valueKey="code"
                  value={props.values.location}
                  {...props}
                />
                <DropdownFloating
                  name="timeZone"
                  placeholder={`${intl.formatMessage({
                    id: "timeZone",
                    defaultMessage: "Time Zone",
                  })}*`}
                  list={timeZones}
                  value={props.values.timeZone}
                  {...props}
                />
                <DropdownFloating
                  name="exchange"
                  placeholder={`${intl.formatMessage({
                    id: "exchange",
                    defaultMessage: "Exchange",
                  })}*`}
                  list={exchanges}
                  value={props.values.exchange}
                  {...props}
                />
                <DropdownFloating
                  name="partner"
                  placeholder={`${intl.formatMessage({
                    id: "partner",
                    defaultMessage: "Partner",
                  })}*`}
                  list={partnerNames}
                  value={props.values.partner}
                  {...props}
                />
                {props.values.partner && (
                  <DropdownFloating
                    name="homeCurrency"
                    placeholder={`${intl.formatMessage({
                      id: "homeCurrency",
                      defaultMessage: "Home Currency",
                    })}*`}
                    list={bankMap.get(getPartnerBankName(props.values.partner))}
                    value={props.values.homeCurrency}
                    {...props}
                  />
                )}
                {props.values.partner && props.values.exchange && (
                  <FormGroup>
                    <Label htmlFor="currencyGroup">
                      <FormattedMessage
                        id="additionalCurrencies"
                        description="Section Label"
                        defaultMessage="Additional Currencies"
                      />
                    </Label>
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
                                >
                                  <Grid item sx={{ pt: 1 }}>
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
                                    <DropdownFloating
                                      /* eslint-disable-next-line react/no-array-index-key */
                                      key={`dropdown.newCurrencies.${index}`}
                                      name={`newCurrencies.${index}`}
                                      placeholder={`${intl.formatMessage({
                                        id: "addNewCurrency",
                                        defaultMessage: "Add New Currency",
                                      })}*`}
                                      list={bankMap.get(
                                        getPartnerBankName(props.values.partner)
                                      )}
                                      value={props.values.newCurrencies[index]}
                                      {...props}
                                    />
                                  </Grid>
                                </Grid>
                              )
                            )}

                          <Grid container justifyContent="right" sx={{ mb: 6 }}>
                            <QDButton
                              onClick={() => push("")}
                              id="program-add-currency"
                              color="secondary"
                              variant="contained"
                              label={intl.formatMessage(
                                defineMessage({
                                  id: "inputLabel",
                                  defaultMessage: "ADD ADDITIONAL CURRENCY",
                                  description: "Input Label",
                                })
                              )}
                            />
                          </Grid>
                        </Box>
                      )}
                    />
                  </FormGroup>
                )}
                <FormGroup sx={{ mb: 3 }}>
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
                        <DropdownFloating
                          name="tPlusDay"
                          placeholder={`${intl.formatMessage({
                            id: "day",
                            defaultMessage: "Day",
                          })}`}
                          list={generateNumberList(31)}
                          value={props.values.tPlusDay}
                          {...props}
                        />
                      </Grid>
                      <Grid item flexGrow={1}>
                        <DropdownFloating
                          name="tPlusHour"
                          placeholder={`${intl.formatMessage({
                            id: "hour",
                            defaultMessage: "Hour",
                          })}`}
                          list={generateNumberList(24)}
                          value={props.values.tPlusHour}
                          {...props}
                        />
                      </Grid>
                      <Grid item flexGrow={1}>
                        <DropdownFloating
                          name="tPlusMinute"
                          placeholder={`${intl.formatMessage({
                            id: "minute",
                            defaultMessage: "Minute",
                          })}`}
                          list={generateNumberList(60)}
                          value={props.values.tPlusMinute}
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
                      id="program-cancel-changes"
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
                      id="program-save-changes"
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
            </form>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default AddProgramDrawer;
