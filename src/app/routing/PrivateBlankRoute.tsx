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

import React from "react";
import { Route, Redirect } from "react-router-dom";
import authService from "../../services/authService";
import Dashboard from "../../pages/Dashboard";

// @ts-ignore
const PrivateBlankRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = authService.isLoggedIn();
  const { match } = rest;
  const parentMatch = match; // Needed for nested sub routes to be aware of what parent route they originate from.

  return (
    <Route
      {...rest}
      render={({ location, ...props }) =>
        isLoggedIn ? (
          <>
            {/* @ts-ignore */}
            <Dashboard blank>
              <Component parentMatch={parentMatch} {...props} />
            </Dashboard>
          </>
        ) : (
          // eslint-disable-next-line react/prop-types
          // @ts-ignore
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateBlankRoute;
