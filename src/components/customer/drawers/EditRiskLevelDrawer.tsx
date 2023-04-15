/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { Formik } from "formik";
import React, { useState, FC, useEffect, useContext } from "react";
import * as Yup from "yup";
import Box from "@mui/material/Box";
import Header from "../../common/elements/Header";
import { MessageContext } from "../../../contexts/MessageContext";
import SubmitButton from "../../common/elements/SubmitButton";
import CancelButton from "../../common/elements/CancelButton";
import { CustomerDetailContext } from "../../../contexts/CustomerDetailContext";
import { CustomerRiskLevelDrawerContext } from "../../../contexts/CustomerRiskLevelDrawerContext";
import emitter from "../../../emitter";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";

interface IEditRiskLevelDrawer {
  toggleDrawer?: Function;
}

const EditRiskLevelDrawer: FC<IEditRiskLevelDrawer> = ({ toggleDrawer }) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const { customerNumber, programName, securityLevel, feePlanName } =
    useContext(CustomerDetailContext);
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

  const updateCustomer = (encId: any, dto: any) =>
    // @ts-ignore
    api.CustomerAPI.updateCustomer(encId, dto).catch((e: any) =>
      setErrorMsg(e)
    );

  const updateRiskLevel = (values: any) => {
    updateCustomer(customerNumber, {
      feePlanName, // required field by the API, resetting to current value
      securityLevel: values.riskLevel,
    }).then((result: any) => {
      emitter.emit("customer.details.changed", {});
      emitter.emit("customer.context.details.changed", {});
      if (toggleDrawer) {
        toggleDrawer();
      }
    });
  };

  useEffect(() => {
    getRiskLevels();
  }, []);

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          value={intl.formatMessage({
            id: "editRiskLevel",
            description: "drawer header",
            defaultMessage: "Edit Risk Level",
          })}
          level={2}
          bold
          color="white"
        />
      </Box>
      <Formik
        initialValues={{
          riskLevel: securityLevel,
        }}
        onSubmit={(values) => updateRiskLevel(values)}
        enableReinitialize
      >
        {(riskLevelProps) => (
          <form onSubmit={riskLevelProps.handleSubmit}>
            <Box sx={{ marginBottom: "60px" }}>
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
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="customer-risk-level-update-cancel"
                  onClick={() => {
                    if (toggleDrawer) {
                      toggleDrawer();
                    }
                  }}
                  style={{ marginRight: "14px" }}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <SubmitButton
                  id="customer-risk-level-update"
                  disabled={!riskLevelProps.dirty}
                >
                  <FormattedMessage
                    id="saveChanges"
                    description="Update risk level button"
                    defaultMessage="Save Changes"
                  />
                </SubmitButton>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default EditRiskLevelDrawer;
