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
import { Box, Grid } from "@mui/material";
import { defineMessage, useIntl } from "react-intl";

import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import { CustomerSearchContext } from "../../../contexts/CustomerSearchContext";

import QDButton from "../../common/elements/QDButton";

const PANSearchForm: React.FC = () => {
  const intl = useIntl();
  const { pageSize, setDto } = useContext(CustomerSearchContext);
  const cardNumber = /^[0-9-]{16,19}$/;

  const [initialValues] = useState({
    customerSearch: "",
  });

  const handleOnSubmit = (query: any) => {
    const dto = {
      searchBy: "PAN",
      pan: "",
      count: pageSize,
    };
    if (cardNumber.test(query.customerSearch)) {
      dto.pan = query.customerSearch;
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
            id: "error.field.PAN.between.16and19",
            defaultMessage: "PAN must be between 16-19 numeric characters.",
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
                  id: "PAN",
                  defaultMessage: "PAN",
                })}
                {...props}
              />
            </Grid>
            <Grid item>
              <Box sx={{ marginTop: "3px" }}>
                <QDButton
                  id="search-button"
                  className="mt-1 mr-0"
                  color="primary"
                  variant="contained"
                  textCase="provided"
                  label={intl.formatMessage(
                    defineMessage({
                      id: "search",
                      defaultMessage: "Search",
                    })
                  )}
                  onClick={props.handleSubmit}
                  size="extra-tall"
                />
              </Box>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default PANSearchForm;
