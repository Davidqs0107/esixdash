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

import React, { lazy, useState } from "react";
import { Grid } from "@mui/material";
import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { useIntl } from "react-intl";
import CardOption from "./CardOption";
import CardWrapper from "./CardWrapper";
import CardTableHeadWrapper from "./CardTableHeadWrapper";

const QDButton = lazy(() => import("../elements/QDButton"));

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      overflow: "hidden",
      padding: theme.spacing(0, 3),
    },
    paper: {
      height: "102px",
      width: "264px",
      padding: "20px",
      opacity: 0.6,
      borderRadius: "10px",
      backgroundColor: "#FFFFFF",
      boxShadow: "0 20px 20px -20px rgba(33,31,64,0.1)",
      marginBottom: "10px",
      marginRight: "20px",
    },
    paperSelected: {
      height: "102px",
      width: "264px",
      padding: "20px",
      borderRadius: "10px",
      backgroundColor: "#FFFFFF",
      boxShadow: "0 20px 20px -20px rgba(33,31,64,0.1)",
      marginBottom: "20px",
      marginRight: "20px",
    },
    links: {
      maxWidth: 400,
      padding: theme.spacing(2),
    },
  })
);
type IProgram = {
  category: string | "none";
  displayName: string | undefined;
  id: string | undefined;
  description: string | undefined;
  documentationLink: string | null;
  link2: string | null;
  templateName: string | undefined;
  config: any | undefined;
  offeringType: any | undefined;
  partnerName: any | undefined;
  language: any | undefined;
  defaultHomeCurrency: any | undefined;
};

const CardTable: any = (props: any) => {
  const { tableHeaders, templates, copyExistingPrograms, buildFromScratch } =
    props;
  const classes = useStyles();
  const intl = useIntl();

  const [hoverObject, setHoverObject]: any = useState({
    id: "",
    link1: "Tech document link",
    link2: "Support document link",
    description: "",
    displayName: "",
    templateName: "",
    partnerName: "",
    language: "",
  });

  const [selectedChoice, setSelectedChoice] = useState(false);
  const [confirmSelection, setConfirmSelection] = useState(false);

  const handleHoverObject = (template: IProgram, cancelSelection?: boolean) => {
    if (confirmSelection && !cancelSelection) {
      return;
    }
    setHoverObject(template);
    setSelectedChoice(true);
  };

  const handleLeaveHover = () => {
    if (confirmSelection) {
      return;
    }
    setHoverObject({
      id: "",
      link1: "",
      link2: "",
      description: "",
      displayName: "",
      templateName: "",
    });
  };

  const setDisabled = (program: IProgram) => {
    if (selectedChoice && program.id === hoverObject.id) {
      return classes.paperSelected;
    }
    if (confirmSelection) {
      return classes.paper;
    }
    return classes.paper;
  };

  return (
    <>
      <Grid sx={{ marginBottom: "10px" }} container justifyContent="flex-start">
        {tableHeaders.map((header: { title: string }, index: number) => (
          <CardTableHeadWrapper
            id={`programs.add.column.header.${header.title.replace(
              /\s/g,
              "."
            )}`}
            key={"card-table-head" + index}
          >
            {header.title}
          </CardTableHeadWrapper>
        ))}
      </Grid>
      <Grid container justifyContent="flex-start" wrap="nowrap">
        <CardWrapper id="programs.template.column" size={3}>
          {buildFromScratch.map((template: IProgram, index: number) => (
            <CardOption
              description={template.description}
              confirmSelected={confirmSelection}
              setConfirmSelection={setConfirmSelection}
              id={template.id}
              documentationLink={template.documentationLink}
              link2={template.link2}
              config={template.config}
              offeringType={template.offeringType}
              partnerName={template.partnerName}
              language={template.language}
              defaultHomeCurrency={template.defaultHomeCurrency}
              displayName={template.displayName}
              templateName={template.templateName}
              category={template.category}
              hoverObject={hoverObject}
              selectedChoice={selectedChoice}
              handleHoverObject={handleHoverObject}
              handleLeaveHover={handleLeaveHover}
              setDisabled={setDisabled}
              key={"card-option" + template.id}
            />
          ))}
          {templates.map((template: IProgram, index: number) => (
            <CardOption
              description={template.description}
              confirmSelected={confirmSelection}
              setConfirmSelection={setConfirmSelection}
              id={template.id}
              documentationLink={template.documentationLink}
              link2={template.link2}
              config={template.config}
              offeringType={template.offeringType}
              partnerName={template.partnerName}
              language={template.language}
              defaultHomeCurrency={template.defaultHomeCurrency}
              displayName={template.displayName}
              templateName={template.templateName}
              category={template.category}
              hoverObject={hoverObject}
              selectedChoice={selectedChoice}
              handleHoverObject={handleHoverObject}
              handleLeaveHover={handleLeaveHover}
              setDisabled={setDisabled}
              key={"card-option" + template.id}
            />
          ))}
        </CardWrapper>
        <CardWrapper id="programs.program.column" size={3}>
          {copyExistingPrograms.map((template: IProgram) => (
            <CardOption
              description={template.description}
              confirmSelected={confirmSelection}
              setConfirmSelection={setConfirmSelection}
              id={template.id}
              documentationLink={template.documentationLink}
              link2={template.link2}
              config={template.config}
              offeringType={template.offeringType}
              partnerName={template.partnerName}
              language={template.language}
              defaultHomeCurrency={template.defaultHomeCurrency}
              displayName={template.displayName}
              templateName={template.templateName}
              category={template.category}
              hoverObject={hoverObject}
              selectedChoice={selectedChoice}
              handleHoverObject={handleHoverObject}
              handleLeaveHover={handleLeaveHover}
              setDisabled={setDisabled}
            />
          ))}
        </CardWrapper>

        <CardWrapper id="programs.build.actions" spacing={0} size={3}>
          <Grid container
            sx={{
              marginTop: "2rem",
            }}
          >
            <QDButton
              type="button"
              id="button-program-add"
              label={intl.formatMessage({
                id: "programs.add.button",
                defaultMessage: "Choose & continue",
              })}
              onClick={() => {
                props.setProduct(hoverObject);
              }}
              variant="contained"
              color="primary"
              size="large"
              textCase="provided"
              fullWidth={false}
              disabled={!confirmSelection}
            />
          </Grid>
        </CardWrapper>
      </Grid>
    </>
  );
};

export default CardTable;
