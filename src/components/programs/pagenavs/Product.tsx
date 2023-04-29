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
 *
 */

import React, { useContext, useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import api from "../../../api/api";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";
import ConfigureProductFormCredit from "../configure-products/ConfigureProductFormCredit";
import ConfigureProductFormInstallments from "../configure-products/ConfigureProductFormInstallments";
import { useHistory } from "react-router-dom";
import { MessageContext } from "../../../contexts/MessageContext";
import {
  ProgramConfig,
  ProgramCreditCardConfig,
  ProgramInstallmentsConfig,
} from "../../../types/program";

import { FormattedMessage, useIntl } from "react-intl";

const Product = () => {
  const intl = useIntl();
  const { program } = useContext(ProgramEditContext);
  const [programProduct, setProgramProduct] = useState<any>(undefined);
  const history = useHistory();
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);

  const getOfferingProgram = () => {
    // @ts-ignore
    api.ProductAPI.getProgramProduct(program.name)
      .then((product: any) => {
        if (product.offeringClassName.indexOf("CreditCard") != -1) {
          if (!product.config.automaticLoadShiftSetting) {
            product.config.automaticLoadShiftSetting = null;
          }
          if (!product.config.repaymentDueShiftSetting) {
            product.config.repaymentDueShiftSetting = null;
          }
        }
        setProgramProduct(product);
      })
      .catch((error: any) => setErrorMsg(error));
  };

  const handleSubmit = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.ProductAPI.updateProgramProduct(program.name, data)
      .then(() => {
        history.push(`/programs/`);
        history.push(`/programs/` + program.name);
      })
      .then(() =>
        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "program.success.updated",
            defaultMessage: `Program has been Updated Successfully`,
          }),
        })
      )
      .catch((error: any) => setErrorMsg(error));
  };

  const createProductForm = (product: any) => {
    if (product !== undefined) {
      if (product.offeringClassName.indexOf("CreditCard") != -1) {
        return (
          <ConfigureProductFormCredit
            programName={program.name}
            initialValues={product.config as ProgramCreditCardConfig}
            submitForm={handleSubmit}
            edit={true}
          />
        );
      }

      if (product.offeringClassName.indexOf("Installments") != -1) {
        return <ConfigureProductFormInstallments
          programName={program.name}
          defaultHomeCurrency={program.defaultHomeCurrency}
          submitForm={handleSubmit}
          initialValues={product.config as ProgramInstallmentsConfig}
          edit={true}
        />;
      }
    }
    return (
      <Typography
        className="label-regular weighted"
        style={{
          fontFamily: "Montserrat",
          opacity: 0.8,
          marginLeft: "100px",
        }}
      >
        No configured product
      </Typography>
    );
  };

  useEffect(() => {
    if (program.name) {
      getOfferingProgram();
    }
  }, [program]);

  return createProductForm(programProduct);
};

export default Product;
