/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import React, { useContext, useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import { FormattedMessage, useIntl } from "react-intl";
import { Grid } from "@mui/material";
import Typography from "@mui/material/Typography";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import SubmitButton from "../../common/elements/SubmitButton";
import { useQueries } from "@tanstack/react-query";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fields: {
      paddingRight: "30px",
      marginTop: "10px",

      "& .MuiSelect-select": {
        boxShadow: "0 15px 5px -10px #0b0d100a",
      },
      "& .MuiTextField-root": {
        boxShadow: "0 15px 5px -10px #0b0d100a",
      },
    },
    checkBox: {
      "& Label": { marginBottom: 0 },
    },
  })
);

const ConfigureProductFormBase: React.FC<any> = (props: any) => {
  const intl = useIntl();
  const classes = useStyles();
  const history = useHistory();
  const { setErrorMsg } = useContext(MessageContext);
  const [errors, setErrors] = useState({});
  const [partners, setPartners] = useState([]);
  const [language, setLanguage] = useState<string[]>([]);
  const [day, setDay] = useState([...Array(30).keys()]);
  const [hour, setHour] = useState([...Array(24).keys()]);
  const [minute, setMinute] = useState([...Array(59).keys()]);
  const [balanceType, setBalanceType] = useState<string[]>([
    "Purchase",
    "Cash Advance",
  ]);
  const [countries, setCountries] = useState<string[]>([]);
  const [potentialHomeCurrenciesList, setPotentialHomeCurrenciesList] =
    useState<string[]>([]);
  const [homeCurrenciesList, setHomeCurrenciesList] = useState<string[]>([]);
  const [timeZones, setTimeZones] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState("");

  const [getCountryListQuery, getLocalesQuery, getTimeZoneListQuery] =
    useQueries({
      queries: [
        {
          queryKey: ["getCountryList"],
          queryFn: () =>
            // @ts-ignore
            api.CommonAPI.getCountryList(null),
          onError: (error: any) => setErrorMsg(error),
        },
        {
          queryKey: ["getLocales"],
          queryFn: () =>
            // @ts-ignore
            api.CommonAPI.getLocales(),
          onError: (error: any) => setErrorMsg(error),
        },
        {
          queryKey: ["getTimeZoneList"],
          queryFn: () =>
            // @ts-ignore
            api.CommonAPI.getTimeZoneList(),
          onError: (error: any) => setErrorMsg(error),
        },
      ],
    });

  const sortBankMap = async (linkedPartner: any) => {
    //
    // Pluck partnerName, name, currencies ==> setPotentialHomeCurrenciesData
    //

    setPotentialHomeCurrenciesList(
      linkedPartner.map((o: any) =>
        Object.fromEntries(
          ["bankName", "currencies", "name"].map((k) => [k, o[k]])
        )
      )
    );
  };

  const sortHomeCurrenciesList = (): void => {
    //
    // Set the data to the  `Home Currency` input depending on which partnerName the user chose via `selectedPartner`
    //

    const match = potentialHomeCurrenciesList.filter(
      // @ts-ignore
      (i) => i.name === selectedPartner
    );

    if (match.length) {
      // @ts-ignore
      const sortedCurrencies = match.map((o: any) =>
        Object.fromEntries(["currencies"].map((k) => [k, o[k]]))
      )[0];
      setHomeCurrenciesList(sortedCurrencies.currencies);
    }
  };

  const getPartners = () =>
    // @ts-ignore
    api.PartnerAPI.listLinkedPartners()
      .then((res: any) => {
        const results = res.map((p: any) => p.name);
        setPartners(results);
        sortBankMap(res);
      })
      .catch((e: any) => setErrorMsg(e));

  const createOperatingProgram = (DTO: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingProgramSetupAPI.create(DTO)
      .then(() => {})
      .catch((error: any) => setErrors(error)); // TODO Handle error case

  const createProgramProduct = (dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.ProductAPI.createProgramProduct(dto)
      .then(() => {})
      .catch((error: any) => setErrors(error)); // TODO Handle error case

  useEffect(() => {
    getPartners().catch((error: any) => setErrors(error));
  }, []);

  useEffect(() => {
    if (
      getCountryListQuery.data &&
      getLocalesQuery.data &&
      getTimeZoneListQuery.data
    ) {
      const countryList = getCountryListQuery.data.map((l: any) => ({
        text: l.name,
        code: l.code,
      }));
      setCountries(countryList);

      const list = getLocalesQuery.data.map((l: any) => ({
        text: l.displayName,
        code: l.code,
      }));
      setLanguage(list);

      const timeZoneList = getTimeZoneListQuery.data;
      timeZoneList.unshift("");
      setTimeZones(timeZoneList);
    }
  }, [
    getCountryListQuery.data,
    getLocalesQuery.data,
    getTimeZoneListQuery.data,
  ]);

  useEffect(() => {
    sortHomeCurrenciesList();
  }, [selectedPartner]);

  return (
    <FormGroup>
      <Grid container item xs={12}>
        <Grid container item xs={8} direction="row">
          <Grid className={classes.fields} item xs={12} direction="row">
            <InputWithPlaceholder
              name="productName"
              autoComplete="off"
              type="text"
              placeholder={
                <FormattedMessage
                  id="productName"
                  description="Input Label"
                  defaultMessage="Product Name"
                />
              }
              value={props.props.values[0].productName}
              className="login-input"
              {...props}
            />
          </Grid>
          <Grid item xs={12} className={classes.fields} direction="row">
            <DropdownFloating
              name="partner"
              placeholder={
                <FormattedMessage
                  id="configure.form.base.label.partner"
                  description="Input Label"
                  defaultMessage="Partner"
                />
              }
              className="login-input"
              list={partners}
              // value={props.values.partner}
              value=""
              values={[]}
              // handleChange={setSelectedPartner(props.values.partner)}
              {...props}
            />
          </Grid>
          <Grid container xs={12} spacing={0} direction="row">
            <Grid item xs={4} className={classes.fields} direction="row">
              <DropdownFloating
                name="language"
                placeholder={
                  <FormattedMessage
                    id="configure.form.base.label.language"
                    description="Input Label"
                    defaultMessage="Language"
                  />
                }
                className="login-input"
                list={language}
                valueKey="code"
                // value={props.values.language}
                value=""
                values={[]}
                {...props}
              />
            </Grid>
            <Grid item xs={4} className={classes.fields} direction="row">
              <DropdownFloating
                name="location"
                placeholder={
                  <FormattedMessage
                    id="drawer.addProgram.label.location"
                    description="Input Label"
                    defaultMessage="Location*"
                  />
                }
                className="login-input"
                list={countries}
                valueKey="code"
                // value={props.values.location}
                value=""
                values={[]}
                {...props}
              />
            </Grid>
            <Grid item xs={4} className={classes.fields} direction="row">
              <DropdownFloating
                name="timeZone"
                placeholder={
                  <FormattedMessage
                    id="configure.form.base.label.timeZone"
                    description="Input Label"
                    defaultMessage="Time Zone"
                  />
                }
                className="login-input"
                list={timeZones}
                // value={props.values.timeZone}
                value=""
                values={[]}
                {...props}
              />
            </Grid>
          </Grid>
          <Grid container xs={12} direction="row">
            <Grid className={classes.fields} item xs={4} direction="row">
              <DropdownFloating
                name="homeCurrency"
                placeholder={
                  <FormattedMessage
                    id="drawer.addProgram.label.homeCurrency"
                    description="Input Label"
                    defaultMessage="Home Currency*"
                  />
                }
                className="login-input"
                list={homeCurrenciesList}
                // value={props.values.homeCurrency}
                value=""
                values={[]}
                {...props}
              />
            </Grid>
          </Grid>
          <Typography className="label-regular mt-4 mb-0">
            Settlement Time:
          </Typography>
          <Grid container xs={12} direction="row">
            <Grid className={classes.fields} item xs={2} direction="row">
              <DropdownFloating
                name="day"
                placeholder={
                  <FormattedMessage
                    id="configure.form.base.label.day"
                    description="Input Label"
                    defaultMessage="Day"
                  />
                }
                className="login-input"
                list={day}
                // value={props.values.day}
                value=""
                values={[]}
                {...props}
              />
            </Grid>
            <Grid className={classes.fields} item xs={2} direction="row">
              <DropdownFloating
                name="hour"
                placeholder={
                  <FormattedMessage
                    id="configure.form.base.label.hour"
                    description="Input Label"
                    defaultMessage="Hour"
                  />
                }
                className="login-input"
                list={hour}
                // value={props.values.hour}
                value=""
                values={[]}
                {...props}
              />
            </Grid>
            <Grid className={classes.fields} item xs={2} direction="row">
              <DropdownFloating
                name="minute"
                placeholder={
                  <FormattedMessage
                    id="configure.form.base.label.minute"
                    description="Input Label"
                    defaultMessage="Minute"
                  />
                }
                className="login-input"
                list={minute}
                // value={props.values.minute}
                value=""
                values={[]}
                {...props}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid justifyContent="center" container item xs={4} direction="row">
          <SubmitButton
            id="drawer-add-fee-button-save-changes"
            className="mt-1 mr-0"
            disabled={false}
            onClick={() => {}}
          >
            <FormattedMessage
              id="configure.form.button.setPlugins"
              description="Set Plugins Button"
              defaultMessage="Save & choose plugins"
            />
          </SubmitButton>
        </Grid>
      </Grid>
    </FormGroup>
  );
};

export default ConfigureProductFormBase;
