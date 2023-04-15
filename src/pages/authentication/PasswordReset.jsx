/*
 * Copyright (c) 2015-2021, Episode Six and/or its affiliates. All rights reserved.
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

import React, { useState, lazy, useMemo } from "react";
import { Grid, Container, FormGroup, Box } from "@mui/material";
import * as Yup from "yup";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { useLocation } from "react-router-dom";
import InputWithPlaceholder from "../../components/common/forms/inputs/InputWithPlaceholder";
import api from "../../api/api";
import Icon from "../../components/common/Icon";
import ClickableRender from "../../components/common/ClickableRender";
import BrandingWrapper from "../../app/BrandingWrapper";
import LoginTopnav from "../../components/authentication/LoginTopnav";

const QDButton = lazy(() =>
  import("../../components/common/elements/QDButton")
);

const PassWordReset = ({ history }) => {
  const intl = useIntl();
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");

  const [initialValues, setInitialValues] = useState({
    newPassword1: "",
    newPassword2: "",
  });
  const [validCredentials, setValidCredentials] = useState(false);
  const [apiResponse, setApiResponse] = useState();
  const title = BrandingWrapper.brandingTitle;

  const resetPassword = (dto) => {
    const { newPassword1 } = dto;

    const resetPassDto = {
      token,
      newPassword: newPassword1,
    };

    return (
      api.PartnerAuthAPI.resetPassword(resetPassDto)
        .then((res) => {
          setValidCredentials(true);
          setInitialValues(dto);
        })
        // eslint-disable-next-line no-console
        .catch((error) => {
          setApiResponse(error.message);
        })
    );
  };

  const ResetSchema = Yup.object().shape({
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
          id: "error.password.mustContain.32Charss",
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
        is: (val) => !!(val && val.length > 0),
        then: Yup.string().oneOf(
          [Yup.ref("newPassword1")],
            intl.formatMessage({
                id: "error.password.bothSame",
                defaultMessage: "Both passwords need to be the same",
            })
        ),
      }),
  });

  return (
    <>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "page.title.resetPassword",
            defaultMessage: "Reset Password",
          })}`}
        </title>
      </Helmet>
      <Container fluid>
        <LoginTopnav />
      </Container>
      <Container className="Forgot" fluid>
        <Row className="pt-5">
          <Col xs={12} md={{ size: 7, offset: 2 }}>
            <Formik
              className="vCenter"
              initialValues={initialValues}
              onSubmit={(values, actions) => resetPassword(values, actions)}
              validationSchema={ResetSchema}
            >
              {(props) => (
                <form id="reset-password-form" onSubmit={props.handleSubmit}>
                  <Container>
                    <Grid container className="brand-corner">
                      <Gird item md={5} className="text-center">
                        <span className="t-console">{title}</span>
                      </Gird>
                    </Grid>
                    <Grid container className="pt-3">
                      {validCredentials ? (
                        " "
                      ) : (
                        <Grid
                          item
                          className="back-button"
                          md={{ size: 1, offset: 2 }}
                        >
                          <ClickableRender
                            id="back-button"
                            className="float-right mt-4 ml-5"
                            onClickFunc={() => history.push("/customer/")}
                          >
                            <img
                              height={13}
                              width={8}
                              src={Icon.caretLeftDark}
                              alt="Caret Left"
                            />
                          </ClickableRender>
                        </Grid>
                      )}
                      {validCredentials ? (
                        <Grid item md={7}>
                          <span className="enter-the-email-addr">
                            <FormattedMessage
                              id="reset.reset.success"
                              defaultMessage="Success!"
                              description="Success"
                            />
                          </span>
                        </Grid>
                      ) : (
                        <Grid item md={6}>
                          <span className="enter-the-email-addr">
                            <FormattedMessage
                              id="reset.password.fields"
                              defaultMessage="Reset Your Password Below."
                              description="Reset Your Password Below"
                            />
                          </span>
                        </Grid>
                      )}
                    </Grid>
                    {validCredentials ? (
                      <Grid container>
                        <Grid item md={{ size: 7, offset: 3 }}>
                          <span className="message">
                            <FormattedMessage
                              id="reset.reset.link.sent"
                              defaultMessage="Your password was reset successfully"
                              description="Reset link sent"
                            />
                            <span className="donkey">
                              {initialValues.userName}
                            </span>
                          </span>
                        </Grid>
                      </Grid>
                    ) : (
                      <Row>
                        <Col md={{ size: 7, offset: 3 }}>
                          <span className="message">
                            <FormattedMessage
                              id="reset.password.instructions"
                              defaultMessage="Enter your new password below, then confirm your new password in the second field"
                              description="Enter your new password instructions"
                            />
                          </span>
                        </Col>
                      </Row>
                    )}
                    {validCredentials ? (
                      ""
                    ) : (
                      <Grid className="pt-5">
                        <Grid md={{ size: 7, offset: 3 }}>
                          <InputWithPlaceholder
                            id="newPassword1-input-field"
                            name="newPassword1"
                            autoComplete="on"
                            type="password"
                            className="login-input"
                            placeholder="New Password*"
                            {...props}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {validCredentials ? (
                      ""
                    ) : (
                      <Grid className="pt-3">
                        <Grid md={{ size: 7, offset: 3 }}>
                          <InputWithPlaceholder
                            id="newPassword2-input-field"
                            name="newPassword2"
                            autoComplete="on"
                            type="password"
                            className="login-input"
                            placeholder="Confirm New Password*"
                            {...props}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Container>
                  {validCredentials ? (
                    <Grid className="pt-5">
                      <Grid md={{ size: 5, offset: 4 }}>
                        <FormGroup className="text-center">
                          <QDButton
                            id="reset-password-back-to-login-button"
                            className="mt-3 mr-2"
                            size="md"
                            onClick={() => history.push("/")}
                            color="primary"
                            variant="contained"
                            label={intl.formatMessage(
                              defineMessage({
                                id: "reset-password-back-to-login-button",
                                defaultMessage: "Back To Login Screen",
                                description: "Input Label",
                              })
                            )}
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid className="pt-5">
                      <Grid md={{ size: 5, offset: 4 }}>
                        <span className="message label-error">
                          {apiResponse}
                        </span>
                        <FormGroup className="text-center">
                          <QDButton
                            id="reset-password-button"
                            className="mt-3 mr-2"
                            type="submit"
                            color="primary"
                            variant="contained"
                            disabled={!props.isValid}
                            label={intl.formatMessage(
                              defineMessage({
                                id: "reset-password-button",
                                defaultMessage: "Reset password",
                                description: "Input Label",
                              })
                            )}
                          />
                        </FormGroup>
                      </Grid>
                    </Grid>
                  )}
                </form>
              )}
            </Formik>
          </Col>
        </Row>
      </Container>
    </>
  );
};

PassWordReset.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};
export default PassWordReset;
