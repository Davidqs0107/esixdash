// @ts-nocheck
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
 */

import React, { FC, useState, useEffect } from "react";
import {
  defineMessage,
  useIntl,
} from "react-intl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FormattedMessage } from "react-intl";
import api from "../../api/api";
import emitter from "../../emitter";
import Header from "../../components/common/elements/Header";
import Label from "../../components/common/elements/Label";

interface ICardBlocksProps {
  customer: {
    customerNumber: string;
    primaryPerson: number;
  };
}

const CardBlocks: FC<ICardBlocksProps> = ({ customer }) => {
  const intl = useIntl();
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [cardBlocks, setCardBlocks] = useState([]);
  const [customerBlocks, setCustomerBlocks] = useState([]);

  // eslint-disable-next-line max-len
  const getCustomerBlocks = (customerIdentifier) =>
    api.CustomerAPI.getCustomerBlocks(customerIdentifier)
      .then((results) => results)
      .catch((error) => error); // TODO Handle Error case

  const getCardBlocks = (cardIdentifier) =>
    api.CardAPI.getCardBlocks(cardIdentifier)
      .then((results) => results)
      .catch((error) => error); // TODO Handle Error case

  const getAllCardBlocks = async (customerIdentifier) => {
    const cardBlockList = [];
    const cardList = await api.CustomerAPI.getCards(customerIdentifier);
    const cardBlocksList = cardList.map((card) => getCardBlocks(card.id));
    // eslint-disable-next-line max-len
    await Promise.all(cardBlocksList).then((blockList) =>
      blockList.map((b) => cardBlockList.push(b))
    );
    return cardBlockList;
  };

  const getAllBlocks = (customerIdentifier) => {
    Promise.all([
      getCustomerBlocks(customerIdentifier),
      getAllCardBlocks(customerIdentifier),
    ])
      .then((results) => {
        // eslint-disable-next-line max-len
        const customerBlocksResult = results[0].filter(
          (i) => i.releaseTime === 0
        ); // Only blocks that haven't been released
        const cardBlocksResult = [].concat(...results[1]);

        const activeCardBlocks = cardBlocksResult.filter(
          (i) => i.releaseTime === 0
        );
        setCustomerBlocks(customerBlocksResult);
        setCardBlocks(activeCardBlocks);
        setTotalBlocks(customerBlocksResult.length + cardBlocksResult.length);
      })
      .catch((error) => error); // TODO handle error
  };

  useEffect(() => {
    getAllBlocks(customer.customerNumber, customer.primaryPerson.id);
    emitter.on("customer.block.changed", () =>
      getAllBlocks(customer.customerNumber, customer.primaryPerson.id)
    );
  }, []);

  return (
    <Box>
      <Box sx={{ mb: "20px" }}>
        <Header
          level={2}
          bold
          color="primary"
          value={intl.formatMessage(
            defineMessage({
              id: "activeBlocks",
              defaultMessage: "Active Blocks",
            })
          )}
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Box sx={{ marginRight: "43px" }}>
          <Label size="big" bold lineHeight="60px">
            {totalBlocks}
          </Label>
        </Box>
        <Box
          sx={{
            "& .number": {
              color: "#8995AD",
              fontSize: "18px",
              fontWeight: "800",
              lineHeight: "20px",
              marginRight: "4px",
            },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography className="number">{cardBlocks?.length}</Typography>
            <Typography variant="labelLight">
              <FormattedMessage id="cardblocks" defaultMessage="card blocks" />
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography className="number">{customerBlocks?.length}</Typography>
            <Typography variant="labelLight">
              <FormattedMessage
                id="customerblocks"
                defaultMessage="customer blocks"
              />
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography className="number">0</Typography>
            <Typography variant="labelLight">
              <FormattedMessage
                id="accountblocks"
                defaultMessage="account blocks"
              />
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CardBlocks;
