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

// eslint-disable-next-line no-use-before-define
import React, { useContext, useEffect, useState } from "react";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import Table from "@mui/material/Table";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useQuery } from "@tanstack/react-query";
import api from "../../../api/api";
import StandardTable from "../../common/table/StandardTable";
import DrawerComp from "../../common/DrawerComp";
import Toggle from "../../common/forms/checkboxes/Toggle";
import TextRender from "../../common/TextRender";

import WalletCards from "../WalletCards";
import DrawerEditWallet from "../drawers/DrawerEditWallet";
import DrawerCardDetails from "../drawers/DrawerCardDetails";
import EllipseMenu from "../../common/EllipseMenu";

import OrderNewCard from "../drawers/OrderNewCard";
import emitter from "../../../emitter";
import Header from "../../common/elements/Header";
import { MessageContext } from "../../../contexts/MessageContext";
import Text from "../../common/elements/Text";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";
import Pill from "../../common/elements/PillLabel";
import CardTokenDrawer from "../drawers/CardTokenDrawer";
import toCountryName from "../../common/converters/CountryNameConverter";
import CardTypeConverter from "../../common/converters/CardTypeConverter";
import moment from "moment/moment";
import CardStateConverter from "../../common/converters/CardStateConverter";
import YesNoConverter from "../../common/converters/YesNoConverter";

export const BlockCardEvents = {
  BlockCardDelete: "delete.card.block.request",
};

interface IPageNavCards {
  customerNumber: string;
  primaryPersonId: string;
  customerAddress: any;
}

const PageNavCards: React.FC<IPageNavCards> = ({
  customerNumber,
  primaryPersonId,
  customerAddress,
  ...props
}) => {
  const intl = useIntl();
  const [fees, setFees] = useState([]);
  const [showInactive, setShowInactive] = useState(false);
  const [cards, setCards]: any = useState([]);
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const { canSeeCustomerCardBlocks, canSeeCardOrderDetails } = useContext(
    ContentVisibilityContext
  );
  const [cardView, setCardView] = useState(false);
  const [countries, setCountries] = useState([]);
  const [filteredCards, setFilteredCards]: any = useState([]);
  const [spin, setSpin] = useState("");
  const { readOnly } = useContext(ContentVisibilityContext);

  const { data: getCountryList2Data } = useQuery({
    queryKey: ["getCountryList2"],
    queryFn: () =>
      // @ts-ignore
      api.CommonAPI.getCountryList2(),
    onError: (error: any) => setErrorMsg(error),
  });

  const getCardList = async () =>
    // @ts-ignore
    api.CustomerAPI.getCards(customerNumber);
  const getCardBlocks = async (cardIdentifier: any) =>
    // @ts-ignore
    api.CardAPI.getCardBlocks(cardIdentifier);
  const cancelCard = (id: any, dto: { memo: string; state: string }) =>
    // @ts-ignore
    api.CardAPI.changeCardState(id, dto);
  const reIssueCard = (customerIdentifier: any, dto: any) =>
    // @ts-ignore
    api.CustomerAPI.orderPersonalized(customerIdentifier, dto).catch(
      (error: any) => setErrorMsg(error)
    );
  const getCardTokens = (cardId: any) =>
    // @ts-ignore
    api.CardTokenManagementAPI.searchTokens(cardId).catch((error: any) => {
      return !error;
    });
  const getPan = async (id: any) =>
    // @ts-ignore
    api.CardAPI.getPan(id);
  const getCardOrders = (cardId: any) =>
    // @ts-ignore
    api.CardAPI.getCardOrder(cardId).catch((error: any) => {
      setErrorMsg(error);
    });
  const activateCard = (id: any, dto: { memo: string; state: string }) =>
    // @ts-ignore
    api.CardAPI.changeCardState(id, dto);

  const toggleInactiveCards = () => {
    setShowInactive(!showInactive);
  };

  const getCustomerFees = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.getFees(customerNumber)
      .then((feeList: any) => setFees(feeList))
      .catch((error: any) => setErrorMsg(error));

  const getCountries = () =>
    // @ts-ignore
    api.CommonAPI.getCountryList2()
      .then((r: any) =>
        setCountries(r.map((c: any) => ({ text: c.name, code: c.code })))
      )
      .catch((e: any) => setErrorMsg(e));

  const processCards = async (unprocessedList: any[]) => {
    const valid: any = [];
    const invalid: any = [];

    // eslint-disable-next-line no-unused-vars
    unprocessedList.forEach((card: any) => {
      if (card.state === "invalid") {
        invalid.push(card);
      } else {
        valid.push(card);
      }
    });

    return { valid, invalid };
  };

  const getCardType = (cardNumber: any) => {
    if (cardNumber === "9") {
      return "Visa";
    }
    if (cardNumber === "5") {
      return "Mastercard";
    }
    if (cardNumber === "3") {
      return "Amex";
    }
    if (cardNumber === "6") {
      return "Discover";
    }
    return "Virtual";
  };

  const getCustomerCards = () =>
    getCardList()
      .then(async (cardList: any) =>
        processCards(
          await Promise.all(
            cardList.map(async (cardListItem: any) => ({
              token: canSeeCardOrderDetails
                ? await getCardTokens(cardListItem.id)
                : [],
              cardOrderInfo: canSeeCardOrderDetails
                ? await getCardOrders(cardListItem.id)
                : {},
              ...cardListItem,
            }))
          )
        )
      )
      .then(async ({ valid, invalid }) => {
        if (canSeeCustomerCardBlocks) {
          const cardBlocksList = valid.map((card: any) =>
            getCardBlocks(card.id).then((response) => {
              if (response.length) {
                const { blockedBy, releasedBy } = response[0];
                if (blockedBy) {
                  const blockedList = response.map(
                    (block: { customerReleaseable: any; blockedBy: any }) => ({
                      ...block,
                      cardNumber: card.id,
                      customerReleaseable: block.customerReleaseable
                        ? "Yes"
                        : "No",
                    })
                  );
                  return {
                    ...card,
                    cardType: getCardType(card.panFirst6.charAt(0)),
                    cardNumber: card.id,
                    blockButtonStatus: false,
                    blockedList,
                  };
                }
                const blockedList = response.map((block: any) => ({
                  ...block,
                  blockedBy: "",
                  cardNumber: card.id,
                  customerReleaseable: response[0].customerReleaseable
                    ? "Yes"
                    : "No",
                }));
                return {
                  ...card,
                  cardType: getCardType(card.panFirst6.charAt(0)),
                  blockButtonStatus: false,
                  blockedList,
                };
              }
              return {
                ...card,
                cardType: getCardType(card.panFirst6.charAt(0)),
                blockButtonStatus: true,
                blockedList: {},
              };
            })
          );
          const cancelledCards = invalid.map((card: any) => {
            return {
              ...card,
              cardType: getCardType(card.panFirst6.charAt(0)),
              blockButtonStatus: true,
              blockedList: {},
            };
          });
          await Promise.all(cardBlocksList).then((cardBlocksListItems) => {
            setFilteredCards([...cancelledCards, ...cardBlocksListItems]);
            return setCards(cardBlocksListItems);
          });
        } else {
          const allCards = valid.map((card: any) => {
            return {
              ...card,
              cardType: getCardType(card.panFirst6.charAt(0)),
              blockButtonStatus: true,
              blockedList: {},
            };
          });
          setFilteredCards(allCards);
          setCards(allCards);
        }
      });

  const iconAnimation = () => {
    if (!cardView) {
      setSpin("text-center");
    }
    setSpin("text-center fa-spin");
    setTimeout(() => {
      setSpin("text-center");
    }, 1000);
  };

  const handleCancelCard = (id: any) => {
    const dto = {
      memo: "Card canceled by customer service.",
      state: "invalid",
    };
    cancelCard(id, dto)
      .then((resp: any) => {
        // getCustomerWallets();
        // getCustomerFees();
        getCustomerCards();
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const handleViewFullPan = (id: any, callback: Function) => {
    getPan(id)
      .then((resp: string) => {
        callback && callback(resp);
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const processReissue = (custNumber: any, dto: any) => {
    let expiry = dto.expiry;
    if (dto.sameExpiry) {
      expiry = dto.cardExpiry;
    }

    let attributeMergeStrategy = dto.attributeMergeStrategy;
    if (dto.attributeMergeStrategy === "UPDATE_PREVIOUS") {
      attributeMergeStrategy = "USE_NEW";
    } else if (dto.attributeMergeStrategy === "NONE") {
      attributeMergeStrategy = undefined;
    }

    /* With PRD-436 there was an issue where the dto returned "Yes" instead of "yes" for expeditedShipping.
     * Fixing any future casing issues here.
     */
    const updatedDto = {
      cardId: dto.cardId,
      chargeFee: dto.chargeFee,
      expeditedShipping: dto.expeditedShipping,
      personId: dto.personId,
      samePan: dto.samePan,
      deactivateCurrent:
        dto.deactivateCurrent /* With H3-15902, "Deactivate current" field was re-enabled */,
      attributeMergeStrategy: attributeMergeStrategy,
      cardOrderAttributes: dto.attributes,
      expiry: expiry,
    };

    reIssueCard(custNumber, updatedDto).then(() => {
      getCustomerCards().then(() => {
        /* Required for Reissue Card drawer to close. */
        emitter.emit("customer.details.changed", {});

        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "card.success.reissued",
            defaultMessage: `Card Reissued Successfully`,
          }),
        });
      });
    });
  };

  const handleActivateCard = (id: any) => {
    const dto = {
      memo: "Card activated by customer service.",
      state: "activated", //"shipped",
    };
    activateCard(id, dto)
      .then(() => {
        getCustomerCards().then(() => {
          emitter.emit("customer.details.changed", {});
          setSuccessMsg({
            responseCode: "200000",
            message: intl.formatMessage({
              id: "card.success.activated",
              defaultMessage: `Card Activated Successfully`,
            }),
          });
        });
      })
      .catch((error: any) => {
        setErrorMsg(error);
      });
  };

  useEffect(() => {
    getCustomerFees();
    getCustomerCards();
  }, []);

  useEffect(() => {
    const cardsListener = emitter.on(
      "customer.block.changed",
      () => {
        getCustomerCards();
      },
      { objectify: true }
    );

    return () => {
      cardsListener.off();
    };
  }, []);

  useEffect(() => {
    iconAnimation();
  }, [cardView]);

  useEffect(() => {
    if (getCountryList2Data) {
      setCountries(
        getCountryList2Data.map((c: any) => ({ text: c.name, code: c.code }))
      );
    }
  }, [getCountryList2Data]);

  const cardMetadata = [
    {
      width: "12%",
      header: (
        <FormattedMessage
          id="program"
          description="Program name"
          defaultMessage="Program"
        />
      ),
      render: (rowData: any) => <Text value={rowData.programName} />,
    },
    {
      width: "22%",
      header: (
        <FormattedMessage
          id="embossedName"
          description="Embossed name header for cards"
          defaultMessage="Embossed Name"
        />
      ),
      render: (rowData: any) => <Text value={rowData.embossedName} />,
    },
    {
      width: "15%",
      header: (
        <FormattedMessage
          id="lastFourPAN"
          description="Last four digits of card number"
          defaultMessage="Last Four PAN"
        />
      ),
      render: (rowData: any) => {
        const { cardType, type, panLast4 } = rowData;
        let color = "blue";
        switch (type) {
          case "virtual":
            color = "green";
            break;
          case "one":
            color = "red";
            break;
          case "temp":
            color = "yellow";
            break;
        }
        const cardTypeDisplay = CardTypeConverter(type, intl);
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ marginRight: "5px" }}>
              <Text value={`*${panLast4}`} />
            </Box>
            <Pill
              label={intl.formatMessage({
                id: "wallets.label.cardType",
                defaultMessage: `${cardTypeDisplay}`,
              })}
              variant={color}
            />
          </Box>
        );
      },
    },
    {
      width: "12%",
      header: (
        <FormattedMessage
          id="status"
          description="Card Status"
          defaultMessage="Status"
        />
      ),
      render: (rowData: any) => (
        <Text value={CardStateConverter(rowData.state.toUpperCase(), intl)} />
      ),
    },
    {
      width: "12%",
      header: (
        <FormattedMessage
          id="block"
          description="Card Block Status"
          defaultMessage="Block"
        />
      ),
      render: (rowData: any) => {
        const { blockedList, state } = rowData;
        return (
          <YesNoConverter bool={blockedList.length || state == "invalid"} />
        );
      },
    },
    // {
    //   header: (
    //     <FormattedMessage
    //       id="cards.table.expiry.header"
    //       description="Card expiration"
    //       defaultMessage="Plastic"
    //     />
    //   ),
    //   render: (rowData: any) => <Text value="--" />,
    // },
    {
      width: "12%",
      header: (
        <FormattedMessage
          id="expiry"
          description="Card expiration"
          defaultMessage="Expiry"
        />
      ),
      render: (rowData: any) => (
        <TextRender data={moment(rowData.expiry).format("MM/YY")} />
      ),
    },
    {
      width: "5%",
      header: <> </>,
      render: (rowData: any) => (
        <>
          <EllipseMenu
            anchorOriginVertical="top"
            anchorOriginHorizontal="left"
            transformOriginVertical={10}
            transformOriginHorizontal={260}
          >
            {canSeeCardOrderDetails && (
              <DrawerComp
                id={`card-details-${rowData.panLast4}-button`}
                buttonProps="w-100"
                bodyInteractive="regular"
                variant="text"
                label={intl.formatMessage({
                  id: "orderDetails",
                  description: "Order Details",
                  defaultMessage: "Order Details",
                })}
                disableHorizontalScroll
              >
                <DrawerCardDetails
                  card={rowData}
                  countryName={
                    rowData.cardOrderInfo.shippingAddress
                      ? toCountryName(
                          rowData.cardOrderInfo.shippingAddress.country,
                          countries
                        )
                      : ""
                  }
                />
              </DrawerComp>
            )}
            {canSeeCardOrderDetails && (
              <DrawerComp
                disabled={!rowData.token}
                id={`card-tokens-${rowData.panLast4}-button`}
                buttonProps="w-100"
                bodyInteractive="regular"
                variant="text"
                label={intl.formatMessage({
                  id: "tokens",
                  description: "Tokens",
                  defaultMessage: "Tokens",
                })}
                disableHorizontalScroll
              >
                <CardTokenDrawer
                  cardTokens={rowData.token}
                  cardId={rowData.id}
                />
              </DrawerComp>
            )}
            <DrawerComp
              id={`view-card-${rowData.panLast4}-button`}
              buttonProps="w-100"
              bodyInteractive="regular"
              variant="text"
              label={intl.formatMessage({
                id: "cardDetails",
                description: "Card Details",
                defaultMessage: "Card Details",
              })}
              disableHorizontalScroll
            >
              <DrawerEditWallet
                cancelCardRequest={handleCancelCard}
                card={rowData}
                personId={primaryPersonId}
                processReissue={processReissue}
                viewFullPanRequest={handleViewFullPan}
                activateCardRequest={handleActivateCard}
              />
            </DrawerComp>
          </EllipseMenu>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "16px",
            alignItems: "center",
          }}
        >
          <Header
            value={intl.formatMessage(
              defineMessage({
                id: "cards",
                description: "Cards section header",
                defaultMessage: "Cards",
              })
            )}
            level={2}
            bold
            color="primary"
          />
          <Box display="flex" alignItems="center">
            {/*
            <ButtonGroup aria-label="outlined primary button group">
              <QDButton
                color={!cardView ? "primary" : undefined}
                onClick={() => setCardView(false)}
                variant="outlined"
              >
                <FontAwesomeIcon
                  className={!cardView ? spin : ""}
                  icon={faList}
                />
              </QDButton>
              <QDButton
                onClick={() => setCardView(false)}
                color={cardView ? "primary" : "inherit"}
                variant="outlined"
              >
                <FontAwesomeIcon className={cardView ? spin : ""} icon={faTh} />
              </QDButton>
            </ButtonGroup>
            <span className="label-dark">Toggle Card View</span>
            */}
            <Box sx={{ marginRight: "30px" }}>
              <Toggle
                id="inactive-cards-toggle"
                checked={showInactive}
                func={toggleInactiveCards}
                label={
                  <Typography>
                    {intl.formatMessage({
                      id: "showInactiveCards",
                      defaultMessage: "Show inactive cards",
                    })}
                  </Typography>
                }
                labelPlacement="start"
              />
            </Box>
            {canSeeCardOrderDetails && (
              <DrawerComp
                id="order-new-card-link"
                disabled={readOnly}
                label={intl.formatMessage({
                  id: "button.orderNewCard",
                  description: "Order new card button text",
                  defaultMessage: "ORDER NEW CARD",
                })}
              >
                <OrderNewCard />
              </DrawerComp>
            )}
          </Box>
        </Box>
        <Box>
          <Fade
            in={!cardView}
            timeout={{ appear: 1900, enter: 1600, exit: 1600 }}
          >
            <div style={{ display: !cardView ? "" : "none" }}>
              <StandardTable
                id="card-table"
                tableRowPrefix="card-table-table"
                tableMetadata={cardMetadata}
                dataList={!showInactive ? cards : filteredCards}
              />
            </div>
          </Fade>
          <Fade
            in={cardView}
            timeout={{ appear: 1900, enter: 1600, exit: 1600 }}
          >
            <div style={{ display: cardView ? "" : "none" }}>
              <Table>
                <WalletCards
                  primaryPersonId={primaryPersonId}
                  toggleInactiveCards={showInactive}
                  customerNumber={customerNumber}
                  cardList={filteredCards}
                  cardView={cardView}
                  cancelCardRequest={handleCancelCard}
                  processReissue={processReissue}
                  // @ts-ignore
                  viewFullPanRequest={handleViewFullPan}
                  activateCardRequest={handleActivateCard}
                  personId={primaryPersonId}
                />
              </Table>
            </div>
          </Fade>
        </Box>
      </Box>
    </Box>
  );
};

export default PageNavCards;
