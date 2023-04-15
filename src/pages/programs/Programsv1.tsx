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

import React, { lazy, useContext, useEffect, useState } from "react";
import { Box, Container } from "@mui/material";
import Helmet from "react-helmet";
import { FormattedMessage, useIntl } from "react-intl";

import { NavLink, RouteComponentProps } from "react-router-dom";
import api from "../../api/api";
import ProgramsRiskLevelDrawer from "../../components/programs/drawers/ProgramsRiskLevelDrawer";
import DrawerComp from "../../components/common/DrawerComp";
import ProgramRiskParamsLevelTwo from "../../components/programs/drawers/level-two/ProgramRiskParamsLevelTwo";
import ProgramDetailContextProvider from "../../contexts/ProgramDetailContext";
import StandardTable from "../../components/common/table/StandardTable";
import ProgramsFeesDrawer from "../../components/programs/drawers/ProgramsFeesDrawer";
import ProgramFeeLevelTwo from "../../components/programs/drawers/level-two/ProgramFeeLevelTwo";
import emitter from "../../emitter";
import BrandingWrapper from "../../app/BrandingWrapper";
import { MessageContext } from "../../contexts/MessageContext";
import PartnerDrawer from "../../components/partners/drawers/PartnerDrawer";
import BankDrawer from "../../components/banks/drawers/BankDrawer";
import Pill from "../../components/common/elements/PillLabel";
import Label from "../../components/common/elements/Label";
import Header from "../../components/common/elements/Header";
import TextRender from "../../components/common/TextRender";
import { ContentVisibilityContext } from "../../contexts/ContentVisibilityContext";
import { PartnerUserContext } from "../../contexts/PartnerUserContext";

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
  const { canSeeBanks, canSeeLinkedPartners, canSeeLinkedPrograms } =
    useContext(ContentVisibilityContext);
  const intl = useIntl();
  const [programList, setProgramList] = useState<any>([]);

  const listPrograms = async () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingAPI.list().catch((error: any) => setErrorMsg(error));
  const getRiskLevels = (programName: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.RiskAPI.getRiskLevels(programName).catch((error: any) =>
      setErrorMsg(error)
    );

  const getPartnerDTO = (partnerName: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.getPartnerDTO(partnerName).catch((error: any) =>
      setErrorMsg(error)
    );

  const getFeePlans = (programName: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingFeesAPI.getFeePlans(programName).catch((error: any) =>
      setErrorMsg(error)
    );

  const getBank = (bankName: string) => {
    if (canSeeBanks) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return api.BankAPI.get(bankName).catch((error: any) =>
        setErrorMsg(error)
      );
    }
    return [];
  };

  const getIINs = (bankName: string) => {
    if (bankName !== undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.BankAPI.getIINs(bankName).catch((error: any) => setErrorMsg(error));
    }
    return [];
  };

  const getCurrencies = (bankName: string) => {
    if (bankName !== undefined) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.BankAPI.getCurrencies(bankName).catch((error: any) =>
        setErrorMsg(error)
      );
    }
    return [];
  };

  const getLinkedPartners = async (partnerName: string) => {
    if (canSeeLinkedPartners) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return api.PartnerAPI.listLinkedPartners2(partnerName).catch(
        (error: any) => {
          // ignore an error if this is a program manager
          if (!isProgramManager) {
            setErrorMsg(error);
          }
        }
      );
    }
    return new Promise((resolve) => resolve([]));
  };

  const getLinkedPrograms = async (partnerName: string) => {
    if (canSeeLinkedPrograms) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.PartnerAPI.getPartnerPrograms(partnerName).catch((error: any) =>
        setErrorMsg(error)
      );
    }
    return [];
  };

  const getAllProgramInfo = async () => {
    listPrograms().then(async (programs) => {
      const promises: any = [];
      try {
        programs.map((program: any) =>
          promises.push([
            // 0
            getRiskLevels(program.name),
            // 1
            getPartnerDTO(program.partnerName),
            // 2
            getFeePlans(program.name),
            // 3
            getBank(program.bankName),
          ])
        );
      } catch (e: any) {
        setErrorMsg(e);
      }

      const list: any = [];
      await Promise.all(
        promises.map((promise: any) => Promise.all(promise))
      ).then((results: any) => {
        programs.forEach((program: any, index: number) => {
          const riskLevels = results[index][0];
          const partner = results[index][1];
          const feePlans = results[index][2];
          const bank: any = results[index][3];

          const innerPromises = [
            // 0
            getIINs(bank.name),
            // 1
            getCurrencies(bank.name),
            // 2
            getLinkedPartners(partner.name),
            // 3
            getLinkedPrograms(partner.name),
          ];

          Promise.all(innerPromises).then((innerResults: any) => {
            const bankObject = canSeeBanks
              ? { ...bank, iins: innerResults[0], currencies: innerResults[1] }
              : { name: program.bankName };
            const newProgram = {
              id: program.id,
              name: program.name,
              type: "program",
              riskLevels,
              feePlans,
              bank: bankObject,
              partner: {
                ...partner,
                linkedPartners: innerResults[2],
                linkedPrograms: innerResults[3],
              },
              primaryContact: partner.primaryContact,
              expandableData: [],
              currencies: program.currencies,
            };
            list.push(newProgram);
            setProgramList([...list]);
          });
        });
      });
    });
  };

  useEffect(() => {
    getAllProgramInfo().catch((error: any) => setErrorMsg(error));
    emitter.on("programs.changed", () =>
      getAllProgramInfo().catch((e) => setErrorMsg(e))
    );
  }, []);

  const tableMetadata = [
    {
      header: (
        <FormattedMessage
          id="name"
          description="name of program/product"
          defaultMessage="Name"
        />
      ),
      width: "15.83%",
      render: (rowData: any) => {
        const { name } = rowData;
        return (
          <NavLink to={`/programs/${name}`}>
            <Label size="body" bold variant="link" noMargin>
              {name}
            </Label>
          </NavLink>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="type"
          description="Type of program/product"
          defaultMessage="Type"
        />
      ),
      width: "10%",
      render: (rowData: any) => {
        const { type } = rowData;
        return type === "program" ? (
          <Pill
            label={intl.formatMessage({
              id: "program",
              defaultMessage: "program",
            })}
            color="info"
          />
        ) : (
          <Pill
            label={intl.formatMessage({
              id: "product",
              defaultMessage: "product",
            })}
            color="warning"
          />
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="riskLevels"
          description="Risk Levels of program/product"
          defaultMessage="Risk Levels"
        />
      ),
      width: "15.83%",
      render: (rowData: any) => {
        const { riskLevels, name, type } = rowData;
        return (
          <>
            {type === "program" &&
              riskLevels.map((level: any) => (
                <ProgramDetailContextProvider
                  programName={rowData.name}
                  currentLevel={level.securityLevel}
                >
                  <DrawerComp
                    id={`program-risk-drawer-${level.securityLevel}`}
                    widthPercentage={80}
                    LevelTwo={ProgramRiskParamsLevelTwo}
                    asLink
                    label={`${intl.formatMessage({
                      id: "riskLevel",
                      defaultMessage: "Risk Level",
                    })} - ${level.securityLevel}`}
                  >
                    <ProgramsRiskLevelDrawer
                      programName={name}
                      riskLevelList={riskLevels}
                    />
                  </DrawerComp>
                </ProgramDetailContextProvider>
              ))}
          </>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="feePlans"
          description="Fee Plans of program/product"
          defaultMessage="Fee Plans"
        />
      ),
      width: "15.83%",
      render: (rowData: any) => {
        const { feePlans, name } = rowData;
        return (
          <>
            {feePlans.map((plan: any) => (
              <ProgramDetailContextProvider
                programName={name}
                currentFeePlan={plan.name}
              >
                <DrawerComp
                  id={`program-risk-drawer-${plan.name}`}
                  widthPercentage={80}
                  LevelTwo={ProgramFeeLevelTwo}
                  asLink
                  label={plan.name}
                >
                  <ProgramsFeesDrawer
                    programName={rowData.name}
                    feePlanList={feePlans}
                  />
                </DrawerComp>
              </ProgramDetailContextProvider>
            ))}
          </>
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="bank"
          description="Banks of program/product"
          defaultMessage="Bank"
        />
      ),
      width: "10%",
      render: (rowData: any) => {
        const { bank } = rowData;
        return canSeeBanks ? (
          <DrawerComp id="programs.table.bank.drawer" label={bank.name} asLink>
            <BankDrawer bank={bank} edit />
          </DrawerComp>
        ) : (
          bank.name
        );
      },
    },
    {
      header: (
        <FormattedMessage
          id="partner"
          description="Partners of program/product"
          defaultMessage="Partner"
        />
      ),
      width: "10%",
      render: (rowData: any) => {
        const { partner } = rowData;
        return isProgramManager ? (
          <Label size="body">{partner.name}</Label>
        ) : (
          <DrawerComp id="programs-table-partners" label={partner.name} asLink>
            <PartnerDrawer edit partner={partner} />
          </DrawerComp>
        );
      },
    },
    {
      width: "17.49%",
      header: (
        <FormattedMessage
          id="programs.table.primaryContact"
          description="Primary Contact of program/product"
          defaultMessage="Primary Contact"
        />
      ),
      render: (rowData: any) => {
        const { primaryContact } = rowData;
        return primaryContact !== undefined ? (
          <TextRender
            data={`${primaryContact.title} ${primaryContact.firstName} ${primaryContact.lastName}`}
          />
        ) : (
          <span>--</span>
        );
      },
    },
    {
      header: <> </>,
      width: "5%",
      render: (rowData: any) => (
        <QDButton
          id={`program-edit-${rowData.name}-button`}
          size="small"
          label={intl.formatMessage({
            id: "button.edit",
            description: "Edit program information",
            defaultMessage: "EDIT",
          })}
          onClick={() => history.push(`/programs/${rowData.name}`)}
          color="primary"
          variant="contained"
        />
      ),
    },
  ];

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
        <StandardTable
          id="program-list"
          dataList={programList}
          tableMetadata={tableMetadata}
          tableRowPrefix="programs-table"
        />
        {/* <ExpandableTable dataList={programList} tableMetadata={tableMetadata} /> */}
      </Box>
    </Container>
  );
};

export default Programs;
