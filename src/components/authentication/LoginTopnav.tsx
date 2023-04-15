/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import React, { useContext, useState } from "react";
import { Box, AppBar, Container, Toolbar } from "@mui/material";
import { LanguageContext } from "../../contexts/LanguageContextProvider";
import LanguageDropdown from "../language/LanguageDropdown";

const LoginTopnav = () => {
  const { locale, setLocale } = useContext(LanguageContext);

  return (
    <AppBar variant="transparent">
      <Container maxWidth="xl" disableGutters>
        <Toolbar sx={{ minHeight: "69px" }} disableGutters>
          <Box sx={{ flexGrow: 1, display: "flex" }}>&nbsp;</Box>
          <Box sx={{ flexGrow: 0, display: "flex" }}>
            <Box sx={{ mr: "24px" }}>
              <LanguageDropdown
                locale={locale}
                setLocale={setLocale}
                className=""
              />
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default LoginTopnav;
