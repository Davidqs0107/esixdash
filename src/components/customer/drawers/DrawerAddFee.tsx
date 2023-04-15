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
 *
 */

import { FormattedMessage, useIntl } from "react-intl";
import { Field, Formik } from "formik";
import Box from "@mui/material/Box";
import * as Yup from "yup";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/api";
import { CustomerDetailContext } from "../../../contexts/CustomerDetailContext";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import Header from "../../common/elements/Header";

import {
  FormatTxSource,
  FormatTxType,
} from "../../common/converters/FormatTxSource";
import emitter from "../../../emitter";
import { CustomerWalletsEvents } from "../pagenavs/PageNavWallets";
import getDecimalFractionalPercentage from "../../common/converters/DecimalFractionalPercentageConverter";
import getPercentage from "../../common/converters/PercentageConverter";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import QDCheckbox from "../../common/forms/inputs/QDCheckbox";

type Fee = {
  id: string;
  transactionSourceCode: number;
  transactionTypeCode: number;
  currency: string;
  fixFee: string;
  percentage: number;
  chargeReceiver: boolean;
  receiverFixFee: string;
  receiverPercentage: number;
  calculationMethod: any;
};

interface IDrawerAddFee {
  editFee?: Fee;
  toggleDrawer?: any; // toggle drawer is always provided by <DrawerComp
}

const DrawerAddFee: React.FC<IDrawerAddFee> = ({
  editFee,
  toggleDrawer = () => {
    /* do nothing */
  },
}) => {
  const intl = useIntl();
  const { customerNumber } = useContext(CustomerDetailContext);
  const [selectFees, setSelectFees] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const [calculationMethodList, setCalculationMethodList] = useState<string[]>(
    []
  );
  const [initialValues, setInitialValues] = useState({
    currency: "",
    selectFee: "",
    fixedFeeAmount: "",
    feePercentage: "",
    chargeReceiver: false,
    receiverFixedAmount: "",
    receiverPercentage: "",
    calculationMethod: "",
  });

  const { data: operatingProgramFeeEntriesData } = useQuery({
    queryKey: ["getOperatingProgramFeeEntries"],
    queryFn: () =>
      // @ts-ignore
      api.OperatingFeesAPI.getOperatingProgramFeeEntries(),
  });

  const AddFeeSchema = Yup.object().shape({
    fixedFeeAmount: Yup.string().when("calculationMethod !== 'Percentage'", {
      is: true,
      then: Yup.string()
        .test(
          "feeAmountFormat",
          intl.formatMessage({
            id: "error.number.15integers5decimals.format",
            defaultMessage:
              "Value should have no more than 15 integers and 5 decimals",
          }),
          (value) =>
            value == undefined ||
            /^(?:\d{1,15}\.\d{0,5})$|^\d{1,15}$/.test(value)
        )
        .test(
          "oneOfRequired",
          intl.formatMessage({
            id: "error.feeAmountOrFeePercentage.mustBeEntered",
            defaultMessage: "Fixed amount or Fee percentage(%) must be entered",
          }),
          function (value) {
            return (
              (value != undefined && parseFloat(value) > 0) ||
              this.parent.feePercentage
            );
          }
        ),
      otherwise: Yup.string(),
    }),
    feePercentage: Yup.string().when("calculationMethod !== 'Flat Amount'", {
      is: true,
      then: Yup.string()
        .test(
          "percentageFormat",
          intl.formatMessage({
            id: "error.number.7integers3decimals.format",
            defaultMessage:
              "Value should have no more than 7 integers and 3 decimals",
          }),
          (value) =>
            value == undefined || /^(?:\d{1,7}\.\d{0,3})$|^\d{1,7}$/.test(value)
        )
        .test(
          "oneOfRequired",
          intl.formatMessage({
            id: "error.feeAmountOrFeePercentage.mustBeEntered",
            defaultMessage: "Fixed amount or Fee percentage(%) must be entered",
          }),
          function (value) {
            return (
              (value != undefined && parseFloat(value) > 0) ||
              this.parent.feePercentage
            );
          }
        ),
      otherwise: Yup.string(),
    }),
    chargeReceiver: Yup.bool(),
    receiverFixedAmount: Yup.string().when(
      "chargeReceiver && calculationMethod !== 'Percentage'",
      {
        is: true,
        then: Yup.string()
          .test(
            "feeAmountFormat",
            intl.formatMessage({
              id: "error.currency.15integers5decimals.format",
              defaultMessage:
                "Value should have no more than 15 integers and 5 decimals",
            }),
            (value) =>
              value == undefined ||
              /^(?:\d{1,15}\.\d{0,5})$|^\d{1,15}$/.test(value)
          )
          .test(
            "oneOfReceiverRequired",
            intl.formatMessage({
              id: "error.feeAmountOrFeePercentage.mustBeEntered",
              defaultMessage:
                "Fixed amount or Fee percentage(%) must be entered",
            }),
            function (value) {
              return (
                (value != undefined && parseFloat(value) > 0) ||
                this.parent.receiverPercentage
              );
            }
          ),
        otherwise: Yup.string(),
      }
    ),
    receiverPercentage: Yup.string().when(
      "chargeReceiver  && calculationMethod !== 'Flat Amount'",
      {
        is: true,
        then: Yup.string()
          .test(
            "percentageFormat",
            intl.formatMessage({
              id: "error.number.7integers3decimals.format",
              defaultMessage:
                "Value should have no more than 7 integers and 3 decimals",
            }),
            (value) =>
              value == undefined ||
              /^(?:\d{1,7}\.\d{0,3})$|^\d{1,7}$/.test(value)
          )
          .test(
            "oneOfReceiverRequired",
            intl.formatMessage({
              id: "error.feeAmountOrFeePercentage.mustBeEntered",
              defaultMessage:
                "Fixed amount or Fee percentage(%) must be entered",
            }),
            function (value) {
              return (
                (value != undefined && parseFloat(value) > 0) ||
                this.parent.receiverFixedAmount
              );
            }
          ),
        otherwise: Yup.string(),
      }
    ),
  });

  const getCurrencyList = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.getWallets(customerNumber).then((wallets: any) => {
      const currencies = wallets.map((wallet: any) => wallet.currency);
      setCurrencyList(currencies);
      // Also set the initial value to the first currency,
      //  otherwise you have to switch away and back to the first item to use it.
      if (editFee === undefined) {
        const withCurrency = initialValues;
        setInitialValues({ ...withCurrency, currency: currencies[0] });
      }
    });
  };

  const addOrEditFee = (values: any) => {
    const {
      currency,
      selectFee,
      fixedFeeAmount,
      feePercentage,
      chargeReceiver,
      calculationMethod,
    } = values;
    let { receiverFixedAmount, receiverPercentage } = values;
    const [transactionSourceCode, transactionTypeCode] = selectFee.split(",");
    if (!chargeReceiver) {
      receiverFixedAmount = 0;
      receiverPercentage = 0;
    }

    const feeDTO: any = {
      chargeReceiver,
      currency,
      fixFee: fixedFeeAmount === "" ? 0 : fixedFeeAmount,
      percentage: getDecimalFractionalPercentage(feePercentage, 5),
      receiverFixFee: receiverFixedAmount === "" ? 0 : receiverFixedAmount,
      receiverPercentage: getDecimalFractionalPercentage(receiverPercentage, 5),
      transactionSourceCode,
      transactionTypeCode,
      calculationMethod,
    };

    if (editFee !== undefined) {
      feeDTO.id = editFee.id;
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.createOrUpdateFee(customerNumber, feeDTO).then(() => {
      emitter.emit(CustomerWalletsEvents.CustomerWalletsChanged, {});
      toggleDrawer();
    });
  };

  const removeFee = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.deleteFee(customerNumber, editFee.id).then(() => {
      emitter.emit(CustomerWalletsEvents.CustomerWalletsChanged, {});
      toggleDrawer();
    });
  };

  const getCalculationMethod = (
    value: number,
    fixedFeeAmount: any,
    feePercentage: any
  ) => {
    let calculationMethod = "";

    switch (value) {
      case 0:
        if (fixedFeeAmount !== 0 && feePercentage !== 0) {
          calculationMethod = "Flat + Percentage";
        } else if (fixedFeeAmount !== 0) {
          calculationMethod = "Flat Amount";
        } else {
          calculationMethod = "Percentage";
        }
        break;
      case 1:
        calculationMethod = "Greater Of";
        break;
      case 2:
        calculationMethod = "Lesser Of";
        break;
      default:
        calculationMethod = "Flat + Percentage";
        break;
    }
    return calculationMethod;
  };

  const parseCalculationMethod = (values: any) => {
    if (values.calculationMethod === "Percentage") {
      values.fixedFeeAmount = 0;
      values.receiverFixedAmount = 0;
    }

    if (values.calculationMethod === "Flat Amount") {
      values.feePercentage = 0;
      values.receiverPercentage = 0;
    }

    let parsedCalculationMethod = 0;
    switch (values.calculationMethod) {
      case "Flat + Percentage":
        parsedCalculationMethod = 0;
        break;
      case "Greater Of":
        parsedCalculationMethod = 1;
        break;
      case "Lesser Of":
        parsedCalculationMethod = 2;
        break;
      default:
        parsedCalculationMethod = 0;
        break;
    }
    values.calculationMethod = parsedCalculationMethod;
    return values;
  };

  const parseOperatingProgramFeeEntriesData = (data: any) => {
    const dropDownFees = data.map((fee: any) => ({
      feeType: `${fee.transactionSourceCode},${fee.transactionTypeCode}`,
      text: `${FormatTxSource(
        fee.transactionSourceCode,
        intl
      )} - ${FormatTxType(fee.transactionTypeCode, intl)}`,
    }));
    setSelectFees(dropDownFees);
    // Also set the initial value to the first select fees,
    //  otherwise you have to switch away and back to the first item to use it.
    if (editFee === undefined) {
      const withFees = initialValues;
      withFees.selectFee = dropDownFees[0].feeType;
      setInitialValues(withFees);
    }
  };

  useEffect(() => {
    if (editFee !== undefined) {
      setInitialValues({
        currency: editFee.currency,
        selectFee: `${editFee.transactionSourceCode},${editFee.transactionTypeCode}`,
        fixedFeeAmount: editFee.fixFee,
        feePercentage: getPercentage(editFee.percentage, 5),
        chargeReceiver: editFee.chargeReceiver,
        receiverFixedAmount: editFee.receiverFixFee,
        receiverPercentage: getPercentage(editFee.receiverPercentage, 5),
        calculationMethod: getCalculationMethod(
          editFee.calculationMethod,
          editFee.fixFee,
          editFee.percentage
        ),
      });
    }
    getCurrencyList();
    setCalculationMethodList([
      "Flat Amount",
      "Percentage",
      "Flat + Percentage",
      "Greater Of",
      "Lesser Of",
    ]);
  }, []);

  useEffect(() => {
    if (operatingProgramFeeEntriesData) {
      parseOperatingProgramFeeEntriesData(operatingProgramFeeEntriesData);
    }
  }, [operatingProgramFeeEntriesData]);

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          bold
          color="white"
          value={
            editFee === undefined
              ? intl.formatMessage({
                  id: "addFee",
                  description: "drawer header add",
                  defaultMessage: "Add Fee",
                })
              : intl.formatMessage({
                  id: "editFee",
                  description: "drawer header add",
                  defaultMessage: "Edit Fee",
                })
          }
        />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={AddFeeSchema}
          onSubmit={(values) => addOrEditFee(parseCalculationMethod(values))}
          enableReinitialize
        >
          {(props: any) => (
            <form id="new-fee-form" onSubmit={props.handleSubmit}>
              <Box sx={{ marginBottom: "60px" }}>
                <Box>
                  <DropdownFloating
                    id="add-fee-select-fee-dropdown"
                    placeholder={`${intl.formatMessage({
                      id: "chooseParameter",
                      description: "Input Label",
                      defaultMessage: "Choose Parameter",
                    })}*`}
                    name="selectFee"
                    list={selectFees}
                    valueKey="feeType"
                    value={props.values.selectFee}
                    {...props}
                  />
                  {currencyList.length > 0 ? (
                    <DropdownFloating
                      id="add-fee-currency-dropdown"
                      name="currency"
                      placeholder={`${intl.formatMessage({
                        id: "currency",
                        defaultMessage: "Currency",
                      })}*`}
                      list={currencyList}
                      value={props.values.currency}
                      {...props}
                    />
                  ) : null}
                  <DropdownFloating
                    id="add-fee-calculation-method-dropdown"
                    name="calculationMethod"
                    placeholder={
                      <FormattedMessage
                        id="drawer.fee.calculationMethod"
                        description="Drawer form fee calculationMethod"
                        defaultMessage="Calculation Method*"
                      />
                    }
                    list={calculationMethodList}
                    value={props.values.calculationMethod}
                    {...props}
                  />
                  {props.values.calculationMethod !== "Percentage" && (
                    <InputWithPlaceholder
                      id="add-fee-fixed-amount-input"
                      name="fixedFeeAmount"
                      autoComplete="off"
                      type="text"
                      placeholder={
                        <FormattedMessage
                          id="drawer.addfee.fixedAmount"
                          description="Fee Drawer fixed amount"
                          defaultMessage="Fixed Amount*"
                        />
                      }
                      {...props}
                    />
                  )}

                  {props.values.calculationMethod !== "Flat Amount" && (
                    <InputWithPlaceholder
                      id="add-fee-percentage-input"
                      name="feePercentage"
                      autoComplete="off"
                      type="text"
                      placeholder={
                        <FormattedMessage
                          id="drawer.addfee.percentage"
                          description="Fee Drawer fee percentage"
                          defaultMessage="Fee Percentage*"
                        />
                      }
                      {...props}
                    />
                  )}
                </Box>
                <Box>
                  <Field
                    name="chargeReceiver"
                    as={QDCheckbox}
                    value={props.values.chargeReceiver}
                    data={{
                      label: intl.formatMessage({
                        id: "chargeReceiver",
                        defaultMessage: "Charge Receiver",
                      }),
                      id: "add-fee-charge-receiver",
                      key: "add-fee-charge-receiver",
                      checkbox: {
                        color: "secondary",
                        size: "small",
                        checked: props.values.chargeReceiver,
                      },
                    }}
                    {...props}
                  />
                  {!props.values.chargeReceiver ||
                    (props.values.calculationMethod !== "Percentage" && (
                      <InputWithPlaceholder
                        id="add-fee-receiver-fixed-amount-input"
                        name="receiverFixedAmount"
                        autoComplete="off"
                        type="text"
                        placeholder={
                          <FormattedMessage
                            id="drawer.addfee.receiver.fixedamount"
                            description="Fee Drawer fixed amount"
                            defaultMessage="Receiver Fixed Amount*"
                          />
                        }
                        {...props}
                      />
                    ))}
                  {!props.values.chargeReceiver ||
                    (props.values.calculationMethod !== "Flat Amount" && (
                      <InputWithPlaceholder
                        id="add-fee-receiver-percentage-input"
                        name="receiverPercentage"
                        autoComplete="off"
                        type="text"
                        placeholder={
                          <FormattedMessage
                            id="drawer.addfee.receiver.percentage"
                            description="Fee Drawer fixed amount"
                            defaultMessage="Receiver Percentage*"
                          />
                        }
                        {...props}
                      />
                    ))}

                  {editFee !== undefined ? (
                    <Box>
                      <SubmitButton
                        id="drawer-add-fee-remove-button"
                        color="primary"
                        //variant="contained"
                        //textCase="provided"
                        size="small"
                        onClick={() => removeFee()}
                      >
                        <FormattedMessage
                          id="remove"
                          description="remove button"
                          defaultMessage="Remove"
                        />
                      </SubmitButton>
                    </Box>
                  ) : (
                    <></>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="drawer-add-fee-button-cancel"
                  onClick={() => toggleDrawer()}
                  style={{ marginRight: "14px" }}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <SubmitButton
                  id="drawer-add-fee-button-save-changes"
                  disabled={!props.dirty}
                >
                  {editFee !== undefined ? (
                    <FormattedMessage
                      id="editFee"
                      description="Edit fee button"
                      defaultMessage="Edit Fee"
                    />
                  ) : (
                    <FormattedMessage
                      id="addFee"
                      description="Add fee button"
                      defaultMessage="Add Fee"
                    />
                  )}
                </SubmitButton>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default DrawerAddFee;
