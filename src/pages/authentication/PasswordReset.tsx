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

import { Formik } from "formik";

import React, { useState, lazy } from "react";
import { Container, FormGroup, Box, Typography, Paper } from "@mui/material";
import * as Yup from "yup";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import Helmet from "react-helmet";
import { useLocation, useHistory } from "react-router-dom";
import InputWithPlaceholder from "../../components/common/forms/inputs/InputWithPlaceholder";
import api from "../../api/api";
import Icon from "../../components/common/Icon";
import ClickableRender from "../../components/common/ClickableRender";
import BrandingWrapper from "../../app/BrandingWrapper";
import LoginTopnav from "../../components/authentication/LoginTopnav";
import ThemeProvider from "../../theme/ThemeProvider";
import CreateToast from "../../components/common/toasts/CreateToast";

const QDButton = lazy(
  () => import("../../components/common/elements/QDButton")
);

const PassWordReset: React.FC<any> = (props: any) => {
  const intl = useIntl();
  const { search } = useLocation();
  const history = useHistory();
  const token = new URLSearchParams(search).get("token");

  const [initialValues, setInitialValues] = useState({
    newPassword1: "",
    newPassword2: "",
  });
  const [validCredentials, setValidCredentials] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>();
  const title = BrandingWrapper.brandingTitle;

  const resetPassword = (dto: any) => {
    const { newPassword1 } = dto;

    const resetPassDto = {
      token,
      newPassword: newPassword1,
    };

    return (
      //@ts-ignore
      api.PartnerAuthAPI.resetPassword(resetPassDto)
        .then((res: any) => {
          setValidCredentials(true);
          setInitialValues(dto);
        })
        // eslint-disable-next-line no-console
        .catch((error: any) => {
          const { message } = error;
          setApiResponse(message);
          return;
        })
    );
  };

  const ResetSchema = Yup.object().shape({
    newPassword1: Yup.string()
      .required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Password is a required field",
          },
          {
            fieldName: intl.formatMessage({
              id: "password",
              defaultMessage: "Password",
            }),
          }
        )
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
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Confirm password is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "confirmPassword",
              defaultMessage: "Confirm password",
            }),
          }
        )
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
            id: "error.password.mustBeTheSame",
            defaultMessage: "Both passwords need to be the same",
          })
        ),
      }),
  });

  return (
    <ThemeProvider>
      <Paper variant="full">
        <Helmet>
          <title>
            {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
              id: "page.title.resetPassword",
              defaultMessage: "Reset Password",
            })}`}
          </title>
        </Helmet>

        <Container disableGutters>
          <LoginTopnav />
        </Container>

        <Container className="Forgot">
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
              initialValues={initialValues}
              onSubmit={(values, actions) => resetPassword(values)}
              validationSchema={ResetSchema}
            >
              {(props) => (
                <form id="reset-password-form" onSubmit={props.handleSubmit}>
                  <Container>
                    {/* Back Icon */}

                    {validCredentials ? (
                      " "
                    ) : (
                      <Box
                        sx={{
                          position: "absolute",
                          left: "0",
                          top: "20px",
                        }}
                      >
                        <ClickableRender onClickFunc={() => history.push("/")}>
                          <img
                            height={"auto"}
                            width={11}
                            src={Icon.caretLeftDark}
                            alt="Caret Left"
                          />
                        </ClickableRender>
                      </Box>
                    )}

                    <Box className="formHeader">
                      {/* Title */}
                      {validCredentials ? (
                        <Box>
                          <Typography component="h2" variant={"loginTitle"}>
                            <FormattedMessage
                              id="reset.reset.success"
                              defaultMessage="Success!"
                              description="Success"
                            />
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Typography component="h2" variant={"loginTitle"}>
                            <FormattedMessage
                              id="reset.password.fields"
                              defaultMessage="Reset Your Password Below."
                              description="Reset Your Password Below"
                            />
                          </Typography>
                        </Box>
                      )}

                      {/* Message */}
                      {validCredentials ? (
                        <Box>
                          <Typography>
                            <FormattedMessage
                              id="reset.reset.link.sent"
                              defaultMessage="Your password was reset successfully"
                              description="Reset link sent"
                            />
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Typography>
                            <FormattedMessage
                              id="reset.password.instructions"
                              defaultMessage="Enter your new password below, then confirm your new password in the second field"
                              description="Enter your new password instructions"
                            />
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Inputs */}
                    {validCredentials ? (
                      ""
                    ) : (
                      <>
                        <Box>
                          {apiResponse ? (
                            <CreateToast toastType="error">
                              <FormattedMessage
                                id="reset.password.error"
                                defaultMessage="Reset password error"
                              />
                              {""}
                              {apiResponse}
                            </CreateToast>
                          ) : null}
                        </Box>
                        <FormGroup>
                          {/* @ts-ignore */}
                          <InputWithPlaceholder
                            id="newPassword1-input-field"
                            name="newPassword1"
                            autoComplete="on"
                            type="password"
                            className="login-input"
                            placeholder={`${intl.formatMessage({
                              id: "newPassword",
                              defaultMessage: "New Password",
                            })}*`}
                            {...props}
                          />
                        </FormGroup>
                      </>
                    )}

                    {validCredentials ? (
                      ""
                    ) : (
                      <FormGroup>
                        {/* @ts-ignore */}
                        <InputWithPlaceholder
                          id="newPassword2-input-field"
                          name="newPassword2"
                          autoComplete="on"
                          type="password"
                          className="login-input"
                          placeholder={`${intl.formatMessage({
                            id: "confirmNewPassword",
                            defaultMessage: "Confirm New Password",
                          })}*`}
                          {...props}
                        />
                      </FormGroup>
                    )}
                  </Container>

                  {/* Button */}
                  <Box sx={{ my: 4, textAlign: "center" }}>
                    {validCredentials ? (
                      <QDButton
                        id="reset-password-back-to-login-button"
                        size="large"
                        onClick={() => history.push("/")}
                        color="primary"
                        variant="contained"
                        label={intl.formatMessage(
                          defineMessage({
                            id: "forgot.button.backToLoginScreen",
                            defaultMessage: "Back To Login Screen",
                          })
                        )}
                      />
                    ) : (
                      <QDButton
                        id="reset-password-button"
                        type="submit"
                        onClick={props.submitForm}
                        disabled={!props.isValid}
                        size="large"
                        color="primary"
                        variant="contained"
                        label={intl.formatMessage(
                          defineMessage({
                            id: "resetPassword",
                            defaultMessage: "Reset password",
                          })
                        )}
                      />
                    )}
                  </Box>
                </form>
              )}
            </Formik>
          </Paper>
        </Container>
      </Paper>
    </ThemeProvider>
  );
};

export default PassWordReset;
