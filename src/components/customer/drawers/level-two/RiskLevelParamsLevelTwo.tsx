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
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import StandardTable from "../../../common/table/StandardTable";
import api from "../../../../api/api";
import { CustomerDetailContext } from "../../../../contexts/CustomerDetailContext";
import emitter from "../../../../emitter";
import YesNoConverter from "../../../common/converters/YesNoConverter";
import DateAndTimeConverter from "../../../common/converters/DateAndTimeConverter";
import { CustomerRiskLevelDrawerContext } from "../../../../contexts/CustomerRiskLevelDrawerContext";
import { MessageContext } from "../../../../contexts/MessageContext";
import RiskParamConverter from "../../../common/converters/RiskParamConverter";
import QDButton from "../../../common/elements/QDButton";
import Header from "../../../common/elements/Header";
import TextRender from "../../../common/TextRender";

const RiskLevelParamsLevelTwo = () => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const [riskMeasurementList, setRiskParamsList] = useState([]);
  const [riskExceptionList, setRiskExceptionList] = useState([]);
  const [riskConfigs, setRiskConfigs] = useState([]);
  const { customerNumber, programName } = useContext(CustomerDetailContext);
  const { selectedRiskLevel } = useContext(CustomerRiskLevelDrawerContext);

  const getRiskMeasurements = () =>
    // @ts-ignore
    api.CustomerAPI.getRiskMeasurements(customerNumber)
      .then((riskMeasurements: any) => setRiskParamsList(riskMeasurements))
      .catch((error: any) => setErrorMsg(error));

  const getRiskExceptions = () =>
    // @ts-ignore
    api.CustomerAPI.getRiskExceptions(customerNumber)
      .then((riskExceptions: any) => setRiskExceptionList(riskExceptions))
      .catch((error: any) => setErrorMsg(error));

  const deleteRiskExceptions = (id: any) =>
    // @ts-ignore
    api.CustomerAPI.deleteRiskException(customerNumber, id)
      .then(() => getRiskExceptions())
      .catch((error: any) => setErrorMsg(error));

  const getRiskConfigs = () => {
    // @ts-ignore
    api.RiskAPI.getRiskConfigs(programName, selectedRiskLevel)
      .then((configs: any) => {
        setRiskConfigs(configs);
      })
      .catch((error: any) => setErrorMsg(error));
  };

  useEffect(() => {
    emitter.on("customer.riskExceptions.changed", () => getRiskExceptions());
    emitter.on("customer.riskMeasurements.changed", () =>
      getRiskMeasurements()
    );
    getRiskMeasurements();
    getRiskExceptions();
    getRiskConfigs();
  }, []);

  useEffect(() => {
    getRiskConfigs();
  }, [selectedRiskLevel]);

  const RiskMeasurementMetaData = [
    {
      header: (
        <FormattedMessage
          id="risk.measurement.name"
          description="Name of param/measurement"
          defaultMessage="Name"
        />
      ),
      render: (rowData: any) => (
        <TextRender
          data={RiskParamConverter(rowData.name, intl)}
          color="#152C5B"
        />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="risk.measurement.maxValue"
          description="Max Value of Measurement"
          defaultMessage="Max Value"
        />
      ),
      render: (rowData: any) => (
        <TextRender data={rowData.maxValue} color="#152C5B" />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="risk.measurement.currentValue"
          description="Current Value of Measurement"
          defaultMessage="Current Value"
        />
      ),
      render: (rowData: any) => (
        <TextRender data={rowData.currentValue} color="#152C5B" />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="risk.measurement.block"
          description="Whether or not measurement triggers a block"
          defaultMessage="Block"
        />
      ),
      render: (rowData: any) => <YesNoConverter bool={rowData.block} />,
    },
    {
      header: (
        <FormattedMessage
          id="risk.measurement.disabled"
          description="Whether or not measurement is disabled"
          defaultMessage="Disabled"
        />
      ),
      render: (rowData: any) => <YesNoConverter bool={rowData.disabled} />,
    },
    {
      header: (
        <FormattedMessage
          id="risk.measurement.notify"
          description="Whether or not measurement is set to notify customer"
          defaultMessage="Notify"
        />
      ),
      render: (rowData: any) => <YesNoConverter bool={rowData.notify} />,
    },
    {
      header: (
        <FormattedMessage
          id="risk.measurement.creationTime"
          description="Creation date/time of Risk Measurement"
          defaultMessage="Created"
        />
      ),
      render: (rowData: any) => (
        <DateAndTimeConverter epoch={rowData.creationTime} />
      ),
    },
  ];

  const RiskExceptionMetaData = [
    {
      header: (
        <FormattedMessage
          id="risk.exception.name"
          description="Name of RiskException"
          defaultMessage="Name"
        />
      ),
      render: (rowData: any) => (
        <TextRender
          data={RiskParamConverter(rowData.paramName, intl)}
          color="#152C5B" 
        />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="risk.exception.value"
          description="Max value of RiskException"
          defaultMessage="Value"
        />
      ),
      render: (rowData: any) => (
        <TextRender data={rowData.paramValue} color="#152C5B" />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="risk.exception.created"
          description="Creation Date/Time"
          defaultMessage="Created"
        />
      ),
      render: (rowData: any) => (
        <DateAndTimeConverter epoch={rowData.creationTime} />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="risk.exception.releaseDate"
          description="The date the risk exception is to be released"
          defaultMessage="Release Date"
        />
      ),
      render: (rowData: any) => (
        <DateAndTimeConverter epoch={rowData.releaseTime} />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="risk.exception.modified"
          description="Last modified date/time of exception"
          defaultMessage="Modified"
        />
      ),
      render: (rowData: any) => (
        <DateAndTimeConverter epoch={rowData.modifiedTime} />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="risk.exception.deleteButton"
          description=""
          defaultMessage=""
        />
      ),
      render: (rowData: any) => (
        <QDButton
          id="risk-level-two-delete-button"
          onClick={() => deleteRiskExceptions(rowData.id)}
          color="primary"
          variant="contained"
          label={intl.formatMessage(
            defineMessage({
              id: "risk-level-two-delete-button",
              defaultMessage: "Delete",
              description: "Input Label",
            })
          )}
        />
      ),
    },
  ];

  const RiskLevelMetaData = [
    {
      header: (
        <FormattedMessage
          id="drawer.riskLevel.table.header.name"
          description="table header"
          defaultMessage="Name"
        />
      ),
      render: (rowData: any) => (
        <TextRender
          data={RiskParamConverter(rowData.paramName, intl)}
          color="#152C5B"
        />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="drawer.riskLevel.table.header.value"
          description="table header"
          defaultMessage="Value"
        />
      ),
      render: (rowData: any) => (
        <TextRender data={rowData.value} color="#152C5B"/>
      ),
    },
    {
      header: (
        <FormattedMessage
          id="drawer.riskLevel.table.header.block"
          description="table header"
          defaultMessage="Block"
        />
      ),
      render: (rowData: any) => <YesNoConverter bool={rowData.block} />,
    },
    {
      header: (
        <FormattedMessage
          id="drawer.riskLevel.table.header.disabled"
          description="table header"
          defaultMessage="Disabled"
        />
      ),
      render: (rowData: any) => <YesNoConverter bool={rowData.disabled} />,
    },
    {
      header: (
        <FormattedMessage
          id="drawer.riskLevel.table.header.notify"
          description="table header"
          defaultMessage="Notify"
        />
      ),
      render: (rowData: any) => <YesNoConverter bool={rowData.notify} />,
    },
    {
      header: (
        <FormattedMessage
          id="drawer.riskLevel.table.header.created"
          description="table header"
          defaultMessage="Created"
        />
      ),
      render: (rowData: any) => (
        <span>
          <DateAndTimeConverter epoch={rowData.creationTime} />
        </span>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mt: 4 }}>
        <Header
          value={intl.formatMessage({
            id: "customerDetail.drawer.riskRules.header",
            description: "drawer header",
            defaultMessage: "Risk Rules",
          })}
          level={2}
          color="white"
        />
        <StandardTable
          id="risk-two-params-table"
          tableRowPrefix="risk-two-params-table"
          className="mt-4"
          dataList={riskConfigs}
          tableMetadata={RiskLevelMetaData}
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Header
          value={intl.formatMessage({
            id: "customerDetail.drawer.riskMeasurements.header",
            description: "drawer header",
            defaultMessage: "Risk Measurements",
          })}
          level={2}
          color="white"
        />
        <StandardTable
          id="risk-measurements-table"
          tableRowPrefix="risk-two-params-table"
          className="mt-4"
          dataList={riskMeasurementList}
          tableMetadata={RiskMeasurementMetaData}
        />
      </Box>
      <Box sx={{ mt: 5, mb: 3 }}>
        <Header
          value={intl.formatMessage({
            id: "customerDetail.drawer.riskExceptions.header",
            description: "drawer header",
            defaultMessage: "Risk Exceptions",
          })}
          level={2}
          color="white"
        />
        <StandardTable
          id="risk-exceptions-table"
          tableRowPrefix="risk-two-exception-table"
          className="mt-4"
          dataList={riskExceptionList}
          tableMetadata={RiskExceptionMetaData}
        />
      </Box>
    </Box>
  );
};

export default RiskLevelParamsLevelTwo;
