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

import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import emitter from "../../../emitter";
import Icon from "../../common/Icon";
import QDButton from "../../common/elements/QDButton";
import DrawerEditWallet from "./DrawerEditWallet";

const WalletCardDrawer = (props: any) => {
  const {
    id,
    card,
    cardClicked,
    cancelCardRequest,
    processReissue,
    personId,
    viewFullPanRequest,
  } = props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(cardClicked);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    emitter.on("customer.details.changed", () => {
      toggleDrawer();
    });
  }, []);

  const cancelCard = () => {
    cancelCardRequest(id);
    toggleDrawer();
  };

  const viewFullPan = () => {
    viewFullPanRequest(id);
  };

  return (
    <div>
      <Drawer
        PaperProps={{
          style: {
            minWidth: "20%",
            maxWidth: "30%",
            zIndex: "1010",
          },
        }}
        anchor="right"
        open={isDrawerOpen}
        onClose={() => toggleDrawer()}
      >
        <Box>
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
        <DrawerEditWallet
          cancelCardRequest={cancelCard}
          card={card.props.cardInfo}
          personId={personId}
          processReissue={processReissue}
          // @ts-ignore
          viewFullPanRequest={viewFullPan}
          toggleDrawer={toggleDrawer}
        />
      </Drawer>
    </div>
  );
};

export default WalletCardDrawer;
