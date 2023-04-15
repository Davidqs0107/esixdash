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

import React, { FC } from "react";
import Pill from "../common/elements/PillLabel";

interface IContactInfoWithPill {
  contactInfo: any;
  contactMethod: any;
  phones: any;
  emails: any;
}

/* eslint-disable */
const ContactInfoWithPill: FC<IContactInfoWithPill> = ({
  contactInfo,
  contactMethod,
  phones,
  emails,
}) => {
  let pillColor = "info";

  const resolveLabel = (
    contactInfo: { value: string },
    contactMethod: { value: string },
    phones: any[],
    emails: any[]
  ) => {
    let result = "";
    if (contactMethod.value === "Phone") {
      phones.forEach((p) => {
        if (contactInfo.value.replace(" ", "").includes(p.phoneNumber)) {
          result = p.type.toString();
          setPillColor("error");
        }
      });
    } else if (contactMethod.value === "Email") {
      emails.forEach((e) => {
        if (contactInfo.value.includes(e.email)) {
          result = e.type.toString();
          setPillColor("warning");
        }
      });
    }
    return result;
  };

  const setPillColor = (color: string) => {
    pillColor = color;
  };

  return (
    <Pill
      label={resolveLabel(contactInfo, contactMethod, phones, emails)}
      color={pillColor}
    />
  );
};

export default ContactInfoWithPill;
