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

import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { Box, Grid, Container, FormGroup } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik } from "formik";
import api from "../../../api/api";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import emitter from "../../../emitter";
import { MessageContext } from "../../../contexts/MessageContext";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import getDecimalFractionalPercentage from "../../common/converters/DecimalFractionalPercentageConverter";
import BankEvents from "../../../pages/banks/BankEvents";
import SubmitButton from "../../common/elements/SubmitButton";
import CancelButton from "../../common/elements/CancelButton";
import Header from "../../common/elements/Header";
import Label from "../../common/elements/Label";

interface IAddNewIndividualCurrencyMarginDrawer {
  toggleDrawer: any;
  exchange?: any;
  edit?: boolean;
  data?: any;
}

const AddNewIndividualCurrencyMarginDrawer: React.FC<
  IAddNewIndividualCurrencyMarginDrawer
> = ({ toggleDrawer, exchange, edit = false, data }) => {
  const { setErrorMsg } = useContext(MessageContext);
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [feePlanOptions, setFeePlanOptions] = useState(new Map());
  const [initialValues, setInitialValues] = useState({
    memo: "",
    program: "",
    currency: "",
    feePlan: "",
    newMargins: [{}],
    buyExchMargin: "0",
    sellExchMargin: "0",
  });
  const intl = useIntl();

  // Get List
  const getOperatingApiList = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingAPI.list().catch((error) => setErrorMsg(error));

  const getProgramExchanges = (programName: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingAPI.getExchanges(programName).catch((error) =>
      setErrorMsg(error)
    );

  const getProgramFeePlans = (programName: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingFeesAPI.getFeePlans(programName).catch((error) =>
      setErrorMsg(error)
    );
  // save changes
  // eslint-disable-next-line no-shadow
  const createChangeOrder = (programName: any, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingChangeOrderAPI.createChangeOrder(programName, dto).catch(
      (error: any) => setErrorMsg(error)
    );
  const createUpdateChangeOrder = (
    programName: any,
    changeOrderId: any,
    dto: any
  ) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingChangeOrderAPI.createUpdateExchangeMarginRequest(
      programName,
      changeOrderId,
      dto
    ).catch((error: any) => setErrorMsg(error));

  const getAllOperatingList = async () => {
    const programs = await getOperatingApiList();
    const filteredPrograms: any = [""];
    const feeMap = new Map();
    await programs.map(async (program: any) => {
      const exchangeList = await getProgramExchanges(program.name);
      const programFeePlan = await getProgramFeePlans([program.name]);
      // eslint-disable-next-line array-callback-return
      programFeePlan.map((plan: any) => {
        if (!feeMap.get(program.name)) {
          feeMap.set(program.name, [""]);
        }

        feeMap.get(program.name).push(plan.name);
      });
      setFeePlanOptions(feeMap);

      // eslint-disable-next-line array-callback-return
      await exchangeList.map((exchangeItem: any) => {
        if (exchangeItem.name === exchange.name) {
          filteredPrograms.push(program.name);
        }
      });
      setProgramOptions([...programOptions].concat(...filteredPrograms));
    });
  };

  useEffect(() => {
    setInitialValues({
      memo: "",
      program: edit ? data.operatingProgram : "",
      currency: edit ? data.currency : "",
      feePlan: edit ? data.feePlan : "",
      newMargins: edit
        ? [
            {
              buyExchMargin: data.buyExchMargin,
              sellExchMargin: data.sellExchMargin,
            },
          ]
        : [{}],
      buyExchMargin: edit ? data.buyExchMargin : "0",
      sellExchMargin: edit ? data.sellExchMargin : "0",
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSupportedCurrencies([...exchange.currencies]);
    getAllOperatingList().catch((error) => setErrorMsg(error));
  }, []);

  const updateCreateChangeOrder = async (createOrder: any, values: any) => {
    const { newMargins, currency, memo, feePlan } = values;

    const createUpdateChangeOrderDto = {
      action: "InsertOrUpdate",
      exchangeName: exchange && exchange.name ? exchange.name : "",
      sellExchMargin: getDecimalFractionalPercentage(
        newMargins[0].sellExchMargin
      ),
      buyExchMargin: getDecimalFractionalPercentage(
        newMargins[0].buyExchMargin
      ),
      sellCurrency: currency,
      memo,
      feePlan,
    };

    // eslint-disable-next-line max-len
    await createUpdateChangeOrder(
      createOrder.programName,
      createOrder.id,
      createUpdateChangeOrderDto
    ).then(() => {
      emitter.emit(BankEvents.CurrencyUpdated, {
        status: true,
        icon: "icons-success@2x.png",
        headline: "Success",
        body: "New change order for currency margin has been created successfully",
      });
      toggleDrawer();
    });
  };

  const addIndividualCurrencyMargin = async (values: any) => {
    const { memo, program } = values;
    const dto = {
      type: "ExchangeMargin",
      partnerProgramName: program,
      memo,
    };

    await createChangeOrder(program, dto).then((createOrder: any) => {
      updateCreateChangeOrder(createOrder, values);
    });
  };

  const ExchangeScheme = Yup.object().shape({
    program: Yup.string()
      .min(1)
      .required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Program is a required field",
          },
          {
            fieldName: intl.formatMessage({
              id: "program",
              defaultMessage: "Program",
            }),
          }
        )
      ),
    currency: Yup.string()
      .min(1)
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
      ),
    newMargins: Yup.array().of(
      Yup.object().shape({
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
                defaultMessage: "Sell Margin must a number between 0 and 100",
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
    memo: Yup.string()
      .required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Memo is a required field",
          },
          {
            fieldName: intl.formatMessage({
              id: "memo",
              defaultMessage: "Memo",
            }),
          }
        )
      )
      .max(
        300,
        intl.formatMessage({
          id: "error.field.lessThan300",
          defaultMessage: "Must be less than 300 characters",
        })
      ),
  });

  return (
    <Container sx={{ width: "350px" }}>
      <Formik
        initialValues={initialValues}
        validateOnChange={true}
        validateOnBlur={true}
        validationSchema={ExchangeScheme}
        onSubmit={(values) => addIndividualCurrencyMargin(values)}
        enableReinitialize
      >
        {(props) => (
          <form onSubmit={props.handleSubmit} noValidate>
            <Box>
              <Header
                value={
                  edit
                    ? intl.formatMessage({
                        id: "editIndividualCurrencyMargin",
                        description: "drawer header",
                        defaultMessage: "Edit Individual Currency Margin",
                      })
                    : intl.formatMessage({
                        id: "addIndividualCurrencyMargin",
                        description: "drawer header",
                        defaultMessage: "Add Individual Currency Margin",
                      })
                }
                level={2}
                color="white"
                bold
                drawerTitle
              />

              <FormGroup>
                <FormGroup>
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  @ts-ignore */}
                  <DropdownFloating
                    required
                    id="add-currency-program-dropdown"
                    name="program"
                    placeholder={
                      <FormattedMessage
                        id="chooseProgram"
                        description="Input Label"
                        defaultMessage="Choose Program"
                      />
                    }
                    list={programOptions}
                    value={props.values.program}
                    {...props}
                  />
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  @ts-ignore */}
                  <DropdownFloating
                    id="add-currency-feePlan-dropdown"
                    name="feePlan"
                    placeholder={
                      <FormattedMessage
                        id="chooseFeePlanOptional"
                        description="Input Label"
                        defaultMessage="Choose Fee Plan (Optional)"
                      />
                    }
                    /* eslint-disable-next-line max-len */
                    list={
                      feePlanOptions.get(props.values.program)
                        ? feePlanOptions.get(props.values.program)
                        : []
                    }
                    value={props.values.feePlan}
                    {...props}
                  />
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  @ts-ignore */}
                  <DropdownFloating
                    required
                    id="add-currency-currency-dropdown"
                    name="currency"
                    placeholder={
                      <FormattedMessage
                        id="currency"
                        description="Input Label"
                        defaultMessage="Currency"
                      />
                    }
                    list={supportedCurrencies}
                    value={props.values.currency}
                    {...props}
                  />
                </FormGroup>
                <FormGroup>
                  <Box>
                    {props.values.newMargins &&
                      props.values.newMargins.map((newMargin, index) => (
                        <Box key={`div.newMargin.${index}`}>
                          {props.errors.newMargins &&
                            props.errors.newMargins[index] && (
                              <Box sx={{ ml: 3.7 }}>
                                {
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  (props.errors.newMargins[index] as any)
                                    .buyExchMargin && (
                                    <Label variant="error">
                                      {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        (props.errors.newMargins[index] as any)
                                          .buyExchMargin
                                      }
                                    </Label>
                                  )
                                }

                                {
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  (props.errors.newMargins[index] as any)
                                    .sellExchMargin && (
                                    <Label variant="error">
                                      {
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        (props.errors.newMargins[index] as any)
                                          .sellExchMargin
                                      }
                                    </Label>
                                  )
                                }
                              </Box>
                            )}

                          <Grid
                            container
                            key={`div.newMargins.${index}.buyExchMargin`}
                            columnSpacing={2}
                            justifyContent="space-between"
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
                                    (props.values.newMargins[index] as any)
                                      .sellExchMargin
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

                    <FormGroup sx={{ mb: 3 }}>
                      <Grid>
                        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        @ts-ignore */}
                        <InputWithPlaceholder
                          required={true}
                          id="memo-message-input-field"
                          name="memo"
                          autoComplete="off"
                          type="text"
                          multiline
                          placeholder={intl.formatMessage({
                            id: "input.memo.placeholder",
                            defaultMessage: "Memo (300 characters max.)",
                          })}
                          {...props}
                        />
                      </Grid>
                    </FormGroup>
                  </Box>
                </FormGroup>

                <Grid container rowSpacing={2} justifyContent="center">
                  <Grid item xs={7} sx={{ mr: 1 }}>
                    <SubmitButton
                      id="exchanges-save-changes"
                      disabled={!props.dirty}
                    >
                      <FormattedMessage
                        id="saveChanges"
                        description="Save changes button"
                        defaultMessage="Save & Submit Change Order"
                      />
                    </SubmitButton>
                  </Grid>
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
                </Grid>
              </FormGroup>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default AddNewIndividualCurrencyMarginDrawer;
