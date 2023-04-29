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

import React, { ReactElement, useContext, useState, useEffect } from "react";
import {
  MessageDescriptor,
  useIntl,
  defineMessage,
  FormattedMessage,
  FormattedDate,
} from "react-intl";
import { Grid, GridSize, Typography, Container, Box } from "@mui/material";
import Helmet from "react-helmet";
import { ProgramEditContext } from "../../contexts/ProgramEditContext";
import Header from "../../components/common/elements/Header";
import PageNav from "../../components/common/navigation/PageNav";
import navs from "../../components/programs/pagenavs/PagenavIndex";
import BrandingWrapper from "../../app/BrandingWrapper";
import { MessageContext } from "../../contexts/MessageContext";
import { ContentVisibilityContext } from "../../contexts/ContentVisibilityContext";
import api from "../../api/api";
import Link from "@mui/material/Link";
import BreadcrumbsNav from "../../components/common/navigation/BreadcrumbsNav";
import Label from "../../components/common/elements/Label";
import CurrencyCodeToSymbol from "../../components/common/converters/CurrencyCodeToSymbolConverter";
import DrawerComp from "../../components/common/DrawerComp";
import ProgramsBalancesDrawer from "../../components/programs/drawers/ProgramsBalancesDrawer";

interface IProgramDetailContext {}

const ProgramDetail: React.FC<IProgramDetailContext> = () => {
  const intl = useIntl();
  const { programName, program, bank, partner, locales, exchanges } =
    useContext(ProgramEditContext);
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const [pansIssued, setPansIssued] = useState("");
  const [cardProfiles, setCardProfiles] = useState([]);
  const [operatingBalance, setOperatingBalance] = useState<any>();
  const [custodialAccounts, setCustodialAccounts] = useState("");
  const [product, setProduct] = useState<any>(undefined);
  const { canManageMerchantControl } = useContext(ContentVisibilityContext);
  const [shownNavs, setShownNavs] = useState<any>(
    canManageMerchantControl
      ? navs.filter((i) => {
          return i.key != "controls";
        })
      : navs
  );

  const getPansIssued = (programName: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CardAPI.getUniquePanCountsByProgram(programName).catch((error: []) =>
      setErrorMsg(error)
    );

  const getCardProfiles = (name: string) =>
    // @ts-ignore
    api.CardProfileAPI.getCardProfiles(name, null).catch((error: any) =>
      setErrorMsg(error)
    );

  const pansIssuedLabel = defineMessage({
    id: "programs.edit.label.pansIssued",
    description: "Section Label",
    defaultMessage: "PANs Issued",
  });

  const operatingBalanceLabel = defineMessage({
    id: "operatingBalance",
    defaultMessage: "Operating Balance",
  });

  const getOfferingProgram = (programName: string) => {
    // @ts-ignore
    api.ProductAPI.getProgramProduct(programName)
      .then((prod: any) => setProduct(prod.config))
      .catch((err: any) => {
        let filteredNavs = navs.filter((i) => {
          return i.key != "product";
        });

        setShownNavs(filteredNavs);
        setProduct(undefined);
      });
  };

  const getCustodialAccounts = (programName: string) =>
    // @ts-ignore
    api.OperatingAPI.getCustodialPortfolioAccountList(programName).catch(
      (err: any) => {
        setErrorMsg(err);
      }
    );

  const getProgramInfo = async (
    defaultHomeCurrency: any,
    programName: string
  ) => {
    const results = await Promise.all([
      getPansIssued(programName),
      getCustodialAccounts(programName),
      getCardProfiles(programName),
    ]);
    const [pansIssued, custodialAccounts, cardProfiles] = results;
    let count = parseInt(pansIssued.count).toLocaleString();
    setPansIssued(count);

    setCustodialAccounts(custodialAccounts);
    const custodialAccount = custodialAccounts.find(
      (item: any) => item.balance.currencyCode == defaultHomeCurrency
    );
    if (custodialAccount) {
      setOperatingBalance(
        <>
          <CurrencyCodeToSymbol currencyCode={defaultHomeCurrency} />
          {custodialAccount.balance.amount}
        </>
      );
    }

    setCardProfiles(cardProfiles);
  };

  const createGridItem = (
    label: MessageDescriptor,
    content: string | ReactElement,
    size: GridSize,
    subContent?: string | ReactElement,
    action?: ReactElement
  ) => (
    <Grid item xs={size} md={size} lg={size} style={{ marginBottom: "4em" }}>
      <Grid item>
        <Typography
          sx={{
            color: "#152C5B",
            fontFamily: "Montserrat",
            fontSize: "14px",
            letterSpacing: "0",
            lineHeight: "18px",
            marginBottom: "12px",
            fontWeight: 500,
          }}
        >
          {intl.formatMessage(label)}
        </Typography>
      </Grid>
      <Grid item>
        <Typography
          sx={{
            color: "#152C5B",
            fontFamily: "Montserrat",
            fontSize: "24px",
            fontWeight: 600,
            letterSpacing: "0",
            lineHeight: "29px",
          }}
        >
          {content}
        </Typography>
        {subContent && (
          <Typography
            sx={{
              color: "#8995AD",
              marginTop: "4px",
              fontSize: "8px",
            }}
          >
            {subContent}
          </Typography>
        )}
        {action}
      </Grid>
    </Grid>
  );

  useEffect(() => {
    if (programName) {
      getOfferingProgram(programName);

      if (program) {
        getProgramInfo(program.defaultHomeCurrency, programName);
      }
    }
  }, [program, programName]);

  return (
    <div>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "page.title.editProgram",
            defaultMessage: "Edit Program",
          })}`}
        </title>
      </Helmet>
      <Container disableGutters>
        <Grid container sx={{ mt: 2, p: "50px 62px 0" }}>
          <Grid item xs={12} md={12} lg={12}>
            <BreadcrumbsNav aria-label="breadcrumb" className="withBorder">
              <Link href="/programs" underline="none">
                {intl.formatMessage({
                  id: "programs",
                  defaultMessage: "Programs",
                })}
              </Link>
              <Typography>{programName}</Typography>
            </BreadcrumbsNav>
          </Grid>

          <Grid item xs={12} md={12} lg={12} sx={{ marginBottom: "41px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Header value={programName} level={1} bold />
              <Box sx={{ textAlign: "right" }}>
                <Box
                  sx={{ display: "flex", gap: "4px", justifyContent: "end" }}
                >
                  <Label size="minor" variant="grey">
                    <FormattedMessage id="created" defaultMessage="Created" />:
                  </Label>
                  <Label size="minor">
                    <FormattedDate
                      value={new Date(program.creationTime)}
                      year="numeric"
                      month="long"
                      day="2-digit"
                    />
                  </Label>
                </Box>
                <Box
                  sx={{ display: "flex", gap: "4px", justifyContent: "end" }}
                >
                  <Label size="minor" variant="grey">
                    <FormattedMessage
                      id="lastUpdated"
                      defaultMessage="Last updated"
                    />
                    :
                  </Label>
                  <Label size="minor">
                    <FormattedDate
                      value={new Date(program.modifiedTime)}
                      year="numeric"
                      month="long"
                      day="2-digit"
                    />
                  </Label>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <Grid container>
              {createGridItem(
                operatingBalanceLabel,
                operatingBalance,
                3,
                intl.formatMessage(
                  {
                    id: "andCustodialAccountsOthers",
                    defaultMessage: `And ${custodialAccounts.length.toLocaleString()} others`,
                  },
                  {
                    fieldName: intl.formatMessage({
                      id: "custodialAccountsCount",
                      defaultMessage: custodialAccounts.length.toLocaleString(),
                    }),
                  }
                ),
                <Box sx={{ marginTop: "18px" }}>
                  <DrawerComp
                    asLink
                    bodyInteractive="small"
                    label={`${intl.formatMessage({
                      id: "viewAllCurrencies",
                      defaultMessage: "View all currencies",
                    })} >>`}
                    buttonStyle={{ lineHeight: "15px" }}
                    truncateAt={60}
                    disableHorizontalScroll
                  >
                    <ProgramsBalancesDrawer
                      custodialAccounts={custodialAccounts}
                      defaultHomeCurrency={program.defaultHomeCurrency}
                      toggleDrawer={() => true}
                    />
                  </DrawerComp>
                </Box>
              )}
              {createGridItem(
                pansIssuedLabel,
                pansIssued,
                3,
                intl.formatMessage(
                  {
                    id: "acrossCardProfiles",
                    defaultMessage: `Across ${cardProfiles.length.toLocaleString()} card profiles`,
                  },
                  {
                    fieldName: intl.formatMessage({
                      id: "cardProfilesCount",
                      defaultMessage: cardProfiles.length.toLocaleString(),
                    }),
                  }
                )
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          sx={{
            p: "14px 62px 0",
            backgroundColor: "#F7FAFF",
            minHeight: "599px",
          }}
        >
          <Grid item xs={12} md={12} lg={12}>
            <PageNav
              components={shownNavs}
              sessionKey="programDetailTab"
              variant="outlined"
              defaultTab={shownNavs[0].key}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ProgramDetail;
