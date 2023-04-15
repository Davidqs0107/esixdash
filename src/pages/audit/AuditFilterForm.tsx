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

import React, { useState, lazy, useEffect } from "react";
import { defineMessage, useIntl, FormattedMessage } from "react-intl";

import { Formik, Field } from "formik";
import Box from "@mui/material/Box";
import Label from "../../components/common/elements/Label";
import moment from "moment";
import { IAudit } from "./IAudit";

const DatePicker = lazy(
  () => import("../../components/common/forms/inputs/DatePicker")
);
const InputWithPlaceholder = lazy(
  () => import("../../components/common/forms/inputs/InputWithPlaceholder")
);
const QDRadioGroup = lazy(
  () => import("../../components/common/forms/inputs/QDRadioGroup")
);
const QDButton = lazy(
  () => import("../../components/common/elements/QDButton")
);

const AuditFilterForm = (props: any) => {
  const intl = useIntl();

  const [pageSize] = useState<Number>(20);
  const [selection, setSelection] = React.useState("today");

  const [inputs, setInputs] = useState({
    customDateRange: false,
    startTime: "",
    endTime: "",
    startIndex: 0,
    ascending: false,
    partnerUser: props.filters.partnerUser,
    customerNumber: "",
    count: pageSize,
  });

  const [fromErrorValidation, setFromDateErrorValidation] = useState<any>({
    error: false,
    errorText: "",
  });

  const [dateToErrorValidation, setToDateErrorValidation] = useState<any>({
    error: false,
    errorText: "",
  });

  const handleReset = () => {
    setInputs(() => ({
      customDateRange: false,
      startTime: "",
      endTime: "",
      startIndex: 0,
      ascending: false,
      partnerUser: "",
      customerNumber: "",
      count: pageSize,
    }));

    props.setFilters(() => ({
      ...inputs,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    // if user or customerNumber, dont allow both
    if (e.target.name === "customerNumber") {
      // Set to Null
      setInputs(() => ({
        ...inputs,
        customerNumber: e.target.value,
        partnerUser: "",
      }));
    }

    if (e.target.name === "partnerUser") {
      // Set to Null
      setInputs(() => ({
        ...inputs,
        partnerUser: e.target.value,
        customerNumber: "",
      }));
    }
  };

  const handleStartTimeChangeDatePicker = (e: any): void => {
    const dateCheck = moment(e).isBefore(inputs.endTime);
    if (!dateCheck) {
      return setFromDateErrorValidation({
        error: true,
        errorText: (
          <FormattedMessage
            id="error.fromDateLessThanToDate"
            defaultMessage={`From Date Must Be Less than "To Date"`}
          />
        ),
      });
    }
    setFromDateErrorValidation({
      error: false,
      errorText: "",
    });
    return setInputs((): any => ({
      ...inputs,
      startTime: moment(e).valueOf(),
    }));
  };

  const handleEndTimeChangeDatePicker = (e: any): void => {
    const dateCheck = moment(e).isAfter(inputs.startTime);
    if (!dateCheck) {
      return setToDateErrorValidation({
        error: true,
        errorText: (
          <FormattedMessage
            id="error.toDateGreaterThanFromDate"
            defaultMessage={`To Date Must Be Greater than "From Date"`}
          />
        ),
      });
    }
    setToDateErrorValidation({
      error: false,
      errorText: "",
    });
    return setInputs((): any => ({
      ...inputs,
      endTime: moment(e).valueOf(),
    }));
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    // set inputs == filters (which === DTO), triggers submit fn on parent via useEffect
    props.setFilters(() => ({
      ...inputs,
    }));
  };

  // This triggers on the filter by date buttons
  useEffect(() => {
    switch (selection) {
      case "today":
        return setInputs((): any => ({
          ...inputs,
          startTime: moment().subtract(24, "hours").valueOf(),
          endTime: moment().valueOf(),
          customDateRange: false,
        }));

      case "week":
        return setInputs((): any => ({
          ...inputs,
          startTime: moment().subtract(7, "days").valueOf(),
          endTime: moment().valueOf(),
          customDateRange: false,
        }));

      case "month":
        return setInputs((): any => ({
          ...inputs,
          startTime: moment().subtract(30, "days").valueOf(),
          endTime: moment().valueOf(),
          customDateRange: false,
        }));

      case "customDateRange":
        return setInputs((): any => ({
          ...inputs,
          endTime: moment().valueOf(),
          startTime: moment().subtract(24, "hours").valueOf(),
          customDateRange: true, // renders the date picker
        }));

      default:
    }
  }, [selection]);

  useEffect(() => {
    if (
      inputs.partnerUser == undefined &&
      props.filters.partnerUser != undefined
    ) {
      setInputs((): any => ({
        ...inputs,
        partnerUser: props.filters.partnerUser,
      }));
    }
  });

  return (
    <div>
      <Formik
        initialValues={{
          partnerUser: inputs.partnerUser,
          customerNumber: inputs.customerNumber,
          customDateRange: inputs.customDateRange,
          startTime: inputs.startTime,
          endTime: inputs.endTime,
        }}
        onSubmit={(values, actions) => console.log(values, actions)}
        enableReinitialize
      >
        {/* eslint-disable-next-line no-shadow */}
        {(props: any) => (
          <form>
            <Box sx={{ marginBottom: "-9px", marginTop: "10px" }}>
              <QDRadioGroup
                {...props}
                selection={selection}
                setSelection={setSelection}
                name="auditDateFilters"
                formLegend={intl.formatMessage(
                  defineMessage({
                    id: "filterByDate",
                    defaultMessage: "Filter by Date",
                  })
                )}
                formControlLabelData={[
                  {
                    label: (
                      <FormattedMessage id="today" defaultMessage="Today" />
                    ),
                    key: "1",
                    value: "today",
                    disabled: false,
                    id: "audits-search-filter-by-today",
                    radio: {
                      required: true,
                      color: "primary",
                      size: "small",
                    },
                  },
                  {
                    label: (
                      <FormattedMessage
                        id="thisWeek"
                        defaultMessage="This Week"
                      />
                    ),
                    key: "2",
                    value: "week",
                    disabled: false,
                    id: "audits-search-filter-by-this-week",
                    radio: {
                      required: true,
                      color: "primary",
                      size: "small",
                    },
                  },
                  {
                    label: (
                      <FormattedMessage
                        id="thisMonth"
                        defaultMessage="This Month"
                      />
                    ),
                    key: "3",
                    value: "month",
                    disabled: false,
                    id: "audits-search-filter-by-this-month",
                    radio: {
                      required: true,
                      color: "primary",
                      size: "small",
                    },
                  },
                  {
                    label: (
                      <FormattedMessage id="custom" defaultMessage="Custom" />
                    ),
                    key: "4",
                    value: "customDateRange",
                    disabled: false,
                    id: "audits-search-filter-by-custom-date-range",
                    radio: {
                      required: true,
                      color: "primary",
                      size: "small",
                    },
                  },
                ]}
              />
            </Box>
            <Box>
              {inputs.customDateRange ? (
                <>
                  <Box sx={{ marginTop: "20px" }}>
                    <Field
                      name="startTime"
                      label={intl.formatMessage(
                        defineMessage({
                          id: "fromDate",
                          defaultMessage: "From Date",
                        })
                      )}
                      value={props.values.startTime}
                      component={DatePicker}
                      maxDate="4100-01-01"
                      onChange={handleStartTimeChangeDatePicker}
                      helperText={fromErrorValidation.errorText}
                      error={fromErrorValidation.error}
                    />
                    <Box sx={{ marginBottom: "-20px" }}>
                      <Field
                        name="endTime"
                        label={intl.formatMessage(
                          defineMessage({
                            id: "toDate",
                            defaultMessage: "To Date",
                          })
                        )}
                        component={DatePicker}
                        maxDate="4100-01-01"
                        value={props.values.endTime}
                        onChange={handleEndTimeChangeDatePicker}
                        helperText={dateToErrorValidation.errorText}
                        error={dateToErrorValidation.error}
                      />
                    </Box>
                  </Box>
                </>
              ) : (
                <></>
              )}
            </Box>
            <Box sx={{ marginTop: "45px" }} onChange={handleInputChange}>
              <Box sx={{ marginBottom: "25px" }}>
                <Box sx={{ marginBottom: "16px" }}>
                  <Label variant="grey">
                    {intl.formatMessage(
                      defineMessage({
                        id: "filterByUser",
                        defaultMessage: "Filter by User",
                      })
                    )}
                  </Label>
                </Box>
                <InputWithPlaceholder
                  id="audits-search-filter-by-user"
                  name="partnerUser"
                  type="text"
                  autoComplete="off"
                  placeholder={intl.formatMessage(
                    defineMessage({
                      id: "userName",
                      defaultMessage: "User name",
                    })
                  )}
                  value={inputs.partnerUser}
                  {...props}
                />
              </Box>
              <Box sx={{ marginBottom: "40px" }}>
                <Box sx={{ marginBottom: "16px" }}>
                  <Label variant="grey">
                    {intl.formatMessage(
                      defineMessage({
                        id: "filterByCustomer",
                        defaultMessage: "Filter by Customer",
                      })
                    )}
                  </Label>
                </Box>
                <InputWithPlaceholder
                  id="audits-search-filter-by-customer"
                  name="customerNumber"
                  type="text"
                  autoComplete="off"
                  placeholder={intl.formatMessage(
                    defineMessage({
                      id: "customerNumber",
                      defaultMessage: "Customer number",
                    })
                  )}
                  value={inputs.customerNumber}
                  {...props}
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <QDButton
                label={intl.formatMessage(
                  defineMessage({
                    id: "clearFilters",
                    defaultMessage: "Clear filters",
                    description: "header",
                  })
                )}
                onClick={() => handleReset()}
                id="audits-search-clear-filters"
                color="info"
              />
              <QDButton
                id="audits-search-submit-button"
                color="primary"
                variant="contained"
                size="large"
                label={intl.formatMessage(
                  defineMessage({
                    id: "filterResults",
                    defaultMessage: "Filter Results",
                    description: "header",
                  })
                )}
                onClick={handleSubmit}
                {...props}
              />
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default AuditFilterForm;
