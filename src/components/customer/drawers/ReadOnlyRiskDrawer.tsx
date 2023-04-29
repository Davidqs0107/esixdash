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

import React, { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import { AxiosResponse } from "axios";
import { CustomerDetailContext } from "../../../contexts/CustomerDetailContext";
import StandardTable from "../../common/table/StandardTable";
import RiskParamConverter from "../../common/converters/RiskParamConverter";
import DateAndTimeConverter from "../../common/converters/DateAndTimeConverter";
import YesNoConverter from "../../common/converters/YesNoConverter";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import emitter from "../../../emitter";
import TextRender from "../../common/TextRender";
import Header from "../../common/elements/Header";

interface IRORiskDrawer {
  toggleDrawer?: any; // provided by Drawer comp
}
const ReadOnlyRiskDrawer: React.FC<IRORiskDrawer> = ({
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
}) => {
  const { customerNumber } = useContext(CustomerDetailContext);
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const [riskMeasurementList, setRiskParamsList] = useState([]);

  const getRiskMeasurements = () =>
    // @ts-ignore
    api.CustomerAPI.getRiskMeasurements(customerNumber)
      .then((riskMeasurements: AxiosResponse<any>) =>
        // @ts-ignore
        setRiskParamsList(riskMeasurements)
      )
      .catch((error: any) => setErrorMsg(error));

  useEffect(() => {
    emitter.on("customer.riskMeasurements.changed", () =>
      getRiskMeasurements()
    );
    getRiskMeasurements();
  }, []);

  const RiskMeasurementMetaData = [
    {
      header: (
        <FormattedMessage
          id="risk.measurement.name"
          description="Name of param/measurement"
          defaultMessage="Name"
        />
      ),
      width: "14.2%",
      render: (rowData: any) => (
        <TextRender
          data={RiskParamConverter(rowData.name, intl)}
          truncated={false}
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
      width: "14.2%",
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
      width: "14.2%",
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
      width: "12.2%",
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
      width: "14.2%",
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
      width: "12.2%",
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
      width: "18.2%",
      render: (rowData: any) => (
        <DateAndTimeConverter
          epoch={rowData.creationTime}
          monthFormat={undefined}
        />
      ),
    },
  ];

  return (
    <Box style={{ width: "600px" }}>
      <Header
        value={intl.formatMessage({
          id: "customerDetail.drawer.riskMeasurements.header",
          description: "drawer header",
          defaultMessage: "Risk Measurements",
        })}
        level={2}
        color="white"
      />
      <Box sx={{ mt: 4 }}>
        <StandardTable
          id="risk-drawer-measurement-table"
          tableRowPrefix="risk-drawer-measurement-table"
          dataList={riskMeasurementList}
          tableMetadata={RiskMeasurementMetaData}
        />
      </Box>
    </Box>
  );
};

export default ReadOnlyRiskDrawer;
