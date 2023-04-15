/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
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

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  FormattedDate,
  FormattedMessage,
  FormattedTime,
  useIntl,
} from "react-intl";
import Header from "../../common/elements/Header";
import TextRender from "../../common/TextRender";
import Label from "../../common/elements/Label";
import TxSourceConverter from "../../common/converters/TxSourceConverter";
import TxTypeConverter from "../../common/converters/TxTypeConverter";
import CancelButton from "../../common/elements/CancelButton";
import ReleaseHoldDrawer from "./ReleaseHoldDrawer";
import DrawerComp from "../../common/DrawerComp";

interface IHoldCardDetails {
  hold: any;
  holdId: string;
  customerNumber: string;
  showReleased?: boolean;
  toggleDrawer?: any;
}

const DrawerHoldDetails: React.FC<IHoldCardDetails> = ({
  hold,
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
  holdId,
  customerNumber,
  showReleased,
}) => {
  const intl = useIntl();

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          className="mb-5 regular-white"
          value={intl.formatMessage({
            id: "authorizedHoldDetails",
            defaultMessage: "Authorized Hold Details",
          })}
          bold
          color="white"
        />
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage id="id" defaultMessage="ID" />
          </Label>
        </Box>
        <TextRender data={hold.id} fontWeight={400} truncated={false} />
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage
              id="transactionID"
              defaultMessage="Transaction ID"
            />
          </Label>
        </Box>
        <TextRender
          data={hold.transactionId}
          fontWeight={400}
          truncated={false}
        />
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage
              id="customerAccountID"
              defaultMessage="Customer Account ID"
            />
          </Label>
        </Box>
        <TextRender
          data={hold.customerAccountId}
          fontWeight={400}
          truncated={false}
        />
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage id="currency" defaultMessage="Currency" />
          </Label>
        </Box>
        <TextRender data={hold.currency} fontWeight={400} truncated={false} />
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage id="amount" defaultMessage="Amount" />
          </Label>
        </Box>
        <TextRender data={hold.amount} fontWeight={400} truncated={false} />
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage
              id="transactionSource"
              defaultMessage="Transaction Source"
            />
          </Label>
        </Box>
        <TextRender
          data={<TxSourceConverter txSourceCode={hold.transactionSourceCode} />}
          fontWeight={400}
          truncated={false}
        />
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage id="type" defaultMessage="Type" />
          </Label>
        </Box>
        <TextRender
          data={<TxTypeConverter txTypeCode={hold.transactionTypeCode} />}
          fontWeight={400}
          truncated={false}
        />
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage id="memo" defaultMessage="Memo" />
          </Label>
        </Box>
        <TextRender data={hold.memo} fontWeight={400} truncated={false} />
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage id="createdDate" defaultMessage="Created Date" />
          </Label>
        </Box>
        <Typography fontWeight={400}>
          <FormattedDate
            value={new Date(hold.creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />{" "}
          <FormattedTime value={new Date(hold.creationTime)} />
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage
              id="modifiedDate"
              defaultMessage="Modified Date"
            />
          </Label>
        </Box>
        <Typography fontWeight={400}>
          <FormattedDate
            value={new Date(hold.modifiedTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />{" "}
          <FormattedTime value={new Date(hold.modifiedTime)} />
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Box>
          <Label variant="grey" fontWeight={400}>
            <FormattedMessage
              id="releasedDate"
              defaultMessage="Released Date"
            />
          </Label>
        </Box>
        <Typography fontWeight={400}>
          <FormattedDate
            value={new Date(hold.releasedTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />{" "}
          <FormattedTime value={new Date(hold.releasedTime)} />
        </Typography>
      </Box>
      <Box sx={{ textAlign: "center", marginTop: "100px" }}>
        <Box sx={{ marginBottom: "32px" }}>
          <DrawerComp
            id="release-hold-button"
            buttonProps="MuiButton-tall"
            label={intl.formatMessage({
              id: "releaseHold",
              defaultMessage: "Release Hold",
            })}
            size="large"
            buttonStyle={{ width: "100%" }}
          >
            <ReleaseHoldDrawer
              holdId={holdId}
              customerNumber={customerNumber}
              showReleased={showReleased}
            />
          </DrawerComp>
        </Box>
        <CancelButton
          id="drawer-personalInfo-button-cancel"
          onClick={() => toggleDrawer()}
        >
          <FormattedMessage
            id="drawer.personalInfo.button.cancel"
            description="Cancel button"
            defaultMessage="Cancel"
          />
        </CancelButton>
      </Box>
    </Box>
  );
};

export default DrawerHoldDetails;
