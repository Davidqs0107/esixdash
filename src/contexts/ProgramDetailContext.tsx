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

import React, { useState } from "react";

interface IProgramDetailContext {
  programName: string;
  level: number;
  feePlan: string;
  setLevel: any;
  setFeePlan: any;
  currentFeePlan: string;
  currentLevel: number;
}

interface IProgramDetailContextProvider {
  currentLevel?: number;
  currentFeePlan?: string;
  children: React.ReactNode;
  programName: string;
}

export const ProgramDetailContext = React.createContext<IProgramDetailContext>({
  programName: "",
  level: 0,
  feePlan: "",
  currentFeePlan: "",
  currentLevel: 0,
  setLevel: () => {
    /* provided below */
  },
  setFeePlan: () => {
    /* provided below */
  },
});

const ProgramDetailContextProvider: React.FC<IProgramDetailContextProvider> = ({
  currentLevel = 0,
  currentFeePlan = "default",
  children,
  programName,
}) => {
  const [level, setLevel] = useState(currentLevel);
  const [feePlan, setFeePlan] = useState(currentFeePlan);

  return (
    <ProgramDetailContext.Provider
      value={{
        currentLevel,
        currentFeePlan,
        programName,
        level,
        setLevel,
        feePlan,
        setFeePlan,
      }}
    >
      {children}
    </ProgramDetailContext.Provider>
  );
};

export default ProgramDetailContextProvider;
