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
import { useParams } from "react-router-dom";
import api from "../api/api";
import emitter from "../emitter";

export const CustomerDetailContext = React.createContext<any>({});

const CustomerDetailContextProvider = (props: any) => {
  // @ts-ignore
  const customerNumber = useParams().id;
  const [customer, setCustomer] = useState({});

  const getCustomer = () =>
    // @ts-ignore
    api.CustomerAPI.get(customerNumber)
      .then((customerDetail: any) => {
        setCustomer(customerDetail);
        // setSelectedRiskLevel(customerDetail.securityLevel);
      })
      .catch((error: any) => error); // TODO Handle error

  useEffect(() => {
    getCustomer();
    emitter.on("customer.context.details.changed", () => getCustomer());
  }, []);

  return (
    <CustomerDetailContext.Provider value={customer}>
      {props.children}
    </CustomerDetailContext.Provider>
  );
};

// TODO Prop Types validation

export default CustomerDetailContextProvider;
