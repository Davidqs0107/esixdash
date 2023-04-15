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

import React, { lazy, useState } from "react";
import { Paper, Typography, Grid } from "@mui/material";
import Fade from "@mui/material/Fade";
import Pill from "../elements/PillLabel";
import Icon from "../Icon";

type IProgram = {
  category: string | "none";
  displayName: string | undefined;
  templateName: string | undefined;
  id: string | undefined;
  description: string | undefined;
  documentationLink: string | null;
  link2: string | null;
  config: any | undefined;
  offeringType: any;
  partnerName: any | undefined;
  language: any | undefined;
  defaultHomeCurrency: any | undefined;
};

interface ICardData {
  category:
    | string
    | "none" /*  Sets Name Of Pill if you want no pill send string as "none" */;
  displayName: string | undefined;
  templateName: string | undefined;
  id:
    | string
    | undefined /* ID on cards must be unique to avoid card duplication  */;
  description: string | undefined;
  documentationLink: string | null;
  link2: string | null;
  config: any;
  offeringType: any;
  partnerName: any | undefined;
  language: any | undefined;
  defaultHomeCurrency: any | undefined;
  confirmSelected: boolean;
  setConfirmSelection: React.Dispatch<React.SetStateAction<boolean>>;
  selectedChoice: boolean;
  handleHoverObject: (template: IProgram, cancelSelection?: boolean) => void;
  handleLeaveHover: (template?: IProgram) => void;
  setDisabled: (program: IProgram) => string;
  hoverObject: {
    id: string;
    link1: string;
    link2: string;
    description: string;
    displayName: string;
  };
}

const CardOption: React.FC<ICardData> = ({
  category,
  displayName,
  templateName,
  id,
  description,
  documentationLink,
  link2,
  config,
  offeringType,
  partnerName,
  language,
  defaultHomeCurrency,
  confirmSelected,
  setConfirmSelection,
  selectedChoice,
  handleHoverObject,
  handleLeaveHover,
  setDisabled,
  hoverObject,
}) => {

  const getPillColor = (templateType: string) => {
    switch (templateType) {
      case 'deposits':
        return "warning";
      case 'multi-currency':
        return "primary";
      default:
        return "success";
    }
  };

  return (
    <>
      <Paper
        onMouseEnter={() =>
          handleHoverObject({
            category,
            displayName,
            templateName,
            id,
            description,
            documentationLink,
            link2,
            config,
            offeringType,
            partnerName,
            language,
            defaultHomeCurrency,
          })
        }
        onMouseLeave={() => handleLeaveHover()}
        onClick={() => {
          if (confirmSelected && hoverObject.displayName !== displayName) {
            handleHoverObject(
              {
                category,
                displayName,
                templateName,
                id,
                description,
                documentationLink,
                link2,
                config,
                offeringType,
                partnerName,
                language,
                defaultHomeCurrency,
              },
              true
            );
          } else {
            setConfirmSelection(!confirmSelected);
          }
        }}
        className={setDisabled({
          category,
          displayName,
          templateName,
          id,
          description,
          documentationLink,
          link2,
          config,
          offeringType,
          partnerName,
          language,
          defaultHomeCurrency,
        })}
        id={id}
      >
        <Grid container wrap="nowrap">
          <Grid sx={{ flexGrow: 1 }} item>
            <Pill
              color={getPillColor(category)}
              label={category === "none" ? "" : category}
            />
            <Typography
              sx={{
                color: "#152C5B",
                fontSize: "18px",
                fontWeight: "600",
                letterSpacing: "0",
                lineHeight: "22px",
              }}
            >
              {displayName}
            </Typography>
          </Grid>
          <Grid item 
              sx={{
                "img": {
                  marginTop: ".5rem"
                }
              }}>
            <Fade
              style={{
                display: selectedChoice && id === hoverObject.id ? "" : "none",
              }}
              mountOnEnter
              unmountOnExit
              timeout={1400}
              in={
                (selectedChoice && id === hoverObject.id) ||
                (confirmSelected && id === hoverObject.id)
              }
            >
              <img
                width={45}
                height={45}
                src={Icon.successIcon}
                alt="Success Icon"
              />
            </Fade>
            <Fade
              style={{
                display:
                  (!selectedChoice && id !== hoverObject.id) ||
                  (selectedChoice && id !== hoverObject.id) ||
                  (!confirmSelected && id !== hoverObject.id)
                    ? ""
                    : "none",
              }}
              mountOnEnter
              unmountOnExit
              timeout={1400}
              in={
                (!selectedChoice && id !== hoverObject.id) ||
                (selectedChoice && id !== hoverObject.id)
              }
            >
              <img
                width={40}
                height={40}
                src={Icon.expandIcon}
                alt="Success Icon"
              />
            </Fade>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default CardOption;
