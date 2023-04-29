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

import React, { useContext, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Grid, Box, Typography } from "@mui/material";
import { Link } from "@mui/material";
import { NavLink } from "react-router-dom";
import Header from "../common/elements/Header";
import Label from "../common/elements/Label";
import QDButton from "../common/elements/QDButton";
import AccountHoldersContext from "../../contexts/account-holders/AccountHoldersContext";

interface IRiskLevelCard {
  customer: any;
  cxIdent: any;
}

const AccountHoldersCard: React.FC<IRiskLevelCard> = ({
  customer,
  cxIdent,
}) => {
  const intl = useIntl();
  const accountHoldersContext = useContext(AccountHoldersContext);
  const {
    getAccountHolders,
    accountHoldersList,
    clearAccountHolderContactList,
  } = accountHoldersContext;

  useEffect(() => {
    clearAccountHolderContactList();
    getAccountHolders(cxIdent);
  }, []);

  return (
    <>
      <Box>
        <Box sx={{ mb: "20px" }}>
          <Header
            value={intl.formatMessage({
              id: "accountHolders",
              description: "Account Holders card title",
              defaultMessage: "Account Holders",
            })}
            level={2}
            bold
            color="primary"
          />
        </Box>
        <Box sx={{ mb: "20px" }}>
          {customer ? (
            <Label size="big" bold lineHeight="60px">
              {accountHoldersList.length}
            </Label>
          ) : null}
        </Box>
        <Box>
          <Link
            component={NavLink}
            to={`/customer/${customer?.customerNumber}/account_holders`}
            style={{ textDecoration: "none" }}
          >
            <QDButton
              color="primary"
              variant="contained"
              size="small"
              textCase="provided"
            >
              <FormattedMessage
                id="customer.account.link.account.holders"
                description="Add Account Holder "
                defaultMessage="View Account Holders"
              />
            </QDButton>
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default AccountHoldersCard;
