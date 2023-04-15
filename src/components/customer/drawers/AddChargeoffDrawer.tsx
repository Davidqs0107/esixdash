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
 */

import Box from "@mui/material/Box";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik } from "formik";
import React, { useState, useEffect, useContext, FC } from "react";
import * as Yup from "yup";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import { CustomerDetailContext } from "../../../contexts/CustomerDetailContext";
import { PartnerUserContext } from "../../../contexts/PartnerUserContext";
import emitter from "../../../emitter";
import RiskStatusEvents from "../pagenavs/RiskStatusEvents";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Header from "../../common/elements/Header";

interface IAddChargeoff {
  toggleDrawer?: () => void;
}

const AddChargeoff: FC<IAddChargeoff> = (props) => {
  const intl = useIntl();
  const { customerNumber } = useContext(CustomerDetailContext);
  const [changeOrders, setChangeOrders] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const { userName } = useContext(PartnerUserContext);
  const { toggleDrawer } = props;
  const [initialValues, setInitialValues] = useState({
    changeOrder: "",
    amount: "",
    currency: "",
    memo: "",
  });

  const cancel = () => {
    if (toggleDrawer) toggleDrawer();
  };

  const getCurrencyList = () => {
    // @ts-ignore
    api.CustomerAPI.getWallets(customerNumber).then((wallets) => {
      const currencies = wallets.map(
        (wallet: { currency: any }) => wallet.currency
      );
      setCurrencyList(currencies);
      // Also set the initial value to the first currency,
      //  otherwise you have to switch away and back to the first item to use it.
      const withCurrency = initialValues;
      withCurrency.currency = currencies[0];
      setInitialValues(withCurrency);
    });
  };

  // @ts-ignore
  const addAdjustment = ({ changeOrder, memo, currency, amount }) => {
    const adjustDTO = {
      partnerUserId: userName,
      memo,
      currency,
      amount,
      action: "InsertOrUpdate",
      type: "chargeoff",
    };
    // @ts-ignore
    api.CustomerChangeOrderAPI.createUpdateChargeoffRequest(
      customerNumber,
      changeOrder,
      adjustDTO
    ).then(() => {
      emitter.emit(RiskStatusEvents.AdjustmentsChanged, {});
      if (toggleDrawer) toggleDrawer();
    });
  };

  const getChangeOrders = () => {
    const adjustDTO = {
      state: "Open",
      // TODO: only grabbing the first 10 is problematic UX
      count: 10,
      startIndex: 0,
      ascending: true,
    };
    // @ts-ignore
    api.CustomerChangeOrderAPI.getChangeOrders(customerNumber, adjustDTO).then(
      (orders: { data: any[] }) => {
        const orderIds = orders.data.map((x) => ({ id: x.id, text: x.memo }));
        // @ts-ignore
        setChangeOrders(orderIds);
        // Also set the initial value to the first order
        //  otherwise you have to switch away and back to the first item to use it.
        const withOrder = initialValues;
        withOrder.changeOrder = orderIds[0].id;
        setInitialValues(withOrder);
      }
    );
  };

  useEffect(() => {
    getCurrencyList();
    getChangeOrders();
  }, []);

  const AddAdjustmentSchema = Yup.object().shape({
    changeOrder: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.changeOrder.required",
          defaultMessage: "Change order is a required field.",
        })
      ),
    amount: Yup.string()
      .required(
        intl.formatMessage({
          id: "error.amount.required",
          defaultMessage: "Amount is a required field",
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
      .max(255, intl.formatMessage({
          id: "error.memo.max255Chars",
          defaultMessage: "Memo must be 255 characters or less.",
      }))
      .required(
        intl.formatMessage({
          id: "error.memo.required",
          defaultMessage: "Memo is a required field.",
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
            id: "drawer.header.addNewChargeoff",
            description: "drawer header",
            defaultMessage: "Create New Chargeoff",
          })}
        />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={AddAdjustmentSchema}
          onSubmit={(values) => addAdjustment(values)}
          enableReinitialize
        >
          {(props) => (
            <form id="new-adjustment-form" onSubmit={props.handleSubmit}>
              <Box sx={{ marginBottom: "60px" }}>
                <Box>
                  <DropdownFloating
                    name="changeOrder"
                    placeholder={
                      <FormattedMessage
                        id="drawer.chargeoff.chooseOrder"
                        description="Drawer form placeholder text"
                        defaultMessage="Choose change order*"
                      />
                    }
                    list={changeOrders}
                    value={props.values.changeOrder}
                    valueKey="id"
                    {...props}
                  />
                </Box>
                <Box>
                  {currencyList.length > 0 ? (
                    <DropdownFloating
                      name="currency"
                      placeholder={
                        <FormattedMessage
                          id="drawer.chargeoff.currency"
                          description="Drawer form placeholder text"
                          defaultMessage="Currency*"
                        />
                      }
                      list={currencyList}
                      value={props.values.currency}
                      {...props}
                    />
                  ) : null}
                  <InputWithPlaceholder
                    name="amount"
                    autoComplete="off"
                    className="login-input"
                    type="text"
                    placeholder={
                      <FormattedMessage
                        id="drawer.chargeoff.amount"
                        description="Drawer form placeholder text"
                        defaultMessage="Amount*"
                      />
                    }
                    {...props}
                  />
                  <InputWithPlaceholder
                    required={true}
                    name="memo"
                    autoComplete="off"
                    type="text"
                    placeholder={
                      <FormattedMessage
                        id="drawer.chargeoff.memo"
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
                  id="drawer-addchargeoff-button-cancel"
                  onClick={() => cancel()}
                  style={{ marginRight: "14px" }}
                >
                  <FormattedMessage
                    id="drawer.addchargeoff.button.cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <SubmitButton
                  id="drawer-addchargeoff-button-save"
                  disabled={!props.dirty}
                >
                  <FormattedMessage
                    id="drawer.addchargeoff.button.saveChanges"
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

export default AddChargeoff;
