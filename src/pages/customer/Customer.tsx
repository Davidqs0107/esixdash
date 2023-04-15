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

import { Switch } from "react-router-dom";
import CustomerDetail from "./CustomerDetail";
import CustomerSearch from "./CustomerSearch";
import PrivateRoute from "../../app/routing/PrivateRoute";
import CustomerEdit from "./CustomerEdit";
import AccountHolders from "./AccountHolders";
import GenericRoute from "../../app/routing/GenericRoute";
import NotFound from "../authentication/NoMatch";

export const customerRoutes = [
  {
    name: "Customer Detail",
    path: "/customer/:id/detail",
    RouteComponent: PrivateRoute,
    TargetHOC: CustomerDetail,
  },
  {
    name: "Edit Customer",
    path: "/customer/:id/edit",
    RouteComponent: PrivateRoute,
    TargetHOC: CustomerEdit,
  },
  {
    name: "Account Holders",
    path: "/customer/:id/account_holders",
    RouteComponent: PrivateRoute,
    TargetHOC: AccountHolders,
  },
  {
    name: "Account Holders",
    path: "/customer/:id/account_holders/edit/:secondaryId",
    RouteComponent: PrivateRoute,
    TargetHOC: CustomerEdit,
  },
  {
    name: "Customer",
    path: "/customer",
    RouteComponent: PrivateRoute,
    TargetHOC: CustomerSearch,
  },
];

const Customer = (props: any) => (
  <Switch>
    {customerRoutes.map((route) => (
      <route.RouteComponent
        key={route.path}
        component={route.TargetHOC}
        exact
        path={route.path}
        {...props}
      />
    ))}

    <GenericRoute component={NotFound} path="*" />
  </Switch>
);

export default Customer;
