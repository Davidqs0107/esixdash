/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import { FormattedMessage, useIntl } from "react-intl";
import React, { useState, FC, useEffect, SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Header from "../../common/elements/Header";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { styled } from "@mui/material/styles";
import Label from "../../common/elements/Label";
import Typography from "@mui/material/Typography";
import api from "../../../api/api";
import Icon from "../../common/Icon";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import moment from "moment/moment";
import YesNoConverter from "../../common/converters/YesNoConverter";
import DateAndTimeConverter from "../../common/converters/DateAndTimeConverter";
import CurrencyRender from "../../common/converters/CurrencyRender";
import QDFormattedCurrency from "../../common/converters/QDFormattedCurrency";
import * as pako from "pako";

const Tabs = styled(TabList)({
  borderBottom: "none",
  "& .MuiTabs-indicator": {
    height: 4,
    backgroundColor: "#FFFFFF",
  },
  "& .MuiButtonBase-root": {
    minWidth: "34px",
    color: "#8995AD",
    fontSize: 14,
    textTransform: "none",
    padding: "7px 0 0",
    marginRight: "40px",
  },
  "& .MuiButtonBase-root.Mui-selected": {
    color: "#FFFFFF",
  },
});

const ExtTabPanel = styled(TabPanel)({
  paddingTop: 30,
  paddingLeft: 0,
  paddingRight: 0,
});

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  background: "transparent",
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <img src={Icon.caretRightWhite} alt="close icon" height={11} width={11} />
    }
    {...props}
  />
))(({ theme }) => ({
  padding: 0,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: "16px",
    padding: 0,
    "& .MuiTypography-root": {
      fontSize: "14px",
      lineHeight: "16px",
      marginBottom: 0,
    },
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingLeft: "16px",
}));

interface INetworkMessageDetailsDrawer {
  usersId: any;
  messagesId: any;
}

const NetworkMessageDetailsDrawer: FC<INetworkMessageDetailsDrawer> = ({
  usersId,
  messagesId,
}) => {
  const intl = useIntl();
  const [value, setValue] = useState("detailsTab");
  const [expanded, setExpanded] = useState<string | false>();
  const [paymentMessageGeneralData, setPaymentMessageGeneralData] =
    useState<any>();
  const [paymentAcquirerInfoData, setPaymentAcquirerInfoData] = useState<any>();
  const [paymentAdditionalInfoData, setPaymentAdditionalInfoData] =
    useState<any>();
  const [paymentTimestampsData, setPaymentTimestampsData] = useState<any>();
  const [paymentAmountsData, setPaymentAmountsData] = useState<any>();
  const [cardType, setCardType] = useState(); // FIXME: TC2 uses magic to pull the card time from a config file.. Not sure how we will do it in QD

  const getUserTransactionInfo = async (uID: any, mID: any) =>
    // @ts-ignore
    api.CustomerAPI.getISO8583Message(uID, mID);

  const setupDataForTables = (message: any) => {
    setPaymentMessageGeneralData({
      brandType: cardType !== undefined ? cardType : "--",
      messageType: message.interchangeName,
      transactionType:
        message.transactionType !== undefined
          ? message.transactionType.name
          : "--",
      transactionSource:
        message.transactionSource !== undefined
          ? message.transactionSource.name
          : "--",
      processingCode:
        message.processingCode !== undefined ? message.processingCode : "--",
      responseCode:
        message.responseCode !== undefined ? message.responseCode : "--",
      originalDataElements:
        message.originalDataElements !== undefined
          ? message.originalDataElements
          : "--",
      systemTraceAuditNumber:
        message.systemTraceAuditNumber !== undefined
          ? message.systemTraceAuditNumber
          : "--",
      referenceNumber:
        message.referenceNumber !== undefined ? message.referenceNumber : "--",
      retrievalReferenceNumber:
        message.retrievalReferenceNumber !== undefined
          ? message.retrievalReferenceNumber
          : "--",
      originalReferenceNumber: "--", // FIXME:
      rawMessage: message.rawMessage,
    });

    setPaymentAcquirerInfoData({
      cardAcceptorName:
        message.cardAcceptorName !== undefined
          ? message.cardAcceptorName
          : "--",
      cardAcceptorId:
        message.cardAcceptorId !== undefined ? message.cardAcceptorId : "--",
      cardAcceptorTerminalId:
        message.cardAcceptorTerminalId !== undefined
          ? message.cardAcceptorTerminalId
          : "--",
      cardAcceptorCity:
        message.cardAcceptorCity !== undefined
          ? message.cardAcceptorCity
          : "--",
      cardAcceptorCountryCode:
        message.cardAcceptorCountryCode !== undefined
          ? message.cardAcceptorCountryCode
          : "--",
      mcc: message.mcc !== undefined ? message.mcc : "--",
      POSEntryMode: message.posEntryMode,
      POSCondition: message.posCondition,
      acquiringInstitutionId:
        message.acquiringInstitutionId !== undefined
          ? message.acquiringInstitutionId
          : "--",
      mti: message.mti !== undefined ? message.mti : "--",
      authCode: message.authCode !== undefined ? message.authCode : "--",
    });

    setPaymentAdditionalInfoData({
      success: message.success !== undefined ? message.success : "--",
      cardPresent:
        message.cardPresent !== undefined ? message.cardPresent : "--",
      inbound: message.inbound !== undefined ? message.inbound : "--",
      authorization:
        message.authorization !== undefined ? message.authorization : "--",
      debit: message.debit !== undefined ? message.debit : "--",
      forcePost: message.forcePost !== undefined ? message.forcePost : "--",
      reversal: message.reversal, // FIXME: this could be a clash with the function? It seems to work in the payments.table.... But they are all false so I can't tell if its ACTUALLY working.
      failedParameter: "--",
      activatedRule: "--",
      errorMessage: "--",
    });

    setPaymentTimestampsData({
      creationTime:
        message.creationTime !== undefined ? message.creationTime : "--",
      modifiedTime:
        message.modifiedTime !== undefined ? message.modifiedTime : "--",
      transmissionDateTime:
        message.transmissionDateTime !== undefined
          ? moment(message.transmissionDateTime, "MMDDhhmmss").valueOf()
          : "--",
      authReleasedTime:
        message.authReleasedTime !== undefined
          ? message.authReleasedTime
          : "--",
      settlementDate:
        message.settlementDate !== undefined
          ? moment(message.settlementDate, "YYYYMMDD").valueOf()
          : "--",
    });

    setPaymentAmountsData({
      acquirer:
        message.acquirerAmount !== undefined
          ? {
              acquirerAmount: message.acquirerAmount.amount,
              acquirerCurrencyCode: message.acquirerAmount.currencyCode,
            }
          : undefined,
      billing:
        message.billingAmount !== undefined
          ? {
              billingAmount: message.billingAmount.amount,
              billingCurrencyCode: message.billingAmount.currencyCode,
            }
          : undefined,
      settlement:
        message.settlementAmount !== undefined
          ? {
              settlementAmount: message.settlementAmount.amount,
              settlementCurrencyCode: message.settlementAmount.currencyCode,
            }
          : undefined,
      compliance:
        message.complianceAmount !== undefined
          ? {
              complianceAmount: message.complianceAmount.amount,
              complianceCurrencyCode: message.complianceAmount.currencyCode,
            }
          : undefined,
      replacement:
        message.replacementAmount !== undefined
          ? {
              replacementAmount: message.replacementAmount.amount,
              replacementCurrencyCode: message.replacementAmount.currencyCode,
            }
          : undefined,
      partial: "--", // FIXME:
    });
  };
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleChangeAccordion =
    (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  useEffect(() => {
    getUserTransactionInfo(usersId, messagesId)
      .then((transInfo) => {
        setupDataForTables(transInfo);
      })
      .catch((e) => e);
  }, []);

  const PaymentMessageGeneralPanel = () => (
    <Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="messageType" defaultMessage="Message Type" />
        </Label>
        <Typography fontWeight={400}>
          {paymentMessageGeneralData.messageType !== undefined
            ? paymentMessageGeneralData.messageType
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage
            id="transactionType"
            defaultMessage="Transaction Type"
          />
        </Label>
        <Typography fontWeight={400}>
          {paymentMessageGeneralData.transactionType !== undefined
            ? paymentMessageGeneralData.transactionType
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage
            id="transactionSource"
            defaultMessage="Transaction Source"
          />
        </Label>
        <Typography fontWeight={400}>
          {paymentMessageGeneralData.transactionSource !== undefined
            ? paymentMessageGeneralData.transactionSource
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage
            id="processingCode"
            defaultMessage="Processing Code"
          />
        </Label>
        <Typography fontWeight={400}>
          {paymentMessageGeneralData.processingCode !== undefined
            ? paymentMessageGeneralData.processingCode
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="responseCode" defaultMessage="Response Code" />
        </Label>
        <Typography fontWeight={400}>
          {paymentMessageGeneralData.responseCode !== undefined
            ? paymentMessageGeneralData.responseCode
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage
            id="originalDataElements"
            defaultMessage="Original Data Elements"
          />
        </Label>
        <Typography fontWeight={400}>
          {paymentMessageGeneralData.originalDataElements !== undefined
            ? paymentMessageGeneralData.originalDataElements
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage
            id="systemTraceAuditNumber"
            defaultMessage="System Trace Audit Number"
          />
        </Label>
        <Typography fontWeight={400}>
          {paymentMessageGeneralData.systemTraceAuditNumber !== undefined
            ? paymentMessageGeneralData.systemTraceAuditNumber
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage
            id="referenceNumber"
            defaultMessage="Reference Number"
          />
        </Label>
        <Typography fontWeight={400}>
          {paymentMessageGeneralData.referenceNumber !== undefined
            ? paymentMessageGeneralData.referenceNumber
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage
            id="retrievalReferenceNumber"
            defaultMessage="Retrieval Reference Number"
          />
        </Label>
        <Typography fontWeight={400}>
          {paymentMessageGeneralData.retrievalReferenceNumber !== undefined
            ? paymentMessageGeneralData.retrievalReferenceNumber
            : ""}
        </Typography>
      </Box>
    </Box>
  );

  const PaymentAcquirerInfoPanel = () => (
    <Box>
      <Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage
              id="cardAcceptorName"
              defaultMessage="Card Acceptor Name"
            />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.cardAcceptorName !== undefined
              ? paymentAcquirerInfoData.cardAcceptorName
              : ""}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage
              id="cardAcceptorID"
              defaultMessage="Card Acceptor ID"
            />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.cardAcceptorId !== undefined
              ? paymentAcquirerInfoData.cardAcceptorId
              : ""}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage
              id="cardAcceptorTerminalID"
              defaultMessage="Card Acceptor Terminal ID"
            />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.cardAcceptorTerminalId !== undefined
              ? paymentAcquirerInfoData.cardAcceptorTerminalId
              : ""}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage
              id="cardAcceptorCity"
              defaultMessage="Card Acceptor City"
            />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.cardAcceptorCity !== undefined
              ? paymentAcquirerInfoData.cardAcceptorCity
              : ""}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage
              id="cardAcceptorCountryCode"
              defaultMessage="Card Acceptor Country Code"
            />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.cardAcceptorCountryCode !== undefined
              ? paymentAcquirerInfoData.cardAcceptorCountryCode
              : ""}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage id="MCC" defaultMessage="MCC " />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.mcc !== undefined
              ? paymentAcquirerInfoData.mcc
              : ""}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage
              id="POSEntryMode"
              defaultMessage="POS Entry Mode"
            />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.POSEntryMode !== undefined
              ? paymentAcquirerInfoData.POSEntryMode
              : ""}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage
              id="POSCondition"
              defaultMessage="POS Condition"
            />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.POSCondition !== undefined
              ? paymentAcquirerInfoData.POSCondition
              : ""}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage
              id="acquiringInstitutionID"
              defaultMessage="Acquiring Institution ID"
            />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.acquiringInstitutionId !== undefined
              ? paymentAcquirerInfoData.acquiringInstitutionId
              : ""}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage id="MTI" defaultMessage="MTI" />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.mti !== undefined
              ? paymentAcquirerInfoData.mti
              : ""}
          </Typography>
        </Box>
        <Box sx={{ marginBottom: "20px" }}>
          <Label variant="grey" size="minor" fontWeight={400}>
            <FormattedMessage id="authCode" defaultMessage="Auth Code" />
          </Label>
          <Typography fontWeight={400}>
            {paymentAcquirerInfoData.authCode !== undefined
              ? paymentAcquirerInfoData.authCode
              : ""}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  const PaymentAdditionalInfoPanel = () => (
    <Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="success" defaultMessage="Success" />
        </Label>
        <Typography fontWeight={400}>
          {paymentAdditionalInfoData.success !== undefined ? (
            <YesNoConverter bool={paymentAdditionalInfoData.success} />
          ) : (
            ""
          )}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="cardPresent" defaultMessage="Card Present" />
        </Label>
        <Typography fontWeight={400}>
          {paymentAdditionalInfoData.cardPresent !== undefined ? (
            <YesNoConverter bool={paymentAdditionalInfoData.cardPresent} />
          ) : (
            ""
          )}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="inbound" defaultMessage="Inbound" />
        </Label>
        <Typography fontWeight={400}>
          {paymentAdditionalInfoData.inbound !== undefined ? (
            <YesNoConverter bool={paymentAdditionalInfoData.inbound} />
          ) : (
            ""
          )}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="authorization" defaultMessage="Authorization" />
        </Label>
        <Typography fontWeight={400}>
          {paymentAdditionalInfoData.authorization !== undefined ? (
            <YesNoConverter bool={paymentAdditionalInfoData.authorization} />
          ) : (
            ""
          )}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="debit" defaultMessage="Debit" />
        </Label>
        <Typography fontWeight={400}>
          {paymentAdditionalInfoData.debit !== undefined ? (
            <YesNoConverter bool={paymentAdditionalInfoData.debit} />
          ) : (
            ""
          )}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="forcePost" defaultMessage="Force Post" />
        </Label>
        <Typography fontWeight={400}>
          {paymentAdditionalInfoData.forcePost !== undefined ? (
            <YesNoConverter bool={paymentAdditionalInfoData.forcePost} />
          ) : (
            ""
          )}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="reversal" defaultMessage="Reversal" />
        </Label>
        <Typography fontWeight={400}>
          {paymentAdditionalInfoData.reversal !== undefined
            ? paymentAdditionalInfoData.reversal
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage
            id="failedParameter"
            defaultMessage="Failed Parameter"
          />
        </Label>
        <Typography fontWeight={400}>
          {paymentAdditionalInfoData.failedParameter !== undefined
            ? paymentAdditionalInfoData.failedParameter
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage
            id="activatedRule"
            defaultMessage="Activated Rule"
          />
        </Label>
        <Typography fontWeight={400}>
          {paymentAdditionalInfoData.activatedRule !== undefined
            ? paymentAdditionalInfoData.activatedRule
            : ""}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="errorMessage" defaultMessage="Error Message" />
        </Label>
        <Typography fontWeight={400}>
          {paymentAdditionalInfoData.errorMessage !== undefined
            ? paymentAdditionalInfoData.errorMessage
            : ""}
        </Typography>
      </Box>
    </Box>
  );

  const PaymentTimestampsPanel = () => (
    <Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="creation" defaultMessage="Creation" />
        </Label>
        <Typography
          fontWeight={400}
          sx={{
            label: {
              color: "#FFFFFF !important",
            },
          }}
        >
          {paymentTimestampsData.creationTime !== "--" &&
          paymentTimestampsData.creationTime !== 0 ? (
            <DateAndTimeConverter epoch={paymentTimestampsData.creationTime} />
          ) : (
            "--"
          )}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="modified" defaultMessage="Modified" />
        </Label>
        <Typography
          fontWeight={400}
          sx={{
            label: {
              color: "#FFFFFF !important",
            },
          }}
        >
          {paymentTimestampsData.modifiedTime !== "--" &&
          paymentTimestampsData.modifiedTime !== 0 ? (
            <DateAndTimeConverter epoch={paymentTimestampsData.modifiedTime} />
          ) : (
            "--"
          )}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="transmission" defaultMessage="Transmission" />
        </Label>
        <Typography
          fontWeight={400}
          sx={{
            label: {
              color: "#FFFFFF !important",
            },
          }}
        >
          {paymentTimestampsData.transmissionDateTime !== "--" &&
          paymentTimestampsData.transmissionDateTime !== 0 ? (
            <DateAndTimeConverter
              epoch={paymentTimestampsData.transmissionDateTime}
            />
          ) : (
            "--"
          )}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="authReleased" defaultMessage="Auth Released" />
        </Label>
        <Typography
          fontWeight={400}
          sx={{
            label: {
              color: "#FFFFFF !important",
            },
          }}
        >
          {paymentTimestampsData.authReleasedTime !== "--" &&
          paymentTimestampsData.authReleasedTime !== 0 ? (
            <DateAndTimeConverter
              epoch={paymentTimestampsData.authReleasedTime}
            />
          ) : (
            "--"
          )}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="settlement" defaultMessage="Settlement" />
        </Label>
        <Typography
          fontWeight={400}
          sx={{
            label: {
              color: "#FFFFFF !important",
            },
          }}
        >
          {paymentTimestampsData.settlementDate !== "--" &&
          paymentTimestampsData.settlementDate !== 0 ? (
            <DateAndTimeConverter
              epoch={paymentTimestampsData.settlementDate}
            />
          ) : (
            "--"
          )}
        </Typography>
      </Box>
    </Box>
  );

  const PaymentAmountsPanel = () => (
    <Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="acquirer" defaultMessage="Acquirer" />
        </Label>
        <Box sx={{ display: "flex", width: "120px", alignItems: "center" }}>
          {paymentAmountsData.acquirer !== undefined ? (
            <CurrencyRender
              currencyCode={paymentAmountsData.acquirer.acquirerCurrencyCode}
            />
          ) : (
            <Typography variant="body1">--</Typography>
          )}
          <Box sx={{ width: "20%" }}>
            {paymentAmountsData.acquirer !== undefined ? (
              <QDFormattedCurrency
                currency={paymentAmountsData.acquirer.acquirerCurrencyCode}
                amount={paymentAmountsData.acquirer.acquirerAmount}
              />
            ) : (
              <Typography variant="body1">--</Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="billing" defaultMessage="Billing" />
        </Label>
        <Box sx={{ display: "flex", width: "120px", alignItems: "center" }}>
          {paymentAmountsData.billing !== undefined ? (
            <CurrencyRender
              currencyCode={paymentAmountsData.billing.billingCurrencyCode}
            />
          ) : (
            <Typography variant="body1">--</Typography>
          )}
          <Box sx={{ width: "20%" }}>
            {paymentAmountsData.billing !== undefined ? (
              <QDFormattedCurrency
                currency={paymentAmountsData.billing.billingCurrencyCode}
                amount={paymentAmountsData.billing.billingAmount}
              />
            ) : (
              <Typography variant="body1">--</Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="settlement" defaultMessage="Settlement" />
        </Label>
        <Box sx={{ display: "flex", width: "120px", alignItems: "center" }}>
          {paymentAmountsData.settlement !== undefined ? (
            <CurrencyRender
              currencyCode={
                paymentAmountsData.settlement.settlementCurrencyCode
              }
            />
          ) : (
            <Typography variant="body1">--</Typography>
          )}
          <Box sx={{ width: "20%" }}>
            {paymentAmountsData.settlement !== undefined ? (
              <QDFormattedCurrency
                currency={paymentAmountsData.settlement.settlementCurrencyCode}
                amount={paymentAmountsData.settlement.settlementAmount}
              />
            ) : (
              <Typography variant="body1">--</Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="compliance" defaultMessage="Compliance" />
        </Label>
        <Box sx={{ display: "flex", width: "120px", alignItems: "center" }}>
          {paymentAmountsData.compliance !== undefined ? (
            <CurrencyRender
              currencyCode={
                paymentAmountsData.compliance.complianceCurrencyCode
              }
            />
          ) : (
            <Typography variant="body1">--</Typography>
          )}
          <Box sx={{ width: "20%" }}>
            {paymentAmountsData.compliance !== undefined ? (
              <QDFormattedCurrency
                currency={paymentAmountsData.compliance.complianceCurrencyCode}
                amount={paymentAmountsData.compliance.complianceAmount}
              />
            ) : (
              <Typography variant="body1">--</Typography>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="replacement" defaultMessage="Replacement" />
        </Label>
        <Box sx={{ display: "flex", width: "120px", alignItems: "center" }}>
          {paymentAmountsData.replacement !== undefined ? (
            <CurrencyRender
              currencyCode={
                paymentAmountsData.replacement.replacementCurrencyCode
              }
            />
          ) : (
            <Typography variant="body1">--</Typography>
          )}
          {paymentAmountsData.replacement !== undefined ? (
            <QDFormattedCurrency
              currency={paymentAmountsData.replacement.replacementCurrencyCode}
              amount={paymentAmountsData.replacement.replacementAmount}
            />
          ) : (
            <Typography variant="body1">--</Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Label variant="grey" size="minor" fontWeight={400}>
          <FormattedMessage id="partial" defaultMessage="Partial" />
        </Label>
        <Box sx={{ display: "flex", width: "120px", alignItems: "center" }}>
          <Typography variant="body1">
            {paymentAmountsData.partial !== undefined
              ? paymentAmountsData.partial
              : "--"}
          </Typography>
          <Typography variant="body1">--</Typography>
        </Box>
      </Box>
    </Box>
  );

  const convertHexToString = (hex: string) => {
    try {
      const strData = atob(hex);
      const charData = strData.split("").map(function (x) {
        return x.charCodeAt(0);
      });

      const binData = new Uint8Array(charData);
      const data = pako.inflate(binData);

      // @ts-ignore
      return String.fromCharCode.apply(null, new Uint16Array(data));
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          value={intl.formatMessage({
            id: "networkMessages",
            defaultMessage: "Network Messages",
          })}
          level={2}
          bold
          color="white"
        />
      </Box>
      {paymentMessageGeneralData && (
        <Box sx={{ width: "100%" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "#595877" }}>
              <Tabs
                onChange={handleChange}
                aria-label="Network Message Details Tab"
              >
                <Tab
                  label={intl.formatMessage({
                    id: "details",
                    defaultMessage: "Details",
                  })}
                  value="detailsTab"
                />
                <Tab
                  label={intl.formatMessage({
                    id: "rawMessage",
                    defaultMessage: "Raw Message",
                  })}
                  value="rawMessageTab"
                />
              </Tabs>
            </Box>
            <ExtTabPanel value="detailsTab">
              <Box>
                {paymentMessageGeneralData && <PaymentMessageGeneralPanel />}
                <Accordion
                  expanded={expanded === "acquirerInfoPanel"}
                  onChange={handleChangeAccordion("acquirerInfoPanel")}
                >
                  <AccordionSummary
                    aria-controls="acquirerInfoPaneld-content"
                    id="acquirerInfoPaneld-header"
                  >
                    <Typography>
                      <FormattedMessage
                        id="acquirerInfo"
                        defaultMessage="Acquirer Info"
                      />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {paymentAcquirerInfoData && <PaymentAcquirerInfoPanel />}
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "additionalInfoPanel"}
                  onChange={handleChangeAccordion("additionalInfoPanel")}
                >
                  <AccordionSummary
                    aria-controls="additionalInfoPaneld-content"
                    id="additionalInfoPaneld-header"
                  >
                    <Typography>
                      <FormattedMessage
                        id="additionalInfo"
                        defaultMessage="Additional Info"
                      />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {paymentAdditionalInfoData && (
                      <PaymentAdditionalInfoPanel />
                    )}
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "timestampsPanel"}
                  onChange={handleChangeAccordion("timestampsPanel")}
                >
                  <AccordionSummary
                    aria-controls="timestampsPaneld-content"
                    id="timestampsPaneld-header"
                  >
                    <Typography>
                      <FormattedMessage
                        id="timestamps"
                        defaultMessage="Timestamps"
                      />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {paymentTimestampsData && <PaymentTimestampsPanel />}
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "amountsPanel"}
                  onChange={handleChangeAccordion("amountsPanel")}
                >
                  <AccordionSummary
                    aria-controls="amountsPaneld-content"
                    id="amountsPaneld-header"
                  >
                    <Typography>
                      <FormattedMessage id="amounts" defaultMessage="Amounts" />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {paymentAmountsData && <PaymentAmountsPanel />}
                  </AccordionDetails>
                </Accordion>
              </Box>
            </ExtTabPanel>
            <ExtTabPanel value="rawMessageTab">
              <Box
                sx={{
                  width: "100%",
                  overflowX: "auto",
                  overflowY: "hidden",
                  "::-webkit-scrollbar": {
                    "-webkit-appearance": "none",
                    width: "4px",
                    height: "4px",
                  },
                  "::-webkit-scrollbar-thumb": {
                    borderRadius: "2px",
                    backgroundColor: "#fff",
                  },
                }}
              >
                <Box
                  sx={{
                    borderRadius: "5px",
                    padding: "10px 15px",
                    backgroundColor: "#454365",
                    whiteSpace: "pre-wrap",
                    color: "#B6BDC4",
                    fontFamily: "Monaco",
                    fontSize: "12px",
                    letterSpacing: "0.5px",
                    lineHeight: "19px",
                    minWidth: "max-content",
                  }}
                >
                  {paymentMessageGeneralData &&
                    convertHexToString(paymentMessageGeneralData.rawMessage)}
                </Box>
              </Box>
            </ExtTabPanel>
          </TabContext>
        </Box>
      )}
    </Box>
  );
};

export default NetworkMessageDetailsDrawer;
