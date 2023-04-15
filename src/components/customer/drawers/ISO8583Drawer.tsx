import React, { useEffect, useState } from "react";
import { Grid, Container, Box } from "@mui/material";
import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import StandardTable from "../../common/table/StandardTable";
import api from "../../../api/api";
import DateAndTimeConverter from "../../common/converters/DateAndTimeConverter";
import CurrencyRender from "../../common/converters/CurrencyRender";
import Header from "../../common/elements/Header";
import TextRender from "../../common/TextRender";
import YesNoConverter from "../../common/converters/YesNoConverter";
import QDFormattedCurrency from "../../common/converters/QDFormattedCurrency";
import moment from "moment";

interface IISO8583Drawer {
  usersId: any;
  messagesId: any;
}

const ISO8583Drawer: React.FC<IISO8583Drawer> = (props) => {
  const { usersId, messagesId } = props;
  const intl = useIntl();

  const [paymentMessageGeneralData, setPaymentMessageGeneralData] = useState([
    {},
  ]);
  const [paymentAcquirerInfoData, setPaymentAcquirerInfoData] = useState([{}]);
  const [paymentAdditionalInfoData, setPaymentAdditionalInfoData] = useState([
    {},
  ]);
  const [paymentTimestampsData, setPaymentTimestampsData] = useState([{}]);
  const [paymentAmountsData, setPaymentAmountsData] = useState([{}]);
  const [cardType, setCardType] = useState(); // FIXME: TC2 uses magic to pull the card time from a config file.. Not sure how we will do it in QD
  const getUserTransactionInfo = async (uID: any, mID: any) =>
    // @ts-ignore
    api.CustomerAPI.getISO8583Message(uID, mID);

  const setupDataForTables = (message: any) => {
    setPaymentMessageGeneralData([
      {
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
          message.referenceNumber !== undefined
            ? message.referenceNumber
            : "--",
        retrievalReferenceNumber:
          message.retrievalReferenceNumber !== undefined
            ? message.retrievalReferenceNumber
            : "--",
        originalReferenceNumber: "--", // FIXME:
      },
    ]);

    setPaymentAcquirerInfoData([
      {
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
      },
    ]);

    setPaymentAdditionalInfoData([
      {
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
      },
    ]);

    setPaymentTimestampsData([
      {
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
      },
    ]);

    setPaymentAmountsData([
      {
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
      },
    ]);
  };

  const paymentMessageGeneral = [
    {
      header: (
        <FormattedMessage
          id="general"
          description="Iso8583 General table"
          defaultMessage="General"
        />
      ),
      render: (rowData: any) => (
        <Box>
          <Box style={{ paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="messageType"
                defaultMessage="Message Type"
              />
            </div>
            <Box>
              {rowData.messageType !== undefined ? rowData.messageType : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="transactionType"
                defaultMessage="Transaction Type"
              />
            </div>
            <Box>
              {rowData.transactionType !== undefined
                ? rowData.transactionType
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="transactionSource"
                defaultMessage="Transaction Source"
              />
            </div>
            <Box>
              {rowData.transactionSource !== undefined
                ? rowData.transactionSource
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="processingCode"
                defaultMessage="Processing Code"
              />
            </div>
            <Box>
              {rowData.processingCode !== undefined
                ? rowData.processingCode
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="responseCode"
                defaultMessage="Response Code"
              />
            </div>
            <Box>
              {rowData.responseCode !== undefined ? rowData.responseCode : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="originalDataElements"
                defaultMessage="Original Data Elements"
              />
            </div>
            <Box>
              {rowData.originalDataElements !== undefined
                ? rowData.originalDataElements
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="systemTraceAuditNumber"
                defaultMessage="System Trace Audit Number"
              />
            </div>
            <Box>
              {rowData.systemTraceAuditNumber !== undefined
                ? rowData.systemTraceAuditNumber
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="referenceNumber"
                defaultMessage="Reference Number"
              />
            </div>
            <Box>
              {rowData.referenceNumber !== undefined
                ? rowData.referenceNumber
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="retrievalReferenceNumber"
                defaultMessage="Retrieval Reference Number"
              />
            </div>
            <Box>
              {rowData.retrievalReferenceNumber !== undefined
                ? rowData.retrievalReferenceNumber
                : ""}
            </Box>
          </Box>
        </Box>
      ),
    },
  ];

  const paymentAcquirerInfo = [
    {
      header: (
        <FormattedMessage
          id="acquirerInfo"
          description="Iso8583 Acquirer table"
          defaultMessage="Acquirer Info"
        />
      ),
      render: (rowData: any) => (
        <Box>
          <Box style={{ paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="cardAcceptorName"
                defaultMessage="Card Acceptor Name"
              />
            </div>
            <Box>
              {rowData.cardAcceptorName !== undefined
                ? rowData.cardAcceptorName
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="cardAcceptorID"
                defaultMessage="Card Acceptor ID"
              />
            </div>
            <Box>
              {rowData.cardAcceptorId !== undefined
                ? rowData.cardAcceptorId
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="cardAcceptorTerminalID"
                defaultMessage="Card Acceptor Terminal ID"
              />
            </div>
            <Box>
              {rowData.cardAcceptorTerminalId !== undefined
                ? rowData.cardAcceptorTerminalId
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="cardAcceptorCity"
                defaultMessage="Card Acceptor City"
              />
            </div>
            <Box>
              {rowData.cardAcceptorCity !== undefined
                ? rowData.cardAcceptorCity
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="cardAcceptorCountryCode"
                defaultMessage="Card Acceptor Country Code"
              />
            </div>
            <Box>
              {rowData.cardAcceptorCountryCode !== undefined
                ? rowData.cardAcceptorCountryCode
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="MCC" defaultMessage="MCC " />
            </div>
            <Grid>{rowData.mcc !== undefined ? rowData.mcc : ""}</Grid>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="POSEntryMode"
                defaultMessage="POS Entry Mode"
              />
            </div>
            <Box>
              {rowData.POSEntryMode !== undefined ? rowData.POSEntryMode : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="POSCondition"
                defaultMessage="POS Condition"
              />
            </div>
            <Box>
              {rowData.POSCondition !== undefined ? rowData.POSCondition : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="acquiringInstitutionID"
                defaultMessage="Acquiring Institution ID"
              />
            </div>
            <Box>
              {rowData.acquiringInstitutionId !== undefined
                ? rowData.acquiringInstitutionId
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="MTI" defaultMessage="MTI" />
            </div>
            <Box>{rowData.mti !== undefined ? rowData.mti : ""}</Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="authCode" defaultMessage="Auth Code" />
            </div>
            <Box>{rowData.authCode !== undefined ? rowData.authCode : ""}</Box>
          </Box>
        </Box>
      ),
    },
  ];

  const paymentAdditionalInfo = [
    {
      header: (
        <FormattedMessage
          id="additionalInfo"
          description="Iso8583 Additional Info table"
          defaultMessage="Additional Info"
        />
      ),
      render: (rowData: any) => (
        <Box>
          <Box style={{ paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="success" defaultMessage="Success" />
            </div>
            <Box>
              {rowData.success !== undefined ? (
                <YesNoConverter bool={rowData.success} />
              ) : (
                ""
              )}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="cardPresent"
                defaultMessage="Card Present"
              />
            </div>
            <Box>
              {rowData.cardPresent !== undefined ? (
                <YesNoConverter bool={rowData.cardPresent} />
              ) : (
                ""
              )}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="inbound" defaultMessage="Inbound" />
            </div>
            <Box>
              {rowData.inbound !== undefined ? (
                <YesNoConverter bool={rowData.inbound} />
              ) : (
                ""
              )}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="authorization"
                defaultMessage="Authorization"
              />
            </div>
            <Box>
              {rowData.authorization !== undefined ? (
                <YesNoConverter bool={rowData.authorization} />
              ) : (
                ""
              )}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="debit" defaultMessage="Debit" />
            </div>
            <Box>
              {rowData.debit !== undefined ? (
                <YesNoConverter bool={rowData.debit} />
              ) : (
                ""
              )}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="forcePost" defaultMessage="Force Post" />
            </div>
            <Grid>
              {rowData.forcePost !== undefined ? (
                <YesNoConverter bool={rowData.forcePost} />
              ) : (
                ""
              )}
            </Grid>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="reversal" defaultMessage="Reversal" />
            </div>
            <Grid>
              {rowData.reversal !== undefined ? rowData.reversal : ""}
            </Grid>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="failedParameter"
                defaultMessage="Failed Parameter"
              />
            </div>
            <Box>
              {rowData.failedParameter !== undefined
                ? rowData.failedParameter
                : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="activatedRule"
                defaultMessage="Activated Rule"
              />
            </div>
            <Box>
              {rowData.activatedRule !== undefined ? rowData.activatedRule : ""}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="errorMessage"
                defaultMessage="Error Message"
              />
            </div>
            <Box>
              {rowData.errorMessage !== undefined ? rowData.errorMessage : ""}
            </Box>
          </Box>
        </Box>
      ),
    },
  ];

  const paymentTimestamps = [
    {
      header: (
        <FormattedMessage
          id="timestamps"
          description="Iso8583 Timestamp table"
          defaultMessage="Timestamps"
        />
      ),
      render: (rowData: any) => (
        <Box>
          <Box style={{ paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="creation" defaultMessage="Creation" />
            </div>
            <Box>
              {rowData.creationTime !== "--" && rowData.creationTime !== 0 ? (
                <DateAndTimeConverter epoch={rowData.creationTime} />
              ) : (
                "--"
              )}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="modified" defaultMessage="Modified" />
            </div>
            <Box>
              {rowData.modifiedTime !== "--" && rowData.modifiedTime !== 0 ? (
                <DateAndTimeConverter epoch={rowData.modifiedTime} />
              ) : (
                "--"
              )}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="transmission"
                defaultMessage="Transmission"
              />
            </div>
            <Box>
              {rowData.transmissionDateTime !== "--" &&
              rowData.transmissionDateTime !== 0 ? (
                <DateAndTimeConverter epoch={rowData.transmissionDateTime} />
              ) : (
                "--"
              )}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage
                id="authReleased"
                defaultMessage="Auth Released"
              />
            </div>
            <Box>
              {rowData.authReleasedTime !== "--" &&
              rowData.authReleasedTime !== 0 ? (
                <DateAndTimeConverter epoch={rowData.authReleasedTime} />
              ) : (
                "--"
              )}
            </Box>
          </Box>
          <Box style={{ paddingTop: "15px", paddingBottom: "15px" }}>
            <div>
              <FormattedMessage id="settlement" defaultMessage="Settlement" />
            </div>
            <Box>
              {rowData.settlementDate !== "--" &&
              rowData.settlementDate !== 0 ? (
                <DateAndTimeConverter epoch={rowData.settlementDate} />
              ) : (
                "--"
              )}
            </Box>
          </Box>
        </Box>
      ),
    },
  ];

  const paymentAmounts = [
    {
      header: (
        <FormattedMessage
          id="amounts"
          description="Iso8583 Amounts table"
          defaultMessage="Amounts"
        />
      ),
      render: (rowData: any) => (
        <Box>
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              paddingBottom: "15px",
              alignItems: "center",
            }}
          >
            <Box>
              <FormattedMessage id="acquirer" defaultMessage="Acquirer" />
            </Box>
            <Box>
              {rowData.acquirer !== undefined ? (
                <CurrencyRender
                  currencyCode={rowData.acquirer.acquirerCurrencyCode}
                />
              ) : (
                "--"
              )}
            </Box>
            <Box sx={{ pl: 2 }}>
              {rowData.acquirer !== undefined ? (
                <QDFormattedCurrency
                  currency={rowData.acquirer.acquirerCurrencyCode}
                  amount={rowData.acquirer.acquirerAmount}
                />
              ) : (
                "--"
              )}
            </Box>
          </Box>
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              paddingBottom: "15px",
              paddingTop: "15px",
              alignItems: "center",
            }}
          >
            <Box>
              <FormattedMessage id="billing" defaultMessage="Billing" />
            </Box>
            <Box>
              {rowData.billing !== undefined ? (
                <CurrencyRender
                  currencyCode={rowData.billing.billingCurrencyCode}
                />
              ) : (
                "--"
              )}
            </Box>
            <Box sx={{ pl: 2 }}>
              {rowData.billing !== undefined ? (
                <QDFormattedCurrency
                  currency={rowData.billing.billingCurrencyCode}
                  amount={rowData.billing.billingAmount}
                />
              ) : (
                "--"
              )}
            </Box>
          </Box>
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              paddingBottom: "15px",
              paddingTop: "15px",
              alignItems: "center",
            }}
          >
            <Box>
              <FormattedMessage id="settlement" defaultMessage="Settlement" />
            </Box>
            <Box>
              {rowData.settlement !== undefined ? (
                <CurrencyRender
                  currencyCode={rowData.settlement.settlementCurrencyCode}
                />
              ) : (
                "--"
              )}
            </Box>
            <Box sx={{ pl: 2 }}>
              {rowData.settlement !== undefined ? (
                <QDFormattedCurrency
                  currency={rowData.settlement.settlementCurrencyCode}
                  amount={rowData.settlement.settlementAmount}
                />
              ) : (
                "--"
              )}
            </Box>
            {/* {rowData.settlementAmount !== undefined ? rowData.settlementAmount : ''} */}
          </Box>
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              paddingBottom: "15px",
              paddingTop: "15px",
              alignItems: "center",
            }}
          >
            <Box>
              <FormattedMessage id="compliance" defaultMessage="Compliance" />
            </Box>
            <Box>
              {rowData.compliance !== undefined ? (
                <CurrencyRender
                  currencyCode={rowData.compliance.complianceCurrencyCode}
                />
              ) : (
                "--"
              )}
            </Box>
            <Box sx={{ pl: 2 }}>
              {rowData.compliance !== undefined ? (
                <QDFormattedCurrency
                  currency={rowData.compliance.complianceCurrencyCode}
                  amount={rowData.compliance.complianceAmount}
                />
              ) : (
                "--"
              )}
            </Box>
          </Box>
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              paddingBottom: "15px",
              paddingTop: "15px",
              alignItems: "center",
            }}
          >
            <Box>
              <FormattedMessage id="replacement" defaultMessage="Replacement" />
            </Box>
            <Box>
              {rowData.replacement !== undefined ? (
                <CurrencyRender
                  currencyCode={rowData.replacement.replacementCurrencyCode}
                />
              ) : (
                "--"
              )}
            </Box>
            <Box sx={{ pl: 2 }}>
              {rowData.replacement !== undefined ? (
                <QDFormattedCurrency
                  currency={rowData.replacement.replacementCurrencyCode}
                  amount={rowData.replacement.replacementAmount}
                />
              ) : (
                "--"
              )}
            </Box>
          </Box>
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              paddingBottom: "15px",
              paddingTop: "15px",
              alignItems: "center",
            }}
          >
            <Box>
              <FormattedMessage id="partial" defaultMessage="Partial" />
            </Box>
            <Box>{rowData.partial !== undefined ? rowData.partial : "--"}</Box>
            <Box sx={{ pl: 2 }}>--</Box>
          </Box>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    getUserTransactionInfo(usersId, messagesId)
      .then((transInfo) => {
        setupDataForTables(transInfo);
      })
      .catch((e) => e);
  }, []);

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Header
          value={intl.formatMessage({
            id: "paymentNetworkMessageDetails",
            description: "drawer header",
            defaultMessage: "Payment Network Message Details",
          })}
          level={2}
          color="white"
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <div>
          <StandardTable
            id="payment-messages-general-table"
            customStyle={{ width: "250px" }}
            customFooter="isoDrawerTableFooter"
            tableRowPrefix="payment-table-general"
            tableMetadata={paymentMessageGeneral}
            dataList={paymentMessageGeneralData}
          />
        </div>
        <div>
          <StandardTable
            id="payment-acquirer-table"
            customStyle={{ width: "250px", marginLeft: "30px" }}
            customFooter="isoDrawerTableFooter"
            tableRowPrefix="payment-table-acquirer-info"
            tableMetadata={paymentAcquirerInfo}
            dataList={paymentAcquirerInfoData}
          />
        </div>
        <div>
          <StandardTable
            id="payment-additional-info-table"
            customStyle={{ width: "250px", marginLeft: "30px" }}
            customFooter="isoDrawerTableFooter"
            tableRowPrefix="payment-table-additional-info"
            tableMetadata={paymentAdditionalInfo}
            dataList={paymentAdditionalInfoData}
          />
        </div>
        <div>
          <StandardTable
            id="payment-timestamps-table"
            customStyle={{ width: "250px", marginLeft: "30px" }}
            customFooter="isoDrawerTableFooter"
            tableRowPrefix="payment-table-timestamps"
            tableMetadata={paymentTimestamps}
            dataList={paymentTimestampsData}
          />
        </div>
      </Box>
      <Box>
        <div>
          <StandardTable
            id="payment-amounts-table"
            customStyle={{ width: "500px" }}
            customFooter="isoDrawerTableFooter"
            tableRowPrefix="payment-table-amounts"
            tableMetadata={paymentAmounts}
            dataList={paymentAmountsData}
          />
        </div>
      </Box>
    </Container>
  );
};

export default ISO8583Drawer;

// FIXME: PropTypes
