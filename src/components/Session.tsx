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
import authService from "../services/authService";

/*
 * Class to handle sessionId management across multiple tabs/windows of the same browser. It would have made sense to
 * merge this code into the Auth class but it turned out that this code was called very often within Auth but only
 * when needed as a separate class.
 */
function Session({ children }: any) {
  let timerSet = false;

  /* Broadcast channel is the newest way to pass information between tabs and has the benefit of not persisting
   * data anywhere it does not need to be. The downside is that Safari does not support it yet. */
  if ("BroadcastChannel" in self) {
    const requestURL = location.href;
    const channel = new BroadcastChannel("E6TokenBus");

    if (!authService.getTokenId()) {
      channel.postMessage({ type: "request" });
    }

    channel.onmessage = (msg: MessageEvent) => {
      if (msg.data.type === "request" && authService.getTokenId()) {
        channel.postMessage({
          type: "response",
          token: authService.getTokenId(),
        });
      } else if (msg.data.type === "response" && !authService.getTokenId()) {
        authService.setSession(msg.data.token);
        channel.close();

        /* The response could be returned _after_ the page has been forcefully navigated to the login page.
         * This will return the user to their requested page. Only happens on initial request, all subsequent
         * requests (including refreshes) already have the sessionId so the below will not trigger. */
        location.href = requestURL;
      }
    };
  } else {
    /* This is the older way of transferring data between tabs, it should only be used by Safari. On first
     * loading the app, this will check to see if the tokenId is set in localStorage. */
    window.addEventListener("load", () => {
      const tokenId = localStorage.getItem("tokenId");

      if (!authService.getTokenId() && tokenId) {
        authService.setSession(tokenId);
      }
    });

    window.addEventListener("blur", () => {
      const sessionId = authService.getTokenId();
      if (sessionId) {
        localStorage.setItem("tokenId", sessionId);
        localStorage.setItem("setTime", Date.now().toString());
      }

      if (!timerSet) {
        /* Check every 10 seconds to see if the token is over 10 seconds old, and if it is then remove it. */
        setInterval(() => {
          const setTime = Number(localStorage.getItem("setTime"));

          if (setTime > 0 && Date.now() - setTime >= 10000) {
            localStorage.removeItem("tokenId");
            localStorage.removeItem("setTime");
          }

          timerSet = true;
        }, 10000);
      }
    });
  }

  return children;
}

export default Session;
