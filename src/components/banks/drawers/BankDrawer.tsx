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
import { Box, Grid, Container, FormGroup } from "@mui/material";
import * as Yup from "yup";
import { FieldArray, Formik } from "formik";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import emitter from "../../../emitter";
import CurrencyRender from "../../common/converters/CurrencyRender";
import Icon from "../../common/Icon";
import TextRender from "../../common/TextRender";
import { MessageContext } from "../../../contexts/MessageContext";
import newid from "../../util/NewId";
import SubmitButton from "../../common/elements/SubmitButton";
import CancelButton from "../../common/elements/CancelButton";
import Pill from "../../common/elements/PillLabel";
import Header from "../../common/elements/Header";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

interface IBankDrawer {
  toggleDrawer?: any;
  bank?: any;
  edit?: boolean;
}

const BankDrawer: React.FC<IBankDrawer> = ({
  toggleDrawer = () => {
    /* function provided by drawercomp */
  },
  bank = {},
  edit = false,
}) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);

  const initialState = {
    edit,
    name: edit ? bank.name : "",
    complianceCurrency: edit ? bank.complianceCurrency : "",
    currencies: edit ? [...new Set(bank.currencies)] : [],
    newCurrencies: edit ? [] : [""],
    iins: edit ? [...bank.iins] : [],
    newIINs: [],
  };

  const [initialValues] = useState(initialState);
  const [currencyList, setCurrencyList] = useState([]);

  const getCurrencyList = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CommonAPI.getCurrencyList().catch((error: any) => setErrorMsg(error));

  const addCurrency = async (name: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.BankAPI.addBankAccount(name, dto).catch((error: any) =>
      setErrorMsg(error)
    );

  const addIIN = async (name: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.BankAPI.addIIN(name, dto).catch((error: any) => setErrorMsg(error));

  // not implemented on the backend
  // const removeIIN = async (name, dto) => api.BankAPI.removeIIN(name, dto)
  // .catch((error) => error);

  const createBank = async (dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.BankAPI.create(dto).catch((error: any) => setErrorMsg(error));

  const buildFormValues = () => {
    const promises = [getCurrencyList()];
    Promise.all(promises).then((results) => {
      const temp = results[0];
      if (temp) {
        temp.unshift(null);
        setCurrencyList(temp);
      }
    });
  };

  useEffect(() => {
    buildFormValues();
  }, []);

  const createOrUpdateBank = async (values: any) => {
    if (edit) {
      // this for loop is needed in order to avoid cache bug issues
      // eslint-disable-next-line no-restricted-syntax
      for (const newCurrency of values.newCurrencies) {
        // wait for each call to finish and then make another call to BankAPI
        // eslint-disable-next-line no-await-in-loop
        await addCurrency(bank.name, { currency: newCurrency });
      }

      await Promise.all(
        values.newIINs.map(async (newIIN: string) => {
          if (bank.iins.indexOf(newIIN) < 0) {
            // not in the original list, addIIN
            await addIIN(bank.name, { iin: newIIN });
          }
        })
      );

      emitter.emit("programs.changed", {});
      emitter.emit("programs.edit.changed", {});
    } else {
      await createBank({
        name: values.name,
        complianceCurrency: values.complianceCurrency,
        currencies: values.newCurrencies,
      }).then(() => {
        Promise.all(
          values.newIINs.map(async (newIIN: string) => {
            await addIIN(values.name, { iin: newIIN });
          })
        );
      });
    }

    emitter.emit("banks.page.update", {});
    toggleDrawer();
  };

  const PartnerUserSchema = Yup.object().shape({
    name: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.name.required",
          defaultMessage: "Name is a required field",
        })
      ),
    edit: Yup.bool(),
    complianceCurrency: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.complianceCurrency.required",
          defaultMessage: "Compliance Currency is a required field",
        })
      ).typeError(
        intl.formatMessage({
          id: "error.complianceCurrency.required",
          defaultMessage: "Compliance Currency is a required field",
      })),
    newCurrencies: Yup.array()
      .of(Yup.string())
      .when("edit", {
        is: false,
        then: Yup.array()
          .of(
            Yup.string()
              .min(3)
              .required(
                intl.formatMessage({
                  id: "error.currency.required",
                  defaultMessage: "Currency is required",
                })
              )
          )
          .min(
            1,
            intl.formatMessage({
              id: "error.minCurrency.required",
              defaultMessage: "At least one currency is required",
            })
          ),
        otherwise: Yup.array().of(Yup.string()),
      }),
    newIINs: Yup.array().of(
      Yup.string()
        .min(6)
        .required(
          intl.formatMessage({
            id: "error.IIN.min6Digits",
            defaultMessage: "IIN needs to contain 6 digits",
          })
        )
    ),
  });

  return (
    <Container sx={{ minWidth: "350px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={PartnerUserSchema}
        onSubmit={(values) => createOrUpdateBank(values)}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit} noValidate>
            <Box>
              <Header
                value={
                  edit
                    ? intl.formatMessage({
                        id: "editBank",
                        defaultMessage: "Edit Bank",
                      })
                    : intl.formatMessage({
                        id: "addNewBank",
                        defaultMessage: "Add New Bank",
                      })
                }
                level={2}
                color="white"
                bold
                drawerTitle
              />

              <FormGroup>
                <Box sx={{ mb: 2 }}>
                  <InputWithPlaceholder
                    name="name"
                    autoComplete="off"
                    type="text"
                    placeholder={`${intl.formatMessage({
                      id: "name",
                      defaultMessage: "Name",
                    })}*`}
                    value={props.values.name}
                    disabled={edit}
                    {...props}
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <DropdownFloating
                    required
                    name="complianceCurrency"
                    placeholder={`${intl.formatMessage({
                      id: "complianceCurrency",
                      defaultMessage: "Compliance Currency",
                    })}`}
                    list={currencyList}
                    value={props.values.complianceCurrency}
                    disabled={edit}
                    {...props}
                  />
                </Box>
                <FormGroup>
                  <TextRender
                    data={
                      <FormattedMessage
                        id="additionalCurrencies"
                        description="Section Label"
                        defaultMessage="Additional Currencies"
                      />
                    }
                    component="label"
                    truncated={false}
                  />
                  {bank.currencies
                    ? bank.currencies.map((currency: string) => (
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
                          {currency === bank.complianceCurrency ? (
                            <Pill
                              label={intl.formatMessage({
                                id: "button.home",
                                defaultMessage: "HOME",
                              })}
                              color="info"
                            />
                          ) : null}
                        </Box>
                      ))
                    : null}
                  <FieldArray
                    name="newCurrencies"
                    render={({ remove, push }) => (
                      <Box>
                        {props.values.newCurrencies.length > 0 &&
                          props.values.newCurrencies.map(
                            (newCurrency: any, index: number) => (
                              <Grid
                                container
                                // eslint-disable-next-line react/no-array-index-key
                                key={`div.newCurrency.${index}`}
                              >
                                <Grid item sx={{ pt: 1 }}>
                                  <QDButton
                                    key={`${newid("btn.newCurrencies.")}`}
                                    label=""
                                    type="button"
                                    onClick={() => remove(index)}
                                    id={`bank-delete-currency-${index}`}
                                    variant="icon"
                                  >
                                    <img
                                      key={`${newid("img.newCurrencies.")}`}
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
                                    list={currencyList}
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
                            id="search-button"
                            color="primary"
                            variant="contained"
                            label={intl.formatMessage(
                              defineMessage({
                                id: "button.addAdditionalCurrency",
                                defaultMessage: "ADD ADDITIONAL CURRENCY",
                              })
                            )}
                            size="small"
                          />
                        </Grid>
                      </Box>
                    )}
                  />
                </FormGroup>
                <FormGroup>
                  <TextRender
                    data={
                      <FormattedMessage
                        id="IINs"
                        description="Section Label"
                        defaultMessage="IINs"
                      />
                    }
                    component="label"
                  />
                  {bank.iins &&
                    bank.iins.map((iin: string, index: number) => (
                      <TextRender data={iin} key={`label.iins.${index}`} truncated={false} />
                    ))}
                  <FieldArray
                    name="newIINs"
                    render={({ remove, push }) => (
                      <Box>
                        {props.values.newIINs && props.values.newIINs.length > 0
                          ? props.values.newIINs.map(
                              (newIIN: any, index: number) => (
                                <Grid
                                  container
                                  /* eslint-disable-next-line react/no-array-index-key */
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
                                      id="bank-remove-iin"
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
                                  <Grid item sx={{ flexGrow: 1 }}>
                                    <InputWithPlaceholder
                                      type="text"
                                      /* eslint-disable-next-line react/no-array-index-key */
                                      key={`input.iins.${index}`}
                                      name={`newIINs.${index}`}
                                      autoComplete="off"
                                      placeholder={`${intl.formatMessage({
                                        id: "addNewIIN",
                                        defaultMessage: "Add New IIN",
                                      })}*`}
                                      value={props.values.newIINs[index]}
                                      index={index}
                                      altName="newIINs"
                                      {...props}
                                    />
                                  </Grid>
                                </Grid>
                              )
                            )
                          : null}
                        <Grid
                          container
                          justifyContent="right"
                          sx={{ mt: 2, mb: 6 }}
                        >
                          <QDButton
                            onClick={() => push("")}
                            id="bank-add-iin"
                            color="primary"
                            variant="contained"
                            size="small"
                            label={intl.formatMessage(
                              defineMessage({
                                id: "button.addAdditionalIIN",
                                defaultMessage: "ADD ADDITIONAL IIN",
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
                      id="bank-cancel-changes"
                      onClick={() => toggleDrawer()}
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
                      id="bank-save-changes"
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
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default BankDrawer;
