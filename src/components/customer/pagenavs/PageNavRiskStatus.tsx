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

import React, { useState, useEffect, lazy, useContext } from "react";
import Box from "@mui/material/Box";
import {
  defineMessage,
  FormattedMessage,
  FormattedNumber,
  useIntl,
} from "react-intl";
import Typography from "@mui/material/Typography";
import api from "../../../api/api";
import StandardTable from "../../common/table/StandardTable";
import TextRender from "../../common/TextRender";
import Toggle from "../../common/forms/checkboxes/Toggle";
import ClickableRender from "../../common/ClickableRender";
import DrawerComp from "../../common/DrawerComp";
import AddNewBlock from "../drawers/AddNewBlock";
import emitter from "../../../emitter";
import CurrencyRender from "../../common/converters/CurrencyRender";
import CreateChangeOrderChargeoff from "../drawers/CreateChangeOrderChargeoffDrawer";
import DateAndTimeConverter from "../../common/converters/DateAndTimeConverter";
import TxSourceConverter from "../../common/converters/TxSourceConverter";
import TxTypeConverter from "../../common/converters/TxTypeConverter";
import RiskStatusEvents from "./RiskStatusEvents";
import ReleaseBlockDrawer from "../drawers/ReleaseBlockDrawer";
import AddChargeoff from "../drawers/AddChargeoffDrawer";
import CustomerBlockReasonConverter from "../../common/converters/CustomerBlockReasonConverter";
import CardBlockReasonConverter from "../../common/converters/CardBlockReasonConverter";
import BlockTypeConverter from "../../common/converters/BlockTypeConverter";
import QDFormattedCurrency from "../../common/converters/QDFormattedCurrency";
import { MessageContext } from "../../../contexts/MessageContext";
import ReadableErrorMessage from "../../common/converters/ReadableErrorMessage";
import Header from "../../common/elements/Header";
import {
  FormatTxSource,
  FormatTxType,
} from "../../common/converters/FormatTxSource";
import DrawerAddFee from "../drawers/DrawerAddFee";
import CheckmarkConverter from "../../common/converters/CheckmarkConverter";
import CreateChangeOrder from "../drawers/CreateChangeOrderDrawer";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";
import { OfferingCustomerSummary } from "../../../types/customer";
import AddAdjustment from "../drawers/AddAdjustment";
import ProgramDetailContextProvider from "../../../contexts/ProgramDetailContext";
import CustomerRiskLevelDrawer from "../drawers/CustomerRiskLevelDrawer";
import ProgramRiskParamsLevelTwo from "../../programs/drawers/level-two/ProgramRiskParamsLevelTwo";
import { CustomerDetailContext } from "../../../contexts/CustomerDetailContext";
import CustomerRiskLevelDrawerContextProvider from "../../../contexts/CustomerRiskLevelDrawerContext";
import Label from "../../common/elements/Label";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

let showActiveBlocksOnly = true;
let showSingleUse = false;

interface IPageNavRiskStatus {
  customerNumber: string;
  primaryPersonId: string;
  portfolioId: string;
  programName: string;
}

const PageNavRiskStatus: React.FC<IPageNavRiskStatus> = (props) => {
  const { readOnly } = useContext(ContentVisibilityContext);
  const { securityLevel } = useContext(CustomerDetailContext);
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);

  const intl = useIntl();
  const searchPageSize = 5;
  const [adjustments, setAdjustments] = useState([]);
  const [chargeoffs, setChargeoffs] = useState([]);
  const [declinedTxs, setDeclinedTxs] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [fees, setFees] = useState([]);
  const [riskRules, setRiskRules] = useState([]);
  const [releasedToggled, setReleasedToggled] = useState(false);
  const [singleUseToggled, setSingleUseToggled] = useState(false);
  const [adjustmentCardObjects, setAdjustmentCardObjects]: any = useState([]);
  const [blocksSearchDto, setBlocksSearchDto] = useState({
    startIndex: 0,
    count: searchPageSize,
    ascending: false,
    activeOnly: true,
    singleUse: false,
  });
  const { customerNumber, primaryPersonId, portfolioId } = props;
  const [adjustmentSearchDto, setAdjustmentSearchDto] = useState({
    transactionType: "14",
    startIndex: 0,
    count: searchPageSize,
  });
  const [chargeoffSearchDto, setChargeoffSearchDto] = useState({
    transactionType: "14",
    startIndex: 0,
    count: searchPageSize,
  });
  const initialState = {
    /* size of pagination link at the top of the table */
    paginationSize: 5,
    currentPage: 0,
    /* startIndex and endIndex are used to determine the
    first and last entry numbers of the pagination display */
    startIndex: 0,
    endIndex: 5,
    /* rangeStart and range End are used in "Showing 1-10 of 100" */
    rangeStart: 1,
    rangeEnd: searchPageSize,

    /* how many rows in each page */
    pageSize: searchPageSize,
    /* total number of pages */
    pagesCount: 0,
    /* total number of rows */
    totalCount: 0,
  };
  const [offsetPaginationElements, setOffsetPaginationElements] =
    useState(initialState);
  const [adjustmentPaginationElements, setAdjustmentPaginationElements] =
    useState(initialState);
  const [chargeoffPaginationElements, setChargeoffPaginationElements] =
    useState(initialState);
  const [cursor, setCursor] = useState({ portfolioId });
  const [nextCursor, setNextCursor] = useState({});
  const [adjustmentCardUpdated, setAdjustmentCardUpdated] = useState(false);
  const [isCreditCardCustomer, setIsCreditCardCustomer] = useState(false);
  const getDeclinedTransactions = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.TransactionAPI.listDeclinedTransactions(cursor)
      .then((txList: any) => {
        const { results } = txList;
        setDeclinedTxs(results);
        setNextCursor(txList.nextCursor);
      })
      .catch((error: any) => setErrorMsg(error)); // TODO Handle error case;
  };

  const [
    adjustmentChangeRequestsMasterList,
    setAdjustmentChangeRequestsMasterList,
  ]: any = useState([]);

  // reset

  const resetOffsetPaginationElements = () => {
    setOffsetPaginationElements(initialState);
    return initialState;
  };

  const resetBlockSearchDto = () => {
    const newDto = { ...blocksSearchDto };
    newDto.activeOnly = showActiveBlocksOnly;
    newDto.startIndex = 0;
    newDto.singleUse = showSingleUse;
    setBlocksSearchDto(newDto);
    return newDto;
  };

  const buildBlocksDisplayList = (
    actives: any,
    releaseds: any,
    activeOnly: boolean
  ) => {
    const separator = {
      id: "SEPARATOR 10",
    };
    let finalList;
    if (activeOnly) {
      finalList = actives;
    } else if (actives.length > 0) {
      finalList = actives.concat(separator).concat(releaseds);
    } else {
      finalList = releaseds;
    }
    return finalList;
  };

  const buildAdjustmentsDisplayList = (actives: any) => {
    const separator = {
      id: "SEPARATOR 10",
    };
    return actives.concat(separator);
  };

  const toggleShowReleased = (value: any) => {
    showActiveBlocksOnly = !value;
    resetBlockSearchDto();
    setReleasedToggled(!releasedToggled);
    //emitter.emit("customer.block.changed", {});
  };

  const toggleShowSingleUse = (value: any) => {
    showSingleUse = !value;
    resetBlockSearchDto();
    setSingleUseToggled(!singleUseToggled);
    //emitter.emit("customer.block.changed", {});
  };

  const createCurrentAdjPageObject = (updatedAdjutmentData: any) => {
    let i: number;
    let adjustment: any;
    let individualAdjPageObj;
    const adjPageObjList = [];
    const chunk = 5;
    for (
      i = 0, adjustment = updatedAdjutmentData.length;
      i < adjustment;
      i += chunk
    ) {
      individualAdjPageObj = {
        data: updatedAdjutmentData.slice(i, i + chunk),
        i,
      };
      adjPageObjList.push(individualAdjPageObj);
      setAdjustmentCardObjects(adjPageObjList);

      const currObj = adjPageObjList.filter(
        (t: { i: number }) =>
          t.i === adjustmentPaginationElements.currentPage * 5
      );
      // // @ts-ignore
      if (currObj.length === 0) {
        setAdjustments(
          buildAdjustmentsDisplayList(adjustmentCardObjects[0].data)
        );
      } else {
        setAdjustments(
          buildAdjustmentsDisplayList(currObj[0] ? currObj[0].data : currObj)
        );
      }
    }

    if (updatedAdjutmentData.length === 0) {
      setAdjustments(buildAdjustmentsDisplayList([]));
    }
  };

  const getAdjustmentTransactions = async () => {
    const adjustDTO = {
      state: "Open",
      count: 5,
      startIndex: 0,
      ascending: true,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const changeOrders = await api.CustomerChangeOrderAPI.getChangeOrders(
      customerNumber,
      adjustDTO
    );
    const promises: any = [];
    changeOrders.data.forEach((changeOrder: any) =>
      promises.push(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        api.CustomerChangeOrderAPI.getChangeRequests(
          customerNumber,
          changeOrder.id
        )
      )
    );
    const adjustmentChangeRequests: any = [];
    const chargeoffChangeRequests: any = [];

    Promise.all(promises).then((results: any) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const result of results) {
        // Each result is an array that contains the underlying change requests as an array
        // eslint-disable-next-line no-restricted-syntax
        for (const responseChangeRequests of result) {
          if (responseChangeRequests.type === "adjust") {
            adjustmentChangeRequests.push(responseChangeRequests);
            setAdjustmentChangeRequestsMasterList(adjustmentChangeRequests);
            const pagesCount = Math.ceil(
              adjustmentChangeRequests.length / searchPageSize
            );
            setAdjustmentPaginationElements({
              paginationSize: 5,
              currentPage: 0,
              startIndex: 0,
              endIndex: 5,
              rangeStart: 1,
              rangeEnd: searchPageSize,
              pageSize: searchPageSize,
              pagesCount,
              totalCount: adjustmentChangeRequests.length,
            });
            createCurrentAdjPageObject(adjustmentChangeRequests);
          } else {
            chargeoffChangeRequests.push(responseChangeRequests);
          }
        }
      }
      setChargeoffs(chargeoffChangeRequests);
    });
  };

  const formatData = (
    result: any,
    altId: string,
    formattedType: string,
    type: string
  ) => ({
    id: result.id,
    creationTime: result.creationTime,
    modifiedTime: result.modifiedTime,
    altId,
    reason: result.reason,
    memo: result.memo,
    releaseTime: result.releaseTime,
    status: result.releaseTime !== 0 ? "Released" : "Active",
    blockedBy:
      result.blockedBy !== undefined ? `@${result.blockedBy.userName}` : "",
    releasedBy:
      result.releasedBy !== undefined ? `@${result.releasedBy.userName}` : "",
    type,
    formattedType,
    releaseMemo: result.releaseMemo,
  });

  const getPaginatedBlocks = (customerIdentifier: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.getAllCardCustomerBlocksPaginated(
      customerIdentifier,
      blocksSearchDto
    ).catch((error: any) => setErrorMsg(error));

  const getCardList = (customerIdentifier: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.getCards(customerIdentifier).catch((error: any) =>
      setErrorMsg(error)
    );

  const getAllBlocks = (
    customerIdentifier: string,
    personIdentifier: string
  ) => {
    Promise.all([
      getCardList(customerIdentifier),
      getPaginatedBlocks(customerIdentifier),
    ]).then((results) => {
      const last4Map = new Map();
      results[0].map((card: any) => last4Map.set(card.id, card.panLast4));

      const resultList: any = [];
      const paginated = results[1];

      const { data, totalCount } = paginated;
      // eslint-disable-next-line array-callback-return
      data.map((block: any) => {
        resultList.push(
          formatData(
            block,
            block.type === "card" ? block.cardId : customerIdentifier,
            block.type === "card"
              ? `${BlockTypeConverter("Card", intl)} (*${last4Map.get(
                  block.cardId
                )})`
              : BlockTypeConverter("Customer", intl),
            block.type
          )
        );
      });

      const activeList: any = [];
      const releasedList: any = [];

      // sets

      setOffsetPaginationElements({
        ...offsetPaginationElements,
        totalCount,
        pagesCount: Math.ceil(totalCount / searchPageSize),
      });

      resultList.forEach((result: any) =>
        result.releaseTime === 0
          ? activeList.push(result)
          : releasedList.push(result)
      );

      setBlocks(
        buildBlocksDisplayList(activeList, releasedList, showActiveBlocksOnly)
      );
    });
  };

  const declinedTransactionsMetaData = [
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="date"
          description="Date of declined tx"
          defaultMessage="Date"
        />
      ),
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return <DateAndTimeConverter epoch={creationTime} monthFormat="long" />;
      },
    },
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="merchant"
          description="Merchant name of declined tx"
          defaultMessage="Merchant"
        />
      ),
      render: (rowData: any) => {
        const { merchant } = rowData;
        return merchant ? <TextRender data={merchant} /> : <span>--</span>;
      },
    },
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="currency"
          description="Currency of declined tx"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) => {
        const { currency } = rowData;
        return currency ? (
          <CurrencyRender currencyCode={currency} />
        ) : (
          <span>--</span>
        );
      },
    },
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="transactionAmount"
          description="Amount of declined tx"
          defaultMessage="Transaction Amount"
        />
      ),
      render: (rowData: any) => {
        const { currency, amount } = rowData;
        return amount !== undefined ? (
          <QDFormattedCurrency currency={currency} amount={amount} />
        ) : (
          <span>--</span>
        );
      },
    },
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="source"
          description="Source of declined tx"
          defaultMessage="Source"
        />
      ),
      render: (rowData: any) => {
        return (
          <TxSourceConverter txSourceCode={rowData.transactionSourceCode} />
        );
      },
    },
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="type"
          description="Type of declined tx"
          defaultMessage="Type"
        />
      ),
      render: (rowData: any) => {
        const { transactionTypeCode } = rowData;
        return <TxTypeConverter txTypeCode={transactionTypeCode} />;
      },
    },
    {
      width: "12.5%",
      header: (
        <FormattedMessage
          id="reason"
          description="Declined Customer Action reason"
          defaultMessage="Reason"
        />
      ),
      render: (rowData: any) => {
        const { responseCode } = rowData;
        return <TextRender data={ReadableErrorMessage(responseCode, intl)} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="riskLevelwhenTriggered"
          description="Risk Level when Triggered"
          defaultMessage="Risk Level when Triggered"
        />
      ),
      render: (rowData: any) => {
        const { riskLevelWhenTriggered } = rowData;
        return <TextRender data={riskLevelWhenTriggered} />;
      },
    },
  ];

  const blocksTableMetaData = [
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="status"
          description="status of block"
          defaultMessage="Status"
        />
      ),
      render: (rowData: any) => {
        const { status } = rowData;
        return (
          <Label
            bold
            variant={`${status === "Active" ? "error" : "labelDark"}`}
            noMargin
          >
            {status}
          </Label>
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="dateCreated"
          description="The date in which the block was created"
          defaultMessage="Date Created"
        />
      ),
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return <DateAndTimeConverter epoch={creationTime} monthFormat="long" />;
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="createdBy"
          description="Username of person who created the block"
          defaultMessage="Created By"
        />
      ),
      render: (rowData: any) => {
        const { blockedBy } = rowData;
        return (
          <ClickableRender
            id={`customer-blocks-blockedby-${blockedBy}`}
            onClickFunc={() => {
              /* do nothing for now */
            }}
          >
            <Label bold variant="link" noMargin>
              {blockedBy}
            </Label>
          </ClickableRender>
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="type"
          description="Block type"
          defaultMessage="Type"
        />
      ),
      render: (rowData: any) => {
        const { formattedType } = rowData;
        return <TextRender data={formattedType} />;
      },
    },
    {
      width: "12%",
      header: (
        <FormattedMessage
          id="reason"
          description="Block reason"
          defaultMessage="Reason"
        />
      ),
      render: (rowData: any) => {
        const { reason, type } = rowData;
        const formattedReason =
          type === "card"
            ? CardBlockReasonConverter(reason, intl)
            : CustomerBlockReasonConverter(reason, intl);
        return <TextRender data={formattedReason} />;
      },
    },
    {
      width: "12%",
      header: (
        <FormattedMessage
          id="blockMemo"
          description="Block memo"
          defaultMessage="Block Memo"
        />
      ),
      render: (rowData: any) => {
        const { memo } = rowData;
        return (
          <TextRender
            component="label"
            bold
            data={memo}
            whiteSpace="pre-wrap"
          />
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="dateReleased"
          description="The date in which the block was released"
          defaultMessage="Date Released"
        />
      ),
      render: (rowData: any) => {
        const { releaseTime } = rowData;
        return releaseTime !== 0 ? (
          <DateAndTimeConverter epoch={releaseTime} monthFormat="long" />
        ) : null;
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="releasedBy"
          description="The username of the person who released the block"
          defaultMessage="Released By"
        />
      ),
      render: (rowData: any) => {
        const { releasedBy } = rowData;
        return (
          <ClickableRender
            id={`customer-blocks-releasedby-${releasedBy}`}
            onClickFunc={() => {
              /* do nothing for now */
            }}
          >
            <Label bold variant="link" noMargin>
              {releasedBy}
            </Label>
          </ClickableRender>
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="releaseMemo"
          description="Release memo"
          defaultMessage="Release Memo"
        />
      ),
      render: (rowData: any) => {
        const { releaseMemo } = rowData;
        return <TextRender data={releaseMemo} whiteSpace="pre-wrap" />;
      },
    },
    {
      width: "10%",
      header: <> </>,
      render: (rowData: any) => {
        const { status, altId, type, id, reason } = rowData;
        let isDisabled =
          status === "Released" ||
          readOnly ||
          (type == "card" && reason == "deactivation");
        return (
          <DrawerComp
            name="release-block-button"
            disabled={isDisabled}
            label={
              status === "Active"
                ? intl.formatMessage({
                    id: "button.release",
                    description: "Release blocks button",
                    defaultMessage: "RELEASE",
                  })
                : intl.formatMessage({
                    id: "button.released",
                    description: "Released blocks button",
                    defaultMessage: "Released",
                  })
            }
            buttonStyle={{ width: "68px" }}
          >
            <ReleaseBlockDrawer altId={altId} blockType={type} blockId={id} />
          </DrawerComp>
        );
      },
    },
  ];

  const adjustmentTransactionCheck = () => {
    if (!adjustmentCardUpdated) {
      const currObj = adjustmentCardObjects.filter(
        (t: { i: number }) =>
          t.i === adjustmentPaginationElements.currentPage * 5
      );
      setAdjustments(
        buildAdjustmentsDisplayList(currObj[0] ? currObj[0].data : currObj)
      );
    } else getAdjustmentTransactions();
  };

  const handleDiscardAdjustmentDto = (adjutmentDtoData: any) => {
    setAdjustmentCardUpdated(false);
    const pagesCount = Math.ceil(adjutmentDtoData.length / searchPageSize);
    const totalCount = adjutmentDtoData.length;

    const adjDto =
      totalCount <= 5
        ? {
            paginationSize: 5,
            currentPage: 0,
            startIndex: 0,
            endIndex: 5,
            rangeStart: 1,
            pagesCount,
            rangeEnd: totalCount,
            totalCount,
            pageSize: 5,
          }
        : {
            ...adjustmentPaginationElements,
            paginationSize: 5,
            startIndex: 0,
            endIndex: 5,
            rangeEnd: totalCount,
            pagesCount,
            totalCount,
          };
    setAdjustmentPaginationElements(adjDto);
  };

  const discardAdjustment = (changeOrderId: string, requestOrderId: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerChangeOrderAPI.discardAdjustmentRequest(
      customerNumber,
      changeOrderId,
      requestOrderId
    ).then(() => {
      emitter.emit(RiskStatusEvents.AdjustmentsChanged, {});
      // setAdjustmentCardUpdated(true);
      const updatedAdjRequestList = adjustmentChangeRequestsMasterList.filter(
        (adjustment: { id: string }) => adjustment.id !== requestOrderId
      );
      setAdjustmentChangeRequestsMasterList(updatedAdjRequestList);
      handleDiscardAdjustmentDto(updatedAdjRequestList);
      createCurrentAdjPageObject(updatedAdjRequestList);
      setSuccessMsg({
        responseCode: "200000",
        message: intl.formatMessage({
          id: "adjustment.success.discarded",
          defaultMessage: `Adjustment has been discarded`,
        }),
      });
    });
  };

  const adjustmentTableMetadata = [
    {
      width: "11.1%",
      header: (
        <FormattedMessage
          id="status"
          description="Adjustment status"
          defaultMessage="Status"
        />
      ),
      render: (rowData: any) => {
        const { state } = rowData;
        return <TextRender data={state} />;
      },
    },
    {
      width: "11.1%",
      header: (
        <FormattedMessage
          id="requestedDate"
          description="The date in which the adjustment was requested"
          defaultMessage="Requested Date"
        />
      ),
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return creationTime !== 0 ? (
          <DateAndTimeConverter epoch={creationTime} monthFormat="long" />
        ) : null;
      },
    },
    {
      width: "11.1%",
      header: (
        <FormattedMessage
          id="requestedBy"
          description="The username of the person who requested the adjustment"
          defaultMessage="Requested By"
        />
      ),
      render: (rowData: any) => {
        const { requestedBy } = rowData;
        return (
          <ClickableRender
            id={`customer-adustments-requestedby-${requestedBy}`}
            onClickFunc={() => {
              /* do nothing for now */
            }}
          >
            <Label bold variant="link" noMargin>
              {requestedBy}
            </Label>
          </ClickableRender>
        );
      },
    },
    {
      width: "11.1%",
      header: (
        <FormattedMessage
          id="currency"
          description="The currency of the adjustment"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) => {
        const { currency } = rowData;
        return <CurrencyRender currencyCode={currency} />;
      },
    },
    {
      width: "11.1%",
      header: (
        <FormattedMessage
          id="amount"
          description="The amount of the adjustment"
          defaultMessage="Amount"
        />
      ),
      render: (rowData: any) => {
        const { currency, amount } = rowData;
        return (
          <QDFormattedCurrency
            currency={currency}
            amount={amount}
          />
        );
      },
    },
    {
      width: "11.1%",
      header: (
        <FormattedMessage
          id="requestMemo"
          description="Adjustment request memo"
          defaultMessage="Request Memo"
        />
      ),
      render: (rowData: any) => {
        const { memo } = rowData;
        return (
          <TextRender
            component="label"
            bold
            data={memo}
            whiteSpace="pre-wrap"
          />
        );
      },
    },
    {
      width: "11.1%",
      header: (
        <FormattedMessage
          id="dateApproved"
          description="The date in which the request was approved"
          defaultMessage="Date Approved"
        />
      ),
      render: (rowData: any) => <TextRender data="--" />,
    },
    {
      width: "11.1%",
      header: (
        <FormattedMessage
          id="approvedBy"
          description="The username of the person who approved the adjustment"
          defaultMessage="Approved By"
        />
      ),
      render: (rowData: any) => {
        const { approvedBy } = rowData;
        return (
          <ClickableRender
            id={`customer-adjustments-approvedby-${approvedBy}`}
            onClickFunc={() => {
              /* do nothing for now */
            }}
          >
            <Label bold variant="link" noMargin>
              {approvedBy}
            </Label>
          </ClickableRender>
        );
      },
    },
    {
      width: "11.1%",
      header: (
        <FormattedMessage
          id="approvalMemo"
          description="Adjustment approval memo"
          defaultMessage="Approval Memo"
        />
      ),
      render: (rowData: any) => {
        const { approvalMemo } = rowData;
        return (
          <TextRender
            component="label"
            bold
            data={approvalMemo}
            whiteSpace="pre-wrap"
          />
        );
      },
    },
    {
      width: "11.1%",
      header: <> </>,
      render: (rowData: any) => {
        const { status } = rowData;
        return (
          <QDButton
            label={
              status === "Approved"
                ? intl.formatMessage({
                    id: "button.approved",
                    description: "Approved adjustments button",
                    defaultMessage: "APPROVED",
                  })
                : intl.formatMessage({
                    id: "button.discard",
                    description: "Discard adjustments button",
                    defaultMessage: "DISCARD",
                  })
            }
            id="discard-adjustment-button"
            onClick={() => discardAdjustment(rowData.changeOrderId, rowData.id)}
            color="primary"
            variant="contained"
            size="small"
            style={{ minWidth: "90px" }}
            disabled={status === "Approved" || readOnly}
          />
        );
      },
    },
  ];

  const handleAddAdjustmentDto = (adjutmentDtoData: any) => {
    setAdjustmentCardUpdated(false);
    const pagesCount = Math.ceil(adjutmentDtoData.length / searchPageSize);
    const totalCount = adjutmentDtoData.length;

    const adjDto = {
      ...adjustmentPaginationElements,
      paginationSize: 5,
      startIndex: 0,
      endIndex: 5,
      rangeEnd: totalCount,
      pagesCount,
      totalCount,
    };
    setAdjustmentPaginationElements(adjDto);
  };

  const addNewAdjustment = (newAdjustment: any) => {
    const updatedAdjRequestList = [
      ...adjustmentChangeRequestsMasterList,
      newAdjustment,
    ];
    setAdjustmentChangeRequestsMasterList(updatedAdjRequestList);
    handleAddAdjustmentDto(updatedAdjRequestList);
    createCurrentAdjPageObject(updatedAdjRequestList);
  };

  const getCustomerFees = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.getFees(customerNumber)
      .then((feeList: any) => setFees(feeList))
      .catch((error: any) => setErrorMsg(error));

  const feeTableMetadata = [
    {
      width: "24%",
      header: (
        <FormattedMessage
          id="selectedFee"
          description="The selected Fee type"
          defaultMessage="Selected Fee"
        />
      ),
      // eslint-disable-next-line max-len
      render: (rowData: any) => {
        const { transactionSourceCode, transactionTypeCode } = rowData;
        return (
          <DrawerComp
            id="edit-fee-link"
            asLink
            label={`${FormatTxSource(
              transactionSourceCode,
              intl
            )} - ${FormatTxType(transactionTypeCode, intl)}`}
          >
            <DrawerAddFee editFee={rowData} />
          </DrawerComp>
        );
      },
    },
    {
      width: "14%",
      header: (
        <FormattedMessage
          id="currency"
          description="The currency for the fee"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) => {
        const { currency } = rowData;
        return <CurrencyRender currencyCode={currency} />;
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="fixedFee"
          description="The fixed fee amount"
          defaultMessage="Fixed Fee"
        />
      ),
      render: (rowData: any) => {
        const { fixFee, currency } = rowData;
        return <QDFormattedCurrency currency={currency} amount={fixFee} />;
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="percentage"
          description="The percentage fee amount"
          defaultMessage="Percentage"
        />
      ),
      render: (rowData: any) => {
        const { percentage } = rowData;
        return (
          <TextRender
            data={
              <FormattedNumber
                value={percentage}
                /* eslint-disable-next-line react/style-prop-object */
                style="percent"
                maximumFractionDigits={2}
                minimumFractionDigits={2}
              />
            }
          />
        );
      },
    },
    {
      width: "12%",
      header: (
        <FormattedMessage
          id="chargeReceiver"
          description="Whether the fee will apply to the receiver"
          defaultMessage="Charge Receiver"
        />
      ),
      render: (rowData: any) => {
        const { chargeReceiver } = rowData;
        return (
          <CheckmarkConverter
            width="12"
            height="12"
            bool={chargeReceiver}
            hideFalse
          />
        );
      },
    },
    {
      width: "12%",
      header: (
        <FormattedMessage
          id="receiverFixFee"
          description="The fixed amount to charge the receiver, if any"
          defaultMessage="Receiver fix fee"
        />
      ),
      render: (rowData: any) => {
        const { receiverFixFee, currency, chargeReceiver } = rowData;

        if (chargeReceiver) {
          return (
            <QDFormattedCurrency currency={currency} amount={receiverFixFee} />
          );
        }
      },
    },
    {
      width: "12%",
      header: (
        <FormattedMessage
          id="receiverPercent"
          description="The percentage amount to charge the receiver, if any"
          defaultMessage="Receiver percent"
        />
      ),
      render: (rowData: any) => {
        const { receiverPercentage, chargeReceiver } = rowData;
        if (chargeReceiver) {
          return (
            <TextRender
              data={
                <FormattedNumber
                  value={receiverPercentage}
                  /* eslint-disable-next-line react/style-prop-object */
                  style="percent"
                  maximumFractionDigits={2}
                  minimumFractionDigits={2}
                />
              }
            />
          );
        }
      },
    },
  ];

  const riskRulesTableMetadata = [
    {
      width: "14%",
      header: <FormattedMessage id="riskRule" defaultMessage="Risk Rule" />,
      render: () => "",
    },
    {
      width: "14%",
      header: (
        <FormattedMessage id="currentValue" defaultMessage="Current Value" />
      ),
      render: () => "",
    },
    {
      width: "10%",
      header: (
        <FormattedMessage id="allowedValue" defaultMessage="Allowed Value" />
      ),
      render: () => "",
    },
    {
      width: "10%",
      header: <FormattedMessage id="scope" defaultMessage="Scope" />,
      render: () => "",
    },
    {
      width: "12%",
      header: <FormattedMessage id="source" defaultMessage="Source" />,
      render: () => "",
    },
    {
      width: "12%",
      header: <FormattedMessage id="alerts" defaultMessage="Alerts" />,
      render: () => "",
    },
    {
      width: "12%",
      header: <FormattedMessage id="created" defaultMessage="Created" />,
      render: () => "",
    },
  ];

  useEffect(() => {
    //getAllBlocks(customerNumber, primaryPersonId);
    //emitter.on(RiskStatusEvents.BlocksChanged, () =>
    //  getAllBlocks(customerNumber, primaryPersonId)
    //);
    getAllBlocks(customerNumber, primaryPersonId);
    getDeclinedTransactions();
    //getAllBlocks(customerNumber, primaryPersonId);
  }, [blocksSearchDto, cursor]);

  useEffect(() => {
    adjustmentTransactionCheck();
  }, [adjustmentSearchDto, cursor]);

  // this useEffect is needed in order for the emitter to only be created once.
  useEffect(() => {
    showActiveBlocksOnly = true;
    setReleasedToggled(false);
    getAdjustmentTransactions();
    getCustomerFees();
    emitter.on(RiskStatusEvents.BlocksChanged, () =>
      getAllBlocks(customerNumber, primaryPersonId)
    );
    emitter.on("customer.adjustment.changed", () => {
      getAdjustmentTransactions();
    });

    // @ts-ignore -- Determine if customer is a credit card customer
    return (
      // @ts-ignore
      api.ProductAPI.getOfferingCustomer(customerNumber)
        .then((product: OfferingCustomerSummary) => {
          if (product.offeringPluginClass == "CreditCard") {
            setIsCreditCardCustomer(true);
          } else {
            console.log(
              `Adjustments will not be viewable because the customer does not have the credit card offering enabled`
            );
          }
        })
        // 4xx and 5xx http errors will get thrown as exceptions.
        .catch((exception: any) =>
          console.log(
            `Adjustments will not be viewable because: ${JSON.stringify(
              exception,
              null,
              2
            )}`
          )
        )
    );
  }, []);

  useEffect(() => {
    emitter.on("customer.block.changed", () => {
      resetOffsetPaginationElements();
      resetBlockSearchDto();
    });
  }, [showActiveBlocksOnly, showSingleUse]);

  return (
    <Box>
      <Box sx={{ marginBottom: "60px" }}>
        <Box sx={{ marginBottom: "18px" }}>
          <Header
            value={intl.formatMessage(
              defineMessage({
                id: "declinedActivity",
                description: "Declined activity section header",
                defaultMessage: "Declined Activity",
              })
            )}
            level={2}
            bold
            color="primary"
          />
        </Box>
        <Box>
          <StandardTable
            id="risk-declined-transactions-table"
            tableRowPrefix="risk-declined-transactions-table"
            dataList={declinedTxs}
            tableMetadata={declinedTransactionsMetaData}
            setCursor={setCursor}
            cursor={cursor}
            nextCursor={nextCursor}
          />
        </Box>
      </Box>
      <Box sx={{ marginBottom: "60px" }}>
        <Box
          sx={{
            marginBottom: "18px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Header
            value={intl.formatMessage(
              defineMessage({
                id: "blocks",
                description: "Blocks section header",
                defaultMessage: "Blocks",
              })
            )}
            level={2}
            bold
            color="primary"
          />
          <Box sx={{ display: "flex" }}>
            <Box sx={{ marginRight: "12px" }}>
              <Toggle
                id="risk-show-released-toggle"
                checked={releasedToggled}
                func={() => toggleShowReleased(showActiveBlocksOnly)}
                label={
                  <Typography>
                    {intl.formatMessage(
                      defineMessage({
                        id: "showreleasedBlocks",
                        defaultMessage: "Show released blocks",
                      })
                    )}
                  </Typography>
                }
              />
            </Box>
            <Box sx={{ marginRight: "2px" }}>
              <Toggle
                id="risk-single-use-toggle"
                checked={singleUseToggled}
                func={() => toggleShowSingleUse(showSingleUse)}
                label={
                  <Typography>
                    {intl.formatMessage(
                      defineMessage({
                        id: "showsingleuseCards",
                        defaultMessage: "Show single-use cards",
                      })
                    )}
                  </Typography>
                }
              />
            </Box>
            <DrawerComp
              id="risk-add-new-block-button"
              label={intl.formatMessage({
                id: "button.addNewBlock",
                description: "Add new block button text",
                defaultMessage: "ADD NEW BLOCK",
              })}
              disabled={readOnly}
            >
              <AddNewBlock />
            </DrawerComp>
          </Box>
        </Box>
        <Box>
          <StandardTable
            id="risk-blocks-table"
            tableRowPrefix="risk-blocks-table"
            tableMetadata={blocksTableMetaData}
            dataList={blocks}
            setDto={setBlocksSearchDto}
            dto={blocksSearchDto}
            offsetPaginationElements={offsetPaginationElements}
            setOffsetPaginationElements={setOffsetPaginationElements}
          />
        </Box>
      </Box>
      <Box>
        {!isCreditCardCustomer ? (
          <Box
            sx={{
              marginBottom: "18px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Header
              value={intl.formatMessage(
                defineMessage({
                  id: "adjustments",
                  description: "Adjustments section header",
                  defaultMessage: "Adjustments",
                })
              )}
              level={2}
              bold
              color="primary"
            />
            <Box sx={{ display: "flex" }}>
              <Box sx={{ marginRight: "12px" }}>
                <DrawerComp
                  id="risk-add-adjustment-button"
                  buttonProps=""
                  disabled={adjustments.length === 0 || readOnly}
                  label={intl.formatMessage({
                    id: "button.addNewAdjustment",
                    description: "Add new chargeoff text",
                    defaultMessage: "ADD NEW ADJUSTMENT",
                  })}
                >
                  {/* @ts-ignore */}
                  <AddAdjustment addNewAdjustment={addNewAdjustment} />
                </DrawerComp>
              </Box>
              <DrawerComp
                id="risk-create-change-order-button"
                buttonProps=""
                disabled={readOnly}
                label={intl.formatMessage({
                  id: "button.createChangeOrder",
                  description: "Create change order text",
                  defaultMessage: "CREATE CHANGE ORDER",
                })}
              >
                <CreateChangeOrder />
              </DrawerComp>
            </Box>
          </Box>
        ) : undefined}
        {!isCreditCardCustomer ? (
          <Box>
            <StandardTable
              id="risk-adjustments-table"
              tableRowPrefix="risk-adjustments-table"
              tableMetadata={adjustmentTableMetadata}
              dataList={adjustments}
              setDto={setAdjustmentSearchDto}
              dto={adjustmentSearchDto}
              offsetPaginationElements={adjustmentPaginationElements}
              setOffsetPaginationElements={setAdjustmentPaginationElements}
            />
          </Box>
        ) : undefined}
      </Box>
      <Box>
        <Box
          sx={{
            marginBottom: "18px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Header
            value={intl.formatMessage(
              defineMessage({
                id: "chargeoffs",
                description: "Chargeoff section header",
                defaultMessage: "Chargeoffs",
              })
            )}
            level={2}
            bold
            color="primary"
          />
          <Box sx={{ display: "flex" }}>
            <Box sx={{ marginRight: "12px" }}>
              <DrawerComp
                id="risk-add-adjustment-button"
                buttonProps=""
                disabled={chargeoffs.length === 0 || readOnly}
                label={intl.formatMessage({
                  id: "button.addNewChargeoff",
                  description: "Add new chargeoff text",
                  defaultMessage: "ADD NEW CHARGEOFF",
                })}
              >
                <AddChargeoff />
              </DrawerComp>
            </Box>
            <DrawerComp
              id="risk-create-change-order-button"
              buttonProps=""
              disabled={readOnly}
              label={intl.formatMessage({
                id: "button.createChangeOrder",
                description: "Create change order text",
                defaultMessage: "CREATE CHANGE ORDER",
              })}
            >
              <CreateChangeOrderChargeoff />
            </DrawerComp>
          </Box>
        </Box>
        <Box>
          <StandardTable
            id="risk-chargeoff-table"
            tableRowPrefix="risk-chargeoff-table"
            tableMetadata={adjustmentTableMetadata}
            dataList={chargeoffs}
            setDto={setChargeoffSearchDto}
            dto={chargeoffSearchDto}
            offsetPaginationElements={chargeoffPaginationElements}
            setOffsetPaginationElements={setChargeoffPaginationElements}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <Box>
          <Header
            level={2}
            bold
            value={intl.formatMessage(
              defineMessage({
                id: "fees",
                description: "Header for Fee section",
                defaultMessage: "Fees",
              })
            )}
          />
        </Box>
        <Box>
          <DrawerComp
            id="pagenav-exchange-currency-button"
            label={intl.formatMessage(
              defineMessage({
                id: "button.addFee",
                defaultMessage: "ADD FEE",
              })
            )}
            callbackFunc={() => getCustomerFees()}
          >
            <DrawerAddFee />
          </DrawerComp>
        </Box>
      </Box>
      <Box>
        <StandardTable
          id="customer-fee-table"
          tableRowPrefix="customer-fee-table"
          tableMetadata={feeTableMetadata}
          dataList={fees}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <Box>
          <Header
            level={2}
            bold
            value={intl.formatMessage(
              defineMessage({
                id: "riskRules",
                defaultMessage: "Risk Rules",
              })
            )}
          />
        </Box>
        <Box sx={{ display: "flex" }}>
          <Box sx={{ marginRight: "14px" }}>
            <CustomerRiskLevelDrawerContextProvider>
              <ProgramDetailContextProvider
                programName={props.programName}
                currentLevel={securityLevel}
              >
                <DrawerComp
                  widthPercentage={80}
                  LevelTwo={ProgramRiskParamsLevelTwo}
                  label={intl.formatMessage(
                    defineMessage({
                      id: "changeRiskLevel",
                      defaultMessage: "Change Risk Level",
                    })
                  )}
                >
                  <CustomerRiskLevelDrawer
                    securityLevel={securityLevel}
                    programName={props.programName}
                  />
                </DrawerComp>
              </ProgramDetailContextProvider>
            </CustomerRiskLevelDrawerContextProvider>
          </Box>
        </Box>
      </Box>
      <Box>
        <StandardTable
          id="customer-risk-rules-table"
          tableRowPrefix="customer-risk-rules-table"
          tableMetadata={riskRulesTableMetadata}
          dataList={riskRules}
        />
      </Box>
    </Box>
  );
};

export default PageNavRiskStatus;
