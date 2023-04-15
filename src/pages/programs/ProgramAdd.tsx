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

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import QDButton from "../../components/common/elements/QDButton";
import QDWizard from "../../components/common/elements/QDWizard";
import ProgramAddPane1 from "./panes/ProgramAddPane1";
import ProgramAddPane2Dynamic from "./panes/ProgramAddPane2Dynamic";
import Icon from "../../components/common/Icon";
import api from "../../api/api";

interface IProgramAddContext {}

const ProgramAdd: React.FC<IProgramAddContext> = () => {
  const history = useHistory();
  const intl = useIntl();

  const steps = ["Step 1", "Step 2"];
  const [activeStep, setActiveStep] = React.useState(0);
  const [product, setProduct] = React.useState({
    type: "",
    title: "",
    id: "",
    description: "",
    link1: "",
    link2: "",
    templateName: "",
    config: "",
    partnerName: "",
    language: "",
  });

  const [plugIns, setPlugins] = React.useState([]);

  const handleNext = (value: any) => {
    if (activeStep === 0) {
      const excludeCategories = ["deposits", "multi-currency"];
      if (!value.offeringType && !excludeCategories.includes(value.category)) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        api.ProductAPI.getProgramProduct(value.displayName)
          .then((data: any) => {
            value.config = data.config;
            value.offeringType = data.offeringClassName;

            setProduct(value);
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
          })
          .catch((e: any) => {
            console.log(e);
            if (e.message === "Not an offering program") {
              setProduct(value);
              setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
          });
      } else {
        setProduct(value);
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === 1) {
      setPlugins(value);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        {/* @ts-ignore */}
        <QDWizard activeStep={activeStep} showButtons={false} steps={steps}>
          <Box sx={{ marginTop: "24px" }}>
            <ProgramAddPane1 setProduct={handleNext} />
          </Box>
          <Box sx={{ marginTop: "24px" }}>
            {/* <ProgramAddPane2 setPlugins={handleNext} product={product} /> */}
            <ProgramAddPane2Dynamic setPlugins={handleNext} product={product} />
          </Box>
        </QDWizard>
        <QDButton
          color="primary"
          variant="text"
          size="extra-tall"
          textCase="upper"
          type="button"
          onClick={() => history.push(`/programs`)}
        >
          <img src={Icon.closeIcon} alt="close icon" height={11} width={11} />
        </QDButton>
      </Box>
    </Container>
  );
};

export default ProgramAdd;
