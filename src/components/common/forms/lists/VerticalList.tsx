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

import React, { FC, useContext } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import moment from "moment";
import { useIntl } from "react-intl";
import { LanguageContext } from "../../../../contexts/LanguageContextProvider";
import Icon from "../../Icon";

const typeImgMap = {
  CUSTOMER_BLOCK_CREATED: Icon.recentCustomerBlockCreated,
  CARD_BLOCK_CREATED: Icon.recentCardBlockCreated,
  CUSTOMER_BLOCK_RELEASED: Icon.recentCustomerBlockReleased,
  CUSTOMER_BLOCK_RELEASED_WITH_MEMO: Icon.recentCustomerBlockReleasedMemo,
  CARD_BLOCK_RELEASED: Icon.recentCardBlockReleased,
  CARD_BLOCK_RELEASED_WITH_MEMO: Icon.recentCardBlockReleasedMemo,
  CARD_ORDERED: Icon.recentCardOrdered,
  CUSTOMER_MEMO_CREATED: Icon.recentCustomerMemoCreated,
  CHANGE_ORDER_CREATED: Icon.recentChangeOrderCreated,
  CHANGE_ORDER_APPROVED: Icon.recentChangeOrderApproved,
};

export type IVerticleItem = {
  id: number;
  title: string;
  memo: string;
  listPrefix: string;
  type: keyof typeof typeImgMap;
};

interface IVerticleListProps {
  data: IVerticleItem[];
  listPrefix?: string;
}

// @ts-ignore
const VerticalList: FC<IVerticleListProps> = ({
  data,
  listPrefix,
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
  });

  return (
    <List id={`${listPrefix}`} style={{ overflowY: "hidden" }}>
      {data.map((entry) => (
        <ListItem
          key={entry.id}
          sx={{
            display: "flex",
            paddingLeft: "0px",
            paddingBottom: "27px",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ marginRight: "10px" }}>
              <img
                width="25px"
                height="25px"
                src={typeImgMap[entry.type]}
                alt={`icon for ${entry.type}`}
              />
            </Box>
            <Box>
              {entry.title ? (
                <Typography
                  sx={{
                    color: "#515969",
                    fontSize: "8px",
                    fontWeight: "bold",
                    letterSpacing: "0.2px",
                    lineHeight: "10px",
                  }}
                >
                  {moment(entry.title).calendar(null, {
                    sameDay: `[${intl.formatMessage({
                      id: "today",
                      defaultMessage: "Today",
                    })}, ] LT`,
                    nextDay: "[Tomorrow at] LT",
                    nextWeek: "dddd [at] LT",
                    lastDay: `[${intl.formatMessage({
                      id: "yesterday",
                      defaultMessage: "Yesterday",
                    })}, ] LT`,
                    lastWeek: "[Last] dddd [at] LT",
                    sameElse: "MMMM D, YYYY, h:mmA",
                  })}
                </Typography>
              ) : null}
              <Typography
                sx={{
                  color: "#433AA8",
                  fontSize: "12px",
                  fontWeight: "600",
                  lineHeight: "15px",
                }}
              >
                {entry.memo}
              </Typography>
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default VerticalList;
