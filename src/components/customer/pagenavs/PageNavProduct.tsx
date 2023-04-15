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

// eslint-disable-next-line no-use-before-define
import React, { useContext, useEffect, useState } from "react";
import { defineMessage, useIntl } from "react-intl";
import Typography from "@mui/material/Typography";
import api from "../../../api/api";
import { Program, ProgramCreditCardConfig } from "../../../types/program";
import ProductCreditCard from "./products/ProductCreditCard";
import ProductInstallments from "./products/ProductInstallments";
import ProductInstallmentsChildLoans from "./products/ProductInstallmentsChildLoans";

interface IPageNavProduct {
  customerNumber: string;
  primaryPersonId: string;
  homeCurrency: string;
  programName: string;
  parentCustomerNumber?: string;
}

const PageNavProduct: React.FC<IPageNavProduct> = ({
  customerNumber,
  homeCurrency,
  programName,
  parentCustomerNumber
}) => {
  const intl = useIntl();
  const [isOfferingProgram, setIsOfferingProgram] = useState(false);
  const [programProduct, setProgramProduct] = useState<Program>();

  const getOfferingProgram = (program: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.ProductAPI.getProgramProduct(program)
      .then((program: Program) => {
        setIsOfferingProgram(true);
        setProgramProduct(program);
      })
      .catch((error: any) => console.log(error));
  };

  useEffect(() => {
    getOfferingProgram(programName);
  }, []);

  const createProductForm = (isOfferingProgram: boolean, programProduct: any) => {
    if (isOfferingProgram && programProduct !== undefined) {
      if (programProduct.offeringClassName.indexOf("CreditCard") != -1) {
        return (
          <ProductCreditCard
            customerNumber={customerNumber}
            homeCurrency={homeCurrency}
            programName={programName}
            programProduct={programProduct}>
          </ProductCreditCard>
        );
      }

      if (programProduct.offeringClassName.indexOf("Installments") != -1) {

        if ( parentCustomerNumber ) {
          return (
            <ProductInstallmentsChildLoans
              customerNumber={customerNumber}
              homeCurrency={homeCurrency}
              programName={programName}
              programProduct={programProduct}
              parentCustomerNumber={parentCustomerNumber}>
            </ProductInstallmentsChildLoans>
          );
        }
        return (
          <ProductInstallments
            customerNumber={customerNumber}
            homeCurrency={homeCurrency}
            programName={programName}
            programProduct={programProduct}>
          </ProductInstallments>
        );
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
        Not a offering customer.
      </Typography>
    );
  };

  return createProductForm(isOfferingProgram, programProduct);
};

export default PageNavProduct;
