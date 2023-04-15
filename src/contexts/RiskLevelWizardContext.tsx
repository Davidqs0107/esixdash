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

import React, { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { MessageContext } from "./MessageContext";

interface IRiskLevelWizardContext {
  currentStep: number;
  existingRiskLevels: any;
  setRiskLevelToCopy: Function;
  riskLevelToCopy: string;
  newRiskObject: any;
  setNewRiskObject: Function;
  getNextStep: Function;
  getPreviousStep: Function;
  programName: string;
  skippedStep0: boolean;
  toggleDrawer: Function;
  changeOrderObject: any;
  setChangeOrderObject: Function;
}

interface IRiskLevelWizardContextProvider {
  programName: string;
  riskLevel?: string;
  skippedStep0?: boolean;
  startStep?: number;
  toggleDrawer: Function;
  children?: React.ReactNode;
}

export const RiskLevelWizardContext =
  React.createContext<IRiskLevelWizardContext>({
    currentStep: 0,
    existingRiskLevels: [],
    setRiskLevelToCopy: () => {},
    riskLevelToCopy: "",
    newRiskObject: {},
    setNewRiskObject: () => {},
    getNextStep: () => {},
    getPreviousStep: () => {},
    programName: "",
    skippedStep0: false,
    toggleDrawer: () => {},
    changeOrderObject: {},
    setChangeOrderObject: () => {},
  });

const RiskLevelWizardContextProvider: React.FC<IRiskLevelWizardContextProvider> =
  (props) => {
    const { setErrorMsg } = useContext(MessageContext);
    const {
      programName,
      skippedStep0 = false,
      startStep = 0,
      toggleDrawer,
      riskLevel = "",
      children,
    } = props;
    const [existingRiskLevels, setExistingRiskLevels] = useState([]);
    const [riskLevelToCopy, setRiskLevelToCopy] = useState(riskLevel);
    const [currentStep, setCurrentStep] = useState(startStep);
    const [newRiskObject, setNewRiskObject] = useState({});
    const [changeOrderObject, setChangeOrderObject] = useState({});
    const getRiskLevels = () =>
      // @ts-ignore
      api.RiskAPI.getRiskLevels(programName).catch((error: any) =>
        setErrorMsg(error)
      );

    const getNextStep = () => {
      setCurrentStep(currentStep + 1);
    };

    const getPreviousStep = () => {
      setCurrentStep(currentStep - 1);
    };

    useEffect(() => {
      getRiskLevels().then((levels: any) => {
        const levelList = levels.map((l: any) => l.securityLevel);
        levelList.unshift("");
        setExistingRiskLevels(levelList);
      });
    }, []);

    return (
      <RiskLevelWizardContext.Provider
        value={{
          currentStep,
          existingRiskLevels,
          setRiskLevelToCopy,
          riskLevelToCopy,
          newRiskObject,
          setNewRiskObject,
          getNextStep,
          getPreviousStep,
          programName,
          skippedStep0,
          toggleDrawer,
          changeOrderObject,
          setChangeOrderObject,
        }}
      >
        {children}
      </RiskLevelWizardContext.Provider>
    );
  };

export default RiskLevelWizardContextProvider;
