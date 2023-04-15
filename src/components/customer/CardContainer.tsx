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

import React, { useEffect, useState, FC } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardColumnContainer from "./CardColumnContainer";
import WalletCardDrawer from "./drawers/WalletCardDrawer";
import emitter from "../../emitter";

interface ICardContainer {
  cardList: any;
  invalidCardList: any;
  toggle: any;
  cancelCardRequest: any;
  processReissue: any;
  personId: string;
}

const CardContainer: FC<ICardContainer> = ({
  cardList,
  invalidCardList,
  toggle,
  cancelCardRequest,
  processReissue,
  personId,
}) => {
  const chunkArray = (array: any, chunkSize: any) =>
    Array(Math.ceil(array.length / chunkSize))
      .fill(undefined)
      .map((_, index) => index * chunkSize)
      .map((begin) => array.slice(begin, begin + chunkSize));
  const createList = (list: any) => chunkArray(list, 3);

  const [validColumnContainer, setValidColumns] = useState<any>([]);
  const [invalidColumnContainer, setInvalidColumns] = useState<any>([]);
  const [isClicked, setIsClicked] = useState(false);
  const [clickedCardId, setClickedCardId] = useState("");
  const [cardPosition, setCardPos] = useState("");
  const [cardColumn, setCardColumn] = useState([]);
  const [frontCardClicked, setFrontCardClicked] = useState(false);
  const [frontClickedCard, setFrontClickedCard] = useState();

  const getClassName = (num: any, invalid: any) => {
    switch (num) {
      case 1:
        return invalid ? "invalid middleCard" : "middleCard";
      case 2:
        return invalid ? "invalid furthestCard" : "furthestCard";
      default:
        return invalid ? "invalid frontCard" : "frontCard";
    }
  };

  const toggleClicked = (index: any, cardId: any, column: any) => {
    setCardPos(index);
    setCardColumn(column);
    setClickedCardId(cardId);
    setIsClicked(!isClicked);
  };

  const arrayMove = (
    colIdx: any,
    cardCol: any,
    oldIndex: any,
    newIndex: any,
    invalid: any
  ) => {
    if (invalid) {
      cardCol.arrayMove(invalidColumnContainer[colIdx], oldIndex, newIndex);
      setInvalidColumns(invalidColumnContainer);
    } else {
      cardCol.arrayMove(validColumnContainer[colIdx], oldIndex, newIndex);
      setValidColumns(validColumnContainer);
    }
  };

  const arrayEquals = (a: any, b: any) =>
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);

  const resetToggles = () => {
    setIsClicked(!isClicked);
    setCardPos("");
    setCardColumn([]);
    setClickedCardId("");
  };

  const shuffleCards = (cardCol: any, index: any, invalid: any) => {
    let colIdx = -1;
    if (invalid) {
      invalidColumnContainer.forEach((e: any, idx: any) =>
        arrayEquals(e, cardCol.cardsArray) ? (colIdx = idx) : -1
      );
    } else {
      validColumnContainer.forEach((e: any, idx: any) =>
        arrayEquals(e, cardCol.cardsArray) ? (colIdx = idx) : -1
      );
    }
    if (index !== 0) {
      switch (index) {
        case 1:
          arrayMove(colIdx, cardCol, 1, 0, invalid);
          break;
        case 2:
          arrayMove(colIdx, cardCol, 2, 0, invalid);
          break;
        default:
          break;
      }
    }
    resetToggles();
  };

  const onAnimationStartFunc = (invalid: any) => {
    if (cardPosition === "0") {
      shuffleCards(cardColumn, 1, invalid);
    }
  };

  const onAnimationEndFunc = (invalid: any) => {
    shuffleCards(cardColumn, cardPosition, invalid);
    setCardColumn([]);
    setCardPos("");
  };

  const openCardDrawer = (id: any, card: any) => {
    setFrontCardClicked(!frontCardClicked);
    setClickedCardId(id);
    setFrontClickedCard(card);
  };

  const getBackCard = (column: any, invalid?: any) => {
    if (column !== undefined && column.length > 2) {
      const cardId = column[2].id;
      const cardColCont = new CardColumnContainer("", column);
      return (
        <Box
          //md={{ size: 3 }}
          //xl={{ size: 2 }}
          //lg={{ size: 2 }}
          style={{ marginRight: "40px", minWidth: "24%" }}
        >
          <Card
            onClick={() => toggleClicked(2, cardId, cardColCont)}
            className={
              isClicked && cardId === clickedCardId
                ? `${getClassName(2, invalid)} furthest-animation`
                : getClassName(2, invalid)
            }
            //body
            onAnimationStart={() => onAnimationStartFunc(invalid)}
            onAnimationEnd={() => onAnimationEndFunc(invalid)}
          >
            {cardColCont.getFurthest()}
          </Card>
        </Box>
      );
    }
    return undefined;
  };

  const getMiddleCard = (column: any, invalid?: any) => {
    if (column !== undefined && column.length > 1) {
      const cardId = column[1].id;
      const cardColCont = new CardColumnContainer("", column);
      return (
        <Box
          //md={{ size: 3 }}
          //xl={{ size: 2 }}
          //lg={{ size: 2 }}
          style={{ marginRight: "40px", minWidth: "24%" }}
        >
          <Card
            onClick={() => toggleClicked(1, cardId, cardColCont)}
            className={
              isClicked && cardId === clickedCardId
                ? `${getClassName(1, invalid)} middle-animation`
                : getClassName(1, invalid)
            }
            onAnimationStart={() => onAnimationStartFunc(invalid)}
            onAnimationEnd={() => onAnimationEndFunc(invalid)}
            //body
          >
            {cardColCont.getMiddle()}
          </Card>
        </Box>
      );
    }
    return undefined;
  };

  const getFrontCard = (column: any, invalid?: any) => {
    if (column !== undefined && column.length > 0) {
      const cardId = column[0].id;
      const cardColCont = new CardColumnContainer("", column);
      return (
        <Box
          //md={{ size: 3 }}
          //xl={{ size: 2 }}
          //lg={{ size: 2 }}
          style={{ marginRight: "40px", minWidth: "24%" }}
        >
          <Card
            onClick={() => openCardDrawer(cardId, cardColCont.getFront())}
            className={
              isClicked && cardId === clickedCardId
                ? `${getClassName(0, invalid)}`
                : getClassName(0, invalid)
            }
            //body
          >
            {cardColCont.getFront()}
          </Card>
        </Box>
      );
    }
    return undefined;
  };

  useEffect(() => {
    emitter.on("customer.wallet.card.drawer.toggled", () => {
      setFrontCardClicked(!frontCardClicked);
    });
  }, [frontCardClicked]);

  useEffect(() => {
    setValidColumns(() => createList(cardList));
    setInvalidColumns(() => createList(invalidCardList));
  }, [cardList]);

  return (
    <Box className="container">
      {frontCardClicked ? (
        <WalletCardDrawer
          cardClicked
          resetToggles={resetToggles}
          card={frontClickedCard}
          id={clickedCardId}
          container={validColumnContainer}
          cancelCardRequest={cancelCardRequest}
          processReissue={processReissue}
          personId={personId}
        />
      ) : null}
      <Box style={{ flexFlow: "row" }}>
        {validColumnContainer !== undefined
          ? validColumnContainer.map((c: any) => getBackCard(c))
          : null}
        {invalidColumnContainer !== undefined && toggle
          ? invalidColumnContainer.map((c: any) => getBackCard(c, true))
          : null}
      </Box>
      <Box style={{ flexFlow: "row" }}>
        {validColumnContainer !== undefined
          ? validColumnContainer.map((c: any) => getMiddleCard(c))
          : null}
        {invalidColumnContainer !== undefined && toggle
          ? invalidColumnContainer.map((c: any) => getMiddleCard(c, true))
          : null}
      </Box>
      <Box style={{ flexFlow: "row" }}>
        {validColumnContainer !== undefined
          ? validColumnContainer.map((c: any) => getFrontCard(c))
          : null}
        {invalidColumnContainer !== undefined && toggle
          ? invalidColumnContainer.map((c: any) => getFrontCard(c, true))
          : null}
      </Box>
    </Box>
  );
};

export default CardContainer;
