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

import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { tabsClasses } from "@mui/material/Tabs";
import emitter from "../../../emitter";

interface IPageNavComponent {
  key: string;
  name: string | React.ReactNode;
  targetComponent: any;
}

interface IPageNav {
  components: IPageNavComponent[];
  customerNumber?: number;
  primaryPersonId?: number;
  portfolioId?: number;
  sessionKey: string;
  defaultTab?: string;
  programName?: string;
  homeCurrency?: string;
  variant?: "outlined";
  parentCustomerNumber?: number | null;
}

const Tabs = styled(TabList)({
  "& .MuiTabs-indicator": {
    height: 4,
    backgroundColor: "#433AA8",
  },
  "& .MuiButtonBase-root": {
    minWidth: "34px",
    color: "#8995AD",
    fontSize: 14,
    textTransform: "none",
    padding: "7px 0 0",
    marginRight: "40px",
  },
  "& .MuiButtonBase-root.Mui-selected": {
    color: "#152C5B",
  },
});

const ExtTabPanel = styled(TabPanel)({
  paddingTop: 30,
  paddingLeft: 0,
});

const PageNav: React.FC<IPageNav> = ({
  components,
  sessionKey,
  defaultTab,
  variant,
  ...rest
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || components[0].key);
  // TODO: this needs to be defined by the calling page, and we need to potentially unset it when changing pages
  const CUSTOMER_TAB_SESSION_KEY = sessionKey;

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
    sessionStorage.setItem(CUSTOMER_TAB_SESSION_KEY, tab);
  };

  useEffect(() => {
    if (!defaultTab) {
      const tab = sessionStorage.getItem(CUSTOMER_TAB_SESSION_KEY);
      if (tab !== null || tab) {
        toggle(tab);
      } else {
        sessionStorage.setItem(CUSTOMER_TAB_SESSION_KEY, activeTab);
      }
    } else {
      toggle(defaultTab);
    }
    emitter.on("common.navigation.changed", (data: any) => {
      toggle(data.tab);
      if (data.tab == "transactions") {
        setTimeout(() => {
          emitter.emit("customer.preset.transaction.filters", data);
        }, 1000);
      }
    });
  }, [CUSTOMER_TAB_SESSION_KEY, defaultTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    toggle(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={activeTab}>
        <Box>
          <Tabs
            onChange={handleTabChange}
            aria-label="lab API tabs example"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                display: "block",
                padding: "18px 0 0",
                minWidth: "initial",
                marginRight: "0",
                "&.Mui-disabled": { display: "none" },
              },
              borderBottom:
                variant && variant == "outlined" ? "1px solid #eeeeee" : "none",
            }}
          >
            {components &&
              components.map((nav, idx) => (
                <Tab
                  key={nav.key}
                  id={`${nav.key}-tab`}
                  label={nav.name}
                  value={nav.key}
                />
              ))}
          </Tabs>
        </Box>
        {components &&
          components.map((component) => (
            <ExtTabPanel value={component.key} key={component.key}>
              <component.targetComponent {...rest} />
            </ExtTabPanel>
          ))}
      </TabContext>
    </Box>
  );
};

export default PageNav;
