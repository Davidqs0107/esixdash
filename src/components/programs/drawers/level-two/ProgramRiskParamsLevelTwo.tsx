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
 *
 */

import { FormattedMessage, useIntl } from "react-intl";
import { Box } from "@mui/material";
import React, { useContext, useEffect, useState, lazy } from "react";
import StandardTable from "../../../common/table/StandardTable";
import YesNoConverter from "../../../common/converters/YesNoConverter";
import DateAndTimeConverter from "../../../common/converters/DateAndTimeConverter";
import api from "../../../../api/api";
import { ProgramDetailContext } from "../../../../contexts/ProgramDetailContext";
import RiskParamConverter from "../../../common/converters/RiskParamConverter";
import { MessageContext } from "../../../../contexts/MessageContext";
import TextRender from "../../../common/TextRender";
import Header from "../../../common/elements/Header";

const QDButton = lazy(() => import("../../../common/elements/QDButton"));

const ProgramRiskParamsLevelTwo = () => {
  const intl = useIntl();
  const { programName, level } = useContext(ProgramDetailContext);
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const [riskConfigs, setRiskConfigs] = useState([]);

  const createUpdateRiskConfigRequest = (
    programName: string,
    id: number,
    dto: any
  ) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingChangeOrderAPI.createUpdateRiskConfigRequest(
      programName,
      id,
      dto
    ).catch((e: any) => setErrorMsg(e));

  const deleteConfig = (paramName: any, value: any) => {
    const changeOrderDto = {
      type: "OperatingRisk",
      partnerProgramName: programName,
      memo: `Deleting '${paramName}' rule from ${level} risk level.`,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingChangeOrderAPI.createChangeOrder(
      programName,
      changeOrderDto
    ).then(async (orderResult: any) => {
      // new Risk Level
      const riskLevelDto = {
        memo: `Deleting '${paramName}' rule from ${level} risk level.`,
        securityLevel: level,
        paramName,
        value,
        action: "Delete",
      };

      await createUpdateRiskConfigRequest(
        programName,
        orderResult.id,
        riskLevelDto
      ).then(() => {
        setSuccessMsg({
          responseCode: "200000",
          message: `${intl.formatMessage({
            id: "program.riskLevels.deleteRiskRule",
            defaultMessage: "Change order created to delete risk rule",
          })}: ${RiskParamConverter(paramName, intl)}`,
        });
      });
    });
  };

  const getRiskConfigs = (currentProgramName: any, securityLevel: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.RiskAPI.getRiskConfigs(currentProgramName, securityLevel)
      .then((configs: any) => {
        setRiskConfigs(configs);
      })
      .catch((error: any) => error);
  };

  const RiskLevelMetaData = [
    {
      header: (
        <FormattedMessage
          id="name"
          description="table header"
          defaultMessage="Name"
        />
      ),
      flex: "flex-2",
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
          id="value"
          description="table header"
          defaultMessage="Value"
        />
      ),
      render: (rowData: any) => (
        <TextRender data={rowData.value} color="#152C5B" />
      ),
    },
    {
      header: (
        <FormattedMessage
          id="block"
          description="table header"
          defaultMessage="Block"
        />
      ),
      render: (rowData: any) => <YesNoConverter bool={rowData.block} />,
    },
    {
      header: (
        <FormattedMessage
          id="disabled"
          description="table header"
          defaultMessage="Disabled"
        />
      ),
      render: (rowData: any) => <YesNoConverter bool={rowData.disabled} />,
    },
    {
      header: (
        <FormattedMessage
          id="notify"
          description="table header"
          defaultMessage="Notify"
        />
      ),
      render: (rowData: any) => <YesNoConverter bool={rowData.notify} />,
    },
    {
      header: (
        <FormattedMessage
          id="created"
          description="table header"
          defaultMessage="Created"
        />
      ),
      flex: "flex-2",
      render: (rowData: any) => (
        <span>
          <DateAndTimeConverter
            epoch={rowData.creationTime}
            monthFormat={undefined}
          />
        </span>
      ),
    },
    {
      header: <> </>,
      width: "115px",
      render: (rowData: any) => (
        <QDButton
          id="programs-riskLevel-param-delete"
          label={intl.formatMessage({
            id: "delete",
            defaultMessage: "Delete",
          })}
          className="float-right"
          onClick={() => deleteConfig(rowData.paramName, rowData.value)}
          color="primary"
          variant="contained"
          size="small"
        />
      ),
    },
  ];

  useEffect(() => {
    getRiskConfigs(programName, level);
  }, [level]);

  return (
    <Box>
      <Header
        value={intl.formatMessage({
          id: "riskLevelParameters",
          description: "drawer header",
          defaultMessage: "Risk Level Parameters",
        })}
        level={2}
        color="white"
        bold
        drawerTitle
      />
      <StandardTable
        id="programs-risk-level-configs-table"
        tableRowPrefix="program-risk-level-configs-table"
        dataList={riskConfigs}
        tableMetadata={RiskLevelMetaData}
      />
    </Box>
  );
};

export default ProgramRiskParamsLevelTwo;
