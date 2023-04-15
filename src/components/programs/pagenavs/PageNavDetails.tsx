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
import React, { ReactElement, useContext } from "react";
import { MessageDescriptor, useIntl, defineMessage } from "react-intl";
import { Grid, GridSize, Typography } from "@mui/material";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";
import CurrencyRender from "../../../components/common/converters/CurrencyRender";

const PageNavDetails = () => {
  const intl = useIntl();
  const { programName, program, bank, partner, locales, exchanges } =
    useContext(ProgramEditContext);

  const getDisplayName = (localeCode: string) => {
    const entry: any = locales.find((l: any) => l.code === localeCode);
    return entry ? entry.text : "";
  };

  const getProgramLanguageDisplayName = () => {
    const programLanguage = intl.formatDisplayName(program.language, {
      type: "language",
    });
    return programLanguage || getDisplayName(program.language);
  };

  const languageLabel = defineMessage({
    id: "drawer.programs.edit.label.language",
    description: "Language Section Label",
    defaultMessage: "Language",
  });

  const locationLabel = defineMessage({
    id: "drawer.programs.edit.label.location",
    description: "Location Section Label",
    defaultMessage: "Location",
  });

  const timeZoneLabel = defineMessage({
    id: "drawer.programs.edit.label.timeZone",
    description: "Time Zone Section Label",
    defaultMessage: "Time Zone",
  });

  const homeCurrencyLabel = defineMessage({
    id: "drawer.programs.edit.label.currency",
    description: "Currency Section Label",
    defaultMessage: "Home Currency",
  });

  const partnerLabel = defineMessage({
    id: "drawer.programs.edit.label.partner",
    description: "Partner Section Label",
    defaultMessage: "Partner",
  });

  const bankLabel = defineMessage({
    id: "drawer.programs.edit.label.Bank",
    description: "Bank Section Label",
    defaultMessage: "Bank",
  });

  const exchangeLabel = defineMessage({
    id: "drawer.programs.edit.label.Exchanges",
    description: "Exchanges Section Label",
    defaultMessage: "Exchanges",
  });

  const createGridItem = (
    label: MessageDescriptor,
    content: string | ReactElement,
    size: GridSize
  ) => (
    <Grid item xs={size} md={size} lg={size} style={{ marginBottom: "4em" }}>
      <Grid item style={{ marginBottom: "1em" }}>
        <Typography
          style={{
            fontFamily: "Montserrat",
            opacity: 0.8,
          }}
        >
          {intl.formatMessage(label)}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          style={{ fontFamily: "Montserrat", fontSize: "12px" }}
        >
          {content}
        </Typography>
      </Grid>
    </Grid>
  );

  const mapToExchangeNames = (exchangeArray: any[]) => (
    <Grid item>
      {exchangeArray.map((e) => (
        <Grid item>
          <Typography
            style={{ fontFamily: "Montserrat", fontSize: "12px" }}
          >
            {e.name}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Grid container spacing={2} sx={{ mt: 2}}>
      {createGridItem(languageLabel, getProgramLanguageDisplayName(), 3)}
      {createGridItem(locationLabel, program.location, 3)}
      {createGridItem(timeZoneLabel, program.timeZone, 3)}
      {createGridItem(
        homeCurrencyLabel,
        <CurrencyRender currencyCode={program.defaultHomeCurrency} />,
        3
      )}
      {createGridItem(partnerLabel, partner.name, 3)}
      <Grid item xs={3} md={3} lg={3} style={{ marginBottom: "4em" }}>
        <Grid item style={{ marginBottom: "1em" }}>
          <Typography
            style={{
              fontFamily: "Montserrat",
              opacity: 0.8,
            }}
          >
            {intl.formatMessage(bankLabel)}
          </Typography>
        </Grid>
        <Grid item>
          <Grid item>
            <Typography
              style={{ fontFamily: "Montserrat", fontSize: "12px" }}
            >
              {bank.name}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      {createGridItem(exchangeLabel, mapToExchangeNames(exchanges), 3)}
    </Grid>
  );
};

export default PageNavDetails;
