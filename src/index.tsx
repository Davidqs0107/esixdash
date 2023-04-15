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

import { enableES5 } from "immer";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { store, persistor } from "./store";

import App from "./app/App";
import ReportWebVitals from "./ReportWebVitals";
// import "bootstrap/dist/css/bootstrap.min.css"; //after theme refactor, we should be able to remove this
import "./index.css";
import ThemeProvider from "./theme/ThemeProvider";

import LanguageContextProvider from "./contexts/LanguageContextProvider";
import MessageContextProvider from "./contexts/MessageContext";

enableES5();

const sessionStoragePersister = createSyncStoragePersister({
  storage: window.sessionStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

persistQueryClient({
  queryClient,
  persister: sessionStoragePersister,
});

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <LanguageContextProvider>
        <MessageContextProvider>
          <ThemeProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </ThemeProvider>
        </MessageContextProvider>
      </LanguageContextProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: ReportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
ReportWebVitals(null);
