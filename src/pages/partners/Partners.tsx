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

import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { Box, Grid, Container, Typography, List } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { useQuery } from "@tanstack/react-query";
import CountryRender from "../../components/common/converters/CountryRender";
import StandardTable from "../../components/common/table/StandardTable";
import api from "../../api/api";
import PartnerDrawer from "../../components/partners/drawers/PartnerDrawer";
import TextRender from "../../components/common/TextRender";
import DrawerComp from "../../components/common/DrawerComp";
import emitter from "../../emitter";
import TableCellAccordion from "../../components/common/forms/accordions/TableCellAccordion";
import BrandingWrapper from "../../app/BrandingWrapper";
import Label from "../../components/common/elements/Label";
import Header from "../../components/common/elements/Header";
import { ContentVisibilityContext } from "../../contexts/ContentVisibilityContext";
import { MessageContext } from "../../contexts/MessageContext";
import { PartnerUserContext } from "../../contexts/PartnerUserContext";
import LanguageToIntl from "../../components/common/converters/LanguageToIntl";

const Partners = () => {
  const partnerPageSize = 10;
  const [partnerDto, setPartnerDto] = useState({
    startIndex: 0,
    count: partnerPageSize,
    inactiveLast: true,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [partnerList, setPartnerList] = useState([]);
  const [countryList, setCountryList] = useState<string[]>([]);
  const { canSeeLinkedPartners } = useContext(ContentVisibilityContext);
  const { setErrorMsg } = useContext(MessageContext);
  const partnerUserContext = useContext(PartnerUserContext);
  const isProgramManager =
    partnerUserContext.roles &&
    partnerUserContext.roles.indexOf("ProgramManager") > -1;
  const partnerUserPartnerName = partnerUserContext.partnerName;
  const intl = useIntl();

  const { data: getCountryList2Data } = useQuery({
    queryKey: ["getCountryList2"],
    queryFn: () =>
      // @ts-ignore
      api.CommonAPI.getCountryList2(),
    onError: (error: any) => setErrorMsg(error),
  });

  const getPartners = async () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.list()
      .then((results: any) => {
        if (partnerUserContext.roles.length === 1 && isProgramManager) {
          // if their only role is program manager, they only see the details of their own partner
          return results.filter((r: any) => r.name === partnerUserPartnerName);
        }
        return results;
      })
      .catch((error: any) => error);
  const getLinkedPartners = async (partnerName: any) => {
    if (canSeeLinkedPartners) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return api.PartnerAPI.listLinkedPartners2(partnerName).catch((error) => {
        if (!isProgramManager) setErrorMsg(error);
      });
    }
    return [];
  };

  const getLinkedPrograms = async (partnerName: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.getPartnerPrograms(partnerName);

  const getPartnerInfo = async () => {
    const partners = await getPartners();

    const promises: any = [];
    partners.map((partner: any) =>
      promises.push([
        getLinkedPartners(partner.name),
        getLinkedPrograms(partner.name),
      ])
    );

    const list: any = [];
    Promise.all(promises.map((promise: any) => Promise.all(promise))).then(
      (results) => {
        partners.forEach((partner: any, index: any) => {
          partner.linkedPartners = results[index][0];
          partner.linkedPrograms = results[index][1];
          list.push(partner);
        });
        setPartnerList(list);
      }
    );
  };

  const partnerInfoMetadata = [
    {
      header: (
        <FormattedMessage
          id="name"
          description="The partner name"
          defaultMessage="Name"
        />
      ),
      width: "200px",
      render: (rowData: any) => {
        const { name } = rowData;
        return (
          <DrawerComp buttonProps="ml-0" label={name} asLink>
            <PartnerDrawer partner={rowData} edit />
          </DrawerComp>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="locale"
          description="The locale for this partner"
          defaultMessage="Locale"
        />
      ),
      width: "160px",
      render: (rowData: any) => {
        const { country } = rowData;
        return (
          <Label>
            {country && (
              <CountryRender countryCode={country} countryList={countryList} />
            )}
          </Label>
        );
      },
    },
    {
      header: <FormattedMessage id="language" defaultMessage="Language" />,
      width: "155px",
      render: (rowData: any) => {
        const { language } = rowData;
        return <Label>{language && <LanguageToIntl value={language} />}</Label>;
      },
    },
    {
      header: (
        <FormattedMessage
          id="bank"
          description="The linked bank"
          defaultMessage="Bank"
        />
      ),
      render: (rowData: any) => {
        const { bankName } = rowData;
        return <TextRender data={bankName} />;
      },
    },
    {
      header: (
        <FormattedMessage
          id="linkedPrograms"
          description="Linked Programs"
          defaultMessage="Linked Programs"
        />
      ),
      render: (rowData: any) => {
        const { linkedPrograms } = rowData;
        return (
          <>
            <List disablePadding>
              {linkedPrograms !== undefined && linkedPrograms.length > 0 ? (
                <li>
                  <TextRender data={linkedPrograms[0].programName} />
                </li>
              ) : null}
            </List>
            {linkedPrograms !== undefined && linkedPrograms.length > 1 ? (
              <TableCellAccordion
                showNumber={linkedPrograms.length}
                hideNumber={linkedPrograms.length - 1}
                showIcon={false}
              >
                <List disablePadding>
                  {linkedPrograms.map((currency: any, idx: any) =>
                    idx > 0 ? (
                      <li key={`li.linkedPrograms.${idx}`}>
                        <TextRender data={linkedPrograms[idx].programName} />
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
          id="linkedPartners"
          description="Linked Partners"
          defaultMessage="Linked Partners"
        />
      ),
      render: (rowData: any) => {
        const { linkedPartners } = rowData;
        return (
          <>
            <List disablePadding>
              {linkedPartners !== undefined && linkedPartners.length > 0 ? (
                <li>
                  <TextRender data={linkedPartners[0].name} />
                </li>
              ) : null}
            </List>
            {linkedPartners !== undefined && linkedPartners.length > 1 ? (
              <TableCellAccordion
                showNumber={linkedPartners.length}
                hideNumber={linkedPartners.length - 1}
                showIcon={false}
              >
                <List disablePadding>
                  {linkedPartners.map((currency: any, idx: any) =>
                    idx > 0 ? (
                      <li key={`li.linkedPartners.${idx}`}>
                        <TextRender data={linkedPartners[idx].name} />
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
      width: "50px",
      render: (rowData: any) => (
        <DrawerComp
          id={`partner-edit-${rowData.name}-button`}
          label={intl
            .formatMessage({
              id: "edit",
              defaultMessage: "EDIT",
            })
            .toUpperCase()}
        >
          <PartnerDrawer partner={rowData} edit />
        </DrawerComp>
      ),
    },
  ];

  useEffect(() => {
    getPartnerInfo().catch((e) => e);

    emitter.on("partner.created", () => {
      getPartnerInfo().catch((e) => e);
    });
    // canSeeLinkedPartners is needed here because the context is slow to load
  }, [canSeeLinkedPartners]);

  useEffect(() => {
    if (getCountryList2Data) {
      setCountryList(
        getCountryList2Data.map((c: any) => ({ text: c.name, code: c.code }))
      );
    }
  }, [getCountryList2Data]);

  return (
    <Container disableGutters>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "partners",
            defaultMessage: "Partners",
          })}`}
        </title>
      </Helmet>

      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.25 }}
      >
        <Grid item>
          <Header
            value={intl.formatMessage({
              id: "partners",
              defaultMessage: "Partners",
            })}
            level={1}
            bold
          />
        </Grid>
        <Grid item>
          <DrawerComp
            // numberOfSteps={2}
            label={intl
              .formatMessage({
                id: "addNewPartner",
                description: "Add new partner information",
                defaultMessage: "Add New Partner",
              })
              .toUpperCase()}
            size="small"
            textCase="provided"
          >
            <PartnerDrawer />
          </DrawerComp>
        </Grid>
      </Grid>

      <Box>
        <StandardTable
          dataList={partnerList}
          tableMetadata={partnerInfoMetadata}
          dto={partnerDto}
          setDto={setPartnerDto}
          // pageSize={partnerPageSize}
          // totalCount={totalCount}
          // pagesCount={Math.ceil(totalCount / partnerPageSize)}
          id="partners-table"
          tableRowPrefix="partners-table"
          className="cellTopAligned"
        />
      </Box>
    </Container>
  );
};

export default Partners;
