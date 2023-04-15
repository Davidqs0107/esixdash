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

import React from "react";
import { Grid, GridSpacing } from "@mui/material";

type ICardWrapper = {
  children: any;
  id: string | undefined;
  spacing?: GridSpacing | undefined;
  size?: any;
};

const CardWrapper: React.FC<ICardWrapper> = (props: ICardWrapper) => {
  const { children, id, spacing, size } = props;
  return (
    <Grid
      container
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      item
      xs={size}
      md={size}
      lg={size}
      spacing={spacing}
      id={id}
      sx={{ marginTop: "20px", marginRight: "20px" }}
    >
      {children}
    </Grid>
  );
};

export default CardWrapper;
