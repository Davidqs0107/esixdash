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

import React, { useCallback, useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { NavLink, useParams } from "react-router-dom";
import Helmet from "react-helmet";
import { FormattedDate, useIntl, defineMessage } from "react-intl";
import { useQuery } from "@tanstack/react-query";

import api from "../../api/api";
import CardBlocks from "../../components/customer/CardBlocks";
import PageNav from "../../components/common/navigation/PageNav";
import { toCustomerName } from "../../components/common/converters/CustomerNameConverter";

import navs from "../../components/customer/pagenavs/PagenavIndex";
import CustomerRecentActivity from "../../components/customer/CustomerRecentActivity";
import StandardTable from "../../components/common/table/StandardTable";
import CustomerDetailContextProvider from "../../contexts/CustomerDetailContext";
import CurrencyRender from "../../components/common/converters/CurrencyRender";
import TextRender from "../../components/common/TextRender";
import TxSourceConverter from "../../components/common/converters/TxSourceConverter";
import FormatRecentActivity from "../../components/common/converters/RecentActivityConverter";
import emitter from "../../emitter";
import DateAndTimeConverter from "../../components/common/converters/DateAndTimeConverter";
import CustomerRiskLevelCard from "../../components/customer/CustomerRiskLevelCard";
import AccountHoldersCard from "../../components/customer/AccountHoldersCard";
import CustomerRiskLevelDrawerContextProvider from "../../contexts/CustomerRiskLevelDrawerContext";
import { MessageContext } from "../../contexts/MessageContext";
import BrandingWrapper from "../../app/BrandingWrapper";
import DrawerComp from "../../components/common/DrawerComp";
import Pill from "../../components/common/elements/PillLabel";
import QDFormattedCurrency from "../../components/common/converters/QDFormattedCurrency";
import Icon from "../../components/common/Icon";
import ReadableErrorMessage from "../../components/common/converters/ReadableErrorMessage";
import TxTypeConverter from "../../components/common/converters/TxTypeConverter";
import BreadcrumbsNav from "../../components/common/navigation/BreadcrumbsNav";
import CreateChangeOrder from "../../components/customer/drawers/CreateChangeOrderDrawer";
import { ContentVisibilityContext } from "../../contexts/ContentVisibilityContext";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Header from "../../components/common/elements/Header";
import Text from "../../components/common/elements/Text";
import Label from "../../components/common/elements/Label";
import CustomerFeePlanDrawer from "../../components/customer/drawers/CustomerFeePlanDrawer";
import FeePlanEntriesLevelTwoDrawer from "../../components/customer/drawers/level-two/FeePlanEntriesLevelTwoDrawer";
import CustomerFeePlanDrawerContextProvider from "../../contexts/CustomerFeePlanDrawerContext";
import toCountryName from "../../components/common/converters/CountryNameConverter";
import FormattedMessage from "../../components/common/FormattedMessage";
import { store } from "../../store";
import { OfferingCustomerSummary } from "../../types/customer";
import AccountHoldersContext from "../../contexts/account-holders/AccountHoldersContext";

const CustomerDetail = (props: any) => {
  const { setErrorMsg } = useContext(MessageContext);
  const { canSeeCustomerMemos } = useContext(ContentVisibilityContext);
  const { setIsAccountHolder, setPrimaryPerson } = useContext(
    AccountHoldersContext
  );
  const state = store.getState();
  const roles = state.account?.user?.roles;

  const [customer, setCustomer] = useState<any>(null);
  const [addresses, setAddresses] = useState([]);
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [allowedNavs, setAllowedNavs] = useState<any>();
  const [children, setChildren] = useState([]);
  const [declinedTxs, setDeclinedTxs] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [countries, setCountries] = useState([]);
  const [templates, setTemplates] = useState<any>([]);
  const [defaultTab, setDefaultTab] = useState("cards");
  const [parentCustomer, setParentCustomer] = useState<any>(null);

  const intl = useIntl();
  // @ts-ignore
  const customerNumber = useParams().id;

  const { history } = props;

  const { data: getCountryList2Data } = useQuery({
    queryKey: ["getCountryList2"],
    queryFn: () =>
      // @ts-ignore
      api.CommonAPI.getCountryList2(),
    onError: (error: any) => setErrorMsg(error),
  });

  const getCustomer = async (customerIdentifier: any) => {
    // @ts-ignore
    const customer = await api.CustomerAPI.get(customerIdentifier).catch(() =>
      history.push("/customer")
    );
    // @ts-ignore
    const custParent = await api.CustomerAPI.getCustomerParent(
      customerIdentifier
    ).catch(() => history.push("/customer"));

    setCustomer(customer);
    setParentCustomer(custParent);

    return customer;
  };

  const getCustomerAddresses = (personId: string) =>
    // @ts-ignore
    api.PersonAPI.getAddress(personId).catch(() => null);

  const getCustomerEmails = (personId: string) =>
    // @ts-ignore
    api.PersonAPI.getEmailList(personId).catch(() => null);

  const getCustomerPhones = (personId: string) =>
    // @ts-ignore
    api.PersonAPI.getPhones(personId).catch(() => null);

  // eslint-disable-next-line max-len
  const getCustomerChildren = () =>
    // @ts-ignore
    api.CustomerAPI.getCustomerChildren(customerNumber, {})
      .then((response: { data: any }) => response?.data)
      .catch(() => []);

  const getDeclinedTransactions = (customerId: string) =>
    // @ts-ignore
    api.TransactionAPI.listDeclinedTransactions({
      portfolioId: customerId,
      limit: 5,
    })
      .then((response: { results: any }) => response?.results)
      .catch((error: Error) => {
        setErrorMsg(error);
        return [];
      });

  const fixDateTime = (creationTime: string | number | Date | undefined) =>
    `${intl.formatDate(creationTime)}, ${intl.formatTime(creationTime)}`;

  const getRecentActivity = (customerId: string) =>
    // @ts-ignore
    api.CustomerAPI.activity(customerId)
      .then((response: { data: any }) => {
        return response?.data
          ?.map((item: any) => ({
            id: item.id,
            title: fixDateTime(item.creationTime),
            type: item.type,
            memo: FormatRecentActivity(item.type, intl),
          }))
          ?.slice(0, 10);
      })
      .catch((error: Error) => {
        setErrorMsg(error);
        return [];
      });

  const getCustomerOfferings = (customerNumber: any, callback: any) => {
    let hasCustomerOffering = false;
    let isCreditCardCustomer = false;
    let isInstallmentsCustomer = false;

    // @ts-ignore
    api.ProductAPI.getOfferingCustomer(customerNumber)
      .then((product: OfferingCustomerSummary) => {
        if (product) {
          hasCustomerOffering = true;
          if (product.offeringPluginClass == "CreditCard") {
            isCreditCardCustomer = true;
          }
          if (product.offeringPluginClass == "Installments") {
            isInstallmentsCustomer = true;
          }
        }
        callback &&
          callback(hasCustomerOffering, {
            isCreditCardCustomer: isCreditCardCustomer,
            isInstallmentsCustomer: isInstallmentsCustomer,
          });
      })
      .catch((exception: any) => {
        console.log(
          `Adjustments will not be viewable because: ${JSON.stringify(
            exception,
            null,
            2
          )}`
        );

        callback &&
          callback(hasCustomerOffering, {
            isCreditCardCustomer: isCreditCardCustomer,
            isInstallmentsCustomer: isInstallmentsCustomer,
          });
      });
  };

  const declinedTxMeta = [
    {
      width: "20%",
      header: (
        <FormattedMessage
          id="date"
          description="Date of declined tx"
          defaultMessage="Date"
        />
      ),
      render: (rowData: any) => (
        <DateAndTimeConverter
          epoch={rowData?.creationTime}
          monthFormat="2-digit"
        />
      ),
    },
    {
      width: "20%",
      header: (
        <FormattedMessage
          id="source"
          description="Source of declined tx"
          defaultMessage="Source"
        />
      ),
      render: (rowData: any) =>
        rowData.merchant ? (
          <span>{rowData.merchant}</span>
        ) : (
          <TxSourceConverter txSourceCode={rowData.transactionSourceCode} />
        ),
    },
    {
      width: "20%",
      header: (
        <FormattedMessage
          id="reason"
          description="Reason of declined tx"
          defaultMessage="Reason"
        />
      ),
      render: (rowData: any) => {
        const { responseCode, transactionTypeCode } = rowData;
        return responseCode !== undefined ? (
          <TextRender data={ReadableErrorMessage(responseCode, intl)} />
        ) : (
          <TxTypeConverter txTypeCode={transactionTypeCode} />
        );
      },
    },
    {
      width: "20%",
      header: (
        <FormattedMessage
          id="currency"
          description="Currency of declined tx"
          defaultMessage="Currency"
        />
      ),
      render: (rowData: any) =>
        rowData.currency ? (
          <CurrencyRender currencyCode={rowData.currency} />
        ) : (
          <span>--</span>
        ),
    },
    {
      width: "20%",
      header: (
        <FormattedMessage
          id="amount"
          description="Amount of declined tx"
          defaultMessage="Amount"
        />
      ),
      render: (rowData: any) =>
        rowData.amount !== undefined ? (
          <QDFormattedCurrency
            currency={rowData.currency}
            amount={rowData.amount}
          />
        ) : (
          <span>--</span>
        ),
    },
  ];

  const setNavs = (
    hasCustomerOffering: boolean,
    isCreditCardCustomer: boolean,
    isInstallmentsCustomer: boolean
  ) => {
    let allowedNavs = navs;
    let offeringNavs = ["product", "financials"];
    if (hasCustomerOffering) {
      if (isCreditCardCustomer) {
        allowedNavs = allowedNavs.filter(
          (nav) => !["wallets", "financials"].includes(nav.key)
        );
      } else if (isInstallmentsCustomer) {
        allowedNavs = allowedNavs.filter(
          (nav) => !["wallets", "product"].includes(nav.key)
        );
      }
    } else {
      allowedNavs = allowedNavs.filter(
        (nav) => !offeringNavs.includes(nav.key)
      );
    }
    setAllowedNavs(allowedNavs);
  };

  const getFilteredNavs = (customerNumber: any) => {
    if (!(roles.length == 1 && roles.includes("CustomerAgent"))) {
      getCustomerOfferings(
        customerNumber,
        (
          hasCustomerOffering: boolean,
          { isCreditCardCustomer, isInstallmentsCustomer }: any
        ) => {
          if (isCreditCardCustomer) {
            setDefaultTab("cards");
          } else if (isInstallmentsCustomer) {
            setDefaultTab("financials");
          }
          setNavs(
            hasCustomerOffering,
            isCreditCardCustomer,
            isInstallmentsCustomer
          );
        }
      );
    } else {
      setNavs(false, false, false);
    }
  };

  const getCustomerInfo = useCallback(
    (customerNumber: any) => {
      getCustomer(customerNumber).then((customer) => {
        const person = customer.primaryPerson;

        Promise.all([
          getCustomerAddresses(person.id),
          getCustomerEmails(person.id),
          getCustomerPhones(person.id),
          getCustomerChildren(),
          getDeclinedTransactions(customer.id),
          getRecentActivity(customer.id),
        ]).then(
          ([
            addresses,
            emails,
            phones,
            children,
            declinedTransactions,
            activities,
          ]) => {
            setPrimaryPerson({
              ...person,
              address: addresses,
              emails: emails,
              contact: phones,
            });

            setAddresses(addresses);
            setEmails(emails);
            setPhones(phones);
            setChildren(children);
            setDeclinedTxs(declinedTransactions);
            setRecentActivity(activities);
          }
        );
      });
    },
    [customerNumber]
  );

  useEffect(() => {
    getCustomerInfo(customerNumber);

    emitter.on("customer.details.changed", () =>
      getCustomerInfo(customerNumber)
    );

    getFilteredNavs(customerNumber);

    emitter.on("customer.billing.history.changed", (data: any) => {
      emitter.emit("common.navigation.changed", data);
    });
  }, [customerNumber, roles]);

  useEffect(() => {
    if (parentCustomer) {
      getFilteredNavs(parentCustomer.customerNumber);
    }
  }, [parentCustomer]);

  useEffect(() => {
    if (getCountryList2Data) {
      setCountries(
        getCountryList2Data.map((c: any) => ({ text: c.name, code: c.code }))
      );
    }
  }, [getCountryList2Data]);

  useEffect(() => {
    setIsAccountHolder(false);
  }, []);

  // @ts-ignore
  return (
    <>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "customerDetail",
            defaultMessage: "Customer Detail",
          })}`}
        </title>
      </Helmet>
      <CustomerDetailContextProvider>
        <Box>
          <Grid container>
            <Grid item xs={12} md={12} lg={12}>
              <Box>
                <BreadcrumbsNav aria-label="breadcrumb" className="withBorder">
                  <Link href="/customer" underline="none">
                    {intl.formatMessage({
                      id: "customers",
                      defaultMessage: "customers",
                    })}
                  </Link>
                  <Label variant="grey" fontWeight={400}>
                    {customerNumber}
                  </Label>
                </BreadcrumbsNav>
              </Box>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginTop: "30px", marginBottom: "49px" }}
              >
                <Grid item>
                  <Typography variant="h1">
                    {toCustomerName(customer)}
                  </Typography>
                  <Typography
                    style={{
                      color: "#515969",
                      fontSize: "14px",
                      lineHeight: "16px",
                    }}
                  >
                    {" "}
                    {customer != null &&
                    customer.primaryPerson.nickName !== undefined &&
                    customer.primaryPerson.nickName.length > 0 ? (
                      <span>{`'${customer.primaryPerson.nickName}'`}</span>
                    ) : null}
                  </Typography>
                </Grid>
                <Grid item>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        marginBottom: "16px",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      <Label variant="grey" fontWeight={400}>
                        {intl.formatMessage(
                          defineMessage({
                            id: "createdDate",
                            defaultMessage: "Created Date",
                          })
                        )}
                      </Label>
                      {customer != null ? (
                        <Label fontWeight={400}>
                          <FormattedDate
                            value={new Date(customer.creationTime)}
                            year="numeric"
                            month="long"
                            day="2-digit"
                          />
                        </Label>
                      ) : null}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        marginBottom: "16px",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      <Label variant="grey" fontWeight={400}>
                        {intl.formatMessage(
                          defineMessage({
                            id: "lastModified",
                            defaultMessage: "Last Modified",
                          })
                        )}
                      </Label>
                      {customer != null ? (
                        <Label fontWeight={400}>
                          <FormattedDate
                            value={new Date(customer.modifiedTime)}
                            year="numeric"
                            month="long"
                            day="2-digit"
                          />
                        </Label>
                      ) : null}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item lg={3}>
              <Box sx={{ minHeight: "218px" }}>
                {customer ? <CardBlocks customer={customer} /> : null}
              </Box>
              <Box>
                <AccountHoldersCard
                  customer={customer}
                  cxIdent={customerNumber}
                />
              </Box>
            </Grid>
            <Grid item lg={6}>
              <Box
                sx={{
                  minHeight: "172px",
                  "& a": {
                    letterSpacing: "0.1px",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <Header
                    level={2}
                    bold
                    color="primary"
                    value={intl.formatMessage(
                      defineMessage({
                        id: "customerDetails",
                        defaultMessage: "Customer Details",
                      })
                    )}
                  />
                  <NavLink to={`/customer/${customerNumber}/edit`}>
                    <Label
                      fontWeight={600}
                      lineHeight="12px"
                      size="body"
                      variant="link"
                    >
                      {intl.formatMessage({
                        id: "viewCustomerDetails",
                        defaultMessage: "View Customer Details",
                      })}
                      {" >>"}
                    </Label>
                  </NavLink>
                </Box>
                <Grid container spacing={2} sx={{ minHeight: "188px" }}>
                  <Grid item lg={5}>
                    {addresses.map((addr: any) => (
                      <Box
                        key={addr.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          paddingBottom: "15px",
                          alignItems: "baseline",
                          marginTop: "-4px",
                        }}
                      >
                        <Grid container flexDirection="column">
                          <Label size="body" lineHeight="15px" fontWeight={400}>
                            {addr.line1}
                          </Label>
                          {addr.line2 ? (
                            <Label
                              size="body"
                              lineHeight="15px"
                              fontWeight={400}
                            >
                              {addr.line2}
                            </Label>
                          ) : null}
                          {addr.line3 ? (
                            <Label
                              size="body"
                              lineHeight="15px"
                              fontWeight={400}
                            >
                              {addr.line3}
                            </Label>
                          ) : null}
                          <Label size="body" lineHeight="15px" fontWeight={400}>
                            {[
                              addr.neighborhood,
                              addr.city,
                              addr.state,
                              addr.postalCode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </Label>
                          <Label size="body" lineHeight="15px" fontWeight={400}>
                            {toCountryName(addr.country, countries)}
                          </Label>
                        </Grid>
                        <Box>
                          <Pill
                            label={<FormattedMessage id={addr.type} />}
                            variant="red"
                          ></Pill>
                        </Box>
                      </Box>
                    ))}
                  </Grid>
                  <Grid item lg={7}>
                    {emails.map((e: any) => (
                      <Box
                        key={e.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                          marginBottom: "15px",
                          lineHeight: "15px",
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "baseline" }}>
                          {e.state === "verified" && (
                            <Box sx={{ marginRight: "5px" }}>
                              <img
                                src={Icon.verifiedCheckmark}
                                height={12}
                                width={12}
                                alt="checkmark"
                              />
                            </Box>
                          )}
                          <Typography
                            sx={{
                              color: "#152C5B",
                              fontSize: "10px",
                            }}
                          >
                            {e.email}
                          </Typography>
                        </Box>
                        <Pill
                          label={<FormattedMessage id={e.type} />}
                          variant="yellow"
                        ></Pill>
                      </Box>
                    ))}
                    {phones.map((p: any) => (
                      <Box
                        key={p.id}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "15px",
                          lineHeight: "15px",
                        }}
                      >
                        <Box>
                          <Typography
                            sx={{
                              color: "#152C5B",
                              fontSize: "10px",
                            }}
                          >
                            {`+${p.countryCode} ${p.phoneNumber}`}
                          </Typography>
                        </Box>
                        <Pill
                          label={
                            <FormattedMessage
                              id={p.type == "mob" ? "mobile" : p.type}
                            />
                          }
                          variant="red"
                        ></Pill>
                      </Box>
                    ))}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "15px",
                        lineHeight: "15px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#152C5B",
                          fontSize: "10px",
                        }}
                      >
                        {customer?.language === undefined ? (
                          "--"
                        ) : (
                          <>
                            {intl.formatDisplayName(customer?.language, {
                              type: "language",
                            }) || ""}
                          </>
                        )}
                      </Typography>
                      <Pill
                        label={
                          <FormattedMessage
                            id="preferredLanguage"
                            defaultMessage="Preferred Language"
                          />
                        }
                        variant="blue"
                      ></Pill>
                    </Box>
                    {/* @ts-ignore */}
                    <List
                      key="fee-plan"
                      sx={{
                        display: "flex",
                        padding: 0,
                        lineHeight: "15px",
                        marginBottom: "15px",
                      }}
                      type="inline"
                    >
                      <ListItem sx={{ padding: 0 }}>
                        {/* @ts-ignore */}
                        <CustomerFeePlanDrawerContextProvider>
                          <DrawerComp
                            id="customer-fee-plan-drawer"
                            LevelTwo={FeePlanEntriesLevelTwoDrawer}
                            asLink
                            label={`${customer?.feePlanName} >>`}
                            widthPercentage={70}
                            bodyInteractive="small"
                          >
                            <CustomerFeePlanDrawer />
                          </DrawerComp>
                        </CustomerFeePlanDrawerContextProvider>
                      </ListItem>
                      <ListItem sx={{ padding: 0, justifyContent: "end" }}>
                        <Pill label="Fee Plan" />
                      </ListItem>
                    </List>
                    {/* @ts-ignore */}
                    <List
                      key="risk-level"
                      sx={{
                        display: "flex",
                        padding: 0,
                        lineHeight: "15px",
                        marginBottom: "15px",
                      }}
                      type="inline"
                    >
                      <ListItem sx={{ padding: 0 }}>
                        <CustomerRiskLevelDrawerContextProvider>
                          <CustomerRiskLevelCard customer={customer} />
                        </CustomerRiskLevelDrawerContextProvider>
                      </ListItem>
                      <ListItem sx={{ padding: 0, justifyContent: "end" }}>
                        <Pill label="Risk Level" />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Box>
              <Box>
                <Box sx={{ mb: 2.25 }}>
                  <Header
                    level={2}
                    bold
                    color="primary"
                    value={intl.formatMessage(
                      defineMessage({
                        id: "declinedActivity",
                        defaultMessage: "Declined Activity",
                      })
                    )}
                  />
                </Box>
                <StandardTable
                  id="customer-detail-table"
                  tableRowPrefix="customer-detail"
                  dataList={declinedTxs}
                  tableMetadata={declinedTxMeta}
                />
              </Box>
            </Grid>
            <Grid item xs={3} md={3} lg={3}>
              <Header
                level={2}
                bold
                color="primary"
                value={intl.formatMessage(
                  defineMessage({
                    id: "recentActivity",
                    defaultMessage: "Recent Activity",
                  })
                )}
              />
              <Box>
                <CustomerRecentActivity
                  listPrefix="recent-activity"
                  activity={recentActivity}
                />
              </Box>
            </Grid>
          </Grid>
          <Box>
            {customer !== null ? (
              <PageNav
                components={allowedNavs}
                customerNumber={customerNumber}
                primaryPersonId={customer.primaryPerson.id}
                portfolioId={customer.id}
                sessionKey={`customerDetailTab-${customerNumber}`}
                defaultTab={defaultTab}
                programName={customer.programName}
                homeCurrency={customer.homeCurrency}
                parentCustomerNumber={
                  parentCustomer ? parentCustomer.customerNumber : null
                }
              />
            ) : null}
          </Box>
        </Box>
      </CustomerDetailContextProvider>
    </>
  );
};

export default CustomerDetail;
