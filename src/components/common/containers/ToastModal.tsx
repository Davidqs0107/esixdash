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

import React, { useContext, useState, lazy } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Modal, Backdrop, Fade, Grid, Typography, Avatar } from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseButton from "../forms/buttons/CloseButton";
import { MessageContext } from "../../../contexts/MessageContext";
import newid from "../../util/NewId";
import Header from "../elements/Header";

const QDButton = lazy(() => import("../elements/QDButton"));

const TModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  flexDirection: "row",
  width: "100%",
  bottom: "20vh",
  left: "68px",

  "& .MuiGrid-container": {
    zIndex: 1,
    backgroundColor: "White",
    borderRadius: "68px",
    border: "2px  #ffff",
    width: "100%",
    maxWidth: "737px",
    minHeight: "68px",
    boxShadow: "0 50px 50px -27px rgba(0,0,0,0.5)",
    padding: "10px",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "nowrap",
  },

  "& .MuiTypography-h3": {
    lineHeight: "22px",
  },

  "& .MuiTypography-body1": {
    fontSize: "10px",
    lineHeight: "12px",
  },

  "& .MuiAvatar-circular": {
    boxShadow: "none",
  },

  "& .MuiButton-textSecondary": {
    color: "#292750",
    boxShadow: "none",
    fontSize: "12px",
  },

  "&.Toast-info .MuiGrid-container": {
    paddingLeft: "22px",
  },

  "&.Toast-info .MuiAvatar-circular": {
    width: "16px",
    height: "16px",
  },
}));

interface IToastModal {
  icon: string;
  headline: string;
  body: string;
  className: string;
  toggleDrawer: () => void;
  message: string;
  showXIcon: boolean;
  buttons: {
    id: string;
    color: any;
    variant: any;
    label: string;
    onClick: () => string;
  }[];
}

const ToastModal: React.FC<IToastModal> = (props) => {
  const {
    icon,
    headline,
    body,
    className,
    toggleDrawer,
    message,
    buttons,
    showXIcon,
  } = props;
  const intl = useIntl();
  const [modal, setModal] = useState(true);
  const { resetMessageValues } = useContext(MessageContext);

  const toggle = () => {
    setModal(!modal);
    resetMessageValues(); // Clear the error contexts
    toggleDrawer();
  };

  const getToastHeader = () => {
    if (headline.length > 0 && body.length > 0) {
      return `${headline} - ${body}`;
    }

    if (headline.length > 0) {
      return headline;
    }

    return body;
  };

  return (
    <>
      <TModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modal}
        onClose={() => toggle()}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        className={`Toast-${className}`}
      >
        <Fade in={modal} timeout={500}>
          <Grid container columnSpacing={{ xs: 3 }}>
            <Grid item>
              <Avatar
                alt="Icon"
                src={icon}
                sx={{ mr: 2, width: 40, height: 40 }}
              />
            </Grid>
            <Grid item sx={{ flexGrow: 1 }}>
              <div id="transition-modal-title">
                <Header value={getToastHeader()} level={3} bold />
              </div>
              <Typography id="transition-modal-description">
                {message}
              </Typography>
            </Grid>
            {/* when XIcon is showing, hide dismiss button  */}
            {showXIcon ? (
              <Grid item sx={{ mr: "25px", display: "flex" }}>
                <CloseButton onClickFunc={() => toggle()} />
              </Grid>
            ) : (
              buttons.map((button) => (
                <Grid
                  key={`${newid("btn.modalActions.")}`}
                  item
                  sx={{ mr: "25px" }}
                >
                  <QDButton
                    onClick={() => toggle()}
                    id={`modalMsg${button.id}`}
                    color={button.color}
                    variant={button.variant}
                    label={button.label}
                    size="large"
                  />
                </Grid>
              ))
            )}
          </Grid>
        </Fade>
      </TModal>
    </>
  );
};

export default ToastModal;
