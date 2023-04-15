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
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import cardImg from "../../../public/icons/VisaLogo.png";

interface IRoundedCard {
  cardInfo: {
    embossedName: string;
    expiry: string;
    type: string;
    cardProfileName: string;
    panLast4: string;
  };
  embossedName?: string;
  expiry?: string;
  cardProfileName?: string;
  type?: string;
  panLast4?: string;
}

const RoundedCard: FC<IRoundedCard> = ({ cardInfo }) => {
  const { embossedName, expiry, cardProfileName, type, panLast4 } = cardInfo;

  const [last4, setLast4] = useState<any>();

  const setCardNum = () => {
    setLast4(`*${panLast4}`);
  };

  useEffect(() => {
    setCardNum();
  }, [cardInfo]);

  const formatExp = () => {
    /* FIXME: This is only going to work for our locale.. need to figure out
        a good method to resolve */
    const year = expiry.substring(2, 4);
    const month = expiry.substring(4, 6);
    return `${month}/${year}`;
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Box className="container">
      <Grid container spacing={2}>
        <Grid item style={{ flexGrow: 1, flexShrink: 1 }} md={9} lg={9} xl={9}>
          <Typography className="cardCustName">{embossedName}</Typography>
        </Grid>
        <Grid item md={3}>
          <Typography className="cardNumber">{last4}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <Typography className="cardTextGray">Program</Typography>
        </Grid>
        <Grid item md={8}>
          <Typography className="cardTextBlue">
            Travel Bank Debit Rewards
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <Typography className="cardTextGray">
            {capitalizeFirst(type)}
          </Typography>
        </Grid>
        <Grid item md={8}>
          <Typography className="cardTextBlue">{cardProfileName}</Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item md={3}>
          <Typography className="cardTextGray">Exp.</Typography>
        </Grid>
        <Grid item md={3}>
          <Typography className="cardTextBlue">{formatExp()}</Typography>
        </Grid>
        <Grid item sm={2} md={2} lg={2}>
          <img className="visa-logo" src={cardImg} alt="Card image cap" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoundedCard;
