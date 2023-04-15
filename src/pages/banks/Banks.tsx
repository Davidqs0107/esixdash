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

import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import {
  Box,
  Container,
  Grid,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import CurrencyRender from "../../components/common/converters/CurrencyRender";
import StandardTable from "../../components/common/table/StandardTable";
import api from "../../api/api";
import TableCellAccordion from "../../components/common/forms/accordions/TableCellAccordion";
import TextRender from "../../components/common/TextRender";
import DrawerComp from "../../components/common/DrawerComp";
import BankDrawer from "../../components/banks/drawers/BankDrawer";
import emitter from "../../emitter";
import InterchangeDrawer from "../../components/banks/drawers/InterchangeDrawer";
import ExchangeDrawer from "../../components/banks/drawers/ExchangeDrawer";
import EditExchangeDrawer from "../../components/banks/drawers/EditExchangeDrawer";
import BrandingWrapper from "../../app/BrandingWrapper";
import Pill from "../../components/common/elements/PillLabel";
import DateAndTimeConverter from "../../components/common/converters/DateAndTimeConverter";
import Header from "../../components/common/elements/Header";
import { ContentVisibilityContext } from "../../contexts/ContentVisibilityContext";

const Banks = () => {
  const [bankInfoList, setBankInfoList] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [interchanges, setInterchanges] = useState([]);
  const { canSeeBanks, canSeeExchanges, canSeeInterchanges } = useContext(
    ContentVisibilityContext
  );
  const intl = useIntl();

  const listBanks = async () => {
    if (canSeeBanks) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return api.BankAPI.list().catch((error: any) => error);
    }
    return [];
  };
  const getIINs = (bankName: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.BankAPI.getIINs(bankName).catch((error) => error);
  const getPartners = async () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.list().catch((error: any) => error);
  const getPrograms = async () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingAPI.list().catch((error) => error);
  const getCurrencies = (bankName: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.BankAPI.getCurrencies(bankName).catch((error) => error);
  const listInterchanges = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.InterchangeAPI.list().catch((error) => error);
  const getInterchangeIINs = (interchangeName: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.InterchangeAPI.getIINs(interchangeName).catch((error) => error);
  const getInterchangeCurrencies = (interchangeName: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.InterchangeAPI.getCurrencies(interchangeName).catch((error) => error);

  const listExchanges = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.listExchanges().catch((error) => error);
  const getExchangeMargins = (exchangeName: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.getExchangeMargins(exchangeName).catch((error) => error);
  const getExchangeCurrencyPairs = (name: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.getExchangeCurrencyPairRates(name).catch((error) => error);

  const getExchangesInfos = () => {
    if (!canSeeExchanges) {
      return;
    }
    listExchanges().then((exs: any) => {
      const promises: any = [];
      const list: any = [];
      exs.map((ex: any) =>
        promises.push([
          getExchangeMargins(ex.name),
          getExchangeCurrencyPairs(ex.name),
        ])
      );
      Promise.all(promises.map((promise: any) => Promise.all(promise))).then(
        (results) => {
          exs.map((ex: any, index: any) => {
            const curr = ex.currencies;
            curr.unshift("");

            const margins = results[index][0];
            const pairs = results[index][1];

            const { exchangeProvider } = ex;
            list.push({
              name: ex.name,
              timeZone: ex.timeZone,
              country: ex.country,
              tPlusDay: ex.tPlusDay,
              tPlusHour: ex.tPlusHour,
              tPlusMinute: ex.tPlusMinute,
              currencies: curr,
              crossTradeCurrency: exchangeProvider.crossTradeCurrency,
              intermediateCurrency: exchangeProvider.intermediateCurrency,
              providerName: exchangeProvider.name,
              externalIdentifierCode: exchangeProvider.externalIdentifierCode,
              margins,
              pairs,
            });
          });

          setExchanges(list);
        }
      );
    });
  };

  const getPartnersByBankName = (partners: any, bankName: any) => {
    const partnerList = partners.filter(
      (partner: any) => partner.bankName === bankName
    );
    return partnerList.map((partner: any) => partner.name);
  };

  const getProgramsByBankName = (programs: any, bankName: any) => {
    const programList = programs.filter(
      (program: any) => program.bankName === bankName
    );
    return programList.map((program: any) => program.name);
  };

  const getBankInfos = async () => {
    const banks = await listBanks();
    const partners = await getPartners();
    const programs = await getPrograms();

    const promises: any = [];
    banks.map((bank: any) =>
      promises.push([getIINs(bank.name), getCurrencies(bank.name)])
    );

    const list: any = [];
    Promise.all(promises.map((promise: any) => Promise.all(promise))).then(
      (results) => {
        banks.forEach((bank: any, index: any) => {
          // putting compliance currency at the beginning of the list
          const indexOf = results[index][1].indexOf(bank.complianceCurrency);
          if (indexOf > 0) {
            results[index][1].splice(indexOf, 1);
          }
          results[index][1].unshift(bank.complianceCurrency);

          list.push({
            id: bank.id,
            name: bank.name,
            iins: results[index][0],
            currencies: [...new Set(results[index][1])],
            complianceCurrency: bank.complianceCurrency,
            partners: getPartnersByBankName(partners, bank.name),
            programs: getProgramsByBankName(programs, bank.name),
          });
        });
        setBankInfoList(list);
      }
    );
  };

  const getInterchangesInfos = async () => {
    if (!canSeeInterchanges) {
      return;
    }
    const interchangeList = await listInterchanges();

    const promises: any = [];
    interchangeList.map((inter: any) =>
      promises.push([
        getInterchangeCurrencies(inter.name),
        getInterchangeIINs(inter.name),
      ])
    );

    const list: any = [];
    Promise.all(promises.map((promise: any) => Promise.all(promise))).then(
      (infos) => {
        interchangeList.map((inter: any, index: any) => {
          const currencies = infos[index][0];
          const iins = infos[index][1];

          list.push({
            name: inter.name,
            currencies,
            iins,
            bankName: inter.bankName,
            creationTime: inter.creationTime,
            modifiedTime: inter.modifiedTime,
            tPlusDay: inter.tPlusDay,
            tPlusHour: inter.tPlusHour,
            tPlusMinute: inter.tPlusMinute,
            timeZone: inter.timeZone,
            country: inter.country,
          });
        });
        setInterchanges(list);
      }
    );
  };

  const bankInfoMetadata = [
    {
      header: (
        <FormattedMessage
          id="name"
          description="Bank name"
          defaultMessage="Name"
        />
      ),
      width: "155px",
      render: (rowData: any) => {
        const { name } = rowData;
        const underscoredName = name.replaceAll(" ", "_");
        return (
          <DrawerComp
            id={`bank-edit-${underscoredName}-link-button`}
            label={name}
            asLink
          >
            <BankDrawer bank={rowData} edit />
          </DrawerComp>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="currencies"
          description="Currencies supported by the bank"
          defaultMessage="Currencies"
        />
      ),
      width: "215px",
      render: (rowData: any) => {
        const { currencies } = rowData;
        const { complianceCurrency } = rowData;
        return (
          <>
            <List disablePadding sx={{ pb: 0.5 }}>
              {currencies !== undefined && currencies.length > 0 ? (
                <li>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item>
                      <CurrencyRender currencyCode={currencies[0]} />
                    </Grid>
                    <Grid item>
                      {complianceCurrency === currencies[0] ? (
                        <>
                          <Box sx={{ marginBottom: "4px" }}>
                            <Pill
                              label={intl.formatMessage({
                                id: "compliance",
                                defaultMessage: "COMPLIANCE",
                              })}
                              variant="green"
                            />
                          </Box>
                          <Box>
                            <Pill
                              label={intl.formatMessage({
                                id: "button.home",
                                defaultMessage: "HOME",
                              })}
                              color="info"
                            />
                          </Box>
                        </>
                      ) : null}
                    </Grid>
                  </Grid>
                </li>
              ) : null}
            </List>
            {currencies !== undefined && currencies.length > 1 ? (
              <TableCellAccordion
                showNumber={currencies.length}
                hideNumber={currencies.length - 1}
              >
                <List sx={{ pt: 0 }}>
                  {currencies.map((currency: any, idx: any) =>
                    idx > 0 ? (
                      <ListItem
                        dense
                        sx={{ px: 0 }}
                        key={`bank.currencies.${currency}.${idx}`}
                      >
                        <CurrencyRender currencyCode={currency} />
                      </ListItem>
                    ) : null
                  )}
                </List>
              </TableCellAccordion>
            ) : null}
          </>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="programs"
          description="Bank programs"
          defaultMessage="Programs"
        />
      ),
      width: "215px",
      render: (rowData: any) => {
        const { programs } = rowData;
        return (
          <>
            <List disablePadding>
              {programs !== undefined && programs.length > 0 ? (
                <li>
                  <TextRender data={programs[0]} />
                </li>
              ) : null}
            </List>
            {programs !== undefined && programs.length > 1 ? (
              <TableCellAccordion
                showNumber={programs.length}
                hideNumber={programs.length - 1}
              >
                <List disablePadding>
                  {programs.map((program: any, idx: any) =>
                    idx > 0 ? (
                      <li>
                        <TextRender data={program} />
                      </li>
                    ) : null
                  )}
                </List>
              </TableCellAccordion>
            ) : null}
          </>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="partners"
          description="Bank partners"
          defaultMessage="Partners"
        />
      ),
      render: (rowData: any) => {
        const { partners } = rowData;
        return (
          <>
            <List disablePadding>
              {partners !== undefined && partners.length > 0 ? (
                <li>
                  <TextRender data={partners[0]} />
                </li>
              ) : null}
            </List>
            {partners !== undefined && partners.length > 1 ? (
              <TableCellAccordion
                showNumber={partners.length}
                hideNumber={partners.length - 1}
              >
                <List disablePadding>
                  {partners.map((partner: any, idx: any) =>
                    idx > 0 ? (
                      <li>
                        <TextRender data={partner} />
                      </li>
                    ) : null
                  )}
                </List>
              </TableCellAccordion>
            ) : null}
          </>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="IINs"
          description="Bank IINs"
          defaultMessage="IINs"
        />
      ),
      render: (rowData: any) => {
        const { iins } = rowData;
        return (
          <>
            <List disablePadding>
              {iins !== undefined && iins.length > 0 ? (
                <li>
                  <TextRender data={iins[0]} />
                </li>
              ) : null}
            </List>
            {iins !== undefined && iins.length > 1 ? (
              <TableCellAccordion
                showNumber={iins.length}
                hideNumber={iins.length - 1}
              >
                <List disablePadding>
                  {iins.map((iin: any, idx: any) =>
                    idx > 0 ? (
                      <li>
                        <TextRender data={iin} />
                      </li>
                    ) : null
                  )}
                </List>
              </TableCellAccordion>
            ) : null}
          </>
        );
      },
    },
    {
      header: <></>,
      render: (rowData: any) => {
        const { name } = rowData;
        const underscoredName = name.replaceAll(" ", "_");
        return (
          <DrawerComp
            id={`bank-edit-${underscoredName}-button`}
            label={intl
              .formatMessage({
                id: "edit",
                description: "Edit bank information",
                defaultMessage: "EDIT",
              })
              .toUpperCase()}
          >
            <BankDrawer bank={rowData} edit />
          </DrawerComp>
        );
      },
    },
  ];

  const exchangeMetadata = [
    {
      header: (
        <FormattedMessage
          id="name"
          description="Exchange name"
          defaultMessage="Name"
        />
      ),
      width: "155px",
      render: (rowData: any) => {
        const { name } = rowData;
        const underscoredName = name.replaceAll(" ", "_");
        return (
          <DrawerComp
            id={`exchange-edit-${underscoredName}-link-button`}
            overrideWidth
            widthPercentage={70}
            label={name}
            asLink
          >
            <EditExchangeDrawer exchange={rowData} />
          </DrawerComp>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="exchangeProvider"
          description="Exchange provider name"
          defaultMessage="Exchange Provider"
        />
      ),
      width: "155px",
      render: (rowData: any) => {
        const { providerName } = rowData;
        return <TextRender data={providerName} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="crossTradeCurrency"
          description="Cross Trade Currency Column"
          defaultMessage="Cross Trade Currency"
        />
      ),
      width: "180px",
      render: (rowData: any) => {
        const { crossTradeCurrency } = rowData;
        return <CurrencyRender currencyCode={crossTradeCurrency} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="intermediateCurrency"
          description="Intermediate Currency Column"
          defaultMessage="Intermediate Currency"
        />
      ),
      width: "180px",
      render: (rowData: any) => {
        const { intermediateCurrency } = rowData;
        return <CurrencyRender currencyCode={intermediateCurrency} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="realTime"
          description="Real Time toggle"
          defaultMessage="Real-Time"
        />
      ),
      width: "150px",
      render: (rowData: any) => <span>--</span>,
    },
    {
      header: (
        <FormattedMessage
          id="externalIdCode"
          description="External Id Code Column"
          defaultMessage="External ID Code"
        />
      ),
      width: "100%",
      render: (rowData: any) => {
        const { externalIdentifierCode } = rowData;
        return <TextRender data={externalIdentifierCode} />;
      },
    },
    {
      header: <></>,
      width: "65px",
      render: (rowData: any) => {
        const { name } = rowData;
        const underscoredName = name.replaceAll(" ", "_");
        return (
          <DrawerComp
            id={`exchange-edit-${underscoredName}-button`}
            overrideWidth
            widthPercentage={70}
            label={intl
              .formatMessage({
                id: "edit",
                description: "Edit exchange information",
                defaultMessage: "EDIT",
              })
              .toUpperCase()}
          >
            <EditExchangeDrawer exchange={rowData} />
          </DrawerComp>
        );
      },
    },
  ];

  const interchangeMetadata = [
    {
      header: (
        <FormattedMessage
          id="name"
          description="Interchange name"
          defaultMessage="Name"
        />
      ),
      width: "155px",
      render: (rowData: any) => {
        const { name } = rowData;
        const underscoredName = name.replaceAll(" ", "_");
        return (
          <DrawerComp
            id={`interchange-edit-${underscoredName}-link-button`}
            label={name}
            asLink
          >
            <InterchangeDrawer interchange={rowData} edit />
          </DrawerComp>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="currencies"
          description="Currencies Column"
          defaultMessage="Currencies"
        />
      ),
      width: "210px",
      render: (rowData: any) => {
        const { currencies } = rowData;
        return (
          <>
            <List disablePadding sx={{ pb: 0.5 }}>
              {currencies !== undefined && currencies.length > 0 ? (
                <li>
                  <CurrencyRender currencyCode={currencies[0]} />
                </li>
              ) : null}
            </List>
            {currencies !== undefined && currencies.length > 1 ? (
              <TableCellAccordion
                showNumber={currencies.length}
                hideNumber={currencies.length - 1}
              >
                <List disablePadding>
                  {currencies.map((currency: any, idx: any) =>
                    idx > 0 ? (
                      <ListItem
                        dense
                        sx={{ px: 0 }}
                        key={`bank.currencies.${currency}.${idx}`}
                      >
                        <CurrencyRender currencyCode={currency} />
                      </ListItem>
                    ) : null
                  )}
                </List>
              </TableCellAccordion>
            ) : null}
          </>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="creationDate"
          description="Creation Date Column"
          defaultMessage="Creation Date"
        />
      ),
      width: "200px",
      render: (rowData: any) => {
        const { creationTime } = rowData;
        return <DateAndTimeConverter epoch={creationTime} monthFormat="long" />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="modifiedDate"
          description="Modified Date column"
          defaultMessage="Modified Date"
        />
      ),
      width: "200px",
      render: (rowData: any) => {
        const { modifiedTime } = rowData;
        return <DateAndTimeConverter epoch={modifiedTime} monthFormat="long" />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="IINs"
          description="IIN Column"
          defaultMessage="IINs"
        />
      ),
      width: "100%",
      render: (rowData: any) => {
        const { iins } = rowData;
        return (
          <>
            <List disablePadding>
              {iins !== undefined && iins.length > 0 ? (
                <li>
                  <TextRender data={iins[0]} />
                </li>
              ) : null}
            </List>
            {iins !== undefined && iins.length > 1 ? (
              <TableCellAccordion
                showNumber={iins.length}
                hideNumber={iins.length - 1}
              >
                <List disablePadding>
                  {iins.map((iin: any, idx: any) =>
                    idx > 0 ? (
                      <li>
                        <TextRender data={iin} />
                      </li>
                    ) : null
                  )}
                </List>
              </TableCellAccordion>
            ) : null}
          </>
        );
      },
    },
    {
      header: <> </>,
      width: "65px",
      render: (rowData: any) => {
        const { name } = rowData;
        const underscoredName = name.replaceAll(" ", "_");
        return (
          <DrawerComp
            id={`interchange-edit-${underscoredName}-button`}
            label={intl
              .formatMessage({
                id: "edit",
                description: "Edit interchange information",
                defaultMessage: "EDIT",
              })
              .toUpperCase()}
          >
            <InterchangeDrawer interchange={rowData} edit />
          </DrawerComp>
        );
      },
    },
  ];

  useEffect(() => {
    getBankInfos().catch((error) => error);
    getInterchangesInfos();
    getExchangesInfos();

    // canSeeBanks, canSeeExchanges, canSeeInterchanges is needed here because the context is slow to load
    // and the value can incorrectly be false the first time the page loads
  }, [canSeeBanks, canSeeExchanges, canSeeInterchanges]);

  useEffect(() => {
    emitter.on("banks.page.update", () => {
      getBankInfos().catch((error) => error);
      getExchangesInfos();
      getInterchangesInfos();
    });
  }, []);

  return (
    <div>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "banks",
            defaultMessage: "Banks",
          })}`}
        </title>
      </Helmet>
      <Container disableGutters>
        {canSeeBanks && (
          <>
            <Grid container justifyContent="space-between">
              <Grid item>
                <Header
                  value={intl.formatMessage({
                    id: "banks",
                    defaultMessage: "Banks",
                  })}
                  level={1}
                  bold
                  pageTitle
                />
              </Grid>
              <Grid item></Grid>
            </Grid>

            <Grid container justifyContent="space-between" sx={{ mb: 2.25 }}>
              <Grid item>
                <Header
                  value={intl.formatMessage({
                    id: "banks",
                    defaultMessage: "Banks",
                  })}
                  level={2}
                  bold
                  color="primary"
                />
              </Grid>
              <Grid item>
                <DrawerComp
                  label={intl
                    .formatMessage({
                      id: "addNewBank",
                      description: "Add new bank button",
                      defaultMessage: "ADD NEW BANK",
                    })
                    .toUpperCase()}
                >
                  <BankDrawer />
                </DrawerComp>
              </Grid>
            </Grid>

            <Box>
              <StandardTable
                id="banks-table"
                dataList={bankInfoList}
                tableMetadata={bankInfoMetadata}
                tableRowPrefix="banksTable"
                className="cellTopAligned"
              />
            </Box>
          </>
        )}
        {canSeeExchanges && (
          <>
            <Grid container justifyContent="space-between" sx={{ mb: 2.25 }}>
              <Grid item>
                <Header
                  value={intl.formatMessage({
                    id: "exchanges",
                    defaultMessage: "Exchanges",
                  })}
                  level={2}
                  bold
                  color="primary"
                />
              </Grid>
              <Grid item>
                <DrawerComp
                  id="banks-add-exchange-button"
                  label={intl
                    .formatMessage({
                      id: "addExchange",
                      description: "Add new exchange button",
                      defaultMessage: "ADD NEW EXCHANGE",
                    })
                    .toUpperCase()}
                >
                  <ExchangeDrawer />
                </DrawerComp>
              </Grid>
            </Grid>

            <Box>
              <StandardTable
                id="exchanges-table"
                dataList={exchanges}
                tableMetadata={exchangeMetadata}
                tableRowPrefix="exchangesTable"
                className="cellTopAligned"
              />
            </Box>
          </>
        )}
        {canSeeInterchanges && (
          <>
            <Grid container justifyContent="space-between" sx={{ mb: 2.25 }}>
              <Grid item>
                <Header
                  value={intl.formatMessage({
                    id: "interchanges",
                    defaultMessage: "Interchanges",
                  })}
                  level={2}
                  bold
                  color="primary"
                />
              </Grid>
              <Grid item>
                <DrawerComp
                  id="banks-add-interchange-button"
                  label={intl
                    .formatMessage({
                      id: "addInterchange",
                      description: "Add new interchange button",
                      defaultMessage: "ADD NEW INTERCHANGE",
                    })
                    .toUpperCase()}
                >
                  <InterchangeDrawer />
                </DrawerComp>
              </Grid>
            </Grid>

            <Box>
              <StandardTable
                id="interchanges-table"
                dataList={interchanges}
                tableMetadata={interchangeMetadata}
                tableRowPrefix="interchangesTable"
                className="cellTopAligned"
              />
            </Box>
          </>
        )}
      </Container>
    </div>
  );
};
export default Banks;
