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

import React from "react";
import { Route, Redirect } from "react-router-dom";
import CustomerSearchContextProvider from "../../contexts/CustomerSearchContext";
import authService from "../../services/authService";
import AccountHolderState from "../../contexts/account-holders/AccountHolderState";

// @ts-ignore
const CustomerPrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = authService.isLoggedIn();
  const { match } = rest;
  // Needed for nested sub routes to be aware of what parent route they originate from.
  const parentMatch = match;

  return (
    <Route
      {...rest}
      render={({ location, ...props }) =>
        isLoggedIn ? (
          <CustomerSearchContextProvider>
            <AccountHolderState>
              <Component parentMatch={parentMatch} {...props} />
            </AccountHolderState>
          </CustomerSearchContextProvider>
        ) : (
          // eslint-disable-next-line react/prop-types
          // @ts-ignore
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};

export default CustomerPrivateRoute;
