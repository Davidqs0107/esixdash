/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import React, { useState, FC, useEffect } from "react";
import api from "../../../api/api";
import emitter from "../../../emitter";
import ReleaseMemo from "./ReleaseMemo";
import RiskStatusEvents from "../pagenavs/RiskStatusEvents";

interface IReleaseBlockDrawer {
  toggleDrawer?: () => void;
  blockType: string;
  altId: string; //could be cardId or customerNumber
  blockId?: string;
}

const ReleaseBlockDrawer: React.FC<IReleaseBlockDrawer> = (props) => {
  const { toggleDrawer, blockId, blockType, altId } = props;
  const isCardBlock = blockType && blockType !== "customer";

  const cancel = () => {
    if (toggleDrawer) toggleDrawer();
  };

  const releaseBlock = async (values: any) => {
    const { memo, reasonBlockId } = values;
    if (blockType === "customer") {
      // altId => customerNumber for CustomerBlock
      // @ts-ignore
      await api.CustomerAPI.releaseCustomerBlockWithMemo(altId, blockId, {
        releaseMemo: memo.replace(/^\s*[\r\n]/gm, ""),
      }).catch((error: any) => error);
    } else {
      // altId => cardId for CardBlock
      // @ts-ignore
      await api.CardAPI.releaseCardBlockWithMemo(altId, reasonBlockId, {
        releaseMemo: memo.replace(/^\s*[\r\n]/gm, ""),
      }).catch((error: any) => error);
    }
    emitter.emit(RiskStatusEvents.BlocksChanged, {});
    emitter.emit("customer.details.changed", {});
  };

  return (
    <ReleaseMemo
      release={(values) => releaseBlock(values)}
      cancel={() => cancel()}
      type="block"
      blockType={blockType}
      altId={altId}
      blockId={blockId}
    />
  );
};

export default ReleaseBlockDrawer;
