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
import { useIntl } from "react-intl";

interface IFeePlanWizardContextProvider {
  programName: string;
  skippedStep0?: boolean;
  startStep?: number;
  toggleDrawer: Function;
  feePlan?: string;
  children?: React.ReactNode;
}

interface IFeePlanWizardContext {
  currentStep: number;
  getNextStep: Function;
  getPreviousStep: Function;
  programName: string;
  skippedStep0: boolean;
  feePlanToCopy: string;
  setFeePlanToCopy: Function;
  newFeeObject: any;
  setNewFeeObject: Function;
  existingFeePlans: string[];
  toggleDrawer: Function;
  currencies: string[];
  changeOrderObject: any;
  setChangeOrderObject: Function;
  children?: React.ReactNode;
  calculationMethods: string[];
}

export const FeePlanWizardContext = React.createContext<IFeePlanWizardContext>({
  currentStep: 0,
  getNextStep: () => {},
  getPreviousStep: () => {},
  programName: "",
  skippedStep0: false,
  feePlanToCopy: "",
  setFeePlanToCopy: () => {},
  newFeeObject: {},
  setNewFeeObject: () => {},
  existingFeePlans: [],
  toggleDrawer: () => {},
  currencies: [],
  changeOrderObject: {},
  setChangeOrderObject: () => {},
  calculationMethods: [],
});

const FeePlanWizardContextProvider: React.FC<IFeePlanWizardContextProvider> = ({
  programName,
  skippedStep0 = false,
  startStep = 0,
  toggleDrawer,
  children,
  feePlan = "",
}) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const [currentStep, setCurrentStep] = useState(startStep);
  const [newFeeObject, setNewFeeObject] = useState({});
  const [feePlanToCopy, setFeePlanToCopy] = useState(feePlan);
  const [existingFeePlans, setExistingFeePlans] = useState([]);
  const [changeOrderObject, setChangeOrderObject] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [calculationMethods, setCalculationMethods] = useState<string[]>([]);

  const getFeePlans = () =>
    // @ts-ignore
    api.OperatingFeesAPI.getFeePlans(programName)
      .then((result: any) =>
        setExistingFeePlans(result.map((plan: any) => plan.name))
      )
      .catch((error: any) => setErrorMsg(error));

  const getProgramCurrencies = () =>
    // @ts-ignore
    api.OperatingAPI.get(programName)
      .then((p: any) => setCurrencies(p.currencies))
      .catch((error: any) => setErrorMsg(error));

  const getNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const getPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  useEffect(() => {
    getFeePlans();
    getProgramCurrencies();
    setCalculationMethods([
      intl.formatMessage({
        id: "calculation.method.flatAmount",
        defaultMessage: "Flat Amount",
      }),
      intl.formatMessage({
        id: "calculation.method.percentage",
        defaultMessage: "Percentage",
      }),
      intl.formatMessage({
        id: "calculation.method.flatPlusPercentage",
        defaultMessage: "Flat + Percentage",
      }),
      intl.formatMessage({
        id: "calculation.method.greaterOf",
        defaultMessage: "Greater Of",
      }),
      intl.formatMessage({
        id: "calculation.method.lesserOf",
        defaultMessage: "Lesser Of",
      }),
    ]);
  }, []);

  return (
    <FeePlanWizardContext.Provider
      value={{
        currentStep,
        getNextStep,
        getPreviousStep,
        programName,
        skippedStep0,
        feePlanToCopy,
        setFeePlanToCopy,
        newFeeObject,
        setNewFeeObject,
        existingFeePlans,
        toggleDrawer,
        currencies,
        changeOrderObject,
        setChangeOrderObject,
        calculationMethods,
      }}
    >
      {children}
    </FeePlanWizardContext.Provider>
  );
};

export default FeePlanWizardContextProvider;
