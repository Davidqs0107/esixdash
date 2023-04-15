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
 *
 */

import React, { useContext } from "react";
import { useIntl } from "react-intl";
import Box from "@mui/material/Box";
import DrawerComp from "../common/DrawerComp";
import RiskStatusDrawer from "./drawers/RiskStatusDrawer";
import { ContentVisibilityContext } from "../../contexts/ContentVisibilityContext";
import ReadOnlyRiskDrawer from "./drawers/ReadOnlyRiskDrawer";

interface IRiskLevelCard {
  customer: any;
}

const CustomerRiskLevelCard: React.FC<IRiskLevelCard> = ({ customer }) => {
  const { canSeeRiskLevels } = useContext(ContentVisibilityContext);
  const intl = useIntl();
  return (
    <>
      <Box>
        {/* <span className="currency">1 ACTIVE</span><span> RISK EXCEPTION</span> */}
      </Box>
      <Box>
        {canSeeRiskLevels ? (
          <DrawerComp
            id="risk-status-drawer"
            label={intl.formatMessage({
              id: "viewRiskLevelDetails",
              defaultMessage: "view risk level details >>",
            })}
            asLink
            buttonProps="ml-2 pl-0"
            widthPercentage={65}
            bodyInteractive="small"
          >
            <RiskStatusDrawer />
          </DrawerComp>
        ) : (
          <DrawerComp
            id="risk-status-drawer"
            label={intl.formatMessage({
              id: "viewRiskLevelDetails",
              defaultMessage: "view risk level details >>",
            })}
            buttonProps="ml-2 pl-0"
            asLink
            bodyInteractive="small"
          >
            <ReadOnlyRiskDrawer />
          </DrawerComp>
        )}
      </Box>
    </>
  );
};

export default CustomerRiskLevelCard;
