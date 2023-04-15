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

import { FormattedMessage, FormattedNumber, useIntl } from "react-intl";
import React, { useContext, useEffect, useState } from "react";
import { Box, Grid, Container } from "@mui/material";
import DrawerComp from "../../common/DrawerComp";
import ExchangeDrawer from "./ExchangeDrawer";
import TextRender from "../../common/TextRender";
import CurrencyRender from "../../common/converters/CurrencyRender";
import DateAndTimeConverter from "../../common/converters/DateAndTimeConverter";
import StandardTable from "../../common/table/StandardTable";
import AddNewIndividualCurrencyMarginDrawer from "./AddNewIndividualCurrencyMarginDrawer";
import AddPairCurrencyMarginDrawer from "./AddPairCurrencyMarginDrawer";
import ToastModal from "../../common/containers/ToastModal";
import emitter from "../../../emitter";
import BankEvents from "../../../pages/banks/BankEvents";
import Header from "../../common/elements/Header";

interface IEditExchangeDrawer {
  toggleDrawer?: any;
  exchange?: any;
}

const EditExchangeDrawer: React.FC<IEditExchangeDrawer> = ({
  toggleDrawer,
  exchange,
}) => {
  const intl = useIntl();

  const [modalState, setModalState] = useState({
    icon: "",
    status: false,
    headline: "Loading...",
    body: "Loading...",
  });

  useEffect(() => {
    // eslint-disable-next-line max-len,no-unused-expressions
    emitter.on(BankEvents.DrawerUpdated, (modalState: any) =>
      setModalState(modalState)
    );
  }, []);

  const individualMetadata = [
    {
      header: (
        <FormattedMessage
          id="currency"
          description="Currency Name"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) => {
        const { currency } = rowData;
        return <CurrencyRender currencyCode={currency} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="buyMarginPercentage"
          description="Buy Margin %"
          defaultMessage="Buy Margin %"
        />
      ),
      render: (rowData: any) => {
        const { buyExchMargin } = rowData;
        return (
          <FormattedNumber
            value={buyExchMargin}
            /* eslint-disable-next-line react/style-prop-object */
            style="percent"
            maximumFractionDigits={4}
            minimumFractionDigits={4}
          />
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="sellMarginPercentage"
          description="Sell Margin %"
          defaultMessage="Sell Margin %"
        />
      ),
      render: (rowData: any) => {
        const { sellExchMargin } = rowData;
        return (
          <FormattedNumber
            value={sellExchMargin}
            /* eslint-disable-next-line react/style-prop-object */
            style="percent"
            maximumFractionDigits={4}
            minimumFractionDigits={4}
          />
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="creationDate"
          description="Created Time"
          defaultMessage="Created"
        />
      ),
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return creationTime !== 0 ? (
          <DateAndTimeConverter epoch={creationTime} monthFormat={undefined} />
        ) : null;
      },
    },
    {
      header: (
        <FormattedMessage
          id="modifiedDate"
          description="Modified Time"
          defaultMessage="Modified"
        />
      ),
      render: (rowData: any) => {
        const { modifiedTime } = rowData;
        return modifiedTime && modifiedTime !== 0 ? (
          <DateAndTimeConverter epoch={modifiedTime} monthFormat={undefined} />
        ) : (
          "--"
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="program"
          description="Program Name"
          defaultMessage="Program"
        />
      ),
      render: (rowData: any) => {
        const { operatingProgram } = rowData;
        return <TextRender data={operatingProgram} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="feePlan"
          description="Fee Plan Name"
          defaultMessage="Fee Plan"
        />
      ),
      render: (rowData: any) => {
        const { feePlan } = rowData;
        return <TextRender data={feePlan} />;
      },
    },
    {
      header: (
        <> </>
      ),
      render: (rowData: any) => {
        return (
          <DrawerComp
            buttonProps="float-right"
            label={intl.formatMessage({
              id: "edit",
              description: "Edit exchange information",
              defaultMessage: "EDIT",
            })}
          >
            <AddNewIndividualCurrencyMarginDrawer
              edit
              exchange={exchange}
              data={rowData}
              toggleDrawer={toggleDrawer}
            />
          </DrawerComp>
        );
      },
    },
  ];

  const pairMetadata = [
    {
      header: (
        <FormattedMessage
          id="buyCurrency"
          description="Buy Currency Name"
          defaultMessage="Buy Currency"
        />
      ),
      render: (rowData: any) => {
        const { buyCurrency } = rowData;
        return <CurrencyRender currencyCode={buyCurrency} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="sellCurrency"
          description="Sell Currency Name"
          defaultMessage="Sell Currency"
        />
      ),
      render: (rowData: any) => {
        const { sellCurrency } = rowData;
        return <CurrencyRender currencyCode={sellCurrency} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="sellMarginPercentage"
          description="Sell Margin %"
          defaultMessage="Sell Margin %"
        />
      ),
      render: (rowData: any) => {
        const { sellExchMargin } = rowData;
        return (
          <FormattedNumber
            value={sellExchMargin}
            /* eslint-disable-next-line react/style-prop-object */
            style="percent"
            maximumFractionDigits={4}
            minimumFractionDigits={4}
          />
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="createdDate"
          description="Created Time"
          defaultMessage="Created"
        />
      ),
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return creationTime !== 0 ? (
          <DateAndTimeConverter epoch={creationTime} monthFormat={undefined} />
        ) : null;
      },
    },
    {
      header: (
        <FormattedMessage
          id="modifiedDate"
          description="Modified Time"
          defaultMessage="Modified"
        />
      ),
      render: (rowData: any) => {
        const { modifiedTime } = rowData;
        return modifiedTime && modifiedTime !== 0 ? (
          <DateAndTimeConverter epoch={modifiedTime} monthFormat={undefined} />
        ) : (
          "--"
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="program"
          description="Program Name"
          defaultMessage="Program"
        />
      ),
      render: (rowData: any) => {
        const { operatingProgram } = rowData;
        return <TextRender data={operatingProgram} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="feePlan"
          description="Fee Plan Name"
          defaultMessage="Fee Plan"
        />
      ),
      render: (rowData: any) => {
        const { feePlan } = rowData;
        return <TextRender data={feePlan} />;
      },
    },
    {
      header: (
        <> </>
      ),
      render: (rowData: any) => (
        <DrawerComp
          buttonProps="float-right"
          label={intl.formatMessage({
            id: "edit",
            description: "Edit exchange information",
            defaultMessage: "EDIT",
          })}
        >
          <AddPairCurrencyMarginDrawer
            edit
            exchange={exchange}
            toggleDrawer={toggleDrawer}
            data={rowData}
          />
        </DrawerComp>
      ),
    },
  ];

  return (
    <Container sx={{ minWidth: "1225px" }}>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Header
            value={intl.formatMessage({
              id: "individualCurrencyMargins",
              description: "drawer header",
              defaultMessage: "Individual Currency Margins",
            })}
            level={2}
            color="white"
            bold
            drawerTitle
          />
        </Grid>
        <Grid item alignSelf="end">
          <Box sx={{ mb: 3 }}>
            <DrawerComp
              id="drawer-edit-exchanges-create-new-margin"
              textCase="upper"
              label={intl.formatMessage({
                id: "createNewIndividualCurrencyMargin",
                description: "create New Individual Currency Margin button",
                defaultMessage: "CREATE NEW INDIVIDUAL CURRENCY MARGIN",
              })}
            >
              {/* eslint-disable-next-line max-len */}
              <AddNewIndividualCurrencyMarginDrawer
                exchange={exchange}
                toggleDrawer={toggleDrawer}
              />
            </DrawerComp>
          </Box>
        </Grid>
      </Grid>

      <Box>
        <Grid>
          <StandardTable
            id="individual-margins-table"
            tableRowPrefix="exchanges-individual-margins"
            tableMetadata={individualMetadata}
            dataList={exchange.margins}
          />
        </Grid>
      </Box>

      <Grid container justifyContent="space-between">
        <Grid item>
          <Header
            value={intl.formatMessage({
              id: "currencyMarginPairs",
              description: "drawer header",
              defaultMessage: "Currency Margin Pairs",
            })}
            level={2}
            color="white"
            bold
            drawerTitle
          />
        </Grid>
        <Grid item alignSelf="end">
          <Box sx={{ mb: 3 }}>
            <DrawerComp
              id="drawer-edit-exchanges-create-new-pair"
              textCase="upper"
              label={intl.formatMessage({
                id: "createNewCurrencyMarginPair",
                description: "Create New Currency Margin Pair button",
                defaultMessage: "CREATE NEW CURRENCY MARGIN PAIR",
              })}
            >
              <AddPairCurrencyMarginDrawer
                exchange={exchange}
                toggleDrawer={toggleDrawer}
              />
            </DrawerComp>
          </Box>
        </Grid>
      </Grid>

      <Box>
        <Grid>
          <StandardTable
            id="pair-margins-table"
            tableRowPrefix="exchanges-margin-pairs"
            tableMetadata={pairMetadata}
            dataList={exchange.pairs}
          />
        </Grid>
      </Box>

      <Box />
      {/* eslint-disable-next-line max-len */}
      {modalState.status ? (
        <ToastModal
          icon={modalState.icon}
          headline={modalState.headline}
          body={modalState.body}
          message={""}
          toggleDrawer={() => null}
          className="error"
          buttons={[]}
          showXIcon={true}
        />
      ) : null}
    </Container>
  );
};

export default EditExchangeDrawer;
