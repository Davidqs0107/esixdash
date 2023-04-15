/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

// @ts-ignore
import english from "../../../compiled-lang/en.json";
// @ts-ignore
import japanese from "../../../compiled-lang/ja.json";
// @ts-ignore
import portuguese from "../../../compiled-lang/pt.json";
// @ts-ignore
import spanish from "../../../compiled-lang/es.json";

// @ts-ignore
const getLanguageMessageFile = ({ locale }) => {
  switch (locale) {
    case "en":
      return english;
    case "ja":
      return japanese;
    case "pt":
      return portuguese;
    case "es":
      return spanish;
    default:
      return english;
  }
};

export default getLanguageMessageFile;
