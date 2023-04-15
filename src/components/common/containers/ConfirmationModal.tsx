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
import { useIntl } from "react-intl";
import { Modal, Backdrop, Fade, Typography, Avatar, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MessageContext } from "../../../contexts/MessageContext";

const QDButton = lazy(() => import("../elements/QDButton"));

const TModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  flexDirection: "row",
  width: "100%",
  bottom: "20vh",
  left: "68px",
  "& .MuiAvatar-circular": {
    boxShadow: "none",
  },
  "&.Toast-info .MuiAvatar-circular": {
    width: "16px",
    height: "16px",
  },
}));

interface IConfirmationModal {
  icon: string;
  body: string;
  toggleDrawer: () => void;
  handleConfirm: () => void;
}

const ConfirmationModal: React.FC<IConfirmationModal> = ({
  icon,
  body,
  toggleDrawer,
  handleConfirm,
}) => {
  const intl = useIntl();
  const [modal, setModal] = useState(true);
  const { resetMessageValues } = useContext(MessageContext);

  const toggle = () => {
    setModal(!modal);
    resetMessageValues(); // Clear the error contexts
    toggleDrawer();
  };

  return (
    <>
      <TModal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modal} timeout={500}>
          <Box
            sx={{
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
              flexWrap: "nowrap",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                alt="Icon"
                src={icon}
                sx={{ mr: 2, width: 40, height: 40 }}
              />
              <Box>
                <Typography
                  sx={{
                    color: "#152C5B",
                    fontSize: "14px",
                    lineHeight: "18px",
                    fontWeight: 500,
                  }}
                >
                  {body}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <QDButton
                type="button"
                id="confirmation-modal-confim"
                label={intl.formatMessage({
                  id: "confirm",
                  defaultMessage: "Confirm",
                })}
                onClick={handleConfirm}
                variant="contained"
                style={{ marginRight: "20px" }}
              />
              <QDButton
                type="button"
                id="confirmation-modal-cancel"
                label={intl.formatMessage({
                  id: "cancel",
                  defaultMessage: "Cancel",
                })}
                onClick={() => toggle()}
                variant="text"
                color="info"
                style={{ color: "#292750", marginRight: "27px" }}
              />
            </Box>
          </Box>
        </Fade>
      </TModal>
    </>
  );
};

export default ConfirmationModal;
