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

import { lazy } from "react";
import { Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import CustomerPrivateRoute from "./CustomerPrivateRoute";

//
// [1] Login [done]
// [2] get /me/ [done] (partnerUserContext)
// [3] pull the config, generate the routes based on the config (JB will create a new one)
// [4] based on that context routes are dynamically loaded for you
// [5] pass down routes object to the side nav
// [6] call it
//

// lets just say these are all available routes for now...
const routes = {};
console.log("routes.js are loaded...");

// @ts-ignore
routes.privateRoutes = [
  {
    name: "Banks",
    path: "/banks",
    RouteComponent: PrivateRoute,
    TargetHOC: lazy(() => import("../../pages/banks/Banks")),
    roles: {},
  },
  {
    name: "Customer Search",
    path: "/customer",
    RouteComponent: CustomerPrivateRoute,
    TargetHOC: lazy(() => import("../../pages/customer/Customer")),
    roles: {},
  },
  {
    name: "Partners",
    path: "/partners",
    RouteComponent: PrivateRoute,
    TargetHOC: lazy(() => import("../../pages/partners/Partners")),
    roles: {},
  },
  {
    name: "Programs",
    path: "/programs",
    RouteComponent: Route,
    TargetHOC: lazy(() => import("../../pages/programs/ProgramRoutes")),
    roles: {},
  },
  {
    name: "Users",
    path: "/users",
    RouteComponent: PrivateRoute,
    TargetHOC: lazy(() => import("../../pages/users/Users")),
    roles: {},
  },
  {
    name: "Audit",
    path: "/audit",
    RouteComponent: PrivateRoute,
    TargetHOC: lazy(() => import("../../pages/audit/Audit")),
    roles: {},
  },
  {
    name: "Change Orders",
    path: "/change",
    RouteComponent: PrivateRoute,
    TargetHOC: lazy(() => import("../../pages/change-orders/ChangeOrders")),
    roles: {},
  },
  {
    name: "Change Password",
    path: "/changepassword",
    RouteComponent: PublicRoute,
    TargetHOC: lazy(() => import("../../pages/authentication/ChangePassword")),
    roles: {},
  },
];

// @ts-ignore
routes.publicRoutes = [
  {
    exact: true,
    name: "No Access",
    path: "/noaccess",
    RouteComponent: PublicRoute,
    TargetHOC: lazy(() => import("../../pages/authentication/NoAccess")),
    roles: {},
  },
  {
    exact: true,
    name: "Login",
    path: "/",
    RouteComponent: PublicRoute,
    TargetHOC: lazy(() => import("../../pages/authentication/Login")),
    roles: {},
  },
  {
    exact: true,
    name: "Forgot Password",
    path: "/forgot",
    RouteComponent: PublicRoute,
    TargetHOC: lazy(() => import("../../pages/authentication/Forgot")),
    roles: {},
  },
  {
    exact: true,
    name: "Forgot Password",
    path: "/passwordreset",
    RouteComponent: PublicRoute,
    TargetHOC: lazy(() => import("../../pages/authentication/PasswordReset")),
    roles: {},
  },
];

export default routes;
