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

import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import api from "../api/api";
import authService from "../services/authService";

export const PartnerUserContext = React.createContext<any>({});

const PartnerContextProvider = (props: any) => {
  const [partnerUser, setPartnerUser] = useState({});

  if (!authService.isLoggedIn()) {
    return <Redirect to={{ pathname: "/", state: { from: props.location } }} />;
  }

  const getPartnerUser = () => {
    // @ts-ignore
    api.CurrentUserAPI.getCurrentUserInfo()
      .then((user: any) => {
        setPartnerUser(user);
      })
      .catch((error: any) => {
        /* TODO Toast modal error */
      });
  };

  useEffect(() => {
    getPartnerUser();
  }, []);

  return (
    <PartnerUserContext.Provider value={partnerUser}>
      {props.children}
    </PartnerUserContext.Provider>
  );
};

// TODO Prop Types validation

export default PartnerContextProvider;
