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
import React, { useState, lazy } from "react";
import { Container, Box, Paper, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import Helmet from "react-helmet";
import BrandingWrapper from "../../app/BrandingWrapper";
import InputWithPlaceholder from "../../components/common/forms/inputs/InputWithPlaceholder";
import ClickableRender from "../../components/common/ClickableRender";
import Icon from "../../components/common/Icon";
import api from "../../api/api";
import LoginTopnav from "../../components/authentication/LoginTopnav";
import ThemeProvider from "../../theme/ThemeProvider";
import { logout } from "../../actions/AccountActions";
import CreateToast from "../../components/common/toasts/CreateToast";
import MessageUtil from "../../components/common/MessageUtil";

const QDButton = lazy(
  () => import("../../components/common/elements/QDButton")
);

interface IForceResetPassword {
  partnerName: string;
  userName: string;
  forceUpdate: Function;
  changePassword?: boolean;
}

const ForceResetPassword: React.FC<IForceResetPassword> = ({
  forceUpdate,
  changePassword,
  partnerName,
  userName,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();
  const [initialValues] = useState({
    oldPassword: "",
    newPassword1: "",
    newPassword2: "",
  });
  const [apiResponse, setApiResponse] = useState<any>();
  const [invalidPassword, setInvalidPassword] = useState(false);

  const title = BrandingWrapper.brandingTitle;

  const LoginSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required(
        intl.formatMessage({
          id: "error.oldPassword.required",
          defaultMessage: "Old password is a required field.",
        })
      )
      .nullable(),
    newPassword1: Yup.string()
      .required(
        intl.formatMessage({
          id: "error.password.required",
          defaultMessage: "Password is a required field.",
        })
      )
      .matches(
        /[a-z]+/,
        intl.formatMessage({
          id: "error.oneLowercase.character",
          defaultMessage: "One lowercase character",
        })
      )
      .matches(
        /[A-Z]+/,
        intl.formatMessage({
          id: "error.password.mustContain.oneUppercase.character",
          defaultMessage: "Password must contain one uppercase character",
        })
      )
      .matches(
        /[@$!%*#?&]+/,
        intl.formatMessage({
          id: "error.password.mustContain.oneSpecial.character",
          defaultMessage: "Password must contain one special character",
        })
      )
      .matches(
        /\d+/,
        intl.formatMessage({
          id: "error.password.mustContain.oneNumber",
          defaultMessage: "Password must contain one number",
        })
      )
      .min(
        8,
        intl.formatMessage({
          id: "error.password.mustContain.8Chars",
          defaultMessage: "Password must contain must be 8 characters or more",
        })
      )
      .max(
        32,
        intl.formatMessage({
          id: "error.password.mustContain.32Chars",
          defaultMessage: "Password must contain must be 32 characters or less",
        })
      )
      .nullable(),
    newPassword2: Yup.string()
      .required(
        intl.formatMessage({
          id: "error.confirmPassword.required",
          defaultMessage: "Confirm password is a required field.",
        })
      )
      .matches(
        /[a-z]+/,
        intl.formatMessage({
          id: "error.oneLowercase.character",
          defaultMessage: "One lowercase character",
        })
      )
      .matches(
        /[A-Z]+/,
        intl.formatMessage({
          id: "error.password.mustContain.oneUppercase.character",
          defaultMessage: "Password must contain one uppercase character",
        })
      )
      .matches(
        /[@$!%*#?&]+/,
        intl.formatMessage({
          id: "error.password.mustContain.oneSpecial.character",
          defaultMessage: "Password must contain one special character",
        })
      )
      .matches(
        /\d+/,
        intl.formatMessage({
          id: "error.password.mustContain.oneNumber",
          defaultMessage: "Password must contain one number",
        })
      )
      .min(
        8,
        intl.formatMessage({
          id: "error.password.mustContain.8Chars",
          defaultMessage: "Password must contain must be 8 characters or more",
        })
      )
      .max(
        32,
        intl.formatMessage({
          id: "error.password.mustContain.32Chars",
          defaultMessage: "Password must contain must be 32 characters or less",
        })
      )
      .when("newPassword1", {
        is: (val: any) => !!(val && val.length > 0),
        then: Yup.string().oneOf(
          [Yup.ref("newPassword1")],
          intl.formatMessage({
            id: "error.password.bothSame",
            defaultMessage: "Both password need to be the same",
          })
        ),
      }),
  });

  const cachePasswordWasChanged = (value: any) => {
    localStorage.setItem("passwordWasChanged", value);
  };

  const setupPassword = (credentials: any) => {
    if (changePassword) {
      // change the password
      return (
        // @ts-ignore
        api.CurrentUserAPI.changePassword({
          oldPassword: credentials.oldPassword,
          newPassword: credentials.newPassword1,
        })
          .then(() => {
            setApiResponse("");
            setInvalidPassword(false);
            cachePasswordWasChanged(true);
            dispatch(logout());
            history.push("/");
          })
          // eslint-disable-next-line no-console
          .catch((error: any) => {
            setApiResponse(error);
            setInvalidPassword(true);
            cachePasswordWasChanged(false);
          })
      );
    }

    // login to regenerate token
    const dto = {
      partnerName,
      userName,
      password: credentials.oldPassword,
      newPassword: credentials.newPassword1,
    };

    return (
      // @ts-ignore
      api.PartnerAuthAPI.login(dto)
        .then(() => forceUpdate(false))
        // eslint-disable-next-line no-console
        .catch((error: any) => {
          const { message } = error;
          setApiResponse(error);
          return;
        })
    );
  };

  const showToast = (apiResponse: any) => {
    let error = {
      type: "Error",
      headline: apiResponse.message,
      description: "",
    };

    switch (apiResponse.responseCode) {
      case "205000":
        error = {
          type: "Error",
          headline: intl.formatMessage(
            defineMessage({
              id: "incorrectOldPassword",
              defaultMessage: "Incorrect Old Password",
            })
          ),
          description: intl.formatMessage(
            defineMessage({
              id: "oldPasswordDoesNotMatch",
              defaultMessage:
                "The old password provided does not match our records. Please enter the correct old password.",
            })
          ),
        };
        break;
      case "208059":
        error = {
          type: "Error",
          headline: intl.formatMessage(
            defineMessage({
              id: "passwordUsedPreviously",
              defaultMessage: "Password used previously",
            })
          ),
          description: intl.formatMessage(
            defineMessage({
              id: "passwordUsedPreviouslyProvideNew",
              defaultMessage:
                "Can not reuse the previous passwords. Please enter a new password.",
            })
          ),
        };

      default:
        break;
    }

    return (
      <CreateToast
        toastType="error"
        onCloseClick={() => setInvalidPassword(false)}
      >
        {error.type}
        {error.headline}
        {error.description}
      </CreateToast>
    );
  };

  return (
    <ThemeProvider>
      <Paper variant="full">
        <Helmet>
          <title>
            {`${title} | ${
              changePassword
                ? intl.formatMessage({
                    id: "changePassword",
                    defaultMessage: "Change password",
                  })
                : intl.formatMessage({
                    id: "resetPassword",
                    defaultMessage: "Reset password",
                  })
            }`}
          </title>
        </Helmet>
        <Container disableGutters>
          <LoginTopnav />
        </Container>
        <Container disableGutters>
          <>
            <Box
              sx={{
                height: "118px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="brandName">{title}</Typography>
            </Box>
          </>
          <Paper variant="formCentered">
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => setupPassword(values)}
              validationSchema={LoginSchema}
            >
              {(props) => (
                <form onSubmit={props.handleSubmit}>
                  <Container>
                    {!changePassword && (
                      <>
                        <Box
                          sx={{
                            position: "absolute",
                            left: "0",
                            top: "20px",
                          }}
                        >
                          <ClickableRender
                            id="password-reset-back-button"
                            onClickFunc={() => forceUpdate(false)}
                          >
                            <img
                              height={13}
                              width={8}
                              src={Icon.caretLeftDark}
                              alt="Caret Left"
                            />
                          </ClickableRender>
                        </Box>
                        <Box>
                          <Typography component="h2" variant={"loginTitle"}>
                            <FormattedMessage
                              id="partner.password.reset.message"
                              defaultMessage="Reset your password below."
                              description="Please reset password"
                            />
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 6 }}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="partner.password.first.time.message"
                              defaultMessage="Since this is your first time logging into {brandName}, you'll need to reset your password. Enter your current password below, followed by your new password."
                              description="First time setup message"
                              values={{
                                brandName: BrandingWrapper.brandingTitle,
                              }}
                            />
                          </Typography>
                        </Box>
                      </>
                    )}

                    {changePassword && (
                      <>
                        <Box sx={{ display: "flex", alignItems: "baseline" }}>
                          <Box
                            sx={{
                              marginLeft: "-30px",
                              marginRight: "20px",
                            }}
                          >
                            <ClickableRender
                              id="password-reset-back-button"
                              onClickFunc={() => {
                                history.push("/");
                              }}
                            >
                              <img
                                height={13}
                                width={8}
                                src={Icon.caretLeftDark}
                                alt="Caret Left"
                              />
                            </ClickableRender>
                          </Box>
                          <Box>
                            <Typography component="h2" variant={"loginTitle"}>
                              <FormattedMessage
                                id="resetPartnerUserPassword"
                                defaultMessage="Reset Partner User Password"
                              />
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ mb: 6 }}>
                          <Typography variant="h6">
                            <FormattedMessage
                              id="change.password.first.time.message"
                              defaultMessage="Enter your current password below, followed by your new password."
                              description="Change password"
                              values={{
                                brandName: BrandingWrapper.brandingTitle,
                              }}
                            />
                          </Typography>
                        </Box>
                      </>
                    )}

                    <Box>
                      {invalidPassword ? showToast(apiResponse) : null}
                      {/* @ts-ignore */}
                      <InputWithPlaceholder
                        id="password-reset-old-password-input-field"
                        name="oldPassword"
                        autoComplete="off"
                        type="password"
                        placeholder="Old password"
                        {...props}
                      />
                    </Box>
                    <Box>
                      {/* @ts-ignore */}
                      <InputWithPlaceholder
                        id="password-reset-new-password-input-field"
                        name="newPassword1"
                        autoComplete="off"
                        type="password"
                        placeholder="New password"
                        {...props}
                      />
                    </Box>
                    <Box>
                      {/* @ts-ignore */}
                      <InputWithPlaceholder
                        id="password-reset-confirm-password-input-field"
                        name="newPassword2"
                        autoComplete="off"
                        type="password"
                        placeholder="Confirm new password"
                        {...props}
                      />
                    </Box>
                    <Box sx={{ my: 4, textAlign: "center" }}>
                      <QDButton
                        id="password-reset-save-password-button"
                        onClick={props.submitForm}
                        color="primary"
                        variant="contained"
                        label={intl.formatMessage(
                          defineMessage({
                            id: "password-reset-save-password-button",
                            defaultMessage: "Reset Password",
                            description: "Input Label",
                          })
                        )}
                      />
                    </Box>
                  </Container>
                </form>
              )}
            </Formik>
          </Paper>
        </Container>
      </Paper>
      <MessageUtil />
    </ThemeProvider>
  );
};

export default ForceResetPassword;
