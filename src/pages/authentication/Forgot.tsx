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

import { Formik } from "formik";

import React, { useState, lazy } from "react";
import { Container, FormGroup, Box, Paper, Typography } from "@mui/material";

import * as Yup from "yup";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import Helmet from "react-helmet";
import InputWithPlaceholder from "../../components/common/forms/inputs/InputWithPlaceholder";
import api from "../../api/api";
import Icon from "../../components/common/Icon";
import ClickableRender from "../../components/common/ClickableRender";
import BrandingWrapper from "../../app/BrandingWrapper";
import LoginTopnav from "../../components/authentication/LoginTopnav";
import ThemeProvider from "../../theme/ThemeProvider";

const QDButton = lazy(
  () => import("../../components/common/elements/QDButton")
);

interface IForgot {
  history: any;
}

const Forgot: React.FC<IForgot> = ({ history }) => {
  const intl = useIntl();
  const [initialValues, setInitialValues] = useState({
    partnerName: "",
    userName: "",
  });

  const [validCredentials, setValidCredentials] = useState(false);
  const title = BrandingWrapper.brandingTitle;

  const resetPassword = (dto: any) =>
    // @ts-ignore
    api.PartnerAuthAPI.forgotPassword(dto)
      .then(() => {
        setValidCredentials(true);
        setInitialValues(dto);
      })
      // eslint-disable-next-line no-console
      .catch((error: any) => console.log(error));

  const ResetSchema = Yup.object().shape({
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
  });

  return (
    <ThemeProvider>
      <Paper variant="full">
        <Helmet>
          <title>
            {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
              id: "forgotPassword",
              defaultMessage: "Forgot Password",
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
                <form id="forgot-password-form" onSubmit={props.handleSubmit}>
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
                              id="forgot.reset.success"
                              defaultMessage="Success!"
                            />
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Typography component="h2" variant={"loginTitle"}>
                            <FormattedMessage
                              id="forgot.fill.fields"
                              defaultMessage="Please fill out the fields below."
                            />
                          </Typography>
                        </Box>
                      )}

                      {/* Message */}
                      {validCredentials ? (
                        <Box>
                          <Typography>
                            <FormattedMessage
                              id="forgot.reset.link.sent"
                              defaultMessage="Your password reset link is on its way to the email address associated with "
                            />
                            <span className="donkey">
                              {" "}
                              {initialValues.userName}
                            </span>
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Typography>
                            <FormattedMessage
                              id="forgot.will.send.link"
                              defaultMessage="We'll send you an email with a secure link to reset your password."
                            />
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Inputs */}
                    {validCredentials ? (
                      ""
                    ) : (
                      <FormGroup>
                        {/* @ts-ignore */}
                        <InputWithPlaceholder
                          id="forgot-password-partner-name-input-field"
                          name="partnerName"
                          autoComplete="on"
                          type="text"
                          placeholder={intl.formatMessage(
                            defineMessage({
                              id: "partner",
                              defaultMessage: "Partner",
                            })
                          )}
                          {...props}
                        />
                      </FormGroup>
                    )}
                    {validCredentials ? (
                      ""
                    ) : (
                      <FormGroup>
                        {/* @ts-ignore */}
                        <InputWithPlaceholder
                          id="forgot-password-username-input-field"
                          name="userName"
                          autoComplete="on"
                          type="text"
                          placeholder={intl.formatMessage(
                            defineMessage({
                              id: "forgot.field.emailAddressOrUsername",
                              defaultMessage: "Email address / username",
                            })
                          )}
                          {...props}
                        />
                      </FormGroup>
                    )}
                  </Container>

                  {/* Button */}
                  <Box sx={{ my: 4, textAlign: "center" }}>
                    {validCredentials ? (
                      <QDButton
                        id="forgot-password-back-to-login-button"
                        size="large"
                        onClick={() => history.push("/customer/")}
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
                        id="forgot-password-send-link-button"
                        type="submit"
                        size="large"
                        color="primary"
                        variant="contained"
                        label={intl.formatMessage(
                          defineMessage({
                            id: "forgot.button.sendMyResetLink",
                            defaultMessage: "Send my reset link",
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

export default Forgot;
