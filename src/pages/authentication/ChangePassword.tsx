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

import React, { useState, useEffect, lazy } from "react";
import { Container } from "@mui/material";
import { useIntl } from "react-intl";
import Helmet from "react-helmet";
import BrandingWrapper from "../../app/BrandingWrapper";
import ForceResetPassword from "./ForceResetPassword";

interface IChangePassword {
  partnerName: string;
  userName: string;
  forceUpdate: Function;
}

interface ILoginValues {
  userName: string;
  partnerName: string;
  password?: string;
}

const ChangePassword: React.FC<IChangePassword> = () => {
  const intl = useIntl();
  const [initialValues, setInitialValues] = useState<ILoginValues>({
    partnerName: "",
    userName: "",
    password: "",
  });

  const [forceResetPassword, setForceResetPassword] = useState(false);

  const populateIfCachePresent = () => {
    const localPartner = localStorage.getItem("partnerName");
    const localUserName = localStorage.getItem("userName");
    setInitialValues({
      password: "",
      partnerName: localPartner !== null ? localPartner : "",
      userName: localUserName !== null ? localUserName : "",
    });
  };

  useEffect(() => {
    populateIfCachePresent();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "changePassword",
            defaultMessage: "Change Password",
          })}`}
        </title>
      </Helmet>
      <Container>
        <ForceResetPassword
          forceUpdate={setForceResetPassword}
          // @ts-ignore
          changePassword={true}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          partnerName={initialValues.partnerName}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          userName={initialValues.userName}
        />
      </Container>
    </>
  );
};

export default ChangePassword;
