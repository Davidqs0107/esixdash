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

import React, { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import { FormattedMessage, useIntl } from "react-intl";
import moment from "moment";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import { CustomerDetailContext } from "../../../contexts/CustomerDetailContext";
import { PartnerUserContext } from "../../../contexts/PartnerUserContext";
import api from "../../../api/api";
import emitter from "../../../emitter";
import RadioButton from "../../common/forms/buttons/RadioButton";
import DatePicker from "../../common/forms/inputs/DatePicker";
import RadioButtonGroup from "../../common/forms/buttons/RadioButtonGroup";
import RiskStatusEvents from "../pagenavs/RiskStatusEvents";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import { MessageContext } from "../../../contexts/MessageContext";
import Header from "../../common/elements/Header";

interface ICreateChangeOrderChargeoff {
  toggleDrawer?: () => boolean;
}

// @ts-ignore
const CreateChangeOrderChargeoff: React.FC<ICreateChangeOrderChargeoff> = ({
  toggleDrawer = () => Yup.boolean,
}) => {
  const intl = useIntl();
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);

  const { primaryPerson, customerNumber, programName } = useContext(
    CustomerDetailContext
  );
  const { userName, partnerName } = useContext(PartnerUserContext);
  const [currencyList, setCurrencyList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    memo: "",
    activateOn: "",
    adjustmentMemo: "",
    amount: "",
    currency: "",
    activationDate: moment().format("YYYY-MM-DD"),
  });

  const cancel = () => {
    toggleDrawer();
  };

  const getCurrencyList = async () => {
    // @ts-ignore
    const wallets = await api.CustomerAPI.getWallets(customerNumber).catch(
      (error: { string: string }) => {
        toggleDrawer();
        setErrorMsg(error);
      }
    );

    if (wallets) {
      const currencies = wallets.map(
        (wallet: { currency: any }) => wallet.currency
      );
      setCurrencyList(currencies);
      // Also set the initial value to the first currency,
      //  otherwise you have to switch away and back to the first item to use it.
      const withCurrency = initialValues;
      // eslint-disable-next-line prefer-destructuring
      withCurrency.currency = currencies[0];
      setInitialValues(withCurrency);
    }
  };

  const createChangeOrder = async (values: {
    memo: any;
    activateOn: any;
    adjustmentMemo: any;
    amount: any;
    currency: any;
    activationDate: any;
  }) => {
    const dto = {
      type: "CustomerAdjustment",
      partnerProgramName: programName,
      activationDateAndTime:
        values.activateOn === "approval"
          ? null
          : `${values.activationDate}T06:00`,
      memo: values.memo,
      partnerName,
    };

    // @ts-ignore
    api.CustomerChangeOrderAPI.createChangeOrder(customerNumber, dto)
      .catch((error: any) => setErrorMsg(error))
      .then((orderResult: { id: any }) => {
        const adjustDTO = {
          partnerUserId: userName,
          memo: values.adjustmentMemo,
          currency: values.currency,
          amount: values.amount,
          action: "InsertOrUpdate",
          type: "chargeoff",
        };
        // @ts-ignore
        api.CustomerChangeOrderAPI.createUpdateChargeoffRequest(
          customerNumber,
          orderResult.id,
          adjustDTO
        )
          .catch((error: any) => setErrorMsg(error))
          .then(() => {
            emitter.emit(RiskStatusEvents.AdjustmentsChanged, {});
            emitter.emit("customer.details.changed", {});
            toggleDrawer();
            setSuccessMsg({
              responseCode: "200000",
              message: intl.formatMessage({
                id: "chargeoffChangeOrder.success.created",
                description: "Details",
                defaultMessage: `Chargeoff Change Order has been Created Successfully`,
              }),
            });
          });
      });
  };

  useEffect(() => {
    getCurrencyList().catch((error) => setErrorMsg(error));
  }, []);

  const AddBlockSchema = Yup.object().shape({
    amount: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.amount.required",
          defaultMessage: "Amount is a required field.",
        })
      )
      .test(
        "currencyFormat",
        intl.formatMessage({
          id: "error.number.15integers5decimals.format",
          defaultMessage:
            "Value should have no more than 15 integers and 5 decimals",
        }),
        (value) =>
          value == undefined || /^(?:\d{1,15}\.\d{0,5})$|^\d{1,15}$/.test(value)
      ),
    currency: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.currency.required",
          defaultMessage: "Currency is a required field.",
        })
      ),
    memo: Yup.string()
      .max(
        255,
        intl.formatMessage({
          id: "error.memo.max255Chars",
          defaultMessage: "Memo must be 255 characters or less.",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.memo.required",
          defaultMessage: "Memo is a required field.",
        })
      ),
    adjustmentMemo: Yup.string()
      .max(
        255,
        intl.formatMessage({
          id: "error.memo.max255Chars",
          defaultMessage: "Memo must be 255 characters or less.",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.memo.required",
          defaultMessage: "Memo is a required field.",
        })
      ),
    activateOn: Yup.string().required(
      intl.formatMessage({
        id: "chargeOff.error.activateOn.required",
        defaultMessage: "A radio option is required",
      })
    ),
    activationDate: Yup.string().when("activateOn", {
      is: "schedule",
      then: Yup.string()
        .min(1)
        .required(
          intl.formatMessage({
            id: "error.cardLast4.required",
            defaultMessage: "Card last 4 is a required field.",
          })
        ),
      otherwise: Yup.string(),
    }),
  });

  // @ts-ignore
  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          bold
          color="white"
          value={intl.formatMessage({
            id: "createNewChangeOrder",
            description: "drawer header",
            defaultMessage: "Create New Change Order",
          })}
        />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={AddBlockSchema}
          onSubmit={(values) => createChangeOrder(values)}
          enableReinitialize
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Box sx={{ marginBottom: "60px" }}>
                <InputWithPlaceholder
                  required={false}
                  id=""
                  name="memo"
                  autoComplete="off"
                  type="text"
                  placeholder={
                    <FormattedMessage
                      id="memo.input.max255Chars.placeholder"
                      description="Drawer form placeholder text"
                      defaultMessage="Memo (255 characters max.)"
                    />
                  }
                  // as="textarea"
                  className="memo-input"
                  multiline
                  {...props}
                />
                <Box sx={{ marginBottom: "12px" }}>
                  <Typography
                    sx={{ marginBottom: "2px !important", fontSize: "12px" }}
                  >
                    <FormattedMessage
                      id="chargeOff.activateOn.input.placeholder"
                      description="Drawer form placeholder text"
                      defaultMessage="Activate on:"
                    />
                  </Typography>
                  <RadioButtonGroup
                    id="radioGroup"
                    value={props.values.activateOn}
                    error={props.errors.activateOn}
                    touched={props.touched.activateOn}
                  >
                    <Box>
                      <Field
                        name="activateOn"
                        as={RadioButton}
                        label={
                          <FormattedMessage
                            id="approval"
                            description="Drawer form placeholder text"
                            defaultMessage="Approval"
                          />
                        }
                        id="approval"
                        value="approval"
                        {...props}
                      />
                    </Box>
                    <Box>
                      <Field
                        name="activateOn"
                        as={RadioButton}
                        label={
                          <FormattedMessage
                            id="schedule"
                            description="Drawer form placeholder text"
                            defaultMessage="Schedule"
                          />
                        }
                        id="schedule"
                        value="schedule"
                        {...props}
                      />
                    </Box>
                  </RadioButtonGroup>
                </Box>

                {props.values.activateOn === "schedule" ? (
                  <Box>
                    <Field
                      name="activationDate"
                      label={`${intl.formatMessage({
                        id: "chooseDate",
                        defaultMessage: "Choose date",
                      })}*`}
                      value={props.values.activationDate}
                      maxDate="4100-01-01"
                      component={DatePicker}
                      minDate={moment().add(1, "d").format("YYYY-MM-DD")}
                      {...props}
                    />
                  </Box>
                ) : (
                  ""
                )}
                <Typography sx={{ fontSize: "12px" }}>
                  <FormattedMessage
                    id="addNewChargeoff"
                    description="Drawer form placeholder text"
                    defaultMessage="Add New Chargeoff"
                  />
                </Typography>
                <Box>
                  {currencyList.length > 0 ? (
                    <DropdownFloating
                      id="drawer.createchangeorder.currency"
                      isActive={false}
                      disabled={false}
                      validationMessage={undefined}
                      initialval={undefined}
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
                  <InputWithPlaceholder
                    required={false}
                    id="drawer.createchangeorder.amount"
                    name="amount"
                    autoComplete="off"
                    className="login-input"
                    type="text"
                    placeholder={`${intl.formatMessage({
                      id: "amount",
                      defaultMessage: "Amount",
                    })}*`}
                    {...props}
                  />
                  <InputWithPlaceholder
                    required={true}
                    id="drawer.createchangeorder.memo"
                    name="adjustmentMemo"
                    autoComplete="off"
                    type="text"
                    placeholder={
                      <FormattedMessage
                        id="memo.input.max255Chars.placeholder"
                        description="Drawer form placeholder text"
                        defaultMessage="Memo (255 characters max.)"
                      />
                    }
                    className="memo-input"
                    as="textarea"
                    multiline
                    {...props}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="drawer-addblock-button-cancel"
                  onClick={() => cancel()}
                  style={{ marginRight: "14px" }}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <SubmitButton
                  id="save-changeorder-button"
                  disabled={!props.dirty}
                >
                  <FormattedMessage
                    id="saveChanges"
                    description="Save changes button"
                    defaultMessage="Save Changes"
                  />
                </SubmitButton>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default CreateChangeOrderChargeoff;
