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

import React, { useState, lazy, FC } from "react";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import ClickableRender from "../../common/ClickableRender";
import Label from "../../common/elements/Label";
import newid from "../../util/NewId";
import emitter from "../../../emitter";
import { ChangeOrderEvents } from "../../../pages/change-orders/ChangeOrders";
import SubmitButton from "../../common/elements/SubmitButton";
import CancelButton from "../../common/elements/CancelButton";
import Icon from "../../common/Icon";
import Header from "../../common/elements/Header";
import { createStyles, makeStyles } from "@mui/styles";
import { Info, InfoSubtitle, InfoTitle } from "../../common/info";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

// @ts-ignore
const useStyles = makeStyles(() => ({
  root: {
    zIndex: "1010 !important",
  },
  maindiv: {
    marginTop: "2.5rem",
  },
  container: {
    display: "grid !important",
    gridTemplateColumns: "60%  40%",
    gridAutoFlow: "row",
    justifyContent: "space-evenly",
    alignContent: "space-evenly",
    alignItems: "center",
  },
  mainLabel: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    color: "rgba(255,255,255,.5)",
    paddingTop: 4,
  },
  label: {
    color: "#8995AD",
    fontFamily: "Montserrat",
    fontSize: "8px",
    letterSpacing: "normal",
    lineHeight: "12px",
    minHeight: "12px",
    textTransform: "capitalize",
    marginBottom: "3px",
  },
  text: {
    color: "#FFFFFF",
    fontFamily: "Montserrat",
    fontSize: "12px",
    letterSpacing: "-0.2px",
    lineHeight: "13px",
    minHeight: "15px",
    textTransform: "capitalize",
    marginBottom: "20px !important",
  },
  button: {
    display: "grid !important",
    gridTemplateColumns: "1px  1px",
    justifyItems: "center",
    marginTop: 20,
    justifyContent: "space-evenly",
    alignContent: "space-evenly",
    alignItems: "center",
    marginBottom: "4rem",
  },
  grid: {
    display: "grid",
    justifyItems: "center",
    marginTop: 20,
    justifyContent: "space-evenly",
    alignContent: "space-evenly",
    alignItems: "center",
  },
  form: {
    paddingLeft: "15px",
    paddingRight: "15px",
  },
  tsst: {
    display: "grid",
    justifyContent: "space-evenly",
  },
}));

const DarkContainer = styled(Container)(({ theme }) => ({
  width: "400px",
  "& p.MuiTypography-body1, & span.MuiTypography-body1": {
    color: "#FFFFFF",
    marginBottom: "10px",
  },
  "& label.MuiTypography-body1": {
    color: "#8995AD",
    marginBottom: "10px",
  },
  "& .Mui-error": {
    color: "#EE0351",
  },
}));

interface IChangeOrderRequestDetailsDrawer {
  id: string;
  label: React.ReactNode | string;
  callbackFunc: () => void;
  LevelTwo: () => void;
  disabled: boolean;
  widthPercentage: number;
  children: React.ReactNode;
  buttonProps: string;
  data: any;
}

const ChangeOrderRequestDetailsDrawer: FC<IChangeOrderRequestDetailsDrawer> = ({
  id,
  data,
  callbackFunc,
  disabled = false,
  widthPercentage = 20,
  ...props
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const { buttonProps } = props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDisabled] = useState(disabled);
  // const {discardObj} = data
  const [confirm, setConfirm] = useState(false);
  const { drawerData, origin } = data;
  const { discardObj } = data;

  const toggleDrawer = () => {
    if (callbackFunc) {
      callbackFunc();
    }
    setIsDrawerOpen(!isDrawerOpen);
  };

  const formattedMessageDynamic = (key: any) => {
    // const message = defineMessage({
    //   id: key,
    //   description: "Section Label",
    //   defaultMessage: key,
    // });
    //
    // intl.formatMessage(message, key);
    // TODO: change order details needs a converter
    let keyName = key[0];
    return keyName.charAt(0).toUpperCase() + keyName.slice(1);
  };

  // eslint-disable-next-line no-shadow
  const handleDelete = (discardObj: any) => {
    const deletePlanObj = { ...discardObj, partner: drawerData.partner };
    emitter.emit(ChangeOrderEvents.DeleteFeePlanRequested, deletePlanObj);
  };

  return (
    <div>
      <ClickableRender
        id={newid()}
        onClickFunc={() => {
          toggleDrawer();
        }}
      >
        {drawerData.partner}
      </ClickableRender>

      <Drawer
        PaperProps={{
          style: {
            backgroundColor: "#292750",
            paddingRight: "0px",
            paddingBottom: "40px",
          },
        }}
        anchor="right"
        open={isDrawerOpen}
        onClose={() => {
          toggleDrawer();
          setConfirm(false);
        }}
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
            >
              <img
                src={Icon.closeIconWhite}
                alt="close icon"
                height={11}
                width={11}
              />
            </QDButton>
          </Box>
          <Container>
            {!confirm ? (
              <Box>
                {/* eslint-disable-next-line max-len */}
                <div>
                  <Header
                    value={intl.formatMessage({
                      id: "changeRequestDetails",
                      description: "drawer header",
                      defaultMessage: "Change Request Details",
                    })}
                    level={2}
                    bold
                    color="white"
                    drawerTitle
                  />
                </div>
                <Box sx={{ mb: 4 }}>
                  {/* eslint-disable-next-line no-unused-vars */}
                  {Object.entries(drawerData).map((key, val) => (
                    <>
                      <Info>
                        <InfoTitle className={classes.label}>
                          {formattedMessageDynamic(key)}
                        </InfoTitle>
                        <InfoSubtitle className={classes.text}>
                          {/* @ts-ignore */}
                          {key[1]}
                        </InfoSubtitle>
                      </Info>
                    </>
                  ))}
                </Box>
                <Grid container rowSpacing={1} justifyContent="center">
                  <Grid item xs={4}>
                    <CancelButton
                      id="changeorder-details-cancel-button"
                      onClick={() => toggleDrawer()}
                    >
                      <FormattedMessage
                        id="cancel"
                        defaultMessage="Cancel"
                        description="Input Label"
                      />
                    </CancelButton>
                  </Grid>
                  <Grid item xs={7}>
                    <SubmitButton
                      id="id"
                      onClick={() => {
                        setConfirm(true);
                      }}
                      color="secondary"
                      disabled={data.state === "Approved"}
                    >
                      <FormattedMessage
                        id="delete"
                        defaultMessage="Delete"
                        description="Input Label"
                      />
                    </SubmitButton>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Label color="white">
                    <FormattedMessage
                      id="drawer.delete.changeOrder"
                      description="drawer header"
                      defaultMessage="Are you sure you want to delete the change order?"
                    />
                  </Label>
                </Box>
                <Grid container rowSpacing={1} justifyContent="center">
                  <Grid item xs={4}>
                    <CancelButton
                      id="drawer-cancel-memo-button"
                      onClick={() => setConfirm(false)}
                      style={{ marginRight: "14px" }}
                    >
                      <FormattedMessage
                        id="cancel"
                        description="Cancel button"
                        defaultMessage="Cancel"
                      />
                    </CancelButton>
                  </Grid>
                  <Grid item xs={4}>
                    <SubmitButton
                      id="drawer-submit-memo-button"
                      onClick={() => {
                        handleDelete(discardObj);
                        toggleDrawer();
                      }}
                    >
                      <FormattedMessage
                        id="delete"
                        description="Delete Change Order Button"
                        defaultMessage="Delete"
                      />
                    </SubmitButton>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Container>
        </DarkContainer>
      </Drawer>
    </div>
  );
};

export default ChangeOrderRequestDetailsDrawer;
