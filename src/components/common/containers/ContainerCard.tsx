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

import React, { FC } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from '@mui/material/CardActions';
import Header from "../elements/Header";

interface IContainerCard {
  title: string;
  icon?: string;
  hasBox?: boolean;
  tag?: string;
  cardPrefix: string;
  children: React.ReactNode;
  cardActions?: React.ReactNode;
}

const ContainerCard: FC<IContainerCard> = ({
  title = "",
  icon = "",
  hasBox = false,
  tag = "",
  cardPrefix,
  ...props
}) => (
  <Card
    id={`${cardPrefix}`}
    className={hasBox ? "Card" : "CardNoBox"}
    sx={{ minWidth: 358 }}
    {...props}
  >
    <CardContent
      sx={{
        padding: "32px 26px",
        "& h3": {
          marginBottom: "32px",
        },
      }}
    >
      {title ? (
        <>
          <div>
            {icon !== "" ? (
              <img className="tenByTen" src={icon} alt={`${title} icon`} />
            ) : null}
          </div>
          <Header
            value={title}
            level={3}
            bold
            color="primary"
            fontWeight={500}
          />
        </>
      ) : null}
      {props.children}
    </CardContent>
    <CardActions sx={{ padding: "32px 26px" }}>{props.cardActions}</CardActions>
  </Card>
);

export default ContainerCard;
