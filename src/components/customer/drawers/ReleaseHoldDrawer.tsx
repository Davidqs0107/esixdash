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

import PropTypes from "prop-types";
import React from "react";
import api from "../../../api/api";
import emitter from "../../../emitter";
import ReleaseMemo from "./ReleaseMemo";

interface IReleaseHoldDrawer {
  toggleDrawer?: () => void;
  holdId: string;
  customerNumber: string;
  showReleased?: boolean;
}

const ReleaseHoldDrawer: React.FC<IReleaseHoldDrawer> = (props) => {
  const { toggleDrawer, holdId, customerNumber, showReleased } = props;
  const cancel = () => {
    if (toggleDrawer) toggleDrawer();
  };

  const createOrUpdateMemo = (data: any) => {
    // @ts-ignore
    api.CustomerAPI.releaseAuthorizationWithMemo(customerNumber, holdId, {
      releaseMemo: data.memo,
    })
      .then(() => {
        if (toggleDrawer) toggleDrawer();
        emitter.emit("customer.holds.changed", {
          status: true,
          showReleased,
        });
        emitter.emit("customer.details.changed", {});
      })
      .catch((e: any) => console.log(e));
  };

  return (
    <ReleaseMemo
      release={(values) => createOrUpdateMemo(values)}
      type="hold"
      cancel={() => cancel()}
    />
  );
};

export default ReleaseHoldDrawer;
