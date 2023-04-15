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

import React, { useContext, useState, useEffect } from "react";
import { Formik } from "formik";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import { CustomerSearchContext } from "../../../contexts/CustomerSearchContext";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";

import QDButton from "../../common/elements/QDButton";

const ExternalReference: React.FC = () => {
  const intl = useIntl();
  const { pageSize, setDto } = useContext(CustomerSearchContext);
  const [initialValues] = useState({
    extRefPartnerName: "",
    extRefNumber: "",
  });
  const [partners, setPartners] = useState([]);

  const getPartners = () =>
    // @ts-ignore
    api.PartnerAPI.list().catch((error: any) => error);

  const handleOnSubmit = (query: any) => {
    const dto = {
      searchBy: "externalReference",
      extRefNumber: "",
      count: pageSize,
      extRefPartnerName: "",
    };

    dto.extRefNumber = query.extRefNumber.replace(/\s/g, "");
    dto.extRefPartnerName = query.extRefPartnerName;

    setDto(dto);
  };

  const validate = (values: any) => {
    if (!values.extRefNumber) {
      return {
        extRefNumber: `*${intl.formatMessage(
          defineMessage({
            id: "error.requiredField",
            defaultMessage: "Required field",
          })
        )}`,
      };
    }
    return {};
  };

  useEffect(() => {
    getPartners().then((partner: any) => {
      setPartners(partner.map((bank: { name: any }) => bank.name));
    });
  }, []);

  return (
    <Formik
      validate={validate}
      initialValues={initialValues}
      onSubmit={(query) => handleOnSubmit(query)}
    >
      {(props: any) => (
        <form id="search-bar-form" onSubmit={props.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item sx={{ width: "265px" }}>
              {
                partners && (
                  <DropdownFloating
                    id="add-fee-currency-dropdown"
                    name="extRefPartnerName"
                    placeholder={
                      <FormattedMessage id="partner" defaultMessage="Partner" />
                    }
                    list={partners}
                    value={props.values.extRefPartnerName}
                    {...props}
                  />
                )
              }
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
              <InputWithPlaceholder
                id="extRefNumber-search-input"
                name="extRefNumber"
                autoComplete="off"
                className="login-input"
                type="text"
                required
                placeholder={intl.formatMessage({
                  id: "externalReference",
                  defaultMessage: "External reference",
                })}
                value={props.values.extRefNumber}
                {...props}
              />
            </Grid>
            <Grid item>
              <Box sx={{ marginLeft: "6px", marginTop: "3px" }}>
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

export default ExternalReference;
