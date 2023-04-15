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
 *
 */

import React, { lazy } from "react";
import Grid from "@mui/material/Grid";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import Header from "../../common/elements/Header";
import StandardTable from "../../common/table/StandardTable";
import TextRender from "../../common/TextRender";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

interface IDrawerBlockedCard {
  cardBlock: any;
  releaseCBFunc: any;
}

const DrawerBlockedCard: React.FC<IDrawerBlockedCard> = ({
  cardBlock,
  releaseCBFunc,
}) => {
  const intl = useIntl();

  const releaseBlock = (releaseBlockData: any) => {
    releaseCBFunc(releaseBlockData);
  };

  const CardBlocksMetaData = [
    {
      header: (
        <FormattedMessage
          id="drawer.blocks.card.table.header.reason"
          description="table header"
          defaultMessage="Reason"
        />
      ),
      render: (rowData: any) => {
        const { reason } = rowData;
        // const { transactionSourceCode, transactionTypeCode } = rowData;
        return <TextRender data={reason} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="drawer.blocks.card.table.header.memo"
          description="table header"
          defaultMessage="Memo"
        />
      ),
      render: (rowData: any) => {
        const { memo } = rowData;
        return <TextRender data={memo} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="drawer.blocks.card.table.header.created"
          description="table header"
          defaultMessage="created"
        />
      ),
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return (
          <FormattedDate
            value={new Date(creationTime)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="drawer.blocks.card.table.header.createdBy"
          description="table header"
          defaultMessage="Created By:"
        />
      ),
      render: (rowData: any) => {
        const { blockedBy } = rowData;
        return <span>{blockedBy.userName}</span>;
      },
    },
    {
      header: (
        <FormattedMessage
          id="drawer.blocks.card.table.header.release"
          description=""
          defaultMessage="Release"
        />
      ),
      width: "125px",
      render: (rowData: any) => {
        const { currency, transactionTypeCode, transactionSourceCode } =
          rowData;
        return (
          <QDButton
            id="drawer.blocks.card.button.release-"
            label={intl.formatMessage({
              id: "drawer.blocks.button.release",
              defaultMessage: "Release",
            })}
            className="float-left"
            onClick={() => releaseBlock(rowData)}
            color="primary"
            variant="contained"
            size="small"
          />
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="drawer.blocks.card.table.header.customerReleasable"
          description=""
          defaultMessage="Customer Releasable"
        />
      ),
      width: "105px",
      render: (rowData: any) => {
        const { customerReleaseable } = rowData;
        return <TextRender data={customerReleaseable} />;
      },
    },
  ];

  return (
    <Grid container className="mr-4 ml-4" style={{ maxWidth: "900px" }}>
      <Grid item xs={12}>
        <Header level={2} color="white" value="Block Card Detail" />
      </Grid>
      <Grid item xs={12} className="mt-4">
        <StandardTable
          id={`card.blocks.table${Math.random}`}
          tableRowPrefix="card-blocks-details-table"
          dataList={cardBlock.blockedList}
          tableMetadata={CardBlocksMetaData}
          customFooter="no-box-shadow"
        />
      </Grid>
    </Grid>
  );
};

export default DrawerBlockedCard;
