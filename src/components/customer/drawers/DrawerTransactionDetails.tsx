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

import React, {ReactElement, useState, useEffect} from "react";
import { MessageDescriptor, useIntl } from "react-intl";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Header from "../../common/elements/Header";
import TextRender from "../../common/TextRender";
import Label from "../../common/elements/Label";
import DateAndTimeConverter from "../../common/converters/DateAndTimeConverter";
import QDFormattedCurrency from "../../common/converters/QDFormattedCurrency";
import YesNoConverter from "../../common/converters/YesNoConverter";
import TxSourceConverter from "../../common/converters/TxSourceConverter";
import TxTypeConverter from "../../common/converters/TxTypeConverter";
import Icons from "../../common/Icon";
import api from "../../../api/api";
import { convertStringToEpoch } from "../../util/ConvertEpochToDate";

interface IDrawerTransactionDetails {
  customerNumber: string;
  txId: string;
  detail: any;
  authCode?: string;
  originalAuthDate?: string;
  internalMemo?: string;
}

const DrawerTransactionDetails: React.FC<IDrawerTransactionDetails> = ({
  customerNumber,
  txId,
  detail,
  authCode,
  originalAuthDate,
  internalMemo
}) => {
  const intl = useIntl();

  const [showAttributes, setShowAttributes] = useState(false);
  const [txAttributes, setTxAttributes] = useState([{}]);

  const getTransactionAttributes = (
    customerNumber: string,
    transactionIdentifier: string
  ) =>
    // @ts-ignore
    api.CustomerAPI.getTransactionAttributes(
      customerNumber,
      transactionIdentifier
    ).catch((error: any) => error);

  useEffect(() => {
    getTransactionAttributes(customerNumber, txId)
      .then((attrs: any) => {
        setTxAttributes(attrs);
      })
      .catch((e: any) => e);
  }, [customerNumber, txId]);

  const createGridItem = (
    label: MessageDescriptor,
    content: string | ReactElement
  ) => (
    <Grid
      container
      sx={{
        marginBottom: "20px",
        "& p.MuiTypography-labelLight > label": { color: "#FFFFFF" },
      }}
      flexDirection="column"
    >
      <Grid item>
        <Label variant="grey" fontWeight={400}>
          {intl.formatMessage(label)}
        </Label>
      </Grid>
      <Grid item>
        <TextRender
          data={content}
          fontWeight={400}
          variant="labelLight"
          truncated={false}
        />
      </Grid>
    </Grid>
  );

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          value={intl.formatMessage({
            id: "transactionDetails",
            defaultMessage: "Transaction Details",
          })}
          bold
          color="white"
        />
      </Box>

      {createGridItem(
        {
          id: "date",
          description: "Date",
          defaultMessage: "Date",
        },
        <DateAndTimeConverter
          epoch={detail.creationTime}
          monthFormat={undefined}
          inline
        />
      )}

      {createGridItem(
        {
          id: "currency",
          description: "currency",
          defaultMessage: "Currency",
        },
        detail.currency
      )}

      {createGridItem(
        {
          id: "amount",
          description: "amount",
          defaultMessage: "Amount",
        },
        <QDFormattedCurrency
          currency={detail.currency}
          amount={detail.amount}
        />
      )}

      {createGridItem(
        {
          id: "transactionSource",
          description: "transactionSource",
          defaultMessage: "Transaction Source",
        },
        <TxSourceConverter txSourceCode={detail.transactionSourceCode} />
      )}

      {createGridItem(
        {
          id: "type",
          description: "type",
          defaultMessage: "Type",
        },
        <TxTypeConverter txTypeCode={detail.transactionTypeCode} />
      )}

      {createGridItem(
        {
          id: "fee",
          description: "fee",
          defaultMessage: "Fee",
        },
        <YesNoConverter bool={detail.fee} />
      )}

      {createGridItem(
        {
          id: "memo",
          description: "memo",
          defaultMessage: "Memo",
        },
        detail.memo
      )}

      {createGridItem(
        {
          id: "authCode",
          description: "Auth Code",
          defaultMessage: "Auth Code",
        },
        authCode || "--"
      )}

      {createGridItem(
        {
          id: "originalAuthDate",
          description: "Authorization Date",
          defaultMessage: "Authorization Date",
        },
        <>
          {originalAuthDate ? (
            <DateAndTimeConverter
              epoch={convertStringToEpoch(
                originalAuthDate,
                "YYYYMMDDhhmmss",
                "x"
              )}
              monthFormat={undefined}
              inline
            />
          ) : (
            "--"
          )}
        </>
      )}

      {createGridItem(
        {
          id: "externalReference",
          description: "External Reference",
          defaultMessage: "External Reference",
        },
        detail.externalReference || "--"
      )}

      {createGridItem(
        {
          id: "internalMemo",
          description: "Internal Memo",
          defaultMessage: "Internal Memo",
        },
        internalMemo || "--"
      )}

      {createGridItem(
        {
          id: "reversal",
          description: "Reversal",
          defaultMessage: "Reversal",
        },
        <YesNoConverter bool={detail.reversal} />
      )}

      {txAttributes.length > 0 && (
        <Grid item>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: "15px",
              marginTop: "60px",
              marginBottom: "20px",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowAttributes(!showAttributes);
            }}
          >
            <Grid item>
              <img
                width="14px"
                height="14px"
                src={
                  showAttributes ? Icons.caretDownWhite : Icons.caretRightWhite
                }
                alt="icon"
              />
            </Grid>
            <Grid item>
              <Header
                level={3}
                value={intl.formatMessage({
                  id: "additionalAttributes",
                  defaultMessage: "Additional Attributes",
                })}
                bold
                color="white"
              />
            </Grid>
          </Box>

          {showAttributes &&
            txAttributes.map((attribute: any) =>
              createGridItem(
                {
                  id: attribute.name,
                  description: "Attribute name",
                  defaultMessage: attribute.name,
                },
                attribute.value
              )
            )}
        </Grid>
      )}
    </Box>
  );
};

export default DrawerTransactionDetails;
