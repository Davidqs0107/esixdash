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
import Label from "../../common/elements/Label";
import Header from "../../common/elements/Header";

interface IAddPairCurrencyMarginDrawer {
  toggleDrawer: any;
  exchange?: any;
  edit?: boolean;
  data?: any;
}

const AddPairCurrencyMarginDrawer: React.FC<IAddPairCurrencyMarginDrawer> = ({
  toggleDrawer,
  exchange = {},
  edit = false,
  data,
}) => {
  const { setErrorMsg } = useContext(MessageContext);
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [feePlanOptions, setFeePlanOptions] = useState(new Map());
  const [initialValues, setInitialValues] = useState({
    memo: "",
    buyCurrency: "",
    feePlan: "",
    newMargins: [{}],
    program: "",
    sellCurrency: "",
  });
  const intl = useIntl();

  // Get List
  const getOperatingApiList = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingAPI.list().catch((error) => setErrorMsg(error));
  // eslint-disable-next-line no-shadow
  const getProgramExchanges = (programName: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingAPI.getExchanges(programName).catch((error) =>
      setErrorMsg(error)
    );
  // eslint-disable-next-line no-shadow
  const getProgramFeePlans = (programName: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingFeesAPI.getFeePlans(programName).catch((error) =>
      setErrorMsg(error)
    );
  // Save changes
  // eslint-disable-next-line no-shadow
  const createChangeOrder = (programName: any, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingChangeOrderAPI.createChangeOrder(programName, dto).catch(
      (error: any) => setErrorMsg(error)
    );
  // eslint-disable-next-line no-shadow,max-len
  const createUpdateExchangeMarginRequest = (
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
      exchangeList.map((exchangeItem: any) => {
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
      buyCurrency: edit ? data.buyCurrency : "",
      feePlan: edit ? data.feePlan : "",
      newMargins: edit
        ? [
            {
              buyExchMargin: data.buyExchMargin,
              sellExchMargin: data.sellExchMargin,
            },
          ]
        : [{}],
      program: edit ? data.operatingProgram : "",
      sellCurrency: edit ? data.sellCurrency : "",
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setSupportedCurrencies([...exchange.currencies]);
    getAllOperatingList().catch((error) => setErrorMsg(error));
  }, []);

  const updateCreateChangeOrder = async (createOrder: any, values: any) => {
    const { newMargins, sellCurrency, buyCurrency, memo, feePlan } = values;

    const createUpdateExchangeMarginRequestDto = {
      action: "InsertOrUpdate",
      buyCurrency,
      exchangeName: exchange.name,
      feePlan,
      memo,
      sellExchMargin: getDecimalFractionalPercentage(
        newMargins[0].sellExchMargin
      ),
      sellCurrency,
    };

    // eslint-disable-next-line max-len
    await createUpdateExchangeMarginRequest(
      createOrder.programName,
      createOrder.id,
      createUpdateExchangeMarginRequestDto
    ).then(() => {
      // eslint-disable-next-line max-len,no-unused-expressions
      emitter.emit(BankEvents.DrawerUpdated, {
        status: true,
        icon: "icons-success@2x.png",
        headline: "Success",
        body: "New change order for individual currency margin has been created successfully",
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
    buyCurrency: Yup.string()
      .min(1)
      .required(
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
    sellCurrency: Yup.string()
      .min(1)
      .required(
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
                        id: "editCurrencyMarginPair",
                        description: "drawer header",
                        defaultMessage: "Edit Currency Margin Pair",
                      })
                    : intl.formatMessage({
                        id: "addCurrencyMarginPair",
                        description: "drawer header",
                        defaultMessage: "Add New Currency Margin Pair",
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
                    id="pair-currency-program-dropdown"
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
                    id="pair-currency-feePlan-dropdown"
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
                    id="pair-buyCurrency-dropdown"
                    name="buyCurrency"
                    placeholder={
                      <FormattedMessage
                        id="buyCurrency"
                        description="Input Label"
                        defaultMessage="Buy Currency"
                      />
                    }
                    list={supportedCurrencies}
                    value={props.values.buyCurrency}
                    {...props}
                  />
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  @ts-ignore */}
                  <DropdownFloating
                    required
                    id="pair-sellCurrency-dropdown"
                    name="sellCurrency"
                    placeholder={
                      <FormattedMessage
                        id="sellCurrency"
                        description="Input Label"
                        defaultMessage="Sell Currency"
                      />
                    }
                    list={supportedCurrencies}
                    value={props.values.sellCurrency}
                    {...props}
                  />
                </FormGroup>
                <FormGroup>
                  <div>
                    {props.values.newMargins &&
                      props.values.newMargins.map((newMargin, index) => (
                        <div>
                          <Box>
                            <Grid>
                              {props.errors.newMargins &&
                                props.errors.newMargins[index] && (
                                  <Box>
                                    <Label variant="error" noMargin>
                                      {
                                        // @ts-ignore
                                        (props.errors.newMargins[index] as any)
                                          .sellExchMargin
                                      }
                                    </Label>
                                  </Box>
                                )}
                              <Box sx={{ display: "flex", width: "135px" }}>
                                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                @ts-ignore */}
                                <InputWithPlaceholder
                                  id="pair-sellExchMargin-input"
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
                                    // @ts-ignore
                                    (props.values.newMargins[index] as any)
                                      .sellExchMargin
                                  }
                                  {...props}
                                />
                                <Box sx={{ pt: 1, color: "white", ml: 1 }}>
                                  <Label htmlFor="sellMargin">%</Label>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid sx={{ mb: 3 }}>
                              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              @ts-ignore */}
                              <InputWithPlaceholder
                                required
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
                          </Box>
                        </div>
                      ))}
                  </div>
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

export default AddPairCurrencyMarginDrawer;
