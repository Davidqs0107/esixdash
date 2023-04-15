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

import React, { useEffect, useState, useContext } from "react";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import { Box, FormGroup, List } from "@mui/material";
import { Formik } from "formik";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import Header from "../../common/elements/Header";
import { CustomerDetailContext } from "../../../contexts/CustomerDetailContext";
import emitter from "../../../emitter";

import { CustomerFeePlanDrawerContext } from "../../../contexts/CustomerFeePlanDrawerContext";
import { MessageContext } from "../../../contexts/MessageContext";
import api from "../../../api/api";
import QDButton from "../../common/elements/QDButton";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";

interface ICustomerFeePlanDrawer {
  toggleDrawer?: any; // automatically provided by DrawerComp
  toggleLevelTwo?: any; // automatically provided by DrawerComp
  isLevelTwoOpen?: boolean; // automatically provided by DrawerComp
}
const CustomerFeePlanDrawer: React.FC<ICustomerFeePlanDrawer> = ({
  toggleDrawer = () => {
    /* do nothing */
  },
  toggleLevelTwo = () => {
    /* do nothing */
  },
  isLevelTwoOpen = false,
}) => {
  const intl = useIntl();
  const { customerNumber, programName, securityLevel, feePlanName } =
    useContext(CustomerDetailContext);
  const { setErrorMsg } = useContext(MessageContext);

  const { setSelectedFeePlan } = useContext(CustomerFeePlanDrawerContext);
  const [feePlans, setFeePlans] = useState([]);
  const { readOnly } = useContext(ContentVisibilityContext);

  const updateCustomer = (encId: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.updateCustomer(encId, dto).catch((error: any) =>
      setErrorMsg(error)
    );

  const getFeePlans = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingFeesAPI.getFeePlans(programName)
      .then((plans: any) => {
        const planList = plans.map((p: any) => ({
          text: p.name,
          planName: p.name,
        }));
        plans.unshift({ text: "", planName: "" });
        setFeePlans(planList);
      })
      .catch((error: any) => setErrorMsg(error));

  const updateFeePlan = (values: any) => {
    updateCustomer(customerNumber, {
      feePlanName: values.feePlanName,
      securityLevel, // resetting to current value
    }).then(() => {
      emitter.emit("customer.details.changed", {});
      emitter.emit("customer.context.details.changed", {});
      toggleDrawer();
    });
  };

  useEffect(() => {
    getFeePlans();
    setSelectedFeePlan(feePlanName);
  }, []);

  return (
    <div
      style={{ minWidth: "340px", paddingLeft: "15px", paddingRight: "15px" }}
    >
      <Formik
        initialValues={{
          feePlanName,
        }}
        onSubmit={(values) => updateFeePlan(values)}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
            <Box>
              <Box sx={{ marginBottom: "24px" }}>
                <Header
                  value={intl.formatMessage({
                    id: "customerDetail.drawer.feePlan.header",
                    description: "drawer header",
                    defaultMessage: "Fee Plan Detail",
                  })}
                  bold
                  level={2}
                  color="white"
                />
              </Box>
              <Box sx={{ marginBottom: "24px" }}>
                {feePlans.length > 0 ? (
                  <DropdownFloating
                    {...props}
                    id="risk-level-dropdown"
                    list={feePlans}
                    disabled={readOnly}
                    name="feePlanName"
                    placeholder={intl.formatMessage({
                      id: "riskLevel",
                      defaultMessage: "Risk Level",
                    })}
                    value={props.values.feePlanName}
                    valueKey="planName"
                    handleChange={(e: any) => {
                      setSelectedFeePlan(e.target.value);
                      props.handleChange(e);
                    }}
                  />
                ) : null}
                <Box sx={{ textAlign: "right" }}>
                  <QDButton
                    id="customer-fee-list-toggle"
                    label={
                      !isLevelTwoOpen
                        ? intl.formatMessage({
                            id: "customerDetail.drawer.feePlans.viewAllFees",
                            defaultMessage:
                              "View all fees assigned to this fee plan <<",
                          })
                        : intl.formatMessage({
                            id: "customerDetail.drawer.feePlan.hideAllFees",
                            defaultMessage:
                              "Hide all fees assigned to this fee plan >>",
                          })
                    }
                    variant="text"
                    color="secondary"
                    size="small"
                    onClick={() => toggleLevelTwo()}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ marginRight: "24px" }}>
                  <QDButton
                    id="fee-plan-drawer-save-changes-button"
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    textCase="provided"
                    disabled={!props.dirty || readOnly}
                  >
                    <FormattedMessage
                      id="customerDetail.drawer.feePlans.saveChanges"
                      description="Save changes button"
                      defaultMessage="Save Changes"
                    />
                  </QDButton>
                </Box>
                <QDButton
                  id="fee-plan-drawer-cancel-button"
                  onClick={() => toggleDrawer()}
                  variant="text"
                  size="large"
                  color="secondary"
                >
                  <FormattedMessage
                    id="customerDetail.drawer.feePlans.cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </QDButton>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default CustomerFeePlanDrawer;
