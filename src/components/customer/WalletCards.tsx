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

import Box from "@mui/material/Box";
import React, { useEffect, useState, FC } from "react";
import api from "../../api/api";
import CardContainer from "./CardContainer";
import emitter from "../../emitter";

export const CardsEvent = {
  CardsChanged: "customer.card.changed",
};

interface IWalletCards {
  primaryPersonId: string;
  toggleInactiveCards: boolean;
  cardList: any;
  cardView: any;
  cancelCardRequest: any;
  processReissue: any;
  personId: any;
  customerNumber: any;
}

const WalletCards: FC<IWalletCards> = ({
  primaryPersonId,
  toggleInactiveCards,
  cardList,
  cardView,
  cancelCardRequest,
  processReissue,
  personId,
}) => {
  const [container, setContainer] = useState<any>();

  const createContainer = (valid: any, invalid: any) => {
    setContainer(
      <CardContainer
        cardList={valid}
        invalidCardList={invalid}
        toggle={toggleInactiveCards}
        cancelCardRequest={cancelCardRequest}
        processReissue={processReissue}
        personId={personId}
      />
    );
  };

  useEffect(() => {
    const valid = cardList.filter((c: any) => c.state !== "invalid");
    const invalids = cardList.filter((c: any) => c.state === "invalid");
    createContainer(valid, invalids);
  }, [toggleInactiveCards, cardList]);

  return (
    <Box className="container">{container !== null ? container : null}</Box>
  );
};

export default WalletCards;
