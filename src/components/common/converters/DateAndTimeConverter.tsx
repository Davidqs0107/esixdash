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

import React from "react";
import { FormattedDate, FormattedTime } from "react-intl";
import Label from "../elements/Label";

interface IDateTime {
  epoch: number | string | Date;
  monthFormat?: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined;
  inline?: boolean;
  wrapped?: boolean;
}

const DateAndTimeConverter: React.FC<IDateTime> = ({
  epoch,
  monthFormat,
  inline = false,
  wrapped = true,
}) => {
  if (epoch >= 1e16 || epoch <= -1e16) {
    //Assuming that this timestamp is in nanoseconds (1 billionth of a second)
    epoch = Math.floor((epoch as number) / 1000000);
  } else if (epoch >= 1e14 || epoch <= -1e14) {
    //Assuming that this timestamp is in microseconds (1/1,000,000 second)
    epoch = Math.floor((epoch as number) / 1000);
  }

  let formattedDate = new Date(epoch);

  const formattedElement = () => {
    return (
      <>
        <FormattedDate
          value={formattedDate}
          year="numeric"
          month={monthFormat}
          day="2-digit"
        />
        {", "} {inline ? "" : <br />}
        <FormattedTime value={formattedDate} />
      </>
    );
  };

  return (
    formattedDate &&
    (wrapped ? <Label>{formattedElement()}</Label> : formattedElement())
  );
};

DateAndTimeConverter.defaultProps = {
  monthFormat: "long",
};

export default DateAndTimeConverter;
