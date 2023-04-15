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

import React, { ReactElement, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import FormControl from "@mui/material/FormControl";
import { Box, Container } from "@mui/material";
import { Link, MenuItem, Select, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import Header from "../../common/elements/Header";
import Label from "../../common/elements/Label";
import { convertDate } from "../../util/ConvertEpochToDate";
// eslint-disable-next-line no-use-before-define
import api from "../../../api/api";
import {
  BillingHistory,
  OfferingCustomerSummary,
} from "../../../types/customer";
import emitter from "../../../emitter";
import QDFormattedCurrency from "../../common/converters/QDFormattedCurrency";

interface IDrawerBillingHistory {
  customerSummary: OfferingCustomerSummary;
  homeCurrency: string;
  toggleDrawer: () => void;
}

const DrawerBillingHistory: React.FC<IDrawerBillingHistory> = ({
  customerSummary,
  homeCurrency,
  toggleDrawer,
}): ReactElement => {
  const [selectedBillingHistory, setSelectedBillingHistory] =
    useState<BillingHistory>();

  const [billingHistories, setBillingHistories] = useState<BillingHistory[]>();
  const intl = useIntl();

  const getBillingHistories = (customerNumber: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.ProductAPI.getOfferingActions(customerNumber).then((res: any) => {
      if (res) {
        let req = res.filter(
          (a: { name: string }) => a.name == "billingHistory"
        )[0];
        if (req) {
          const attribute = req.attributes.filter(
            (attribute: { name: string }) => (attribute.name = "limit")
          )[0];
          attribute.value = 12;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          api.ProductAPI.executeOfferingAction(customerNumber, req).then(
            (res: any) => {
              setBillingHistories(res);
              if (res.length > 0) {
                setSelectedBillingHistory(res[0]);
              }
            }
          ).catch((error: any) => console.log(error));
        }
      }
    });
  };

  useEffect(() => {
    getBillingHistories(customerSummary.customerNumber);
  }, []);

  const handleChange = (event: any) => {
    setSelectedBillingHistory(event.target.value);
  };

  const jumpToTransaction = () => {
    // emit the event
    emitter.emit("customer.billing.history.changed", {
      tab: "transactions",
      startDate: selectedBillingHistory?.billingPeriodStart,
      endDate: selectedBillingHistory?.billingPeriodClose,
    });
    toggleDrawer();
  };

  return (
    <Container
      sx={{
        minWidth: "400px",
        "& .billingDetails .MuiTypography-body1, & .billingDetails .MuiTypography-labelLight":
          {
            display: "block",
          },
        "& .billingDetails .MuiTypography-labelLight": {
          marginBottom: "15px",
        },
        "& .MuiTypography-link": {
          color: "#FFFFFF",
          display: "block",
          marginBottom: "15px",
        },
      }}
    >
      <Box>
        <Header
          level={2}
          bold
          color="white"
          value={intl.formatMessage({
            id: "customer.drawer.billingHistory.header",
            defaultMessage: "Billing History",
          })}
        />
        <Box className="mb-2">
          <Box>
            <FormControl
              style={{
                minWidth: "100%",
                marginTop: 15,
              }}
              variant="outlined"
            >
              {selectedBillingHistory && (
                <Select
                  labelId="billing-history-select-label"
                  id="billing-history-select"
                  value={selectedBillingHistory}
                  onChange={handleChange}
                  color="primary"
                  sx={{
                    ".MuiOutlinedInput-notchedOutline legend": {
                      maxWidth: "0px",
                    },
                  }}
                >
                  {billingHistories?.length ? (
                    billingHistories.map((h) => {
                      return (
                        // @ts-ignore
                        <MenuItem
                          className="body-interactive"
                          value={h}
                          key={h.billingPeriodClose}
                        >
                          {convertDate(h.billingPeriodClose)}
                        </MenuItem>
                      );
                    })
                  ) : (
                    <MenuItem className="body-interactive">No data.</MenuItem>
                  )}
                </Select>
              )}
            </FormControl>
          </Box>
        </Box>
      </Box>

      {selectedBillingHistory && (
        <Box>
          <Box>
            <Label variant="labelLight">
              <Link onClick={jumpToTransaction} variant="link">
                <FormattedMessage
                  id="viewCycleTransaction"
                  defaultMessage="View Cycle Transactions"
                />
              </Link>
            </Label>
          </Box>

          <Box className="billingDetails">
            <Box>
              <Label>
                <FormattedMessage
                  id="cycleStartDate"
                  defaultMessage="Cycle Start Date"
                />
              </Label>
              <Label variant="labelLight">
                {selectedBillingHistory
                  ? convertDate(selectedBillingHistory.billingPeriodStart)
                  : "- -"}
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="cycleEndDate"
                  defaultMessage="Cycle End Date"
                />
              </Label>
              <Label variant="labelLight">
                {selectedBillingHistory
                  ? convertDate(selectedBillingHistory.billingPeriodClose)
                  : "- -"}
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="cycleBalance"
                  defaultMessage="Cycle Balance"
                />
              </Label>
              <Label variant="labelLight">
                <QDFormattedCurrency
                  className="MuiTypography-body1 label-white-regular"
                  currency={homeCurrency}
                  amount={
                    selectedBillingHistory
                      ? selectedBillingHistory.closingBalance
                      : "0"
                  }
                />
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="previousCycleBalance"
                  defaultMessage="Previous Cycle Balance"
                />
              </Label>
              <Label variant="labelLight">
                <QDFormattedCurrency
                  className="MuiTypography-body1 label-white-regular"
                  currency={homeCurrency}
                  amount={
                    selectedBillingHistory
                      ? selectedBillingHistory.previousClosingBalance
                      : "0"
                  }
                />
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="minimumDue"
                  defaultMessage="Minimum Due"
                />
              </Label>
              <Label variant="labelLight">
                <QDFormattedCurrency
                  className="MuiTypography-body1 label-white-regular"
                  currency={homeCurrency}
                  amount={
                    selectedBillingHistory
                      ? Math.ceil(selectedBillingHistory.minimumDue)
                      : "0"
                  }
                />
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="paymentDueDate"
                  defaultMessage="Payment Due Date"
                />
              </Label>
              <Label variant="labelLight">
                {selectedBillingHistory
                  ? convertDate(selectedBillingHistory.repaymentPeriodEnd)
                  : "- -"}
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="creditLimit"
                  defaultMessage="Credit Limit"
                />
              </Label>
              <Label variant="labelLight">
                <QDFormattedCurrency
                  className="MuiTypography-body1 label-white-regular"
                  currency={homeCurrency}
                  amount={
                    selectedBillingHistory
                      ? selectedBillingHistory.creditLimit
                      : "0"
                  }
                />
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="availableCredit"
                  defaultMessage="Available Credit"
                />
              </Label>
              <Label variant="labelLight">
                <QDFormattedCurrency
                  className="MuiTypography-body1 label-white-regular"
                  currency={homeCurrency}
                  amount={
                    selectedBillingHistory
                      ? selectedBillingHistory.creditLimit +
                        selectedBillingHistory.closingBalance
                      : "0"
                  }
                />
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage id="payments" defaultMessage="Payments" />
              </Label>
              <Label variant="labelLight">
                {selectedBillingHistory?.payments ? (
                  <QDFormattedCurrency
                    className="MuiTypography-body1 label-white-regular"
                    currency={homeCurrency}
                    amount={
                      selectedBillingHistory
                        ? selectedBillingHistory.payments
                        : "0"
                    }
                  />
                ) : (
                  "--"
                )}
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage id="credits" defaultMessage="Credits" />
              </Label>
              <Label variant="labelLight">
                {selectedBillingHistory?.credits ? (
                  <QDFormattedCurrency
                    className="MuiTypography-body1 label-white-regular"
                    currency={homeCurrency}
                    amount={
                      selectedBillingHistory
                        ? selectedBillingHistory.credits
                        : "0"
                    }
                  />
                ) : (
                  "--"
                )}
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="purchasesCharged"
                  defaultMessage="Purchases Charged"
                />
              </Label>
              <Label variant="labelLight">
                <QDFormattedCurrency
                  className="MuiTypography-body1 label-white-regular"
                  currency={homeCurrency}
                  amount={
                    selectedBillingHistory
                      ? selectedBillingHistory.purchaseBalance
                      : "0"
                  }
                />
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="cashAdvanceCharged"
                  defaultMessage="Cash Advance Charged"
                />
              </Label>
              <Label variant="labelLight">
                <QDFormattedCurrency
                  className="MuiTypography-body1 label-white-regular"
                  currency={homeCurrency}
                  amount={
                    selectedBillingHistory
                      ? selectedBillingHistory.cashAdvanceBalance
                      : "0"
                  }
                />
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="feeCharged"
                  defaultMessage="Fee Charged"
                />
              </Label>
              <Label variant="labelLight">
                <QDFormattedCurrency
                  className="MuiTypography-body1 label-white-regular"
                  currency={homeCurrency}
                  amount={
                    selectedBillingHistory
                      ? selectedBillingHistory.feeAdjustment
                      : "0"
                  }
                />
              </Label>
            </Box>

            <Box>
              <Label>
                <FormattedMessage
                  id="interestCharged"
                  defaultMessage="Interest Charged"
                />
              </Label>
              <Label variant="labelLight">
                <QDFormattedCurrency
                  className="MuiTypography-body1 label-white-regular"
                  currency={homeCurrency}
                  amount={
                    selectedBillingHistory
                      ? selectedBillingHistory.totalInterest
                      : "0"
                  }
                />
              </Label>
            </Box>

            <Box>
              <Label>Total Charged for Credit</Label>
              <Label variant="labelLight">
                {selectedBillingHistory?.totalCostOfCredit ? (
                  <QDFormattedCurrency
                    className="MuiTypography-body1 label-white-regular"
                    currency={homeCurrency}
                    amount={
                      selectedBillingHistory?.totalCostOfCredit
                        ? selectedBillingHistory.totalCostOfCredit
                        : "0"
                    }
                  />
                ) : (
                  "--"
                )}
              </Label>
            </Box>

            <Box>
              <Label>Estimated Interest</Label>
              <Label variant="labelLight">
                {selectedBillingHistory?.estimatedInterest ? (
                  <QDFormattedCurrency
                    className="MuiTypography-body1 label-white-regular"
                    currency={homeCurrency}
                    amount={
                      selectedBillingHistory?.estimatedInterest
                        ? selectedBillingHistory.estimatedInterest
                        : "0"
                    }
                  />
                ) : (
                  "--"
                )}
              </Label>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default DrawerBillingHistory;
