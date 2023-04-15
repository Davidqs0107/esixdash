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

import React, { useContext } from "react";
import moment from "moment";
import TextField from "@mui/material/TextField";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useIntl } from "react-intl";
import { LanguageContext } from "../../../../contexts/LanguageContextProvider";

import "moment/locale/en-gb";
import "moment/locale/es";
import "moment/locale/ja";
import "moment/locale/pt";

import Icon from "../../Icon";

interface IDatePicker {
  id: string;
  name: string;
  label?: string;
  value?: any;
  field?: any;
  form?: any;
  error?: any;
  errors?: Record<string, string>;
  handleBlur: any;
  handleChange: any;
}

const CalendarIcon = () => {
  return <img src={Icon.calendarIcon} alt="Calendar icon" />;
};

const DatePickerField: React.FC<IDatePicker> = ({
  field,
  name,
  label = "Date",
  value = "Date Picker",
  id,
  form,
  errors,
  ...props
}) => {
  const { locale } = useContext(LanguageContext);
  const intl = useIntl();
  
  moment.updateLocale(locale.replace("us", "en-gb"), {
    months: `${intl.formatMessage({
      id: "january",
      defaultMessage: "January",
    })}_${intl.formatMessage({
      id: "february",
      defaultMessage: "February",
    })}_${intl.formatMessage({
      id: "march",
      defaultMessage: "March",
    })}_${intl.formatMessage({
      id: "april",
      defaultMessage: "April",
    })}_${intl.formatMessage({
      id: "may",
      defaultMessage: "May",
    })}_${intl.formatMessage({
      id: "june",
      defaultMessage: "June",
    })}_${intl.formatMessage({
      id: "july",
      defaultMessage: "July",
    })}_${intl.formatMessage({
      id: "august",
      defaultMessage: "August",
    })}_${intl.formatMessage({
      id: "september",
      defaultMessage: "September",
    })}_${intl.formatMessage({
      id: "october",
      defaultMessage: "October",
    })}_${intl.formatMessage({
      id: "november",
      defaultMessage: "November",
    })}_${intl.formatMessage({
      id: "december",
      defaultMessage: "December",
    })}`.split("_"),
    weekdaysMin: `${intl.formatMessage({
      id: "weekdaysMin.sunday",
      defaultMessage: "SU",
    })}_${intl.formatMessage({
      id: "weekdaysMin.monday",
      defaultMessage: "MO",
    })}_${intl.formatMessage({
      id: "weekdaysMin.tuesday",
      defaultMessage: "TU",
    })}_${intl.formatMessage({
      id: "weekdaysMin.wednesday",
      defaultMessage: "WE",
    })}_${intl.formatMessage({
      id: "weekdaysMin.thursday",
      defaultMessage: "TH",
    })}_${intl.formatMessage({
      id: "weekdaysMin.friday",
      defaultMessage: "FR",
    })}_${intl.formatMessage({
      id: "weekdaysMin.saturday",
      defaultMessage: "SA",
    })}`.split("_"),
  });

  const isForm = (date: any) => {
    if (field) {
      return form.setValues((prevValues: any) => ({
        ...prevValues,
        [field.name]: moment(date).format("YYYY-MM-DD"),
      }));
    }
    return date;
  };

  const hasError = () => {
    return errors && field && field.name && errors[field.name];
  }

  const getHelperText = () => {
    if (hasError()) {
      return errors && errors[field.name];
    }
    return "";
  }

  // @ts-ignore
  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <DatePicker
        label={label}
        value={value}
        onChange={(newValue) => {
          isForm(newValue);
        }}
        components={{
          OpenPickerIcon: CalendarIcon,
        }}
        inputFormat="MM/DD/YYYY"
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              width: "100%",
              "&.Mui-verified .MuiOutlinedInput-notchedOutline": {
                border: "1.5px solid #23C38E",
                borderRadius: "5px",
              },
              "&.Mui-verified .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline":
              {
                border: "1.5px solid #23C38E",
                borderRadius: "5px",
              },
              "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                color: "#433AA8",
                fontSize: "8px",
                top: "15px",
                paddingBottom: "0px",
                fontWeight: 600,
                cursor: "pointer",
                width: "initial",
                pointerEvents: "none",
                left: "-4px",
              },
              "& .MuiInputLabel-root.Mui-error": {
                color: "#EE0351",
              },
              "& .Mui-error input": {
                paddingRight: "0px !important",
                backgroundPosition: "right -5px center !important",
              },
              "& .MuiOutlinedInput-notchedOutline > legend > span": {
                display: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#433AA8",
                borderRadius: "5px",
                borderWidth: "2px",
              },
              "& .MuiInputBase-root:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#433AA8",
                borderRadius: "5px",
                borderWidth: "2px",
              },
              "& .MuiInputBase-root.Mui-error .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#EE0351",
                },
            }}
            error={hasError()}
            helperText={getHelperText()}
            className={!hasError() ? "Mui-verified": ""}
          />
        )}
        showDaysOutsideCurrentMonth
        disableHighlightToday={true}
        views={["day"]}
        InputAdornmentProps={{
          sx: {
            "& .MuiButtonBase-root": {
              marginLeft: "-6px !important",
              marginRight: "-8px !important",
            },
          },
        }}
        PopperProps={{
          sx: {
            marginTop: "10px !important",
          },
        }}
        PaperProps={{
          sx: {
            width: "250px",
            border: "1.5px solid #433AA8",
            borderRadius: "5px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 20px 20px -10px rgba(33,31,64,0.1)",
            marginLeft: "65px",
            "& >": {
              margin: "0px",
            },
            "& .MuiCalendarPicker-root": {
              margin: "0px",
              padding: "25px",
              height: "228px",
              width: "247px",
              overflow: "hidden",
            },
            "& .MuiIconButton-root": {
              height: "12px",
              width: "12px",
              padding: "0",
              marginTop: "2px",
            },
            "& .PrivatePickersFadeTransitionGroup-root": {
              overflowY: "visible",
            },
            "& .PrivatePickersFadeTransitionGroup-root > div > div:nth-child(1)":
              {
                marginBottom: "25px",
                display: "block",
                height: "10px",
              },
            "& .PrivatePickersSlideTransition-root": {
              minHeight: "128px",
              overflow: "hidden",
            },
            "& .PrivatePickersSlideTransition-root > div[role=grid] > div[role=row]":
              {
                justifyContent: "flex-start",
                margin: "0 0 15px",
              },
            "& .PrivatePickersSlideTransition-root > div[role=grid] > div[role=row] > div[role=cell]:last-child":
              {
                height: "10px",
                width: "15px",
                borderTop: "1px solid transparent",
              },
            "& .PrivatePickersSlideTransition-root > div[role=grid] > div[role=row] > div[role=cell]:not(:last-child)":
              {
                marginRight: "15px",
                height: "10px",
                width: "15px",
                borderTop: "1px solid transparent",
              },
            "& .MuiTypography-caption": {
              fontSize: "8px",
              fontWeight: "bold",
              letterSpacing: "0.2px",
              lineHeight: "10px",
              color: "#8995AD",
              width: "15px",
              height: "10px",
              margin: "0",
              display: "inline",
            },
            "& .MuiCalendarPicker-root > div > div > div > div": {
              color: "#152C5B",
              fontSize: "14px",
              lineHeight: "18px",
              marginTop: "-3px",
            },
            "& .MuiCalendarPicker-root > div:nth-child(1)": {
              display: "block",
              position: "relative",
              marginTop: "0",
              marginBottom: "15px",
              padding: "0",
              minHeight: "18px",
              maxHeight: "18px",
            },
            "& .MuiCalendarPicker-root > div:nth-child(1) > div:nth-child(1)": {
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              top: "2px",
              width: "100%",
            },
            "& .MuiCalendarPicker-root > div:nth-child(1) > div:nth-child(2)": {
              justifyContent: "space-between",
            },
            "& .MuiCalendarPicker-root > div:nth-child(1) > div:nth-child(2) .MuiSvgIcon-root":
              {
                color: "#433AA8",
              },
            "& .PrivatePickersFadeTransitionGroup-root > div > div .MuiTypography-caption:nth-child(1)":
              {
                visibility: "hidden",
                width: 0,
                "&::after": {
                  content: `'${intl.formatMessage({
                    id: "weekdaysMin.sunday",
                    defaultMessage: "SU",
                  })}'`,
                  display: "inline-block",
                  visibility: "visible",
                  width: "15px",
                  marginRight: "15px",
                  marginLeft: locale == "ja" ? "-9px" : "-6px",
                },
              },
            "& .PrivatePickersFadeTransitionGroup-root > div > div .MuiTypography-caption:nth-child(2)":
              {
                visibility: "hidden",
                width: 0,
                "&::after": {
                  content: `'${intl.formatMessage({
                    id: "weekdaysMin.monday",
                    defaultMessage: "MO",
                  })}'`,
                  display: "inline-block",
                  visibility: "visible",
                  width: "15px",
                  marginRight: "15px",
                  marginLeft: "-7px",
                },
              },
            "& .PrivatePickersFadeTransitionGroup-root > div > div .MuiTypography-caption:nth-child(3)":
              {
                visibility: "hidden",
                width: 0,
                "&::after": {
                  content: `'${intl.formatMessage({
                    id: "weekdaysMin.tuesday",
                    defaultMessage: "TU",
                  })}'`,
                  display: "inline-block",
                  visibility: "visible",
                  width: "15px",
                  marginRight: "15px",
                  marginLeft: locale == "ja" ? "-8px" : "-4px",
                },
              },
            "& .PrivatePickersFadeTransitionGroup-root > div > div .MuiTypography-caption:nth-child(4)":
              {
                visibility: "hidden",
                width: 0,
                "&::after": {
                  content: `'${intl.formatMessage({
                    id: "weekdaysMin.wednesday",
                    defaultMessage: "WE",
                  })}'`,
                  display: "inline-block",
                  visibility: "visible",
                  width: "15px",
                  marginRight: "15px",
                  marginLeft: locale == "ja" ? "-8.5px" : "-10.5px",
                },
              },
            "& .PrivatePickersFadeTransitionGroup-root > div > div .MuiTypography-caption:nth-child(5)":
              {
                visibility: "hidden",
                width: 0,
                "&::after": {
                  content: `'${intl.formatMessage({
                    id: "weekdaysMin.thursday",
                    defaultMessage: "TH",
                  })}'`,
                  display: "inline-block",
                  visibility: "visible",
                  width: "15px",
                  marginRight: "15px",
                  marginLeft: locale == "ja" ? "-8px" : "-5px",
                },
              },
            "& .PrivatePickersFadeTransitionGroup-root > div > div .MuiTypography-caption:nth-child(6)":
              {
                visibility: "hidden",
                width: 0,
                "&::after": {
                  content: `'${intl.formatMessage({
                    id: "weekdaysMin.friday",
                    defaultMessage: "FR",
                  })}'`,
                  display: "inline-block",
                  visibility: "visible",
                  width: "15px",
                  marginRight: "15px",
                  marginLeft: locale == "ja" ? "-9px" : "-5px",
                },
              },
            "& .PrivatePickersFadeTransitionGroup-root > div > div .MuiTypography-caption:nth-child(7)":
              {
                visibility: "hidden",
                width: 0,
                "&::after": {
                  content: `'${intl.formatMessage({
                    id: "weekdaysMin.saturday",
                    defaultMessage: "SA",
                  })}'`,
                  display: "inline-block",
                  visibility: "visible",
                  width: "15px",
                  marginLeft: "-6px",
                },
              },
            "& .MuiPickersDay-root": {
              fontSize: "8px",
              fontWeight: "bold",
              letterSpacing: "0.2px",
              lineHeight: "10px",
              color: "#515969",
              width: "15px",
              height: "10px",
              margin: "0",
            },
            "& .MuiPickersDay-root.MuiPickersDay-dayOutsideMonth": {
              color: "#8995AD",
            },
            "& .MuiPickersDay-root.Mui-selected": {
              color: "#FFFFFF",
              backgroundColor: "#433AA8",
              border: "none",
              height: "16px",
              width: "16px",
              borderRadius: "50%",
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerField;
