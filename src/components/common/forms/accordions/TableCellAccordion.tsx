/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import React, { ReactElement, useState } from "react";
import { FormattedMessage } from "react-intl";
import Icon from "../../Icon";
import QDButton from "../../elements/QDButton";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";

interface ITableCellAccordion {
  children: React.ReactNode;
  hideNumber: number;
  showNumber: number;
  addDrawer?: ReactElement;
  showIcon?: boolean;
}

const TableCellAccordion: React.FC<ITableCellAccordion> = ({
  children,
  hideNumber,
  showNumber,
  addDrawer,
  showIcon = true,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => setExpanded(!expanded);

  return (
    <>
      <Collapse in={expanded}>{children}</Collapse>
      <Grid container>
        <Grid item>
          <QDButton
            variant={showIcon ? "icon" : "text"}
            onClick={() => toggle()}
            style={{
              paddingLeft: "0px",
            }}
          >
            {showIcon && (
              <Avatar
                alt={"Expand/Collapse Icon"}
                src={expanded ? Icon.collapseIcon : Icon.expandIcon}
                sx={{ mr: 1, height: "13px", width: "13px" }}
              />
            )}
            <Typography component="span" variant="boldLink">
              {expanded ? (
                <>
                  <FormattedMessage
                    id="button.hide"
                    description="Cancel button"
                    defaultMessage="Hide {hideNumber}"
                    values={{ hideNumber }}
                  />
                  {!showIcon && " <<"}
                </>
              ) : (
                <>
                  <FormattedMessage
                    id="button.view"
                    description="Cancel button"
                    defaultMessage="View all {showNumber}"
                    values={{ showNumber }}
                  />
                  {!showIcon && " >>"}
                </>
              )}
            </Typography>
          </QDButton>
        </Grid>
        {addDrawer !== undefined ? (
          <Grid sx={{ marginLeft: "auto" }} justifyContent="flex-end">
            {addDrawer}
          </Grid>
        ) : (
          ""
        )}
      </Grid>
    </>
  );
};

export default TableCellAccordion;
