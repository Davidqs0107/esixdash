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
import React, { useContext, useEffect, useState } from "react";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import api from "../../../api/api";
import StandardTable from "../../common/table/StandardTable";
import DrawerComp from "../../common/DrawerComp";
import CurrencyRender from "../../common/converters/CurrencyRender";
import CheckmarkConverter from "../../common/converters/CheckmarkConverter";
import Toggle from "../../common/forms/checkboxes/Toggle";
import Sortable from "../../common/Sortable";
// eslint-disable-next-line import/no-cycle
import ExchangeCurrencyTwo from "../drawers/DrawerExchangeCurrencyTwo";
import emitter from "../../../emitter";
import Header from "../../common/elements/Header";
import { MessageContext } from "../../../contexts/MessageContext";
import QDFormattedCurrency from "../../common/converters/QDFormattedCurrency";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";
import Pill from "../../common/elements/PillLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CustomerWalletsEvents = {
  CustomerWalletsChanged: "exchange.currency.changed",
};

interface IPageNavWallets {
  customerNumber: string;
  primaryPersonId: string;
  customerAddress: any;
}

interface IUpdateSortOrder {
  oldIndex: number;
  newIndex: number;
}

const PageNavWallets: React.FC<IPageNavWallets> = ({
  customerNumber,
  primaryPersonId,
  customerAddress,
  ...props
}) => {
  const intl = useIntl();
  const [wallets, setWallets] = useState([]);
  const [fees, setFees] = useState([]);
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const { readOnly } = useContext(ContentVisibilityContext);

  const getCustomerWallets = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.getWallets(customerNumber)
      .then((walletList: any) => setWallets(walletList))
      .catch((error: any) => setErrorMsg(error));

  const getCustomerFees = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.getFees(customerNumber)
      .then((feeList: any) => setFees(feeList))
      .catch((error: any) => setErrorMsg(error));

  const toggleQuickspend = (values: any) => {
    const { currency, quickSpend } = values;
    const dto = {
      currency,
      quickSpend: !quickSpend,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return api.CustomerAPI.safeDraft(customerNumber, currency, dto)
      .then(() => getCustomerWallets())
      .catch((error: any) => setErrorMsg(error));
  };

  const updateSortOrder = ({ oldIndex, newIndex }: IUpdateSortOrder) => {
    const without = wallets
      .slice(0, oldIndex)
      .concat(wallets.slice(oldIndex + 1));
    // eslint-disable-next-line max-len
    const withNew = without
      .slice(0, newIndex)
      .concat([wallets[oldIndex]])
      .concat(without.slice(newIndex));
    setWallets(withNew);
    const parsedSafeDraft = withNew.map((wallet: any) => wallet.safeDraft);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return api.CustomerAPI.safeDraft2(customerNumber, parsedSafeDraft);
  };

  useEffect(() => {
    getCustomerWallets();
    getCustomerFees();
  }, []);

  useEffect(() => {
    const walletsListener = emitter.on(
      CustomerWalletsEvents.CustomerWalletsChanged,
      () => {
        getCustomerWallets();
        getCustomerFees();
      },
      { objectify: true }
    );

    return () => {
      walletsListener.off();
    };
  }, []);

  const tableMetadata = [
    {
      width: "8%",
      header: (
        <FormattedMessage
          id="drawdownOrder"
          description="Drawdown order of Wallets"
          defaultMessage="Drawdown Order"
        />
      ),
      render: () => (
        <FontAwesomeIcon icon={faEllipsisV} />
      ),
    },
    {
      width: "15%",
      header: (
        <FormattedMessage
          id="currency"
          description="Currency held in wallet"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) => {
        const { currency, complianceBalance } = rowData;
        return (
          <>
            <CurrencyRender currencyCode={currency} />
            {currency === complianceBalance.currencyCode && (
              <Box sx={{ ml: 4 }}>
                <Pill
                  label={intl.formatMessage({
                    id: "complianceCurrency",
                    defaultMessage: "Compliance Currency",
                  })}
                  color="info"
                />
              </Box>
            )}
          </>
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="Balance"
          description="Balance in Wallet"
          defaultMessage="Balance"
        />
      ),
      render: (rowData: any) => {
        const { balance, currency } = rowData;
        return (
          <QDFormattedCurrency currency={currency} amount={balance.amount} />
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="availableBalance"
          description="Available Balance in Wallet"
          defaultMessage="Available Balance"
        />
      ),
      render: (rowData: any) => {
        const { availableBalance, currency } = rowData;
        return (
          <QDFormattedCurrency
            currency={currency}
            amount={availableBalance.amount}
          />
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="safeDraft"
          description="If the wallet is Safe Draft supported"
          defaultMessage="Safe Draft"
        />
      ),
      render: (rowData: any) => {
        const { safeDraft } = rowData;
        return (
          <CheckmarkConverter
            width="12"
            height="12"
            bool={safeDraft.supported}
          />
        );
      },
    },
    {
      width: "10%",
      header: (
        <FormattedMessage
          id="quickSpend"
          description="If wallet has Quick Spend enabled"
          defaultMessage="Quick Spend"
        />
      ),
      render: (rowData: any) => {
        const { safeDraft, currency } = rowData;
        return (
          <Toggle
            id={`wallet-quick-spend-toggle-${currency}`}
            checked={safeDraft.quickSpend}
            disabled={readOnly}
            func={() => toggleQuickspend(rowData.safeDraft)}
          />
        );
      },
    },
    {
      width: "10%",
      header: <> </>,
      render: (rowData: any) => {
        const { currency } = rowData;
        return (
          <DrawerComp
            id={`pagenav-exchange-${currency}-button`}
            buttonProps="MuiButton-tall float-right"
            label={intl.formatMessage({
              id: "button.exchange",
              defaultMessage: "EXCHANGE",
            })}
            callbackFunc={() => getCustomerWallets}
            size="small"
            disabled={readOnly}
          >
            <ExchangeCurrencyTwo currency={currency} />
          </DrawerComp>
        );
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ marginBottom: "16px" }}>
        <Header
          level={2}
          bold
          value={intl.formatMessage(
            defineMessage({
              id: "wallets.section.header.wallets",
              description: "Wallets section header",
              defaultMessage: "Wallets",
            })
          )}
        />
      </Box>
      <Box>
        {/* @ts-ignore */}
        <Sortable items={wallets} onSortEnd={updateSortOrder} pressDelay={200}>
          <StandardTable
            id="customer-wallets-table"
            tableRowPrefix="wallets-row"
            tableMetadata={tableMetadata}
          />
        </Sortable>
      </Box>
    </Box>
  );
};

export default PageNavWallets;
