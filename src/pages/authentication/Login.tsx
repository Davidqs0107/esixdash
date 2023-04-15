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

import React, { useEffect, useState, lazy, useContext } from "react";
import { Container, Box, Paper, Typography } from "@mui/material";

import { Field, Formik } from "formik";
import { defineMessage, useIntl } from "react-intl";
import { History } from "history";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import Helmet from "react-helmet";
import BrandingWrapper from "../../app/BrandingWrapper";
import { login, setUserData } from "../../actions/AccountActions";
import InputWithPlaceholder from "../../components/common/forms/inputs/InputWithPlaceholder";
import ForceResetPassword from "./ForceResetPassword";
import LoginTopnav from "../../components/authentication/LoginTopnav";
import QDCheckbox from "../../components/common/forms/inputs/QDCheckbox";
import authService from "../../services/authService";
import { store } from "../../store";
import rolesRouteConfig from "../../app/routing/RolesRouteConfig";
import { MessageContext } from "../../contexts/MessageContext";
import ThemeProvider from "../../theme/ThemeProvider";
import CreateToast from "../../components/common/toasts/CreateToast";
import MessageUtil from "../../components/common/MessageUtil";
import { cacheIcons, cacheFlags } from "../../utils/cacheIcons";

const QDButton = lazy(
  () => import("../../components/common/elements/QDButton")
);

interface IRememberMe {
  rememberMe: boolean;
}

interface ILoginValues {
  userName: string;
  partnerName: string;
  password?: string;
}
interface IErrorResponseData {
  responseCode: string;
}
interface IErrorResponse {
  data: IErrorResponseData;
}
interface IErrorObject {
  response: IErrorResponse;
}

interface ILogin {
  history: History;
}

/**
 * Non-secret login information that we should 'remember' for the user.
 */
type LoginCache = {
  userName: string;
  partnerName: string;
  rememberMe: boolean;
};

const Login: React.FC<ILogin> = ({ history }) => {
  const intl = useIntl();
  // const classes = useStyles();
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = useState<
    IRememberMe & ILoginValues
  >({
    partnerName: "",
    userName: "",
    password: "",
    rememberMe: false,
  });
  const { setSuccessMsg } = useContext(MessageContext);
  const [validateOnChange, setValidateOnChange] = useState(true);
  const title = BrandingWrapper.brandingTitle;
  const [invalidCredentials, setCredentialsInvalid] = useState(false);
  const [invalidRole, setRoleInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formikValues, setFormikValues] = useState();
  const [forceResetPassword, setForceResetPassword] = useState(false);
  const LoginSchema = Yup.object().shape({
    partnerName: Yup.string().required(
      intl.formatMessage({
        id: "error.partnerName.required",
        defaultMessage: "Partner Name is a required field.",
      })
    ),
    userName: Yup.string().required(
      intl.formatMessage({
        id: "error.username.required",
        defaultMessage: "Username is a required field.",
      })
    ),
    password: Yup.string().required(
      intl.formatMessage({
        id: "error.password.required",
        defaultMessage: "Password is a required field.",
      })
    ),
  });

  // if we want to reinstate this code, we need to grab it from the AuthService instead
  // const checkIsLoggedIn = async () =>
  //   authService.isLoggedIn() ? history.push("/customer") : null;

  /**
   * We remember non-secret login information. This persists across sessions and browser restarts.
   */
  const cacheLoginInfo = ({
    partnerName,
    userName,
    rememberMe,
  }: LoginCache) => {
    localStorage.setItem("rememberMe", String(rememberMe));
    localStorage.setItem("userName", userName);
    localStorage.setItem("partnerName", partnerName);
    setInitialValues({ partnerName, userName, rememberMe });
  };

  const onSubmitSuccess = (values: LoginCache) => {
    cacheLoginInfo(values);
    const state = store.getState();
    const roles = state.account?.user?.roles;
    history.push(authService.getDefaultRoute(roles, rolesRouteConfig));
  };

  const populateIfCachePresent = () => {
    if (localStorage.getItem("rememberMe")) {
      const localPartner = localStorage.getItem("partnerName");
      const localUserName = localStorage.getItem("userName");
      setInitialValues({
        password: "",
        partnerName: localPartner !== null ? localPartner : "",
        userName: localUserName !== null ? localUserName : "",
        rememberMe: localStorage.getItem("rememberMe") === "true",
      });
    }

    if (localStorage.getItem("passwordWasChanged") === "true") {
      setSuccessMsg({
        responseCode: "200000",
        message: intl.formatMessage({
          id: "password.success.message",
          defaultMessage: `Password was successfully updated. Please login with your new password!`,
        }),
      });
      localStorage.removeItem("passwordWasChanged");
    }
  };

  useEffect(() => {
    populateIfCachePresent();
    cacheIcons();
    cacheFlags();
  }, []);

  // @ts-ignore
  return forceResetPassword ? (
    <ForceResetPassword
      forceUpdate={setForceResetPassword}
      changePassword={false}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      partnerName={initialValues.partnerName || formikValues.partnerName}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userName={initialValues.userName || formikValues.userName}
    />
  ) : (
    <>
      {invalidRole && (
        <>
          <CreateToast
            toastType="error"
            onCloseClick={() => setRoleInvalid(false)}
          >
            {intl.formatMessage({
              id: "error.invalid.role.header",
              defaultMessage: "Invalid Role",
            })}
            {""}
            {intl.formatMessage({
              id: "error.invalid.role.description",
              defaultMessage:
                "You do not have a role that is able to access the dashboard. Please contact your platform administrator.",
            })}
          </CreateToast>
        </>
      )}
      <ThemeProvider>
        <Paper variant="full" square={true}>
          <Helmet>
            <title>
              {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
                id: "login",
                defaultMessage: "Login",
              })}`}
            </title>
          </Helmet>

          <Container disableGutters>
            <LoginTopnav />
          </Container>

          <Container className="Login">
            <Box
              sx={{
                height: "118px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Typography variant="brandName">{title}</Typography>
            </Box>

            <Paper variant="formCentered">
              <Formik
                validateOnMount
                initialValues={initialValues}
                validateOnChange={validateOnChange}
                validateOnBlur={validateOnChange}
                validationSchema={LoginSchema}
                enableReinitialize
                onSubmit={async (
                  values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    // Needed for PWD reset
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    setFormikValues(values);

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    // this needs to be fixed later on by sharing the interface
                    const loginDispatch = await dispatch(login(values));

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    const { responseCode } = loginDispatch;

                    if (responseCode === "200065") {
                      const inputToCache = {
                        partnerName: values.partnerName,
                        userName: values.userName,
                        rememberMe: values.rememberMe,
                      };
                      cacheLoginInfo(inputToCache);
                      setForceResetPassword(true);
                      return;
                    }

                    if (responseCode === "205000") {
                      setCredentialsInvalid(true);
                      return;
                    }

                    if (responseCode === "201012") {
                      setCredentialsInvalid(true);
                      return;
                    }

                    // assume good to go
                    const user: any = await authService.populateUserStore();
                    const roles = user?.roles;
                    if (roles.length === 1 && roles.includes("System")) {
                      setRoleInvalid(true);
                      authService.setSession("");
                      return;
                    }

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    await dispatch(setUserData(user));

                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onSubmitSuccess(values);
                  } catch (error: any) {
                    const message: string =
                      (error.message && error.message) ||
                      intl.formatMessage({
                        id: "error.somethingWentWrong",
                        defaultMessage: "Something went wrong",
                      });

                    const responseCode: string =
                      error.responseCode && error.responseCode;

                    setStatus({ success: false });
                    setCredentialsInvalid(true);
                    setErrorMessage(
                      responseCode == "205000"
                        ? intl.formatMessage({
                            id: "error.login.205000",
                            defaultMessage:
                              "Incorrect username or password. Please try again.",
                          })
                        : responseCode == "201012"
                        ? intl.formatMessage({
                            id: "error.login.201012",
                            defaultMessage:
                              "Partner not found. Please try again.",
                          })
                        : message
                    );
                    // setErrors({ submit: message });
                    setSubmitting(false);
                  }
                }}
              >
                {(formikProps) => {
                  return (
                    <Box
                      component="form"
                      id="login-form"
                      onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        // !important for the validation to properly work
                        setValidateOnChange(true);
                        formikProps.handleSubmit(event);
                      }}
                    >
                      {invalidCredentials ? (
                        <Typography component="div" variant="error">
                          {errorMessage}
                        </Typography>
                      ) : null}

                      <Box>
                        <InputWithPlaceholder
                          id="login-partner-name-input-field"
                          name="partnerName"
                          placeholder={intl.formatMessage(
                            defineMessage({
                              id: "partnerName",
                              defaultMessage: "Partner Name",
                            })
                          )}
                          required
                          type="text"
                          touchOnChange
                          {...formikProps}
                        />
                        <InputWithPlaceholder
                          id="login-partner-username-input-field"
                          name="userName"
                          autoComplete="username"
                          type="text"
                          placeholder={intl.formatMessage(
                            defineMessage({
                              id: "username",
                              defaultMessage: "Username",
                            })
                          )}
                          required
                          touchOnChange
                          {...formikProps}
                        />
                        <InputWithPlaceholder
                          id="login-partner-password-input-field"
                          name="password"
                          autoComplete="password"
                          type="password"
                          placeholder={intl.formatMessage(
                            defineMessage({
                              id: "password",
                              defaultMessage: "Password",
                            })
                          )}
                          required
                          touchOnChange
                          {...formikProps}
                        />
                      </Box>

                      {/* Remember Me */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Field
                          name="rememberMe"
                          as={QDCheckbox}
                          value={formikProps.values.rememberMe}
                          data={{
                            label: intl.formatMessage(
                              defineMessage({
                                id: "login.label.rememberMe",
                                defaultMessage: "Remember me",
                              })
                            ),
                            key: "login-remember-me-checkbox",
                            id: "login-remember-me-checkbox",
                            checkbox: {
                              labelCursor: "default",
                              color: "primary",
                              size: "small",
                              checked: formikProps.values.rememberMe,
                            },
                          }}
                          {...formikProps}
                        />

                        <QDButton
                          id="login-forgot-password-button"
                          onClick={() => history.push("forgot")}
                          variant="text"
                          size="small"
                          textCase="provided"
                          label={intl.formatMessage({
                            id: "login.link.forgotPassword",
                            defaultMessage: "Forgot Password",
                          })}
                        />
                      </Box>

                      {/* Login Button */}
                      <Box sx={{ my: 4, textAlign: "center" }}>
                        <QDButton
                          id="login-submit-button"
                          onClick={() => {
                            setValidateOnChange(true);
                            formikProps.submitForm();
                          }}
                          color="primary"
                          variant="contained"
                          size="large"
                          type="submit"
                          textCase="provided"
                          // This might be cheeky, when the form first loads I need to disable the
                          // Submit button until all fields have been validated.
                          disabled={
                            !formikProps.dirty ||
                            !(
                              formikProps.isValid &&
                              Object.keys(formikProps.touched).length >= 1
                            )
                          }
                          className="grid-sized"
                          label={intl.formatMessage(
                            defineMessage({
                              id: "login.button.login",
                              defaultMessage: "Log In",
                            })
                          )}
                        />
                      </Box>
                    </Box>
                  );
                }}
              </Formik>
            </Paper>
          </Container>
        </Paper>
      </ThemeProvider>
      <MessageUtil />
    </>
  );
};

export default Login;
