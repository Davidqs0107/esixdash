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

import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Helmet from "react-helmet";
import { useIntl } from "react-intl";
import Header from "../../../components/common/elements/Header";
import CardTable from "../../../components/common/card-table/CardTable";
import BrandingWrapper from "../../../app/BrandingWrapper";
import api from "../../../api/api";

interface IProgramAddPane1 {
  setProduct: any;
}

const ProgramAddPane1: React.FC<IProgramAddPane1> = (props) => {
  const { setProduct } = props;
  const [errors, setErrors] = useState({});
  const intl = useIntl();
  const [templates, setTemplates] = useState([]);
  const [programs, setPrograms] = useState([]);
  const includeTemplates = ["CreditCard","Installments"];

  const convertProgramToCardEntry = (program: any) => {
    let programDetails: any = {};
    if (!program.offeringType) {
      program.offeringType = "";
    }
    const type = program.offeringType.split(".")[8];
    switch (type) {
      case "LineOfCredit":
        programDetails.displayName = "Line of Credit Wallet";
        programDetails.description =
          "Provides a standing available balance of revolving credit that can be drawn upon as needed.";
        programDetails.category = "Credit";
        break;
      case "Loan":
        programDetails.displayName = "Installment Wallet";
        programDetails.description =
          "Provides multiple amortized loans which handle interest and repayment independently.";
        programDetails.category = "Credit";
        break;
      case "Savings":
        programDetails.displayName = "Savings Wallet";
        programDetails.description =
          "Provides open-ended interest accrual on deposited funds with limited access to withdrawal on a monthly basis.";
        programDetails.category = "Savings";
        break;
      case "CreditCard":
        programDetails.displayName = "Revolving Credit Wallet";
        programDetails.description =
          "Provides access to multiple types of credit draw including purchase, cash advance, and balance transfer which accrue interest on unpaid balances.";
        programDetails.category = "Credit";
        break;
      case "TermDeposit":
        programDetails.displayName = "Term Deposit Wallet";
        programDetails.description =
          "Provides interest accrual on deposited funds over a set period of time before money can bet withdrawn without penalty.";
        programDetails.category = "Savings";
        break;
      case "Installments":
        programDetails.displayName = "Installments";
        programDetails.description = 
           "Provides access to multiple types of credit draw including purchase, cash advance, and balance transfer which accrue interest on unpaid balances.";
        programDetails.category = "Credit";
        break;
      default:
        programDetails.displayName = program.name;
        programDetails.description = program.name;
        programDetails.category = "";
        break;
    }
    if (program.programName) {
      programDetails.displayName = program.programName;
      programDetails.description = program.name;
      programDetails.category = "";
    }
    return Object.assign(
      {
        category: programDetails.category,
        displayName: programDetails.displayName,
        id: `programsCopy${program.id}`,
        description: programDetails.description,
        documentationLink: "",
        link2: "",
        config: program.config,
        offeringType: program.offeringType,
      },
      program
    );
  };

  const getPrograms = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingAPI.list()
      .then((programList: any) => {
        const converted = programList.map((prog: any) => {
          return convertProgramToCardEntry(prog);
        });
        setPrograms(converted);
      })
      .catch((error: any) => setErrors(error));
  };

  const getProductTemplates = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.ProductAPI.getAllProductTemplates()
      .then((dataList: any) => {
        // @TODO - instead of mapping this to the Interface, the interface needs to match the Response.
        let modifiedTemplates: any = [];

        // eslint-disable-next-line no-param-reassign
        dataList = dataList.reverse(); // This is because we want `Revolving credit wallet` as the first one for Johns demo

        dataList.forEach((list: any, i: number) => {
          const type = list.split(".")[8];
          if (includeTemplates.includes(type)) {
            let result: any = {};
            result.id = `programsAddProducts-template-${i}`;
            result.link2 = result.link1;
            result.offeringType = list;
            result = convertProgramToCardEntry(result);

            // Add to array
            modifiedTemplates = modifiedTemplates.concat(result);
            modifiedTemplates = [...modifiedTemplates];
            setTemplates(modifiedTemplates);
          }
        });
      })
      .catch((error: any) => {
        console.log(error);
        setErrors(error);
      }); // TODO Handle error case

  // On Mount
  useEffect(() => {
    // @TODO change this trigger
    if (templates.length <= 0) {
      // get all product templates
      getProductTemplates().catch((error: any) => setErrors(error));
      getPrograms();
    }
  }, []);

  // Static content
  const tableHeaders = [
    {
      title: "Use a template",
    },
    {
      title: "Copy an existing program",
    },
  ];

  const buildFromScratch = [
    {
      category: "deposits",
      className: "",
      description: "Build from scratch",
      displayName: "Deposit",
      documentationLink: "Link to start from scratch tech document",
      id: "programsAddProducts-buildFromScratch",
      link2: "Link to start from scratch support document",
      offeringType: "",
      title: "Deposit",
    },
    {
      category: "multi-currency",
      className: "",
      description: "Build from scratch",
      displayName: "Multicurrency",
      documentationLink: "Link to start from scratch tech document",
      id: "programsAddProducts-multiCurrency",
      link2: "",
      offeringType: "",
      title: "Multi-currency",
    },
  ];

  return (
    <Container disableGutters>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "page.title.program.add",
            defaultMessage: "Add Program",
          })}`}
        </title>
      </Helmet>
      <Box sx={{ marginBottom: "10px" }}>
        <Header
          value={intl.formatMessage({
            id: "programs.header.program.add",
            description: "Programs header",
            defaultMessage: "Pick your product.",
          })}
          level={1}
          bold
        />
      </Box>
      <Box sx={{ marginBottom: "60px" }}>
        <Typography
          sx={{
            color: "#152C5B",
            fontSize: "13px",
            lineHeight: "16px",
            fontWeight: "500",
          }}
        >
          {intl.formatMessage({
            id: "programs.section.add.products",
            defaultMessage:
              "Use a product template, copy an existing product, or build one from scratch.",
          })}
        </Typography>
      </Box>
      <CardTable
        tableHeaders={tableHeaders}
        templates={templates}
        copyExistingPrograms={programs}
        buildFromScratch={buildFromScratch}
        setProduct={setProduct}
      />
    </Container>
  );
};

export default ProgramAddPane1;
