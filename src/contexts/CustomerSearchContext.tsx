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

import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toCustomerUI } from "../components/common/converters/CustomerConverter";

export const CustomerSearchContext = React.createContext<any>({});

const CustomerSearchContextProvider = (props: any) => {
  const initFilter = {
    supportStatus: [],
    accountStatus: [],
    riskStatus: [],
    banks: [],
    partners: [],
    programs: [],
  };

  const [dto, setDto] = useState<any>(null);
  const [filter, setFilter] = useState(initFilter);
  const [customerList, setCustomerList] = useState([]);
  const [cursor, setCursor] = useState({});
  const [nextCursor, setNextCursor] = useState(undefined);
  // const [programs, setPrograms] = useState([]);
  // const [banks, setBanks] = useState([]);
  // const [partners, setPartners] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 25;

  const search = async () => {
    const { searchBy } = dto;
    delete dto.searchBy;
    switch (searchBy) {
      case "name":
        // @ts-ignore
        return api.CustomerAPI.searchByName(dto).catch((error: any) => error);
      case "customerNumber":
        // @ts-ignore
        return api.CustomerAPI.searchByCustomerNumber(dto).catch(
          (error: any) => error
        );
      case "externalReference":
        // @ts-ignore
        return api.CustomerAPI.searchByExternalReference(dto).catch(
          (error: any) => error
        );
      case "card":
        // @ts-ignore
        return api.CustomerAPI.searchByCard(dto).catch((error: any) => error);
      case "PAN":
        // @ts-ignore
        return api.CustomerAPI.searchByPAN(dto).catch((error: any) => error);
    }
  };

  const resetFilter = () => {
    setDto(null);
    setFilter(initFilter);
  };

  // const getProgramList = () => {
  //   api.OperatingAPI.list()
  //     .then((list) => {
  //       setPrograms(list.map((program) => program.name));
  //     })
  //     .catch((error) => error);
  // };
  //
  // const getBankList = () => {
  //   api.BankAPI.list()
  //     .then((list) => {
  //       setBanks(list.map((bank) => bank.name));
  //     })
  //     .catch((error) => error);
  // };
  //
  // const getPartnerList = () => {
  //   api.PartnerAPI.list()
  //     .then((list) => {
  //       setPartners(list.map((partner) => partner.name));
  //     })
  //     .catch((error) => error);
  // };

  useEffect(() => {
    if (dto !== null) {
      search().then((list) => {
        const { results, cursor, nextCursor, resultCount } = list;
        setTotalCount(resultCount);
        setCursor(cursor);
        if (resultCount > pageSize) {
          setNextCursor(nextCursor);
        }
        setCustomerList(toCustomerUI({ data: results !== undefined ? results : [] }));
      });
    }
  }, [dto, filter]);

  // useEffect(() => {
  //   getProgramList();
  //   getBankList();
  //   getPartnerList();
  // }, []);

  return (
    <CustomerSearchContext.Provider
      value={{
        dto,
        setDto,
        filter,
        resetFilter,
        setFilter,
        customerList,
        // programs,
        // banks,
        // partners,
        totalCount,
        pageSize,
        cursor,
        setCursor,
        nextCursor,
        setNextCursor,
      }}
    >
      {props.children}
    </CustomerSearchContext.Provider>
  );
};

export default CustomerSearchContextProvider;
