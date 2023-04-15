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

import React from "react";
import { useIntl } from "react-intl";
import TextRender from "../TextRender";

interface IQDFormattedCurrency {
  currency: string;
  amount: string | number;
  className?: string;
  bold?: boolean;
  variant?: "inherit" | "labelLight" | "labelDark";
  forceVariant?: boolean;
}

const QDFormattedCurrency: React.FC<IQDFormattedCurrency> = ({
  currency,
  amount,
  className,
  bold = false,
  variant,
  forceVariant = false
}) => {
  const intl = useIntl();
  const finalAmount = Number(amount);
  const getVariant = () => {
    if ( forceVariant ) {
      return variant;
    }
    return finalAmount > 0 ? "tablePositiveData" : (finalAmount == 0 ? variant : "tableNegativeData");
  };

  if (currency && currency.length > 3) {
    // this renders a star in front of the number for loyalty related currencies
    return (
      <TextRender
        data={`\u2605${intl.formatNumber(finalAmount)}`}
        className={className ? className : "weighted sky mt-1"}
        bold={bold}
        variant={ getVariant() }
      />
    );
  }
  return (
    <TextRender
      data={intl.formatNumber(finalAmount, {
        style: "currency",
        currency: `${currency}`,
      })}
      className={className ? className : "weighted kingk mt-1"}
      bold={bold}
      variant={ getVariant() }
    />
  );
};

export default QDFormattedCurrency;
