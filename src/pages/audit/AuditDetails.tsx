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

import React, { lazy } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import {
  defineMessage,
  FormattedMessage,
  FormattedTime,
  useIntl,
} from "react-intl";
import CheckmarkConverter from "../../components/common/converters/CheckmarkConverter";
import Label from "../../components/common/elements/Label";
import Icon from "../../components/common/Icon";

const QDButton = lazy(
  () => import("../../components/common/elements/QDButton")
);

const QDCard = styled(Card)({
  "& .MuiCardHeader-root": {
    backgroundColor: "rgb(239,243,249)",
    color: "#8995AD",
    fontSize: "12px",
    padding: "8px",
  },
  "& .MuiAvatar-root": {
    boxShadow: "unset",
    width: "20px",
    height: "100%",
    borderRadius: 0,
  },
  "& .MuiCardContent-root": {
    marginTop: 5,
    display: "grid !important",
    gridTemplateColumns: "15%  20% 45% 20% ",
    gridTemplateRows: "[row] auto [row] auto [row] auto",
    gridAutoFlow: "row",
    justifyItems: "start",
    fontSize: "12px",
    rowGap: "15px",
    backgroundColor: "rgb(255,255,255)",
  },
  "& .fullWidth": {
    gridTemplateColumns: "100%",
    gridTemplateRows: "auto",
  },
});

interface IAuditDetails {
  auditDetailInfo: any;
  showSearchList: any;
}

const AuditDetails: React.FC<IAuditDetails> = ({
  auditDetailInfo,
  showSearchList,
}) => {
  const intl = useIntl();

  return (
    <>
      <QDCard>
        <CardHeader
          avatar={<Avatar src={Icon.BankIcon} />}
          title={intl.formatMessage({
                id: "audit.details.title",
                defaultMessage: "Audit Details"})}
        >
          Audit Details
        </CardHeader>
        <CardContent>
          <div>
            <Label variant="grey">
              <FormattedMessage
                id="audit.details.partner"
                description="Partner Title"
                defaultMessage="Partner:"
              />
            </Label>
            <Label>{auditDetailInfo.partnerName}</Label>
          </div>

          <div>
            <Label variant="grey">
              <FormattedMessage
                id="audit.details.username"
                description="User Name Title"
                defaultMessage="User Name:"
              />
            </Label>
            <Label>{auditDetailInfo.userName}</Label>
          </div>

          <div>
            <Label variant="grey">
              <FormattedMessage
                id="audit.details.customerNumber"
                description="Customer Number"
                defaultMessage="Customer Number:"
              />
            </Label>
            <Label>{auditDetailInfo.id}</Label>
          </div>

          <div>
            <Label variant="grey">
              <FormattedMessage
                id="audit.details.remoteaddress"
                description="Remote Address"
                defaultMessage="Remote Address:"
              />
            </Label>
            <Label>{auditDetailInfo.remoteAddress}</Label>
          </div>

          <div>
            <Label variant="grey">
              <FormattedMessage
                id="audit.details.api"
                description="Api"
                defaultMessage="Api:"
              />
            </Label>
            <Label>{auditDetailInfo.api}</Label>
          </div>

          <div>
            <Label variant="grey">
              {" "}
              <FormattedMessage
                id="audit.details.created"
                description="Created"
                defaultMessage="Created:"
              />
            </Label>
            <Label>{auditDetailInfo.creationTime}</Label>
          </div>

          <div>
            <Label variant="grey">
              {" "}
              <FormattedMessage
                id="audit.details.created"
                description="Created"
                defaultMessage="Created:"
              />
            </Label>
            <Label>
              <FormattedTime
                value={new Date(auditDetailInfo.creationTime)}
                year="numeric"
                month="long"
                day="2-digit"
              />
            </Label>
          </div>

          <div>
            <Label variant="grey">
              <FormattedMessage
                id="audit.details.success"
                description="Success"
                defaultMessage="Success:"
              />
            </Label>
            <Label>
              <CheckmarkConverter
                width="12"
                height="12"
                hideFalse={false}
                bool={auditDetailInfo.success}
              />
            </Label>
          </div>

          <div>
            <Label variant="grey">
              <FormattedMessage
                id="audit.details.responseCode"
                description="Response Code"
                defaultMessage="Response Code:"
              />
            </Label>
            <Label>{auditDetailInfo.responseCode}</Label>
          </div>

          <div>
            <Label variant="grey">
              <FormattedMessage
                id="audit.row.details.path"
                description="Path"
                defaultMessage="Path:"
              />
            </Label>
            <Label>{auditDetailInfo.path}</Label>
          </div>
        </CardContent>
      </QDCard>

      <br />

      <QDCard>
        <CardHeader
          avatar={<Avatar src={Icon.feePlanIcon} />}
          title={intl.formatMessage({
            id: "audit.details.parameters",
            defaultMessage: "Parameters",
          })}
        ></CardHeader>
        <CardContent className="fullWidth">
          <Label>{auditDetailInfo.arguments}</Label>
        </CardContent>
      </QDCard>

      <QDButton
        id="audit.details.back.button"
        onClick={() => showSearchList(false)}
        variant="text"
        color="primary"
        size="small"
        label={intl.formatMessage(
          defineMessage({
            id: "audit.details.button.message",
            defaultMessage: "<< Back to results",
            description: "header",
          })
        )}
      />
    </>
  );
};

export default AuditDetails;
