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

import React, { useState } from "react";
import { Box, List, ListItem, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import Icon from "../Icon";
import { FormattedMessage } from "react-intl";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import rolesRouteConfig from "../../../app/routing/RolesRouteConfig";

import SidenavItem from "./SidenavItem";
import { store } from "../../../store";
import { logout } from "../../../actions/AccountActions";
import authService from "../../../services/authService";

const NavListItem = styled(ListItem)(({ theme }) => ({
  cursor: "pointer",
  padding: "0",
  "& > .MuiBox-root": {
    display: "flex",
    alignItems: "center",
    width: "100%",
    height: "44px",
  },
  "&.Mui-selected, &:hover": {
    backgroundColor: "white!important",
    width: "204px",
    boxShadow: theme.container.shadow,
    "& .icon": {
      color: theme.palette.primary.dark,
      backgroundColor: theme.palette.bodyText.highlight,
      padding: "10px 22px",
      "& > img": {
        filter: "brightness(0) invert(1)",
      },
    },
    "& .text": {
      color: theme.palette.primary.dark,
      paddingLeft: "14px",
    },
  },
  "& .text": {
    color: theme.palette.bodyText.body,
    paddingLeft: "4px",
  },
}));

const Sidenav: React.FC<any> = (props: any) => {
  const dispatch = useDispatch();
  const state = store.getState();
  const roles = state.account?.user?.roles;
  const routes = props.children;
  const location = useLocation();

  let allowedNavItems: any[];
  let sideNavItems: any[];

  if (roles && routes) {
    // get allowed nav items based on the roles
    allowedNavItems = authService.calculateRoutesBasedOnRoles(
      roles,
      rolesRouteConfig
    );
    // build the sidenavItemsObject
  } else {
    // something is obviously wrong
    dispatch(logout());
  }

  // this needs to be redone based on routes
  sideNavItems = [
    {
      key: "customer",
      icon: Icon.CustomerIcon,
      path: "/customer",
      tr: (
        <FormattedMessage
          id="customers"
          defaultMessage="Customers"
          description="sidenav label"
        />
      ),
    },
    {
      key: "programs",
      icon: Icon.ProgramsIcon,
      path: "/programs",
      tr: (
        <FormattedMessage
          id="programs"
          defaultMessage="Programs"
          description="sidenav label"
        />
      ),
    },
    {
      key: "partners",
      icon: Icon.PartnersIcon,
      path: "/partners",
      tr: (
        <FormattedMessage
          id="partners"
          defaultMessage="Partners"
          description="sidenav label"
        />
      ),
    },
    {
      key: "banks",
      icon: Icon.BankIcon,
      path: "/banks",
      tr: (
        <FormattedMessage
          id="banks"
          defaultMessage="Banks"
          description="sidenav label"
        />
      ),
    },
    {
      key: "separator",
    },
    {
      key: "change",
      icon: Icon.ChangeOrdersIcon,
      path: "/change",
      tr: (
        <FormattedMessage
          id="changeOrders"
          defaultMessage="Change Orders"
          description="sidenav label"
        />
      ),
    },
    {
      key: "users",
      icon: Icon.UsersIcon,
      path: "/users",
      tr: (
        <FormattedMessage
          id="users"
          defaultMessage="Users"
          description="sidenav label"
        />
      ),
    },
    {
      key: "audit",
      icon: Icon.AuditIcon,
      path: "/audit",
      tr: (
        <FormattedMessage
          id="audit"
          defaultMessage="Audit"
          description="sidenav label"
        />
      ),
    },
  ];

  sideNavItems = sideNavItems.filter(
    (item) => allowedNavItems && allowedNavItems.includes(item.key)
  );

  const getCurrentTab = () => {
    const current = sideNavItems.find((s: any) =>
      location.pathname.includes(s.path)
    );
    return current ? current.key : "";
  };

  const [activeTab, setActiveTab] = useState(getCurrentTab());

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <Container disableGutters>
      <List
        component="nav"
        aria-label="customers banks"
        sx={{ position: "fixed" }}
        disablePadding
      >
        {sideNavItems.map((nav) =>
          nav.key !== "separator" ? (
            <NavListItem
              id={`${nav.key}-tab`}
              key={`${nav.key}-tab`}
              selected={activeTab === nav.key}
              className={`${activeTab === nav.key ? "active" : ""}`}
              onClick={() => {
                toggle(nav.key);
              }}
              disableGutters
            >
              <SidenavItem sideNavItem={nav} />
            </NavListItem>
          ) : (
            <Box key={`${nav.key}-tab`} sx={{ margin: "12px 0" }} />
          )
        )}
      </List>
    </Container>
  );
};

export default Sidenav;
