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

import React, { lazy } from "react";
import { Container, Grid, Box, Typography } from "@mui/material";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import Helmet from "react-helmet";
import { useHistory } from "react-router-dom";
import BrandingWrapper from "../../app/BrandingWrapper";
import Icon from "../../components/common/Icon";

const QDButton = lazy(
  () => import("../../components/common/elements/QDButton")
);

const ErrorFallback = () => {
  const history = useHistory();
  const intl = useIntl();

  return (
    <>
      <Helmet>
        <title>
          {`${BrandingWrapper.brandingTitle} | ${intl.formatMessage({
            id: "error.noMatch",
            defaultMessage: "Oops, this page doesn’t exist.",
          })}`}
        </title>
      </Helmet>
      <Container disableGutters>
        <Grid
          height="100vh"
          alignItems="center"
          justifyContent="center"
          sx={{ backgroundColor: "#f7faff" }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "60px",
              paddingTop: "164px",
            }}
          >
            <Typography
              variant={"h1"}
              sx={{
                color: "#000000",
                fontSize: "36px",
                fontWeight: "600",
                lineHeight: "44px",
              }}
            >
              {intl.formatMessage({
                id: "error.noMatch",
                description: "No Match header",
                defaultMessage: "Oops, this page doesn’t exist.",
              })}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box sx={{ marginRight: "80px" }}>
                <QDButton
                  id="no-match-back-button"
                  size="medium"
                  onClick={() => history.goBack()}
                  color="primary"
                  variant="text"
                >
                  <>
                    <img
                      height={13}
                      width={8}
                      src={Icon.caretLeftDark}
                      alt="Caret Left"
                      className="mr-1"
                    />
                    <Typography ml={1} mr={2}>
                      <FormattedMessage
                        id="takeMeBack"
                        description="Take me back"
                        defaultMessage="Take me back"
                      />
                    </Typography>
                  </>
                </QDButton>
              </Box>
              <QDButton
                id="no-match-back-to-home-button"
                size="medium"
                onClick={() => history.push("/customer")}
                color="primary"
                variant="contained"
                label={intl.formatMessage(
                  defineMessage({
                    id: "takeMeHome",
                    defaultMessage: "Take me home",
                    description: "Take me home",
                  })
                )}
              />
            </Box>
          </Box>
        </Grid>
      </Container>
    </>
  );
};

export default ErrorFallback;
