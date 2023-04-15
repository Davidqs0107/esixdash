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

import React, { lazy, useContext, useEffect, useState, ReactElement } from "react";
import { Box, Container, Grid, Typography, Link } from "@mui/material";
import Helmet from "react-helmet";
import { useIntl, MessageDescriptor } from "react-intl";

import { NavLink, RouteComponentProps } from "react-router-dom";
import api from "../../api/api";
import emitter from "../../emitter";
import BrandingWrapper from "../../app/BrandingWrapper";
import { MessageContext } from "../../contexts/MessageContext";
import Pill from "../../components/common/elements/PillLabel";
import Label from "../../components/common/elements/Label";
import Header from "../../components/common/elements/Header";
import TextRender from "../../components/common/TextRender";
import { PartnerUserContext } from "../../contexts/PartnerUserContext";
import ContainerCard from "../../components/common/containers/ContainerCard";
import OfferingTypeConverter from "../../components/common/converters/OfferingTypeConverter";
import CurrencyRender from "../../components/common/converters/CurrencyRender";
import BreadcrumbsNav from "../../components/common/navigation/BreadcrumbsNav";

const QDButton = lazy(
  () => import("../../components/common/elements/QDButton")
);

// the extends is for the history input
type IPrograms = RouteComponentProps<any>;

const Programs: React.FC<IPrograms> = ({ history }) => {
  const { setErrorMsg } = useContext(MessageContext);
  const partnerUserContext = useContext(PartnerUserContext);
  const isProgramManager = partnerUserContext.roles
    ? partnerUserContext.roles.indexOf("ProgramManager") > -1
    : -1;
  const intl = useIntl();
  const [programList, setProgramList] = useState<any>([]);

  const listPrograms = async () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingAPI.list().catch((error: any) => setErrorMsg(error));


  const getAllProgramInfo = async () => {
    listPrograms().then(async (programs) => {
      const list: any = [];
      programs.forEach((program: any, index: number) => {
        const newProgram = {
          id: program.id,
          name: program.name,
          type: "program",
          partnerName: program.partnerName,
          currencies: program.currencies,
          defaultHomeCurrency: program.defaultHomeCurrency
        };
        list.push(newProgram);
        setProgramList([...list]);
      });
    });
  };

  useEffect(() => {
    getAllProgramInfo().catch((error: any) => setErrorMsg(error));
    emitter.on("programs.changed", () =>
      getAllProgramInfo().catch((e) => setErrorMsg(e))
    );
  }, []);

  const createGridItem = (
    label: MessageDescriptor,
    content: string | ReactElement
  ) => (
    <Grid
      container
      sx={{
        marginBottom: "15px",
        lineHeight: 1,
        "& label.MuiTypography-grey": {},
      }}
      flexDirection="row"
    >
      <Grid item sx={{ width: 75 }}>
        <Label variant="grey" fontWeight={500} size="minor">
          {intl.formatMessage(label)}
        </Label>
      </Grid>
      <Grid item>
        <TextRender
          data={content}
          fontWeight={500}
          variant="labelDark"
        />
      </Grid>
    </Grid>
  );

  return (
    <Container disableGutters>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "programs",
            defaultMessage: "Programs",
          })}`}
        </title>
      </Helmet>
      <Box>
        <BreadcrumbsNav aria-label="breadcrumb" className="withBorder">
            <Label variant="grey">
              {intl.formatMessage({
                id: "programs",
                description: "Programs header",
                defaultMessage: "Programs",
              })}
            </Label>
        </BreadcrumbsNav>
      </Box>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "70px",
          }}
        >
          <Header
            value={intl.formatMessage({
              id: "programs",
              description: "Programs header",
              defaultMessage: "Programs",
            })}
            level={1}
            bold
            color="primary"
          />
          <QDButton
            id="add-program-button"
            name="addProgramButton"
            onClick={() => history.push(`/programs/add`)}
            label={intl.formatMessage({
              id: "programs.button.addNewProgram",
              description: "Add New Program button label",
              defaultMessage: "Add New Program",
            })}
            color="primary"
            variant="contained"
            size="large"
            textCase="provided"
          />
        </Box>

        <Grid container spacing={2.5} columns={3}>
          {programList.map((program: any, index: number) => (
            <>
              <Grid item key={'program-card-' + index}>
                <ContainerCard
                  title={program.name}
                  cardPrefix="program-card-item"
                  cardActions={
                    <NavLink
                      to={`/programs/${program.name}`}
                      style={{
                        color: "#6236FF",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#433EA5",
                          fontSize: "10px",
                          fontWeight: "600",
                          letterSpacing: "0.1px",
                          lineHeight: "12px",
                        }}
                      >
                        {intl.formatMessage({
                          id: "viewAllDetails",
                          defaultMessage: "View all details",
                        })}
                        {" >>"}
                      </Typography>
                    </NavLink>
                  }
                >
                  <Box>
                    {/* {createGridItem(
                      {
                        id: "productType",
                        defaultMessage: "Product type",
                      },
                      <Pill
                        label={intl.formatMessage({
                          id: program.type,
                          defaultMessage: program.type,
                        })}
                        color="info"
                      />
                      //   <Pill
                      //     color={OfferingTypeConverter(program.name, "").pillColor}
                      //     label={OfferingTypeConverter(program.name, "").category}
                      //     />
                    )} */}

                    {createGridItem(
                      {
                        id: "partnername",
                        defaultMessage: "Partner name",
                      },
                      program.partnerName
                    )}

                    {createGridItem(
                      {
                        id: "currency",
                        defaultMessage: "Currency",
                      },
                      <CurrencyRender
                        currencyCode={program.defaultHomeCurrency}
                        flagWidth={"15px"}
                        flagHeight={"15px"}
                        fontWeight={500}
                      />
                    )}
                  </Box>
                </ContainerCard>
              </Grid>
            </>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Programs;
