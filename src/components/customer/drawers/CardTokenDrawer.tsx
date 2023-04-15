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
 *
 */

import React, { useContext, useEffect, useState } from "react";
import { Field, Formik } from "formik";
import Box from "@mui/material/Box";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import { Grid, FormGroup } from "@mui/material";
import { MessageContext } from "../../../contexts/MessageContext";
import api from "../../../api/api";
import QDCheckbox from "../../common/forms/inputs/QDCheckbox";
import Pill from "../../common/elements/PillLabel";
import QDButton from "../../common/elements/QDButton";
import CardTokenStatusConverter from "../../common/converters/CardTokenStatusConverter";
import emitter from "../../../emitter";
import { CustomerWalletsEvents } from "../pagenavs/PageNavWallets";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import RadioButtonGroup from "../../common/forms/buttons/RadioButtonGroup";
import Label from "../../common/elements/Label";
import Header from "../../common/elements/Header";

interface ICardTokenDrawer {
  cardTokens?: any;
  cardId: string;
  toggleDrawer?: any;
}
const CardTokenDrawer: React.FC<ICardTokenDrawer> = ({
  cardId,
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
}) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const [cardTokens, setCardTokens] = useState<any>([]);
  const [initialValues, setInitialValues] = useState({
    tokens: [],
    action: "",
    memo: "",
  });

  const searchTokens = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CardTokenManagementAPI.searchTokens(cardId)
      .then((result: any) => {
        setCardTokens(result);
      })
      .catch((error: any) => setErrorMsg(error));

  const suspendToken = (id: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CardTokenManagementAPI.suspendToken(cardId, dto).catch((error: any) =>
      setErrorMsg(error)
    );

  const unsuspendToken = (id: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CardTokenManagementAPI.unsuspendToken(cardId, dto).catch((error: any) =>
      setErrorMsg(error)
    );

  const deleteToken = (id: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CardTokenManagementAPI.deleteToken(cardId, dto).catch((error: any) =>
      setErrorMsg(error)
    );

  const getPillColor = (currentStatus: string) => {
    return currentStatus === "SUSPENDED" ? "error" : "info";
  };

  const doDelete = async (tokens: string[], memo: string) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const token of cardTokens) {
      if (tokens.indexOf(token.externalReference) > -1) {
        // eslint-disable-next-line no-await-in-loop
        await deleteToken(cardId, {
          requestorId: token.tokenRequestorId,
          externalReference: token.externalReference,
          comment: memo,
        });
      }
    }
  };

  const doUnsuspend = async (tokens: string[], memo: string) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const token of cardTokens) {
      // only unsuspend tokens that are currently suspended
      if (
        token.currentStatus.toUpperCase() === "SUSPENDED" &&
        tokens.indexOf(token.externalReference) > -1
      ) {
        // eslint-disable-next-line no-await-in-loop
        await unsuspendToken(cardId, {
          requestorId: token.tokenRequestorId,
          externalReference: token.externalReference,
          comment: memo,
        });
      }
    }
  };

  const doSuspend = async (tokens: string[], memo: string) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const token of cardTokens) {
      // only suspend tokens that are currently active
      if (
        token.currentStatus.toUpperCase() === "ACTIVE" &&
        tokens.indexOf(token.externalReference) > -1
      ) {
        // eslint-disable-next-line no-await-in-loop
        await suspendToken(cardId, {
          requestorId: token.tokenRequestorId,
          externalReference: token.externalReference,
          comment: memo && memo.length > 0 ? memo : null,
        });
      }
    }
  };

  const doAction = async (values: any) => {
    const { tokens, action, memo } = values;
    if (action === "suspend") {
      doSuspend(tokens, memo);
    } else if (action === "unsuspend") {
      doUnsuspend(tokens, memo);
    } else if (action === "delete") {
      doDelete(tokens, memo);
    }
    emitter.emit(CustomerWalletsEvents.CustomerWalletsChanged, {});
    toggleDrawer();
  };

  const TokenSchema = Yup.object().shape({
    tokens: Yup.array().min(
      1,
      intl.formatMessage({
        id: "error.cardToken.required",
        defaultMessage: "Please select at least one card token",
      })
    ),
    memo: Yup.string().max(
      128,
      intl.formatMessage({
        id: "error.memo.mustBe128Chars",
        defaultMessage: "Memo must be 128 characters or less.",
      })
    ),
  });

  useEffect(() => {
    searchTokens();
  }, []);

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => doAction(values)}
        validationSchema={TokenSchema}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
            {!props.values.action ? (
              <>
                <Box sx={{ marginBottom: "40px" }}>
                  <Header
                    level={2}
                    bold
                    color="white"
                    value={intl.formatMessage({
                      id: "tokens",
                      description: "drawer header",
                      defaultMessage: "Tokens",
                    })}
                  />
                </Box>
                <Box>
                  <Label htmlFor="tokens">
                    <FormattedMessage
                      id="drawer.card.tokens.label.select"
                      description="Label text"
                      defaultMessage="Select tokens to take action on:"
                    />
                  </Label>
                  <FormGroup sx={{ marginBottom: "70px" }}>
                    <RadioButtonGroup
                      id="tokensGroup"
                      value={props.values.tokens}
                      error={props.errors.tokens}
                      touched={props.touched.tokens}
                    >
                      {cardTokens &&
                        cardTokens.length > 0 &&
                        cardTokens.map(
                          (token: any, index: number) =>
                            token.currentStatus.toUpperCase() !==
                              "DEACTIVATED" && (
                              <Grid
                                container
                                sx={{ alignItems: "center" }}
                                key={`token-${token.externalReference}`}
                              >
                                <Grid item xs={8} md={8} lg={8}>
                                  <Field
                                    name="tokens"
                                    as={QDCheckbox}
                                    value={token.externalReference}
                                    data={{
                                      label: `*${token.tokenSuffix}`,
                                      key: `token-${token.externalReference}`,
                                      id: `token-${token.externalReference}`,
                                      checkbox: {
                                        color: "secondary",
                                        size: "small",
                                        checked:
                                          props.values.tokens.indexOf(
                                            token.externalReference
                                          ) > -1,
                                      },
                                    }}
                                    {...props}
                                  />
                                </Grid>
                                <Grid item xs={4} md={4} lg={4}>
                                  <Pill
                                    label={CardTokenStatusConverter(
                                      token.currentStatus,
                                      intl
                                    )}
                                    color={getPillColor(token.currentStatus)}
                                  />
                                </Grid>
                              </Grid>
                            )
                        )}
                    </RadioButtonGroup>
                  </FormGroup>
                  <FormGroup>
                    <QDButton
                      type="button"
                      id="drawer-card-token-suspend"
                      label={intl.formatMessage({
                        id: "suspend",
                        defaultMessage: "Suspend",
                      })}
                      onClick={() => {
                        props.setFieldValue("action", "suspend");
                      }}
                      variant="contained"
                      color="primary"
                      size="large"
                      textCase="provided"
                      fullWidth
                      disabled={!props.dirty}
                      style={{ width: "305px", marginBottom: "20px" }}
                    />
                    <QDButton
                      type="button"
                      id="drawer-card-token-unsuspend"
                      label={intl.formatMessage({
                        id: "unsuspend",
                        defaultMessage: "Unsuspend",
                      })}
                      onClick={() => {
                        props.setFieldValue("action", "unsuspend");
                      }}
                      variant="contained"
                      color="primary"
                      size="large"
                      textCase="provided"
                      fullWidth
                      disabled={!props.dirty}
                      style={{ width: "305px", marginBottom: "20px" }}
                    />
                    <QDButton
                      type="button"
                      onClick={() => {
                        props.setFieldValue("action", "delete");
                      }}
                      id="drawer-card-token-delete"
                      label={intl.formatMessage({
                        id: "delete",
                        defaultMessage: "Delete",
                      })}
                      variant="contained"
                      color="secondary"
                      size="large"
                      textCase="provided"
                      fullWidth
                      disabled={!props.dirty}
                      style={{ width: "305px", marginBottom: "20px" }}
                    />
                    <Box sx={{ marginLeft: "126px", marginTop: "24px" }}>
                      <QDButton
                        type="button"
                        onClick={() => toggleDrawer()}
                        id="drawer-card-token-delete"
                        label={intl.formatMessage({
                          id: "cancel",
                          defaultMessage: "Cancel",
                        })}
                        variant="text"
                        size="large"
                        color="secondary"
                        textCase="provided"
                      />
                    </Box>
                  </FormGroup>
                </Box>
              </>
            ) : (
              <>
                <Box sx={{ marginBottom: "40px" }}>
                  <Header
                    level={2}
                    bold
                    color="white"
                    value={intl.formatMessage({
                      id: `${props.values.action}Tokens`,
                      description: "drawer header",
                      defaultMessage: `${props.values.action} Tokens`,
                    })}
                  />
                </Box>
                <Box mt={2}>
                  <InputWithPlaceholder
                    id="drawer-card-token-memo"
                    name="memo"
                    autoComplete="off"
                    type="text"
                    multiline
                    placeholder={intl.formatMessage({
                      id: "memo.input.placeholder.max128Chars",
                      description: "form label",
                      defaultMessage: "Memo (128 characters max.)",
                    })}
                    {...props}
                  />
                </Box>
                <Box
                  sx={{
                    marginTop: "24px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <QDButton
                    type="button"
                    id="drawer-card-token-delete"
                    label={intl.formatMessage({
                      id: "cancel",
                      defaultMessage: "Cancel",
                    })}
                    variant="text"
                    size="large"
                    color="secondary"
                    textCase="provided"
                    onClick={() => {
                      console.log(props.values.action);
                      props.setFieldValue("action", "");
                    }}
                  />
                  <QDButton
                    type="submit"
                    label={intl.formatMessage({
                      id: "saveChanges",
                      defaultMessage: "Save Changes",
                    })}
                    variant="contained"
                    color="primary"
                    textCase="provided"
                  />
                </Box>
              </>
            )}
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default CardTokenDrawer;
