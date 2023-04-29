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

import Box from "@mui/material/Box";
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Header from "../../common/elements/Header";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import { CustomerRiskLevelDrawerContext } from "../../../contexts/CustomerRiskLevelDrawerContext";
import QDButton from "../../common/elements/QDButton";

interface ICustomerRiskRuleDrawer {
  toggleDrawer?: any; // provided by Drawer comp
  programName: string;

  toggleLevelTwo?: any;
  isLevelTwoOpen?: boolean;
  securityLevel: number;
}

const CustomerRiskLevelDrawer: React.FC<ICustomerRiskRuleDrawer> = ({
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
  programName,
  toggleLevelTwo = () => {
    /* provided by drawer comp */
  },
  isLevelTwoOpen = false,
  securityLevel,
}) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const { setSelectedRiskLevel } = useContext(CustomerRiskLevelDrawerContext);
  const [riskLevels, setRiskLevels] = useState([]);

  const getRiskLevels = () =>
    // @ts-ignore
    api.RiskAPI.getRiskLevels(programName)
      .then((levels: any) => {
        const secLevels = levels.map((l: any) => l.securityLevel);
        setRiskLevels(secLevels);
      })
      .catch((error: any) => setErrorMsg(error));

  useEffect(() => {
    getRiskLevels();
  }, []);

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          bold
          color="white"
          value={intl.formatMessage({
            id: "editRiskLevel",
            defaultMessage: "Edit Risk Level",
          })}
        />
      </Box>
      <Formik
        initialValues={{ riskLevel: securityLevel }}
        onSubmit={() => {}}
        enableReinitialize
      >
        {(riskLevelProps) => (
          <form onSubmit={riskLevelProps.handleSubmit}>
            <Box>
              {riskLevels.length > 0 ? (
                <DropdownFloating
                  {...riskLevelProps}
                  id="risk-level-dropdown"
                  list={riskLevels}
                  name="riskLevel"
                  placeholder={intl.formatMessage({
                    id: "riskLevel",
                    defaultMessage: "Risk Level",
                  })}
                  value={riskLevelProps.values.riskLevel}
                  handleChange={(e: any) => {
                    setSelectedRiskLevel(e.target.value);
                    riskLevelProps.handleChange(e);
                  }}
                />
              ) : null}
            </Box>
            <Box
              sx={{
                textAlign: "right",
                mb: "80px",
              }}
            >
              <QDButton
                id="program-risk-list-toggle"
                label={
                  isLevelTwoOpen
                    ? intl.formatMessage({
                        id: "riskLevel.hideRules",
                        defaultMessage:
                          "Hide all rules assigned to this risk level >>",
                      })
                    : intl.formatMessage({
                        id: "riskLevel.showRules",
                        defaultMessage:
                          "Show all rules assigned to this risk level <<",
                      })
                }
                variant="text"
                color="secondary"
                size="small"
                onClick={() => toggleLevelTwo()}
              />
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CustomerRiskLevelDrawer;
