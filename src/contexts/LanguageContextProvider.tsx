/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 */

import React, { useState, useEffect } from "react";
import moment from "moment";

export const LanguageContext = React.createContext<any>({});

moment.locale("en-gb");

const LanguageContextProvider = (props: any) => {
  const [locale, persistLocale] = useState(
    localStorage.getItem("locale") || navigator.language.split(/[-_]/)[0]
  );

  const setLocale = (locale: string) => {
    persistLocale(locale);
    localStorage.setItem("locale", locale);
  };

  useEffect(() => {
    moment.locale(locale.replace("en", "en-gb"));
  });

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {props.children}
    </LanguageContext.Provider>
  );
};

// TODO Prop Types validation

export default LanguageContextProvider;
