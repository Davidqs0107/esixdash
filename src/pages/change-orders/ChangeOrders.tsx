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

// eslint-disable-next-line no-use-before-define
// @ts-nocheck
import React, { lazy, useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import api from "../../api/api";
import ChangeOrderDetails from "../../components/change-orders/order-details/DetailsCreator";
import ToastModal from "../../components/common/containers/ToastModal";
import emitter from "../../emitter";
import { MessageContext } from "../../contexts/MessageContext";
import BrandingWrapper from "../../app/BrandingWrapper";
import Header from "../../components/common/elements/Header";
import BreadcrumbsNav from "../../components/common/navigation/BreadcrumbsNav";
import Typography from "@mui/material/Typography";
import { ContentVisibilityContext } from "../../contexts/ContentVisibilityContext";

const Toggle = lazy(
  () => import("../../components/common/forms/checkboxes/Toggle")
);
const NestedExpandableTable = lazy(
  () =>
    // eslint-disable-next-line import/no-cycle
    import("../../components/common/table/NestedExpandableTable")
);

export const ChangeOrderEvents = {
  DeleteFeePlanRequested: "delete.feePlan.changed",
};

// 2 levels
// ChangeOrder
//   - Change Request
//   - Change Request

// PaginationDTO {state, count, startIndex, ascending}
// Partner Change Orders [10]
// Customer Orders [11] ([10], [1])
// OperatingChangeOrderAPI 29 ([10], [10], [1])

// CustomerChangeOrderAPI

const ChangeOrders = () => {
  const { setErrorMsg, setWarningMsg, setSuccessMsg, setInfoMsg } =
    useContext(MessageContext);
  const {
    canSeeCustomerChangeOrders,
    canSeeProgramChangeOrders,
    canSeePartnerChangeOrders,
  } = useContext(ContentVisibilityContext);
  const [changeOrderList, setChangeOrderList] = useState([]);
  const [changeRequestDataState, setChangeRequestData] = useState([]);
  const [rowOnDisplay, setRowOnDisplay] = useState([]);
  // const [changeOrderPageSize, setChangeOrderPageSize] = useState(100);
  const [changeOrderDto, setUserSearchDto] = useState({
    state: null,
    count: 100,
    startIndex: 0,
    ascending: false,
  });

  const [approvedChangeOrderDto, setapprovedChangeOrderDto] = useState({
    state: "Approved",
    count: 100,
    startIndex: 0,
    ascending: false,
  });
  const [isChecked, setIsChecked] = useState(false);
  const [changeOrders, setChangeOrders] = useState([]);
  let changeRequestData = [];
  const [refresh, setRefresh] = useState(false);
  const [approved, setApproved] = useState([]);
  const [approveReqResp, setApproveReqResp] = useState({
    status: "Initial" || {},
  });
  const [thisIs, setThisIs] = useState(false);

  // Customer
  const getCustomerChangeOrders = async (id, paginationDTO) =>
    api.CustomerChangeOrderAPI.getChangeOrders(id, paginationDTO).catch(
      (error) => setErrorMsg(error)
    );

  const getCustomerChangeRequests = async (changeOrderNumber, changeOrderId) =>
    api.CustomerChangeOrderAPI.getChangeRequests(
      changeOrderNumber,
      changeOrderId
    ).catch((error) => setErrorMsg(error));

  const approveCustomerChangeOrder = async (
    customerIdentifier,
    changeOrderId,
    dto
  ) =>
    api.CustomerChangeOrderAPI.approveChangeOrder(
      customerIdentifier,
      changeOrderId,
      dto
    ).catch((error) => setErrorMsg(error));
  const discardCustomerChangeOrder = async (
    customerIdentifier,
    changeOrderId,
    memo
  ) =>
    api.CustomerChangeOrderAPI.discardChangeOrder(
      customerIdentifier,
      changeOrderId,
      memo
    ).catch((error) => setErrorMsg(error));
  const discardCustomerAdjReq = async (
    customerIdentifier,
    changeOrderId,
    changeRequestId,
    memo
  ) =>
    api.CustomerChangeOrderAPI.discardAdjustmentRequest(
      customerIdentifier,
      changeOrderId,
      changeRequestId,
      memo
    ).catch((error) => setErrorMsg(error));

  // Partner
  const getPartnerChangeOrders = async (paginationDTO) =>
    api.PartnerChangeOrderAPI.getChangeOrders(paginationDTO).catch((error) =>
      setErrorMsg(error)
    );
  const getPartnersChangeRequest = async (orderId) =>
    api.PartnerChangeOrderAPI.getChangeRequests(orderId).catch((error) =>
      setErrorMsg(error)
    );
  const approvePartnersChangeOrder = async (programName, changeOrderId, dto) =>
    api.OperatingChangeOrderAPI.approveChangeOrder(
      programName,
      changeOrderId,
      dto
    ).catch((error) => setErrorMsg(error));
  const discardPartnerChangeOrder = async (changeOrderId, memo) =>
    api.PartnerChangeOrderAPI.discardChangeOrder(changeOrderId, memo).catch(
      (error) => setErrorMsg(error)
    );
  const discardPartnerFeeEntry = async (changeOrderId, requestId, memo) =>
    api.PartnerChangeOrderAPI.discardFeeEntry(
      changeOrderId,
      requestId,
      memo
    ).catch((error) => setErrorMsg(error));

  // Program
  const getOperatingChangeOrder = async (programName, paginationDTO) =>
    api.OperatingChangeOrderAPI.getChangeOrders(
      programName,
      paginationDTO
    ).catch((error) => setErrorMsg(error));
  const getOperatingChangeRequests = async (programName, changeOrderId) =>
    api.OperatingChangeOrderAPI.getChangeRequests(
      programName,
      changeOrderId
    ).catch((error) => setErrorMsg(error));
  const approveOperatingChangeOrder = async (programName, changeOrderId, dto) =>
    api.OperatingChangeOrderAPI.approveChangeOrder(
      programName,
      changeOrderId,
      dto
    ).catch((error) => setErrorMsg(error));
  const discardOperatingChangeOrder = async (
    programName,
    changeOrderId,
    memo
  ) =>
    api.OperatingChangeOrderAPI.discardChangeOrder(
      programName,
      changeOrderId,
      memo
    ).catch((error) => setErrorMsg(error));
  const discardOperatingFeePlanRequest = async (
    programName,
    changeOrderId,
    requestId,
    memo
  ) =>
    api.OperatingChangeOrderAPI.discardFeePlanRequest(
      programName,
      changeOrderId,
      requestId,
      memo
    )
      .then(() => {
        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "changeRequest.success.deleted",
            defaultMessage: `Change request deleted`,
          }),
        });
      })
      .catch((error) => setErrorMsg(error));

  // eslint-disable-next-line no-shadow
  const nestedRowStatus = (nestedRowStatus, id, pendingChange) => {
    ChangeOrderDetails(
      "changeOrder",
      "type",
      "origin",
      "partnerName",
      nestedRowStatus
    );
    const rowData = changeRequestDataState.filter(
      (request) =>
        request.origin === pendingChange && request.changeOrderId === id
    );

    const clean = rowData.filter(
      (arr, index, self) => index === self.findIndex((t) => t.id === arr.id)
    );

    setRowOnDisplay([clean]);
  };

  const approveChangeOrder = async (approveOrderNotes, order) => {
    setApproveReqResp({ status: "Initial" });
    const approvedOrder = changeOrderList
      .filter(
        (change) => change.id === order.id && change.banks === order.banks
      )
      // eslint-disable-next-line no-shadow
      .map((order) => ({ ...order, state: "Approved" }));
    const filteredOrder = changeOrderList.filter(
      // eslint-disable-next-line no-shadow
      (order) => order.id !== approvedOrder[0].id
    );
    if (order.pendingChange === "Customer") {
      const approvedReq = await approveCustomerChangeOrder(
        order.customerNumber,
        order.id,
        approveOrderNotes
      );
      if (approvedReq.state === "Approved") {
        // eslint-disable-next-line no-shadow
        const changeOrders = [...filteredOrder, ...approvedOrder];
        setApproveReqResp({ status: "Approved" });
        setChangeOrderList(changeOrders);
      } else {
        setApproveReqResp({ status: "Error", ...approvedReq });
      }
    } else if (order.pendingChange === "Partner") {
      const approvedDto = { ...changeOrderDto, ...approveOrderNotes };
      const approvedReq = await approvePartnersChangeOrder(
        order.programName,
        order.id,
        approvedDto
      );

      if (approvedReq.state === "Approved") {
        // eslint-disable-next-line no-shadow
        const changeOrders = [...filteredOrder, ...approvedOrder];
        setApproveReqResp({ status: "Approved" });
        setChangeOrderList(changeOrders);
      } else {
        setApproveReqResp({ status: "Error", ...approvedReq });
      }
    } else {
      const approvedDto = { ...changeOrderDto, ...approveOrderNotes };
      const approvedReq = await approveOperatingChangeOrder(
        order.programName,
        order.id,
        approvedDto
      );
      if (approvedReq.state === "Approved") {
        // eslint-disable-next-line no-shadow
        const changeOrders = [...filteredOrder, ...approvedOrder];
        setApproveReqResp({ status: "Approved" });
        setChangeOrderList(changeOrders);
      } else {
        setApproveReqResp({ status: "Error", ...approvedReq });
      }
    }

    await getAllChangeOrders();
  };

  const deleteFeePlan = async (order) => {
    const {
      changeOrderId,
      changeRequestId,
      customerNumber,
      partner,
      programName,
    } = order;

    // eslint-disable-next-line no-nested-ternary,no-unused-expressions
    order.origin === "Customer"
      ? await discardCustomerAdjReq(
          customerNumber,
          changeOrderId,
          changeRequestId
        ).catch((error) => setErrorMsg(error))
      : order.origin === "Partner"
      ? await discardPartnerFeeEntry(changeOrderId, changeRequestId).catch(
          (error) => setErrorMsg(error)
        )
      : await discardOperatingFeePlanRequest(
          programName ? programName : partner,
          changeOrderId,
          changeRequestId
        ).catch((error) => setErrorMsg(error));
    setRefresh(!refresh);
  };

  const deleteChangeOrder = async (data) => {
    if (data.pendingChange === "Customer") {
      await discardCustomerChangeOrder(data.customerNumber, data.id).catch(
        (error) => setErrorMsg(error)
      );
      setChangeOrderList(
        changeOrderList.filter((changeOrder) => changeOrder.id !== data.id)
      );
    } else if (data.pendingChange === "Partner") {
      await discardPartnerChangeOrder(data.id).catch((error) =>
        setErrorMsg(error)
      );
      setChangeOrderList(
        changeOrderList.filter((changeOrder) => changeOrder.id !== data.id)
      );
    } else {
      await discardOperatingChangeOrder(data.programName, data.id).then(
        (response) =>
          !response
            ? null
            : setChangeOrderList(
                changeOrderList.filter(
                  (changeOrder) => changeOrder.id !== data.id
                )
              )
      );
    }

    await getAllChangeOrders();
  };

  const getAllChangeOrders = async () => {
    let customerChangeOrderData = [];
    let partnerChangeOrderData = [];
    let programChangeOrderData = [];

    if (canSeeCustomerChangeOrders) {
      const customerChangeOrdResp = await getCustomerChangeOrders(
        "",
        changeOrderDto
      ).catch((error) => setErrorMsg(error));
      customerChangeOrderData = customerChangeOrdResp.data.map((data) => ({
        ...data,
        origin: "Customer",
      }));
    }

    if (canSeePartnerChangeOrders) {
      const partnerChangeOrdResp = await getPartnerChangeOrders(
        changeOrderDto
      ).catch((error) => error);
      partnerChangeOrderData = partnerChangeOrdResp.data.map((data) => ({
        ...data,
        origin: "Partner",
      }));
    }

    if (canSeeProgramChangeOrders) {
      const programChangeOrdResp = await getOperatingChangeOrder(
        "",
        changeOrderDto
      ).catch((error) => setErrorMsg(error));
      programChangeOrderData = programChangeOrdResp.data.map((data) => ({
        ...data,
        origin: "Program",
      }));
    }

    setChangeOrders([
      {
        customerChangeOrderData: customerChangeOrderData,
        partnerChangeOrderData: partnerChangeOrderData,
        programChangeOrderData: programChangeOrderData,
      },
    ]);
  };

  const getAllApprovedChangeOrders = async () => {
    if (isChecked && !thisIs) {
      setThisIs(true);
      let customerApprovedChangeOrderData = [];
      let partnerApprovedChangeOrderData = [];
      let programApprovedChangeOrderData = [];

      if (canSeeCustomerChangeOrders) {
        const customerChangeOrdResp = await getCustomerChangeOrders(
          "",
          approvedChangeOrderDto
        ).catch((error) => error);
        customerApprovedChangeOrderData = customerChangeOrdResp.data.map(
          (data) => ({
            ...data,
            origin: "Customer",
          })
        );
      }

      if (canSeePartnerChangeOrders) {
        const partnerChangeOrdResp = await getPartnerChangeOrders(
          approvedChangeOrderDto
        ).catch((error) => error);
        partnerApprovedChangeOrderData = partnerChangeOrdResp.data.map(
          (data) => ({
            ...data,
            origin: "Partner",
          })
        );
      }

      if (canSeeProgramChangeOrders) {
        const programChangeOrdResp = await getOperatingChangeOrder(
          "",
          approvedChangeOrderDto
        ).catch((error) => error);
        programApprovedChangeOrderData = programChangeOrdResp.data.map(
          (data) => ({
            ...data,
            origin: "Program",
          })
        );
      }

      const {
        customerChangeOrderData,
        partnerChangeOrderData,
        programChangeOrderData,
      } = changeOrders[0];

      setChangeOrders([
        {
          customerChangeOrderData: [
            ...customerChangeOrderData,
            ...customerApprovedChangeOrderData,
          ],

          partnerChangeOrderData: [
            ...partnerChangeOrderData,
            ...partnerApprovedChangeOrderData,
          ],
          programChangeOrderData: [
            ...programChangeOrderData,
            ...programApprovedChangeOrderData,
          ],
        },
      ]);
    }
  };

  const runChangeOrderTableCreation = async () => {
    const nestedDataObj = [];

    const [
      {
        customerChangeOrderData,
        partnerChangeOrderData,
        programChangeOrderData,
      },
    ] = changeOrders;

    // Create Lower Level Values
    const setChangeRequestRowData = async (
      changeOrder,
      partnerName,
      origin,
      type,
      customerNumber,
      programName,
      topLevelMemo
    ) => {
      changeRequestData = ChangeOrderDetails(
        changeOrder,
        type,
        origin,
        partnerName,
        false,
        customerNumber,
        programName,
        topLevelMemo
      );

      setChangeRequestData([...changeRequestData]);
    };

    // Set the Top level call after the Promise.All has finished
    const setTopLevelValues = (orderData, origin) => {
      // eslint-disable-next-line array-callback-return
      orderData.map((order) => {
        nestedDataObj.push({
          id: order.id,
          pendingChange: origin,
          for:
            origin === "Customer"
              ? order.customerNumber
              : origin === "Partner"
              ? order.partnerName
              : origin === "Program"
              ? order.programName
              : "",
          details: order.memo,
          banks: order.partnerName,
          createdBy: order.requestedBy,
          createdDate: order.creationTime,
          partners: order.partnerName,
          programName: order.programName,
          primaryContact: "NA",
          state: order.state,
          customerNumber: order.customerNumber,
          expandableData: changeRequestData.filter(
            (request) =>
              request.origin === order.origin &&
              request.changeOrderId === order.id
          ),
          type: order.type,
        });
      });
      setChangeOrderList([...nestedDataObj]);
    };
    // Get All Change Request
    const getCustomerChangeRequest = async (
      changeOrderNumber,
      changeOrderId,
      partnerName,
      origin,
      type,
      customerNumber,
      topLevelMemo
    ) => {
      const changeRequest = await getCustomerChangeRequests(
        changeOrderNumber,
        changeOrderId
      );

      changeRequest.map((changeOrder) =>
        setChangeRequestRowData(
          [changeOrder],
          partnerName,
          origin,
          type,
          customerNumber,
          "",
          topLevelMemo
        )
      );
    };

    const getPartnerChangeRequest = async (
      orderId,
      partnerName,
      origin,
      type,
      topLevelMemo
    ) => {
      const changeRequest = await getPartnersChangeRequest(orderId);
      await changeRequest.map((changeOrder) =>
        setChangeRequestRowData(
          [changeOrder],
          partnerName,
          origin,
          type,
          partnerName,
          "",
          topLevelMemo
        )
      );
    };

    const getOperatingChangeRequest = async (
      programName,
      changeOrderId,
      origin,
      type,
      partnerName,
      topLevelMemo
    ) => {
      const changeRequest = await getOperatingChangeRequests(
        programName,
        changeOrderId
      );
      await changeRequest.map((changeOrder) =>
        setChangeRequestRowData(
          [changeOrder],
          partnerName,
          origin,
          type,
          "",
          programName,
          topLevelMemo
        )
      );
    };

    // Call is made to get the order Data relies Top Level Call to grab cust number partnerName etc.

    await Promise.all(
      customerChangeOrderData.map((changeOrder) =>
        getCustomerChangeRequest(
          changeOrder.customerNumber,
          changeOrder.id,
          changeOrder.partnerName,
          "Customer",
          changeOrder.type,
          changeOrder.customerNumber,
          changeOrder.memo
        )
      )
    );
    await Promise.all(
      partnerChangeOrderData.map((changeOrder) =>
        getPartnerChangeRequest(
          changeOrder.id,
          changeOrder.partnerName,
          "Partner",
          changeOrder.type,
          changeOrder.memo
        )
      )
    );
    await Promise.all(
      programChangeOrderData.map((changeOrder) =>
        getOperatingChangeRequest(
          changeOrder.programName,
          changeOrder.id,
          "Program",
          changeOrder.type,
          changeOrder.partnerName,
          changeOrder.memo
        )
      )
    );
    setTopLevelValues(customerChangeOrderData, "Customer");
    setTopLevelValues(partnerChangeOrderData, "Partner");
    setTopLevelValues(programChangeOrderData, "Program");
  };

  useEffect(async () => {
    getAllChangeOrders().catch((error) => error);
  }, [
    canSeeCustomerChangeOrders,
    canSeePartnerChangeOrders,
    canSeeProgramChangeOrders,
  ]);
  useEffect(() => {
    runChangeOrderTableCreation().catch((error) => error);
  }, [changeOrders]);
  useEffect(() => {
    runChangeOrderTableCreation().catch((error) => error);
  }, [refresh]);

  useEffect(() => {
    getAllApprovedChangeOrders().catch((error) => error);
  }, [
    isChecked,
    canSeeCustomerChangeOrders,
    canSeePartnerChangeOrders,
    canSeeProgramChangeOrders,
  ]);

  useEffect(() => {
    emitter.on(ChangeOrderEvents.DeleteFeePlanRequested, (deleteOrder) =>
      deleteFeePlan(deleteOrder)
    );
  }, []);

  const clean = changeRequestDataState.filter(
    (arr, index, self) => index === self.findIndex((t) => t.id === arr.id)
  );

  const intl = useIntl();

  const breadcrumbs = [
    {
      name: intl.formatMessage({
        id: "changeRequests",
        defaultMessage: "Change Requests",
      }),
      path: "/change",
    },
  ];

  return (
    <>
      {approveReqResp.status === "Error" ? (
        // eslint-disable-next-line max-len
        <ToastModal
          icon="icons-error@2x.png"
          headline={approveReqResp.status}
          body={approveReqResp.message}
        />
      ) : null}
      <div>
        <Helmet>
          <title>
            {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
              id: "changeOrders",
              defaultMessage: "Change Orders",
            })}`}
          </title>
        </Helmet>
        <Box>
          <Grid
            container
            sx={{
              justifyContent: "space-between",
              mb: "18px",
            }}
          >
            <Grid item>
              <Header
                value={intl.formatMessage({
                  id: "changeOrders",
                  defaultMessage: "Change Orders",
                })}
                level={1}
                bold
              />
            </Grid>
            <Grid item>
              <Box>
                <Toggle
                  id="wallet-quick-spend-toggle"
                  checked={isChecked}
                  func={() => setIsChecked(!isChecked)}
                  label={intl.formatMessage({
                    id: "showApprovedChangeOrders",
                    defaultMessage: "Show Approved Change Orders",
                  })}
                />
              </Box>
            </Grid>
          </Grid>
          <Box style={{ marginTop: "7px" }}>
            <NestedExpandableTable
              key={changeOrderList.id}
              dataList={changeOrderList}
              showApproved={isChecked}
              nestedRowStatus={nestedRowStatus}
              deleteFeePlan={deleteFeePlan}
              nestedRowData={clean}
              rowOnDisplay={rowOnDisplay}
              deleteChangeOrder={deleteChangeOrder}
              approveChangeOrder={approveChangeOrder}
              approveResponse={approveReqResp}
              tableRowPrefix="change-orders"
            />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default ChangeOrders;
