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

import React, { useContext } from "react";
import {
  Box,
  AppBar,
  Container,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { PartnerUserContext } from "../../../contexts/PartnerUserContext";
import LanguageDropdown from "../../language/LanguageDropdown";
import { LanguageContext } from "../../../contexts/LanguageContextProvider";
import { logout } from "../../../actions/AccountActions";
import { styled } from "@mui/material/styles";
import BrandingWrapper from "../../../app/BrandingWrapper";

const Topnav = () => {
  const { locale, setLocale } = useContext(LanguageContext);
  const partnerUser = useContext(PartnerUserContext);
  const history = useHistory();
  const { firstName, lastName } = partnerUser;
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const Offset = styled("div")({
    minHeight: "69px",
  });

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const dispatch = useDispatch();

  const dispatchLogout = (): void => {
    try {
      dispatch(logout());
      history.push("/");
    } catch (error) {
      // TODO: Toast Modal Error
    }
  };

  const changePassword = (): void => {
    try {
      history.push("/changepassword");
    } catch (error) {}
  };

  return (
    <>
      <AppBar sx={{ position: "fixed" }}>
        <Container maxWidth={false} disableGutters>
          <Toolbar sx={{ pr: "62px", minHeight: "69px" }} disableGutters>
            <Box sx={{ flexGrow: 1, display: "flex", marginLeft: "52px" }}>
              <Typography variant="brandName">
                {BrandingWrapper.brandingTitle}
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 0, display: "flex" }}>
              <Box sx={{ mr: "24px" }}>
                <LanguageDropdown
                  locale={locale}
                  setLocale={setLocale}
                  className=""
                />
              </Box>

              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
                disableRipple
              >
                <Typography>
                  <FormattedMessage
                    id="welcome"
                    defaultMessage="Welcome"
                    description="topnav label"
                  />
                  {","}
                </Typography>
                <Typography variant="link">
                  <strong>
                    &nbsp; {firstName} {lastName}!
                  </strong>
                </Typography>
              </IconButton>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => changePassword()}>
                  <Typography textAlign="center">
                    <FormattedMessage
                      id="changePassword"
                      defaultMessage="Change Password"
                    />
                  </Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatchLogout()}>
                  <Typography textAlign="center">
                    <FormattedMessage
                      id="logout"
                      defaultMessage="Logout"
                      description="topnav label"
                    />
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Offset />
    </>
  );
};

export default Topnav;
