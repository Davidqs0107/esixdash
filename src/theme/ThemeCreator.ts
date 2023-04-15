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

import { Theme } from "@mui/material/styles";
import LightTheme from "./LightTheme";

const themeMap: { [key: string]: Theme } = {
  LightTheme,
};

export default function themeCreator(theme: string): Theme {
  return themeMap[theme];
}

declare module "@mui/material/styles" {
  interface Theme {
    container: {
      shadow: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    container?: {
      shadow?: string;
    };
  }

  interface Palette {
    bodyText: {
      body: string;
      highlight: string;
    };
  }

  interface PaletteOptions {
    bodyText?: {
      body: string;
      highlight: string;
    };
  }

  interface TypographyVariants {
    brandName: React.CSSProperties;
    link: React.CSSProperties;
    loginTitle: React.CSSProperties;
    tiny: React.CSSProperties;
    error: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    brandName?: React.CSSProperties;
    link?: React.CSSProperties;
    boldLink?: React.CSSProperties;
    loginTitle?: React.CSSProperties;
    minor?: React.CSSProperties;
    error?: React.CSSProperties;
    success?: React.CSSProperties;
    grey?: React.CSSProperties;
    tableData?: React.CSSProperties;
    tablePositiveData?: React.CSSProperties;
    tableNegativeData?: React.CSSProperties;
    tableInteractiveData?: React.CSSProperties;
    labelLight?: React.CSSProperties;
    labelDark?: React.CSSProperties;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    brandName: true;
    link: true;
    boldLink: true;
    loginTitle: true;
    minor: true;
    error: true;
    success: true;
    grey: true;
    tableData: true;
    tablePositiveData: true;
    tableNegativeData: true;
    tableInteractiveData: true;
    labelLight: true;
    labelDark: true;
    lightGrey: true;
  }
}

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    full?: true;
    transparent?: true;
    formCentered?: true;
  }
}
