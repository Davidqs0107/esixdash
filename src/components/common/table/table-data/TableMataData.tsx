/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

// @ts-nocheck
import { FormattedMessage, FormattedDate } from "react-intl";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ClickableRender from "../../ClickableRender";
import ApproveChangeOrderMemo from "../../../change-orders/drawers/ApproveChangeOrderMemo";
import ChangeOrderRequestDetailsDrawer from "../../../change-orders/drawers/ChangeOrderRequestDetailsDrawer";
import Pill from "../../elements/PillLabel";

const changeOrderTableData = [
  {
    width: "20%",
    cellPadding: "18px 15px",
    header: (
      <FormattedMessage
        id="pendingChange"
        description="name of program/product"
        defaultMessage="Pending Change"
      />
    ),
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    render: (
      rowData: any,
      icon: string | undefined,
      onClickFunc: any,
      deleteChangeOrder: any
    ) => {
      return (
        <ClickableRender
          onClickFunc={icon ? onClickFunc : null}
          id={undefined}
          data={undefined}
          role={icon === "" ? "cell" : "button"}
        >
          {icon ? (
            <img
              height={13}
              width={13}
              src={icon}
              alt="Expand/Collapse Icon"
              style={{ marginRight: "15px" }}
            />
          ) : (
            <div style={{ width: "13px", marginRight: "15px" }}>&nbsp;</div>
          )}
          {/* eslint-disable-next-line react/destructuring-assignment */}
          <Typography
            variant="link"
            sx={{
              marginRight: "10px",
              fontWeight: 600,
            }}
          >
            {`${rowData.pendingChange} - ${rowData.type}`}
          </Typography>
        </ClickableRender>
      );
    },
  },
  {
    width: "10%",
    cellPadding: "18px 15px",
    header: (
      <FormattedMessage id="changeOrder.table.for" defaultMessage="For" />
    ),
    render: (rowData) => (
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      <>{rowData.for}</>
    ),
  },
  {
    width: "20%",
    cellPadding: "18px 15px",
    header: (
      <FormattedMessage
        id="details"
        description="Type of program/product"
        defaultMessage="Details"
      />
    ),
    render: (rowData: { details: any }) => {
      const expandableData = rowData.expandableData[0];
      return (
        <Typography variant="tableData">
          {expandableData != undefined ? expandableData.details : rowData.details}
        </Typography>
      );
    },
  },
  {
    width: "15%",
    cellPadding: "18px 15px",
    header: (
      <FormattedMessage
        id="createdBy"
        description="Risk Levels of program/product"
        defaultMessage="Created By"
      />
    ),
    render: (rowData: { createdBy: any }) => (
      <Typography variant="tableData">{rowData.createdBy}</Typography>
    ),
  },
  {
    width: "10%",
    cellPadding: "18px 15px",
    header: (
      <FormattedMessage
        id="date"
        description="Fee Plans of program/product"
        defaultMessage="Date"
      />
    ),
    render: (rowData: { createdDate: string | number | Date }) => (
      <Typography variant="tableData">
        <FormattedDate
          value={new Date(rowData.createdDate)}
          year="numeric"
          month="short"
          day="2-digit"
        />
      </Typography>
    ),
  },
  {
    width: "10%",
    cellPadding: "18px 15px",
    header: (
      <FormattedMessage
        id="changeOrder.table.status"
        description="Status of program/product"
        defaultMessage="Status"
      />
    ),
    flex: "flex-0",
    render: (rowData) => (
      <>{rowData.state === "Approved" ? "Approved" : "Pending"}</>
    ),
  },
  {
    width: "5%",
    cellPadding: "15.5px 16px",
    header: <></>,
    render: (
      rowData: { state: string; id: any },
      icon: any,
      onClickFunc: any,
      deleteChangeOrder: any,
      approveChangeOrder: any,
      approveResponse: any
    ) =>
      rowData.state === "Open" ? (
        <ApproveChangeOrderMemo
          id={rowData.id}
          disabled={rowData.state !== "Open"}
          deleteChangeOrder={deleteChangeOrder}
          data={rowData}
          approveChangeOrder={approveChangeOrder}
          approveResponse={approveResponse}
          label={
            <FormattedMessage
              id="button.approve"
              description="Approve Change Order"
              defaultMessage="APPROVE"
            />
          }
          props="rowOnDisplay"
          name=""
        />
      ) : (
        <ClickableRender onClickFunc={onClickFunc}>
          <FormattedMessage
            id="approved"
            description="Approved Change Order"
            defaultMessage="Approved"
          />
        </ClickableRender>
      ),
  },
];

const changeOrderNestedTableData = [
  {
    width: "20%",
    header: (
      <FormattedMessage
        id="changeOrder.nestedTable.partner"
        description="name of partner"
        defaultMessage="Partner"
      />
    ),
    render: (rowData: { id: any }, icon: any, deleteFeePlanFunc: () => any) => (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: "28px" }}></div>
        <Typography
          variant="tableData"
          sx={{
            marginRight: "10px",
          }}
        >
          <ChangeOrderRequestDetailsDrawer
            id={rowData.id}
            data={rowData}
            deletePlan={deleteFeePlanFunc()}
            props=""
          />
        </Typography>
        <Pill
          label={
            <FormattedMessage
              id="changeRequest"
              defaultMessage="Change Request"
            />
          }
          color="secondary"
        />
        {/*: <Pill label="product" className="wrinkly" /> */}
      </Box>
    ),
  },
  {
    width: "10%",
    cellPadding: "18px 15px",
    header: (
      <FormattedMessage id="changeOrder.table.for" defaultMessage="For" />
    ),
    render: () => null,
  },
  {
    width: "20%",
    header: (
      <FormattedMessage
        id="memo"
        description="Change Order Memo"
        defaultMessage="Memo"
      />
    ),
    render: (rowData: { memo: any }) => (
      <Box sx={{ marginLeft: "-2px" }}>
        <Typography variant="tableData">{rowData.memo}</Typography>
      </Box>
    ),
  },
  {
    width: "15%",
    header: (
      <FormattedMessage
        id="changeOrder.table.createdBy"
        description="Risk Levels of program/product"
        defaultMessage="Created By"
      />
    ),
    render: (rowData: { customerNumber: any }) => {
      return (
        <Box sx={{ marginLeft: "-3px" }}>
          <Typography variant="tableData">{rowData.customerNumber}</Typography>
        </Box>
      );
    },
  },
  {
    width: "10%",
    header: (
      <FormattedMessage
        id="changeOrder.nestedTable.date"
        description="Date Created"
        defaultMessage="Created"
      />
    ),
    render: (rowData) => (
      <Typography variant="tableData" sx={{ marginLeft: "-4px" }}>
        <FormattedDate
          value={new Date(rowData.createdDate)}
          year="numeric"
          month="short"
          day="2-digit"
        />
      </Typography>
    ),
  },
  {
    width: "10%",
    header: (
      <FormattedMessage
        id="changeOrder.nestedTable.status"
        description="Status of Change Request"
        defaultMessage="Status"
      />
    ),
    render: (rowData, icon, deleteFeePlanFunc, intl) => <>{rowData.state}</>,
  },
  {
    width: "5%",
    header: <> </>,
    render: () => <div style={{ width: "66px" }}></div>,
  },
];

export { changeOrderTableData, changeOrderNestedTableData };
