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

import React from "react";

import { Switch } from "react-router-dom";
import PrivateRoute from "../../app/routing/PrivateRoute";
import PrivateBlankRoute from "../../app/routing/PrivateBlankRoute";
import Programs from "./Programs";
import ProgramAdd from "./ProgramAdd";

import ProgramEditWrapper from "./ProgramEditWrapper";

export const programRoutes = [
  {
    name: "Add Program",
    path: "/programs/add",
    RouteComponent: PrivateRoute,
    TargetHOC: ProgramAdd,
  },
  {
    name: "Edit Program",
    path: "/programs/*",
    RouteComponent: PrivateBlankRoute,
    TargetHOC: ProgramEditWrapper,
  },
  {
    name: "Add Program",
    path: "/programs/add/program",
    RouteComponent: PrivateRoute,
    TargetHOC: ProgramAdd,
  },
  {
    name: "Programs",
    path: "/programs",
    RouteComponent: PrivateRoute,
    TargetHOC: Programs,
  },
];

const ProgramRoutes = (props: any) => (
  <Switch>
    {programRoutes.map((route) => (
      <route.RouteComponent
        key={route.path}
        component={route.TargetHOC}
        exact
        path={route.path}
        {...props}
      />
    ))}
  </Switch>
);

export default ProgramRoutes;
