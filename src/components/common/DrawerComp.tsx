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

import React, {
  useState,
  Children,
  lazy,
  ReactElement,
  useEffect,
} from "react";
import { Box, Grid, Container, Drawer } from "@mui/material";
import { styled } from "@mui/material/styles";
import Icon from "./Icon";
import QDTooltip from "./elements/QDTooltip";

const QDButton = lazy(() => import("./elements/QDButton"));

interface ILevelTwo {
  toggleLevelTwo: any;
}

interface IDrawerComp {
  id?: string;
  name?: string;
  size?: "small" | "medium" | "large";
  variant?: "text" | "outlined" | "contained";
  bodyInteractive?: "regular" | "small";
  label: string | any;
  callbackFunc?: any;
  LevelTwo?: React.ComponentType<ILevelTwo>;
  textCase?: "upper" | "provided";
  widthPercentage?: number;
  overrideWidth?: boolean;
  disabled?: boolean;
  asLink?: boolean;
  buttonProps?: string;
  buttonStyle?: any;
  buttonColor?: "inherit" | "primary" | "secondary";
  children: ReactElement;
  truncated?: boolean; // default is true, only used when asLink is true
  truncateAt?: number; // truncated needs to be set to true, default is 30, only used when asLink is true
  disableHorizontalScroll?: boolean;
}

const DarkContainer = styled(Container)(({ theme }) => ({
  "& p.MuiTypography-body1, & span.MuiTypography-body1": {
    color: "#FFFFFF",
    marginBottom: "10px",
  },
  "& label.MuiTypography-body1": {
    color: "#8995AD",
    marginBottom: "10px",
  },
  "& label span.MuiTypography-boldLink": {
    color: "#FFFFFF",
    fontSize: "12px",
    fontWeight: 400,
  },
  "& .Mui-error": {
    color: "#EE0351",
  },
  "& span.MuiFormControlLabel-label.Mui-disabled": {
    color: "#FFFFFF",
  },
  "& .MuiTableCell-root span.MuiTypography-body1": {
    color: "inherit"
  }
}));

const DrawerComp: React.FC<IDrawerComp> = ({
  id,
  name,
  size = "small",
  variant = "contained",
  label,
  callbackFunc,
  LevelTwo,
  widthPercentage = 20,
  overrideWidth = false,
  disabled = false,
  asLink = false,
  buttonProps = "",
  buttonStyle,
  buttonColor = "primary",
  textCase = "provided",
  bodyInteractive = "regular",
  truncated = true,
  truncateAt = 30,
  disableHorizontalScroll = false,
  ...props
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLevelTwoOpen, setIsLevelTwoOpen] = useState(false);
  const [levelTwoColumn] = useState(LevelTwo ? 4 : 12);
  const [isDisabled, setIsDisabled] = useState(disabled);

  const toggleDrawer = () => {
    if (callbackFunc) {
      callbackFunc();
    }
    setIsDrawerOpen(!isDrawerOpen);
  };

  /* Required to change the disabled status when the condition is updated on the parent. */
  useEffect(() => {
    setIsDisabled(disabled);
  }, [disabled]);

  const toggleLevelTwo = () => setIsLevelTwoOpen(!isLevelTwoOpen);

  return (
    <div>
      {asLink ? (
        <QDTooltip
          title={truncated && label.length > truncateAt ? label : ""}
          interactive
        >
          <div className="buttonAsLink">
            <QDButton
              id={id}
              name={name}
              onClick={() => toggleDrawer()}
              label={
                truncated && label.length > truncateAt
                  ? `${label.substring(0, truncateAt)}...`
                  : label
              }
              size={size}
              textCase={textCase}
              variant="text"
              style={buttonStyle}
            />
          </div>
        </QDTooltip>
      ) : (
        <QDButton
          id={id}
          name={name}
          onClick={() => toggleDrawer()}
          label={label}
          color={buttonColor}
          variant={variant}
          size={size}
          disabled={isDisabled}
          textCase={textCase}
          style={buttonStyle}
        />
      )}

      <Drawer
        PaperProps={{
          style: {
            minWidth:
              (LevelTwo && isLevelTwoOpen) || overrideWidth
                ? `${widthPercentage}%`
                : "20%",
            overflowX: disableHorizontalScroll ? "hidden" : "inherit",
            backgroundColor: "#292750",
            paddingRight: "0px",
            paddingBottom: "40px",
          },
        }}
        anchor="right"
        open={isDrawerOpen}
        onClose={() => toggleDrawer()}
      >
        <DarkContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "20px 0",
            }}
          >
            <QDButton
              label=""
              type="button"
              onClick={() => toggleDrawer()}
              id="drawer-close-btn"
              variant="icon"
              style={buttonStyle}
            >
              <img
                height={11}
                width={11}
                src={Icon.closeIconWhite}
                alt="close icon"
              />
            </QDButton>
          </Box>
          {/* eslint-disable-next-line max-len */}
          <Grid container columnSpacing={4} sx={{ flexWrap: "nowrap" }}>
            <Grid item xs={levelTwoColumn}>
              {Children.map(props.children, (child) => {
                if (React.isValidElement(child)) {
                  return React.cloneElement(child as React.ReactElement<any>, {
                    ...props,
                    toggleDrawer,
                    toggleLevelTwo,
                    isLevelTwoOpen,
                  });
                }
                return child;
              })}
            </Grid>
            {LevelTwo && isLevelTwoOpen ? (
              <Grid item flexGrow={1} sx={{ pr: "16px" }}>
                <LevelTwo toggleLevelTwo={toggleLevelTwo} />
              </Grid>
            ) : null}
          </Grid>
        </DarkContainer>
      </Drawer>
    </div>
  );
};

export default DrawerComp;
