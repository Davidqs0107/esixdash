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

import React, { lazy, useState, useContext } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { FormattedMessage, useIntl } from "react-intl";
import Header from "../../common/elements/Header";
import TextRender from "../../common/TextRender";
import ReIssueCard from "./ReIssueCard";
import CancelButton from "../../common/elements/CancelButton";
import AddNewBlock from "./AddNewBlock";
import ReleaseBlockDrawer from "./ReleaseBlockDrawer";
import Label from "../../common/elements/Label";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";
import CardTypeConverter from "../../common/converters/CardTypeConverter";
import CardStateConverter from "../../common/converters/CardStateConverter";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

interface IDrawerEditWallet {
  cancelCardRequest: any;
  card: any;
  personId: any;
  processReissue: any;
  viewFullPanRequest: any;
  toggleDrawer?: any;
  activateCardRequest?: any;
}

const DrawerEditWallet: React.FC<IDrawerEditWallet> = ({
  card,
  cancelCardRequest,
  processReissue,
  personId,
  viewFullPanRequest,
  activateCardRequest,
  toggleDrawer = () => {
    /* function provided by drawercomp */
  },
}) => {
  const intl = useIntl();
  const [showReissue, setShowReissue] = useState(false);
  const [showBlock, setShowBlock] = useState(false);
  const [showUnblock, setShowUnblock] = useState(false);
  const [showPan, setShowPan] = useState(false);
  const [fullPan, setFullPan] = useState("");
  const { readOnly, canSeePAN } = useContext(ContentVisibilityContext);
  const cancelCard = (id: any) => {
    cancelCardRequest(id);
  };

  const viewFullPan = (id: any) => {
    viewFullPanRequest(id, (fullPan: string) => {
      setFullPan(fullPan);
      setShowPan(true);
    });
  };

  const activateCard = (id: any) => {
    activateCardRequest(id);
  };

  const canActivateCard = (state: string) => {
    // return ['activated','invalid','returned','created'].includes(card.state);
    return ["shipped", "sold", "resent", "virtual"].includes(state);
  };

  const expiryDisplay = card.expiry
    ? `${card.expiry.substring(4, 6)} / ${card.expiry.substring(2, 4)}`
    : "";
  const cardTypeDisplay = CardTypeConverter(card.type, intl);

  let cardProcessor = "";
  if (card.panFirst6 && card.panFirst6.length > 0) {
    switch (card.panFirst6.charAt(0)) {
      case "3":
        cardProcessor = "AMEX";
        break;
      case "4":
        cardProcessor = "VISA";
        break;
      case "5":
        cardProcessor = "MASTERCARD";
        break;
      case "6":
        cardProcessor = "DISCOVER";
        break;
    }
  }

  if (showReissue) {
    return (
      <ReIssueCard
        processReissue={processReissue}
        showCardForm={setShowReissue}
        customerId={card.customerNumber}
        cardId={card.id}
        personId={personId}
        showExpedited={card.type === "phy"}
        cardExpiry={card.expiry}
        cardOrderInfo={card.cardOrderInfo}
        cardType={card.type}
      />
    );
  }
  if (showBlock) {
    return (
      <AddNewBlock cardId={card.id} type="Card" toggleDrawer={toggleDrawer} />
    );
  }
  if (showUnblock && card.blockedList.length > 0) {
    return (
      <ReleaseBlockDrawer
        altId={card.id}
        blockType={card.type}
        toggleDrawer={toggleDrawer}
      />
    );
  }
  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          bold
          color="white"
          value={intl.formatMessage({
            id: "cardDetails",
            defaultMessage: "Card Details",
          })}
        />
      </Box>
      <Box sx={{ marginBottom: "70px" }}>
        <Grid
          container
          sx={{ marginBottom: "14px", rowGap: "6px" }}
          rowSpacing={1}
          flexDirection="column"
        >
          <Label variant="grey">
            <FormattedMessage
              id="program"
              description="Card program name"
              defaultMessage="Program"
            />
          </Label>
          <TextRender data={card.programName} />
        </Grid>
        <Grid
          container
          sx={{ marginBottom: "14px", rowGap: "6px" }}
          flexDirection="column"
        >
          <Label variant="grey">
            <FormattedMessage
              id="name"
              description="The name of the person on the card"
              defaultMessage="Name"
            />
          </Label>
          <TextRender data={card.embossedName} />
        </Grid>
        <Grid
          container
          sx={{ marginBottom: "14px", rowGap: "6px" }}
          flexDirection="column"
        >
          <Label variant="grey">
            <FormattedMessage
              id="PAN"
              description="Primary Account Number"
              defaultMessage="PAN"
            />
          </Label>
          <div>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box sx={{ marginRight: "10px" }}>
                  <TextRender
                    noMargin
                    data={fullPan && showPan ? fullPan : `*${card.panLast4}`}
                  />
                </Box>
              </Box>
              {canSeePAN && (
                <Box>
                  {!showPan ? (
                    <QDButton
                      label={intl.formatMessage({
                        id: "button.VIEW",
                        defaultMessage: "VIEW",
                      })}
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={() => viewFullPan(card.id)}
                    />
                  ) : (
                    <QDButton
                      label={intl.formatMessage({
                        id: "button.HIDE",
                        defaultMessage: "HIDE",
                      })}
                      color="primary"
                      variant="contained"
                      size="small"
                      onClick={() => setShowPan(false)}
                    />
                  )}
                </Box>
              )}
            </Box>
          </div>
        </Grid>
        <Grid
          container
          sx={{ marginBottom: "14px", rowGap: "6px" }}
          flexDirection="column"
        >
          <Label variant="grey">
            <FormattedMessage
              id="expiry"
              description="Expiration date for the card"
              defaultMessage="Expiry"
            />
          </Label>
          <TextRender data={expiryDisplay} />
        </Grid>
        <Grid
          container
          sx={{ marginBottom: "14px", rowGap: "6px" }}
          flexDirection="column"
        >
          <Label variant="grey">
            <FormattedMessage
              id="status"
              description="Card status"
              defaultMessage="Status"
            />
          </Label>
          <TextRender
            variant={
              card.blockedList.length > 0 || card.state === "invalid"
                ? "error"
                : "success"
            }
            data={CardStateConverter(card.state.toUpperCase(), intl)}
          />
        </Grid>
        <Grid
          container
          sx={{ marginBottom: "14px", rowGap: "6px" }}
          flexDirection="column"
        >
          <Label variant="grey">
            <FormattedMessage
              id="drawer.card.detail.PIN.failCount"
              defaultMessage="PIN Fail Count"
            />
          </Label>
          <TextRender data={card.pinFailCount} />
        </Grid>
        <Grid
          container
          sx={{ marginBottom: "14px", rowGap: "6px" }}
          flexDirection="column"
        >
          <Label variant="grey">
            <FormattedMessage
              id="type"
              description="Type of card issued"
              defaultMessage="Type"
            />
          </Label>
          <TextRender data={cardTypeDisplay} />
        </Grid>
        <Grid
          container
          sx={{ marginBottom: "14px", rowGap: "6px" }}
          flexDirection="column"
        >
          <Label variant="grey">
            <FormattedMessage
              id="sequenceNumber"
              description="Card sequence number"
              defaultMessage="Sequence Number"
            />
          </Label>
          <TextRender data={card.sequenceNumber} />
        </Grid>
        <Grid
          container
          sx={{ marginBottom: "14px", rowGap: "6px" }}
          flexDirection="column"
        >
          <Label variant="grey">
            <FormattedMessage
              id="profile"
              description="Card profile"
              defaultMessage="Profile"
            />
          </Label>
          <TextRender data={card.cardProfileName} />
        </Grid>
      </Box>
      <Box>
        <QDButton
          id="wallet-card-block"
          onClick={() => setShowBlock(true)}
          variant="contained"
          color="error"
          size="large"
          textCase="provided"
          disabled={card.state === "invalid" || readOnly}
          style={{ width: "305px", marginBottom: "20px" }}
        >
          <FormattedMessage
            id="block"
            description="Block card button"
            defaultMessage="Block"
          />
        </QDButton>
        <QDButton
          id="wallet-card-button-unblock"
          onClick={() => setShowUnblock(true)}
          variant="contained"
          color="primary"
          size="large"
          textCase="provided"
          disabled={
            !card.blockedList.length || card.state === "invalid" || readOnly
          }
          style={{ width: "305px", marginBottom: "20px" }}
        >
          <FormattedMessage
            id="unblock"
            description="Unblock card button"
            defaultMessage="Unblock"
          />
        </QDButton>
        <QDButton
          id="wallet-card-button-activate"
          onClick={() => activateCard(card.id)}
          variant="contained"
          color="primary"
          size="large"
          textCase="provided"
          style={{ width: "305px", marginBottom: "20px" }}
          disabled={!canActivateCard(card.state)}
        >
          <FormattedMessage
            id="wallet.card.activate.button"
            description="Activate card button"
            defaultMessage="Activate"
          />
        </QDButton>
        <QDButton
          id="wallet-card-button-reissue"
          onClick={() => setShowReissue(true)}
          variant="contained"
          color="primary"
          size="large"
          textCase="provided"
          style={{ width: "305px", marginBottom: "20px" }}
          disabled={card.state === "invalid" || readOnly}
        >
          <FormattedMessage
            id="reissue"
            description="Reissue card button"
            defaultMessage="Reissue"
          />
        </QDButton>
        <QDButton
          id="wallet-card-cancel-button"
          onClick={() => cancelCard(card.id)}
          variant="contained"
          color="error"
          size="large"
          textCase="provided"
          style={{ width: "305px", marginBottom: "20px" }}
          disabled={card.state === "invalid" || readOnly}
        >
          <FormattedMessage
            id="cancelCard"
            description="Cancel card button"
            defaultMessage="Cancel Card"
          />
        </QDButton>
        <Box sx={{ marginLeft: "126px", marginTop: "24px" }}>
          <CancelButton
            id="drawer-card-button-cancel"
            onClick={() => toggleDrawer()}
          >
            <FormattedMessage
              id="cancel"
              description="Cancel button"
              defaultMessage="Cancel"
            />
          </CancelButton>
        </Box>
      </Box>
    </Box>
  );
};

export default DrawerEditWallet;
