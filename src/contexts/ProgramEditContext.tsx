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
 *
 */

import React, { useContext, useEffect, useState } from "react";
import api from "../api/api";
import emitter from "../emitter";
import { MessageContext } from "./MessageContext";
import { ContentVisibilityContext } from "./ContentVisibilityContext";
import { PartnerUserContext } from "./PartnerUserContext";
import { useQuery } from "@tanstack/react-query";

interface IProgramEditContextProvider {
  programName: string;
  children: React.ReactNode;
}

interface IProgramEditContext {
  programName: string;
  locales: string[];
  program: any;
  cardProfiles: any;
  feePlans: any;
  riskLevels: any;
  mailTemplates: any;
  mailTemplateCount: number;
  mailLanguages: string[];
  memoLanguages: string[];
  memoTemplateCount: number;
  memoTemplates: any;
  bank: any;
  partner: any;
  exchanges: any[];
}

export const ProgramEditContext = React.createContext<IProgramEditContext>({
  programName: "",
  locales: [],
  program: {},
  cardProfiles: [],
  feePlans: [],
  riskLevels: [],
  mailTemplates: [],
  mailTemplateCount: 0,
  mailLanguages: [],
  memoLanguages: [],
  memoTemplateCount: 0,
  memoTemplates: [],
  bank: {},
  partner: {},
  exchanges: [],
});

const ProgramEditContextProvider: React.FC<IProgramEditContextProvider> = ({
  programName,
  children,
}) => {
  const { setErrorMsg } = useContext(MessageContext);
  const { canSeeLinkedPartners } = useContext(ContentVisibilityContext);
  const partnerUserContext = useContext(PartnerUserContext);
  const isProgramManager =
    partnerUserContext.roles &&
    partnerUserContext.roles.indexOf("ProgramManager") > -1;
  const getLocales = () =>
    // @ts-ignore
    api.CommonAPI.getLocales().catch((error: any) => setErrorMsg(error));
  const get = (name: string) =>
    // @ts-ignore
    api.OperatingAPI.get(name).catch((error: any) => setErrorMsg(error));
  const getRiskLevels = (name: string) =>
    // @ts-ignore
    api.RiskAPI.getRiskLevels(name).catch((error: any) => setErrorMsg(error));
  const getPartnerDTO = (name: string) =>
    // @ts-ignore
    api.PartnerAPI.getPartnerDTO(name).catch((error: any) =>
      setErrorMsg(error)
    );
  const getExchanges = (name: string) =>
    // @ts-ignore
    api.OperatingAPI.getExchanges(name).catch((error: any) =>
      setErrorMsg(error)
    );
  const getCardProfiles = (name: string) =>
    // @ts-ignore
    api.CardProfileAPI.getCardProfiles(name, null).catch((error: any) =>
      setErrorMsg(error)
    );
  const getFeePlans = (name: string) =>
    // @ts-ignore
    api.OperatingFeesAPI.getFeePlans(name).catch((error: any) =>
      setErrorMsg(error)
    );
  const getMailTemplateSets = (name: string) =>
    // @ts-ignore
    api.MailTemplateAPI.getMailTemplateSets(name).catch((error: any) =>
      setErrorMsg(error)
    );
  const getMailTemplates = (name: string, language: string) =>
    // @ts-ignore
    api.MailTemplateAPI.getMailTemplates(name, language).catch((error: any) =>
      setErrorMsg(error)
    );
  const getMemoTemplateSets = (name: string) =>
    // @ts-ignore
    api.MemoAPI.getMemoTemplateSets(name).catch((error: any) =>
      setErrorMsg(error)
    );
  const getMemoTemplates = (name: string, language: string) =>
    // @ts-ignore
    api.MemoAPI.getMemoTemplates(name, language).catch((error: any) =>
      setErrorMsg(error)
    );
  const getBank = (bankName: string) =>
    // @ts-ignore
    api.BankAPI.get(bankName).catch((error: any) => setErrorMsg(error));
  const getIINs = (bankName: string) =>
    // @ts-ignore
    api.BankAPI.getIINs(bankName).catch((error: any) => setErrorMsg(error));
  const getCurrencies = (bankName: string) =>
    // @ts-ignore
    api.BankAPI.getCurrencies(bankName).catch((error: any) =>
      setErrorMsg(error)
    );

  const canEditPartner = (partnerName: string) => {
    return (
      canSeeLinkedPartners || partnerName === partnerUserContext.partnerName
    );
  };

  const getLinkedPartners = async (partnerName: string) => {
    return canEditPartner(partnerName)
      ? // @ts-ignore
        api.PartnerAPI.listLinkedPartners2(partnerName).catch((error: any) => {
          if (!isProgramManager) setErrorMsg(error);
        })
      : new Promise<any>((resolve) => resolve([]));
  };

  const getLinkedPrograms = async (partnerName: string) =>
    // @ts-ignore
    api.PartnerAPI.getPartnerPrograms(partnerName).catch((error: any) =>
      setErrorMsg(error)
    );

  const [program, setProgram] = useState({});
  const [cardProfiles, setCardProfiles] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [feePlans, setFeePlans] = useState([]);
  const [riskLevels, setRiskLevels] = useState([]);
  const [mailTemplates, setMailTemplates] = useState(new Map());
  const [mailTemplateCount, setMailTemplateCount] = useState(0);
  const [mailLanguages, setMailLanguages] = useState([]);
  const [memoLanguages, setMemoLanguages] = useState([]);
  const [memoTemplateCount, setMemoTemplateCount] = useState(0);
  const [memoTemplates, setMemoTemplates] = useState(new Map());
  const [bank, setBank] = useState({});
  const [partner, setPartner] = useState({});
  const [locales, setLocales] = useState([]);

  const { data: getLocalesData } = useQuery({
    queryKey: ["getLocales"],
    queryFn: () =>
      // @ts-ignore
      api.CommonAPI.getLocales(),
    onError: (error: any) => setErrorMsg(error),
  });

  const getProgramInfo = () => {
    get(programName).then((prog: any) => {
      //set program location
      const arr = prog.language.split("-");
      if (arr.length > 1) {
        prog.location = arr[1];
      }
      setProgram(prog);
      const promises = [
        // 0
        getRiskLevels(prog.name),
        // 1
        getPartnerDTO(prog.partnerName),
        // 2
        getCardProfiles(prog.name),
        // 3
        getMailTemplateSets(prog.name),
        // 4
        getMemoTemplateSets(prog.name),
        // 5
        getBank(prog.bankName),
        // 6
        getIINs(prog.bankName),
        // 7
        getCurrencies(prog.bankName),
        // 8
        getFeePlans(prog.name),
        // 9
        getRiskLevels(prog.name),
        // 10
        getLinkedPartners(prog.partnerName),
        // 11
        getLinkedPrograms(prog.partnerName),
        // 12
        getExchanges(prog.name),
      ];

      Promise.all(promises).then((results) => {
        setRiskLevels(results[0]);
        setPartner({
          ...results[1],
          linkedPartners: results[10],
          linkedPrograms: results[11],
        });
        setCardProfiles(results[2]);

        const mailTemplateSets = results[3];
        const sets = mailTemplateSets.map((set: any) => set.language);
        sets.unshift("");
        setMailLanguages(sets);

        const memoTemplateSets = results[4];
        const memoSets = memoTemplateSets.map((set: any) => set.language);
        memoSets.unshift("");
        setMemoLanguages(memoSets);

        setBank({
          id: results[5].id,
          name: results[5].name,
          iins: results[6],
          currencies: results[7],
          complianceCurrency: results[5].complianceCurrency,
        });

        setFeePlans(results[8]);
        setExchanges(results[12]);

        Promise.all(
          mailTemplateSets.map((set: any) =>
            getMailTemplates(programName, set.language)
          )
        ).then((templates) => {
          const map = new Map();
          // eslint-disable-next-line max-len
          mailTemplateSets.map((lang: any, index: number) =>
            map.set(lang.language, templates[index])
          );
          setMailTemplates(map);
          // eslint-disable-next-line prefer-spread
          setMailTemplateCount(
            [].concat.apply([], Array.from(map.values())).length
          );
        });

        Promise.all(
          memoTemplateSets.map((set: any) =>
            getMemoTemplates(programName, set.language)
          )
        ).then((memoTemps) => {
          const map = new Map();
          // eslint-disable-next-line max-len
          memoTemplateSets.map((lang: any, index: number) =>
            map.set(lang.language, memoTemps[index])
          );
          setMemoTemplates(map);
          // eslint-disable-next-line prefer-spread
          setMemoTemplateCount(
            [].concat.apply([], Array.from(map.values())).length
          );
        });
      });
    });
  };

  useEffect(() => {
    getProgramInfo();
    emitter.on("programs.edit.changed", () => getProgramInfo());
  }, []);

  useEffect(() => {
    if (getLocalesData) {
      const list = getLocalesData.map((l: any) => ({
        text: l.displayName,
        code: l.code,
      }));
      setLocales(list);
    }
  }, [getLocalesData]);

  return (
    <ProgramEditContext.Provider
      value={{
        programName,
        locales,
        program,
        cardProfiles,
        feePlans,
        riskLevels,
        mailTemplates,
        mailTemplateCount,
        mailLanguages,
        memoLanguages,
        memoTemplateCount,
        memoTemplates,
        bank,
        partner,
        exchanges,
      }}
    >
      {children}
    </ProgramEditContext.Provider>
  );
};

export default ProgramEditContextProvider;
