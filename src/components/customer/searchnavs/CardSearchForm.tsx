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

import React, { useContext, useState } from "react";
import { Formik } from "formik";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { defineMessage, useIntl } from "react-intl";

import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import { CustomerSearchContext } from "../../../contexts/CustomerSearchContext";

import QDButton from "../../common/elements/QDButton";

const CardSearchForm: React.FC = () => {
  const intl = useIntl();

  const { pageSize, setDto } = useContext(CustomerSearchContext);

  const cardNumber = /^[0-9-]*$/;

  const [initialValues] = useState({
    customerSearch: "",
  });

  const handleOnSubmit = (query: any) => {
    const dto = {
      searchBy: "card",
      cardNumber: "",
      count: pageSize,
    };
    if (cardNumber.test(query.customerSearch)) {
      dto.cardNumber = query.customerSearch;
      setDto(dto);
    }
  };

  const validate = (values: any) => {
    if (!values.customerSearch) {
      return {
        customerSearch: `*${intl.formatMessage(
          defineMessage({
            id: "error.requiredField",
            defaultMessage: "Required field",
          })
        )}`,
      };
    }
    if (!cardNumber.test(values.customerSearch)) {
      return {
        customerSearch: `*${intl.formatMessage(
          defineMessage({
            id: "error.mustBeANumber",
            defaultMessage: "Must be a number",
          })
        )}`,
      };
    }
    return {};
  };

  return (
    <Formik
      validate={validate}
      initialValues={initialValues}
      onSubmit={(query) => handleOnSubmit(query)}
    >
      {(props: any) => (
        <form id="search-bar-form" onSubmit={props.handleSubmit}>
          <Grid container spacing={4}>
            <Grid item sx={{ flexGrow: 1 }}>
              <InputWithPlaceholder
                id="customer-search-input"
                name="customerSearch"
                autoComplete="off"
                className="login-input"
                type="text"
                required
                placeholder={intl.formatMessage({
                  id: "cardNumber",
                  defaultMessage: "Card number",
                })}
                {...props}
              />
            </Grid>
            <Grid item>
              <Box sx={{ marginTop: "3px" }}>
                <QDButton
                  id="search-button"
                  color="primary"
                  variant="contained"
                  size="large"
                  textCase="provided"
                  label={intl.formatMessage(
                    defineMessage({
                      id: "search",
                      defaultMessage: "Search",
                    })
                  )}
                  onClick={props.handleSubmit}
                />
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default CardSearchForm;
