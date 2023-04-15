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

/* eslint-disable react/no-array-index-key */
import React, { Suspense } from "react";
import { Switch } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../../pages/authentication/ErrorFallback";

import LoadingScreen from "../../components/LoadingScreen";
import NotFound from "../../pages/authentication/NoMatch";
import GenericRoute from "./GenericRoute";

const RouteBuilder = (props: any) => {
  const { routes } = props;
  const { publicRoutes, privateRoutes } = routes;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Switch>
          {publicRoutes.map((route: any) => (
            <route.RouteComponent
              exact={route.exact}
              key={route.path}
              component={route.TargetHOC}
              path={route.path}
              roles={route.roles}
            />
          ))}

          {privateRoutes.map((route: any) => (
            <route.RouteComponent
              key={route.path}
              component={route.TargetHOC}
              path={route.path}
              roles={route.roles}
            />
          ))}

          <GenericRoute component={NotFound} path="*" />
        </Switch>
      </ErrorBoundary>
    </Suspense>
  );
};

export default RouteBuilder;
