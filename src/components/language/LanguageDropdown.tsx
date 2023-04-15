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
import { FormattedMessage } from "react-intl";
import LanguageConverter from "../common/converters/LanguageConverter";
import {
  Divider,
  List,
  ListItem,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

interface ILanguageDropdown {
  locale: string;
  setLocale: any;
  className: string;
}

const options = ["en", "ja", "pt", "es"];

const LanguageDropdown: React.FC<ILanguageDropdown> = ({
  locale,
  setLocale,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (value: string) => {
    setLocale(value);
    setAnchorEl(null);
  };

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const resetLanguage = () => {
    setLocale(navigator.language.split(/[-_]/)[0]);
  };

  return (
    <div>
      <List
        component="nav"
        aria-label="Select Language"
        sx={{ minWidth: "200px" }}
      >
        <ListItem
          button
          id="select-language-button"
          aria-haspopup="listbox"
          aria-controls="lock-menu"
          aria-label="select a language"
          aria-expanded={Boolean(anchorEl) ? "true" : undefined}
          onClick={handleClickListItem}
        >
          <LanguageConverter locale={locale} className="bold" />
        </ListItem>
      </List>
      <Menu
        id="select-language-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "select-language-button",
          role: "listbox",
        }}
        sx={{ minWidth: "200px" }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            selected={option === locale}
            onClick={() => handleClick(option)}
          >
            <LanguageConverter locale={option} />
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          onClick={() => resetLanguage()}
          sx={{ justifyContent: "center" }}
        >
          <Typography variant="link">
            <FormattedMessage
              id="reset"
              defaultMessage="Reset"
              description="Reset"
            />
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageDropdown;
