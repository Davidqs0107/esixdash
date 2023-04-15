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

import { createTheme } from "@mui/material/styles";
import InputErrorIcon from "../../public/icons/icons-error-input-field.png";
import InputOkIcon from "../../public/icons/icons-ok-input-field.png";

const themeColors = {
  white: "#FFFFFF",
  black: "#000000",
  purple: "#433EA5",
  hotRed: "#EE0351",
  dandyLion: "#F6B42A",
  tangerine: "#F86520",
  mintGreen: "#23C38E",
  sonicBlue: "#3DC6FD",

  // primary colors
  indigo: "#433AA8",
  indigoLight: "#6E759F",
  darkBlue: "#152C5B",

  grey: "#73809D",
  lightGrey: "#8995AD",
  mediumGrey: "#515969",
  transparent: "transparent",
};

const fontFamily = [
  "Montserrat",
  "Roboto",
  '"Helvetica Neue"',
  "Arial",
  "sans-serif",
].join(",");

const containerOptions = {
  boxShadow: "10px 10px 10px -5px rgba(33,31,64,0.1)",
  buttonShadow: "0 15px 15px -5px rgba(33,31,64,0.2)",
};

export const LightTheme = createTheme({
  // mode: 'light',
  palette: {
    primary: {
      light: themeColors.indigoLight,
      main: themeColors.indigo,
      dark: themeColors.darkBlue,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: themeColors.white,
      contrastText: themeColors.black,
    },
    error: {
      main: themeColors.hotRed,
    },
    warning: {
      main: themeColors.tangerine,
    },
    info: {
      main: themeColors.sonicBlue,
    },
    success: {
      main: themeColors.mintGreen,
    },
    bodyText: {
      body: themeColors.grey,
      highlight: themeColors.purple,
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          position: "relative",
          backgroundColor: themeColors.white,
        },
      },
      variants: [
        {
          props: { variant: "transparent" },
          style: {
            backgroundColor: themeColors.transparent,
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRight: 0,
          "& .MuiDrawer-paper": {
            borderRight: 0,
          },
          "& .PhoneInput label.MuiInputLabel-shrink": {
            transform: "translate(8px, 4px) scale(1)",
            fontSize: "8px",
          }
        },
      },
      variants: [
        {
          props: { variant: "full" },
          style: {
            //minWidth: "1440px",
            minHeight: "100vh",
            backgroundColor: "#F7FAFF",
          },
        },
        {
          props: { variant: "formCentered" },
          style: {
            position: "relative",
            maxWidth: "560px",
            margin: "0 auto",
            padding: "15px",
            backgroundColor: themeColors.transparent,
            "& .formHeader": {
              marginBottom: "60px",
            },
          },
        },
      ],
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          // right bar drawers
          "& .MuiBackdrop-root": {
            backgroundColor: "rgb(41 39 80 / 30%)",
          },
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        // The props to apply
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
      styleOverrides: {
        root: {
          disableRipple: true, // No more ripple, on the whole application!
          "&:hover": {
            backgroundColor: themeColors.transparent,
          },
          "&.MuiListItem-root:hover": {
            backgroundColor: themeColors.transparent,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          disableRipple: true,
          borderRadius: 28,
          textTransform: "none",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          wordBreak: "keep-all",
          maxHeight: "36px",

          "&.MuiButton-text.MuiButton-sizeSmall": {
            fontWeight: 600,
          },
          "&.MuiButton-text.MuiButton-sizeLarge": {
            fontWeight: 400,
          },
          "&.MuiButton-text:hover": {
            color: themeColors.darkBlue,
            backgroundColor: themeColors.transparent,
          },
        },
        contained: {
          "&.Mui-disabled": {
            backgroundColor: themeColors.indigo,
            color: themeColors.white,
            opacity: "40%",
          },
        },
        sizeSmall: {
          minWidth: "auto",
          paddingLeft: "0.63rem",
          paddingRight: "0.63rem",
          fontSize: "10px",
          lineHeight: "12px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            boxShadow: containerOptions.buttonShadow,
          },
        },
        sizeLarge: {
          minWidth: "auto",
          padding: "9px 20px 10px",
          fontSize: "14px",
          lineHeight: "17px",
          fontWeight: 400,
          boxShadow: containerOptions.buttonShadow,
          "&:hover": {
            boxShadow: containerOptions.buttonShadow,
          },
        },
        text: {
          boxShadow: "unset !important",
          paddingLeft: "0 !important",
          paddingRight: "0 !important",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: themeColors.white,
          "& fieldset": {
            borderWidth: 0,
          },
          "&.Mui-focused fieldset": {
            borderWidth: "1.5px",
            borderColor: themeColors.indigo,
          },
          "&.Mui-error fieldset": {
            borderWidth: "1.5px",
            borderColor: themeColors.hotRed,
          },
        },
        input: {
          "&:-internal-autofill-selected": {
            backgroundColor: `${themeColors.white} !important`,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: themeColors.lightGrey,
            letterSpacing: "-0.2px",
            lineHeight: "15px",
            "&.MuiInputLabel-shrink": {
              color: themeColors.indigo,
              fontWeight: 600,
              transform: "translate(14px, -9px) scale(1)",
            },
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: "5px",
          },
          "& .MuiOutlinedInput-root.Mui-error": {
            borderColor: themeColors.hotRed,
          },
          "& .MuiOutlinedInput-root.Mui-error input": {
            backgroundImage: `url(${InputErrorIcon})`,
            backgroundPosition: "right 14px center",
            backgroundSize: "12px 12px",
            backgroundRepeat: "no-repeat",
            color: themeColors.hotRed,
          },
          "&.Mui-verified .MuiOutlinedInput-root input": {
            backgroundImage: `url(${InputOkIcon})`,
            backgroundPosition: "right 12px center",
            backgroundSize: "12px 12px",
            backgroundRepeat: "no-repeat",
          },
          "& input": {
            color: themeColors.darkBlue,
            backgroundColor: themeColors.white,
            paddingLeft: "10px",
            paddingTop: "18px",
            paddingBottom: "8px",
            borderRadius: "5px",
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          position: "relative",
          marginBottom: "22px",
          "& .MuiFormControlLabel-root": {
            display: "inline-block !important",
          },
          "& .MuiFormControlLabel-root:hover": {
            color: themeColors.darkBlue,
          },
          "& .MuiFormHelperText-root": {
            margin: 0,
            position: "absolute",
            top: "-20px",
            width: "100%",
            fontWeight: 500,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
          "& .MuiFormHelperText-root > .MuiBox-root": {
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: "30px",
          height: "30px",
          boxShadow: "0 10px 10px -5px rgba(33,31,64,0.2)",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          minWidth: "180px",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          color: themeColors.mediumGrey,
          textTransform: "uppercase",
          fontSize: "8px",
          "& .MuiChip-label": {
            padding: "1px 6px",
            fontWeight: 600,
            lineHeight: "10px",
            letterSpacing: "0.2px",
          },
          "&.MuiChip-colorSuccess": {
            backgroundColor: "rgba(35, 195, 142, 0.2)",
          },
          "&.MuiChip-colorInfo": {
            backgroundColor: "#D8F4FF",
          },
          "&.MuiChip-colorWarning": {
            backgroundColor: "rgba(248, 101, 32, 0.2)",
          },
          "&.MuiChip-colorError": {
            backgroundColor: "rgba(238, 3, 81, 0.2)",
          },
          "&.MuiChip-red": {
            backgroundColor: "rgba(238, 3, 81, 0.2)",
          },
          "&.MuiChip-yellow": {
            backgroundColor: "rgba(246, 180, 42, 0.2)",
          },
          "&.MuiChip-blue": {
            backgroundColor: "rgba(61, 198, 253, 0.2)",
          },
          "&.MuiChip-green": {
            backgroundColor: "rgba(35, 195, 142, 0.2)",
          },
          "&.MuiChip-orange": {
            backgroundColor: "#FFA500",
          },
        },
        sizeSmall: {
          height: "12px",
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderRadius: "0px 0px 10px 10px",
          backgroundColor: "#F7F8FA",
          boxShadow: "0 20px 20px -10px rgba(33,31,64,0.1)",
          "&:not(.separatedRows) .MuiTableBody-root:before": {
            content: '"@"',
            display: "block",
            lineHeight: "15px",
            textIndent: "-99999px",
          },
          "& .MuiTableBody-root:after": {
            content: '"@"',
            display: "block",
            lineHeight: "30px",
            textIndent: "-99999px",
          },
          "& .MuiTableRow-root": {
            backgroundColor: "#FFFFFF",
          },
          "& .MuiTableRow-head": {
            backgroundColor: "#EFF3FA",
          },
          "& .MuiTableRow-head label.MuiTypography-grey": {
            fontWeight: 400,
          },
          "&.separatedRows": {
            borderCollapse: "separate",
            borderSpacing: "0 15px",
          },
          "&.separatedRows .MuiTableBody-root:after": {
            lineHeight: 0,
          },
          "& .MuiTableHead-root .MuiTableCell-root .MuiTypography-root": {
            lineHeight: "15px",
          },
          "& .MuiTableBody-root .MuiTableCell-root .MuiTypography-root": {
            lineHeight: "14px",
          },
          "&.cellTopAligned .MuiTableCell-root": {
            verticalAlign: "top",
          },
          "& .MuiTableCell-body, .MuiTypography-body1, span.MuiTypography-body1":
            {
              color: "#152C5B",
              fontSize: "12px",
              fontFamily: fontFamily,
              fontWeight: 400,
            },
          "& .MuiTableCell-body": {
            padding: "16px",
          },
          "& .MuiButton-text": {
            fontSize: "12px",
            color: themeColors.indigo,
            lineHeight: "15px",
          },
          "& .MuiIconButton-root": {
            padding: "0px",
          },
          "& .MuiTableCell-body .MuiButton-text": {
            justifyContent: "flex-start",
          },
          "& .MuiTableCell-body .MuiTypography-body1, & .MuiTableCell-body .buttonAsLink .MuiButton-text":
            {
              fontSize: "13px",
              lineHeight: "14px",
              paddingTop: 0,
              paddingBottom: 0,
            },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {},
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: themeColors.darkBlue,
          fontSize: "14px",
          lineHeight: "18px",
          fontWeight: 400,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: themeColors.indigo,
          fontSize: "12px",
          lineHeight: "13px",
          fontWeight: 600,
          textDecoration: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "&.CardNoBox": {
            boxShadow: "none"
          }
        }
      }
    }
  },
  typography: {
    fontFamily: fontFamily,
    h1: {
      fontSize: "36px",
      lineHeight: "39px",
      color: themeColors.black,
      fontWeight: 600,
    },
    h2: {
      fontSize: "24px",
      lineHeight: "26px",
      color: themeColors.black,
      fontWeight: 300,
    },
    h3: {
      fontSize: "14px",
      lineHeight: "16px",
      color: themeColors.darkBlue,
      fontWeight: 500,
    },
    h4: {
      fontSize: "12px",
      lineHeight: "13px",
      color: themeColors.darkBlue,
      fontWeight: 500,
    },
    h5: {
      fontSize: "11px",
      lineHeight: "13px",
      color: themeColors.darkBlue,
    },
    h6: {
      fontSize: "10px",
      lineHeight: "12px",
      color: themeColors.darkBlue,
    },
    body1: {
      fontSize: "12px",
      lineHeight: "15px",
      color: themeColors.darkBlue,
      fontWeight: 400,
    },
    body2: {
      fontSize: "10px",
      lineHeight: "12px",
      color: themeColors.darkBlue,
      fontWeight: 400,
      marginBottom: "2px",
    },
    boldLink: {
      fontFamily: fontFamily,
      color: themeColors.indigo,
      fontSize: "10px",
      lineHeight: "13px",
      fontWeight: 600,
    },
    brandName: {
      textTransform: "uppercase",
      alignSelf: "center",
      fontSize: "10px",
      fontWeight: 600,
      lineHeight: "11px",
      letterSpacing: "4px",
      color: themeColors.grey,
      fontFamily: fontFamily,
    },
    loginTitle: {
      fontFamily: fontFamily,
      fontSize: "24px",
      color: themeColors.darkBlue,
      fontWeight: 600,
      marginBottom: "20px",
    },
    link: {
      fontFamily: fontFamily,
      color: themeColors.indigo,
      fontSize: "12px",
      lineHeight: "13px",
      cursor: "pointer",
    },
    minor: {
      fontFamily: fontFamily,
      fontSize: "8px",
      color: themeColors.indigo,
    },
    error: {
      fontFamily: fontFamily,
      fontSize: "12px",
      lineHeight: "14px",
      letterSpacing: "-0.2px",
      color: themeColors.hotRed,
      marginBottom: "20px",
      fontWeight: 500,
    },
    success: {
      fontFamily: fontFamily,
      color: themeColors.mintGreen,
    },
    grey: {
      fontFamily: fontFamily,
      color: themeColors.lightGrey,
    },
    tableData: {
      fontFamily: fontFamily,
      color: themeColors.darkBlue,
      fontSize: "13px",
      lineHeight: "14px",
      fontWeight: 400,
    },
    tablePositiveData: {
      fontFamily: fontFamily,
      color: `${themeColors.mintGreen} !important`,
      fontSize: "12px",
      lineHeight: "13px",
      fontWeight: 600,
    },
    tableNegativeData: {
      fontFamily: fontFamily,
      color: `${themeColors.hotRed} !important`,
      fontSize: "12px",
      lineHeight: "13px",
      fontWeight: 600,
    },
    tableInteractiveData: {
      fontFamily: fontFamily,
      color: themeColors.indigo,
      fontSize: "12px",
      lineHeight: "13px",
      fontWeight: 600,
    },
    labelLight: {
      fontFamily: fontFamily,
      color: themeColors.darkBlue,
      fontSize: "12px",
      letterSpacing: "-0.2px",
      lineHeight: "13px",
      fontWeight: 400,
    },
    labelDark: {
      fontFamily: fontFamily,
      color: themeColors.lightGrey,
      fontSize: "12px",
      letterSpacing: "-0.2px",
      lineHeight: "13px",
      fontWeight: 400,
    },
  },
  breakpoints: {
    values: {
      // disable styles for xs, sm and md
      xs: 9999,
      sm: 9999,
      md: 9999,
      lg: 1440,
      xl: 1536,
    },
  },
  container: {
    shadow: containerOptions.boxShadow,
  },
});

export default LightTheme;
