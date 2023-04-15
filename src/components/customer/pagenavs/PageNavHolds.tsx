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

import React, { useState, useEffect, FC, useContext } from "react";
import Box from "@mui/material/Box";
import {
  defineMessage,
  defineMessages,
  FormattedMessage,
  FormattedNumber,
  useIntl,
} from "react-intl";
import api from "../../../api/api";
import Toggle from "../../common/forms/checkboxes/Toggle";
import StandardTable from "../../common/table/StandardTable";
import CurrencyRender from "../../common/converters/CurrencyRender";
import DateAndTimeConverter from "../../common/converters/DateAndTimeConverter";
import TxSourceConverter from "../../common/converters/TxSourceConverter";
import TxTypeConverter from "../../common/converters/TxTypeConverter";
import DrawerComp from "../../common/DrawerComp";
import TextRender from "../../common/TextRender";
import ReleaseHoldDrawer from "../drawers/ReleaseHoldDrawer";
import DrawerHoldDetails from "../drawers/DrawerHoldDetails";
import emitter from "../../../emitter";
import ClickableRender from "../../common/ClickableRender";
import Header from "../../common/elements/Header";
import QDFormattedCurrency from "../../common/converters/QDFormattedCurrency";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";
import EllipseMenu from "../../common/EllipseMenu";

interface IPageNavHolds {
  customerNumber: string;
}

const PageNavHolds: FC<IPageNavHolds> = (props) => {
  const { customerNumber } = props;
  const [holds, setHolds] = useState([]);
  const [showReleased, setShowReleased] = useState(false);
  const { readOnly } = useContext(ContentVisibilityContext);
  const intl = useIntl();

  const getReleaseMessage = (released: any) => {
    const messages = defineMessages({
      released: {
        id: "released",
        description: "Specifies this auth hold has been released",
        defaultMessage: "Released",
      },
      release: {
        id: "releaseHold",
        description: "Specifies that you can release this auth hold",
        defaultMessage: "Release Hold",
      },
    });
    const resultMsg = released ? messages.released : messages.release;
    return intl.formatMessage(resultMsg);
  };

  const getToggleMessage = (show: boolean) => {
    const messages = defineMessages({
      hide: {
        id: "hideReleasedHolds",
        description: "Toggle that when switched will hide the released holds",
        defaultMessage: "Hide released holds",
      },
      show: {
        id: "showReleasedHolds",
        description: "Toggle that when switched will show the released holds",
        defaultMessage: "Show released holds",
      },
    });
    const resultMsg = show ? messages.hide : messages.show;
    return intl.formatMessage(resultMsg);
  };

  const holdsMetadata = [
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="currency"
          description="Currency the hold was placed in"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) => (
        <CurrencyRender currencyCode={rowData.currency} />
      ),
    },
    {
      width: "9%",
      header: (
        <FormattedMessage
          id="amount"
          description="Amount of the transaction that triggered the auth"
          defaultMessage="Amount"
        />
      ),
      render: (rowData: any) => (
        <QDFormattedCurrency
          currency={rowData.currency}
          amount={rowData.amount}
        />
      ),
    },
    {
      width: "9%",
      header: (
        <FormattedMessage
          id="dateCreated"
          description="The time the auth hold was created"
          defaultMessage="Date Created"
        />
      ),
      render: (rowData: any) =>
        rowData.creationTime !== 0 ? (
          <DateAndTimeConverter epoch={rowData.creationTime} />
        ) : null,
    },
    {
      width: "9%",
      header: (
        <FormattedMessage
          id="source"
          description="The source of the Auth Hold"
          defaultMessage="Source"
        />
      ),
      render: (rowData: any) => (
        <TxSourceConverter txSourceCode={rowData.transactionSourceCode} />
      ),
    },
    {
      width: "9%",
      header: (
        <FormattedMessage
          id="merchantLocation"
          description="The address of the merchant"
          defaultMessage="Merchant Location"
        />
      ),
      render: (rowData: any) =>
        rowData.merchant ? (
          <TextRender data={rowData.merchant} />
        ) : (
          <span>--</span>
        ),
    },
    {
      width: "9%",
      header: (
        <FormattedMessage
          id="type"
          description="The type of the Auth Hold"
          defaultMessage="Type"
        />
      ),
      render: (rowData: any) => (
        <TxTypeConverter txTypeCode={rowData.transactionTypeCode} />
      ),
    },
    {
      width: "9%",
      header: (
        <FormattedMessage
          id="holdMemo"
          description="The Memo describing this Auth Hold"
          defaultMessage="Hold Memo"
        />
      ),
      render: (rowData: any) => <TextRender data={rowData.memo} />,
    },
    {
      width: "9%",
      header: (
        <FormattedMessage
          id="dateReleased"
          description="The time this auth hold was released"
          defaultMessage="Date Released"
        />
      ),
      render: (rowData: any) =>
        rowData.released ? (
          <DateAndTimeConverter epoch={rowData.releasedTime} />
        ) : (
          <span>--</span>
        ),
    },
    {
      width: "9%",
      header: (
        <FormattedMessage
          id="releasedBy"
          description="The user who authorized the release of this hold"
          defaultMessage="Released By"
        />
      ),
      render: (rowData: any) =>
        rowData.released && rowData.releasedBy ? (
          <ClickableRender onClickFunc={() => {}} id={undefined}>
            <TextRender variant="link" data={`@${rowData.releasedBy.userName}`} />
          </ClickableRender>
        ) : (
          <span>--</span>
        ),
    },
    {
      width: "9%",
      header: (
        <FormattedMessage
          id="releaseMemo"
          description="Reasoning for releasing this hold"
          defaultMessage="Release Memo"
        />
      ),
      render: (rowData: any) =>
        rowData.released ? (
          <TextRender data={rowData.releaseMemo} />
        ) : (
          <span>--</span>
        ),
    },
    {
      width: "5%",
      header: <> </>,
      render: (rowData: any) => (
        <>
          <EllipseMenu
            anchorOriginVertical="top"
            anchorOriginHorizontal="left"
            transformOriginVertical={10}
            transformOriginHorizontal={260}
          >
            <DrawerComp
              id="view-details-button"
              variant="text"
              label={intl.formatMessage(
                defineMessage({
                  id: "viewDetails",
                  defaultMessage: "View Details",
                })
              )}
            >
              <DrawerHoldDetails
                hold={rowData}
                holdId={rowData.id}
                customerNumber={customerNumber}
                showReleased={showReleased}
              />
            </DrawerComp>
            <DrawerComp
              id="release-hold-button"
              variant="text"
              label={getReleaseMessage(rowData.released)}
              disabled={rowData.released || readOnly}
            >
              <ReleaseHoldDrawer
                holdId={rowData.id}
                customerNumber={customerNumber}
                showReleased={showReleased}
              />
            </DrawerComp>
          </EllipseMenu>
        </>
      ),
    },
  ];

  const toggleShowReleased = () => {
    setShowReleased(!showReleased);
  };

  const buildHoldsDisplayList = (returnedHolds: any, showReleased: boolean) => {
    const separator = {
      id: "SEPARATOR 10",
    };
    const releasedHolds = returnedHolds.filter(
      (x: { released: any }) => x.released
    );
    const activeHolds = returnedHolds.filter(
      (x: { released: any }) => !x.released
    );

    if (!showReleased) {
      return activeHolds; // active holds only
    }
    if (activeHolds.length > 0) {
      // active and released holds if active holds are available
      return activeHolds.concat(separator).concat(releasedHolds);
    }
    return releasedHolds; // released holds only
  };

  const getCustomerHolds = (showReleased: boolean) => {
    const options = {
      count: 100,
      startIndex: 0,
      ascending: false,
    };

    // @ts-ignore
    api.CustomerAPI.listAuthorizations(customerNumber, options)
      .then((authHoldList: { results: any } | null) => {
        if (authHoldList != null) {
          const displayHolds = buildHoldsDisplayList(
            authHoldList.results,
            showReleased
          );
          setHolds(displayHolds);
        }
      })
      .catch((error: any) => error);
  };

  useEffect(() => {
    getCustomerHolds(showReleased);
  }, [showReleased]);

  useEffect(() => {
    getCustomerHolds(showReleased);

    emitter.on("customer.holds.changed", (data: any) => {
      getCustomerHolds(data.showReleased);
    });
  }, []);

  return (
    <Box>
      <Box
        sx={{ marginBottom: "18px" }}
        display="flex"
        justifyContent="space-between"
      >
        <Header
          value={intl.formatMessage(
            defineMessage({
              id: "holds",
              description: "Holds section header",
              defaultMessage: "Holds",
            })
          )}
          level={2}
          bold
          color="primary"
        />
        <Toggle
          id="toggleHold"
          checked={showReleased}
          func={() => toggleShowReleased()}
          label={getToggleMessage(showReleased)}
        />
      </Box>
      <Box>
        <StandardTable
          id="auth-hold-table"
          tableRowPrefix="hold-table"
          dataList={holds}
          tableMetadata={holdsMetadata}
        />
      </Box>
    </Box>
  );
};

export default PageNavHolds;
