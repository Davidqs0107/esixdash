/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import { Field, Formik } from "formik";
import React, { useState, FC, useEffect, useContext } from "react";
import * as Yup from "yup";
import moment from "moment";
import Box from "@mui/material/Box";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "../../common/forms/inputs/DatePicker";
import Header from "../../common/elements/Header";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import QDButton from "../../common/elements/QDButton";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import { MessageContext } from "../../../contexts/MessageContext";
import CancelButton from "../../common/elements/CancelButton";
import RiskParamConverter from "../../common/converters/RiskParamConverter";
import { CustomerDetailContext } from "../../../contexts/CustomerDetailContext";
import api from "../../../api/api";
import emitter from "../../../emitter";

interface IAddRiskExceptionDrawer {
  toggleDrawer?: Function;
}

const AddRiskExceptionDrawer: FC<IAddRiskExceptionDrawer> = ({
  toggleDrawer,
}) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const { customerNumber, programName } = useContext(CustomerDetailContext);

  const [riskParams, setRiskParams] = useState([]);
  const [initialValues] = useState({
    paramName: "",
    paramValue: "",
    releaseDate: moment().format("YYYY-MM-DD"),
  });

  const { data: getRiskParamsData } = useQuery({
    queryKey: ["getRiskParams", programName],
    queryFn: () =>
      // @ts-ignore
      api.RiskAPI.getRiskParams(programName),
    onError: (error: any) => setErrorMsg(error),
  });

  const RiskExceptionSchema = Yup.object().shape({
    paramName: Yup.string().required(
      intl.formatMessage({
        id: "error.riskParameter.required",
        defaultMessage: "Risk Parameter required",
      })
    ),
    paramValue: Yup.string().required(
      intl.formatMessage({
        id: "error.parameterValue.required",
        defaultMessage: "Parameter value required.",
      })
    ),
    releaseDate: Yup.date()
      .min(
        moment().format("YYYY-MM-DD"),
        intl.formatMessage({
          id: "error.releaseDate.cannotBeOlderThanToday",
          defaultMessage: "Release date cannot be older than today",
        })
      )
      .max(
        moment().format("4100-01-01"),
        intl.formatMessage({
          id: "error.releaseDate.invalid",
          defaultMessage: "Please enter a valid release date",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.releaseDate.required",
          defaultMessage: "Release date is required.",
        })
      )
      .typeError(
        intl.formatMessage({
          id: "error.releaseDate.invalid",
          defaultMessage: "Please enter a valid release date",
        })
      ),
  });

  const createRiskException = (values: any) => {
    const { releaseDate, paramName, paramValue } = values;
    const dto = {
      releaseDate: releaseDate.replace(/-/g, ""),
      paramName,
      paramValue,
    };
    // @ts-ignore
    return api.CustomerAPI.createRiskException(customerNumber, dto)
      .then(() => {
        emitter.emit("customer.riskExceptions.changed", {});
        emitter.emit("customer.riskMeasurements.changed", {});
        if (toggleDrawer) {
          toggleDrawer();
        }
      })
      .catch((error: any) => setErrorMsg(error));
  };

  useEffect(() => {
    if (getRiskParamsData) {
      const params = getRiskParamsData.map((param: any) => ({
        text: RiskParamConverter(param.name, intl),
        paramId: param.name,
      }));
      params.unshift({ text: "Please select a parameter", paramId: "none" });
      params.sort((a: any, b: any) =>
        a.text.toLowerCase() > b.text.toLowerCase() ? 1 : -1
      );
      setRiskParams(params);
    }
  }, [getRiskParamsData]);

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          value={intl.formatMessage({
            id: "addRiskException",
            description: "drawer header",
            defaultMessage: "Add Risk Exception",
          })}
          level={2}
          bold
          color="white"
        />
      </Box>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => createRiskException(values)}
        validationSchema={RiskExceptionSchema}
        enableReinitialize
      >
        {(riskExProps) => (
          <form onSubmit={riskExProps.handleSubmit}>
            <Box sx={{ marginBottom: "60px" }}>
              <DropdownFloating
                id="risk-param-name-dropdown"
                list={riskParams}
                name="paramName"
                placeholder={`${intl.formatMessage({
                  id: "riskParameter",
                  defaultMessage: "Risk parameter",
                })}*`}
                value={riskExProps.values.paramName}
                valueKey="paramId"
                {...riskExProps}
              />
              <InputWithPlaceholder
                id="risk-param-value-dropdown"
                name="paramValue"
                autoComplete="off"
                type="text"
                placeholder={`${intl.formatMessage({
                  id: "value",
                  defaultMessage: "Value",
                })}*`}
                {...riskExProps}
              />
              <Field
                id="risk-releasable-date-picker"
                name="releaseDate"
                label={`${intl.formatMessage({
                  id: "releasableDate",
                  defaultMessage: "Releasable Date",
                })}*`}
                component={DatePicker}
                maxDate="4100-01-01"
                value={riskExProps.values.releaseDate}
                minDate={moment().format("YYYY-MM-DD")}
                {...riskExProps}
              />
            </Box>
            <Box sx={{ textAlign: "center" }}>
              <Box sx={{ marginBottom: "32px" }}>
                <QDButton
                  id="create-risk-exception-button"
                  color="primary"
                  variant="contained"
                  size="large"
                  onClick={riskExProps.handleSubmit}
                  textCase="provided"
                  label={intl.formatMessage(
                    defineMessage({
                      id: "createRiskException",
                      defaultMessage: "Create Risk Exception",
                      description: "Input Label",
                    })
                  )}
                />
              </Box>
              <CancelButton
                id="customer-risk-level-update-cancel"
                onClick={() => {
                  if (toggleDrawer) {
                    toggleDrawer();
                  }
                }}
              >
                <FormattedMessage
                  id="close"
                  description="Cancel button"
                  defaultMessage="Close"
                />
              </CancelButton>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default AddRiskExceptionDrawer;
