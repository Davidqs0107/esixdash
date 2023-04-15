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
 *
 */

import React, { lazy, useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Field, FieldArray, Formik } from "formik";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import Header from "../../common/elements/Header";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import CancelButton from "../../common/elements/CancelButton";
import QDCheckbox from "../../common/forms/inputs/QDCheckbox";
import Label from "../../common/elements/Label";
import Icon from "../../common/Icon";
import DebouncedButton from "../../common/elements/DebouncedButton";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

interface IReIssueCard {
  showCardForm: any;
  processReissue: any;
  cardId: any;
  customerId: any;
  personId: any;
  showExpedited?: boolean;
  cardExpiry: any;
  cardOrderInfo?: any;
  cardType: string;
}

const ReIssueCard: React.FC<IReIssueCard> = ({
  showCardForm,
  processReissue,
  cardId,
  customerId,
  personId,
  showExpedited,
  cardExpiry,
  cardOrderInfo,
  cardType,
}) => {
  const intl = useIntl();
  const [selectedMergeStrategy, setSelectedMergeStrategy] = useState();
  const formRef: any = useRef(null);

  const [initialValues] = useState({
    samePan: false,
    sameExpiry: false,
    chargeFee: false,
    deactivateCurrent: true,
    expeditedShipping: false,
    expiry: "",
    attributes: [],
    attributeMergeStrategy: "",
    cardExpiry: cardExpiry,
  });

  const [attributeMergeStrategies] = useState([
    {
      code: "USE_PREVIOUS",
      text: intl.formatMessage({
        id: "usePrevious",
        defaultMessage: "Use Previous",
      }),
    },
    {
      code: "UPDATE_PREVIOUS",
      text: intl.formatMessage({
        id: "updatePrevious",
        defaultMessage: "Update Previous",
      }),
    },
    {
      code: "USE_NEW",
      text: intl.formatMessage({
        id: "useNew",
        defaultMessage: "Use New",
      }),
    },
    {
      code: "NONE",
      text: intl.formatMessage({
        id: "none",
        defaultMessage: "None",
      }),
    },
  ]);

  const reissueCard = (values: any) => {
    if (cardType == "virtual") {
      delete values.deactivateCurrent;
    }

    processReissue(customerId, {
      cardId,
      personId,
      ...values,
    });
  };

  const ReIssueCardSchema = Yup.object().shape({
    samePan: Yup.bool(),
    sameExpiry: Yup.bool(),
    chargeFee: Yup.bool(),
    deactivateCurrent: Yup.bool(),
    expeditedShipping: Yup.bool(),
    expiry: Yup.string().when(["samePan", "sameExpiry"], {
      is: (samePan: boolean, sameExpiry: boolean) =>
        !samePan || (samePan && !sameExpiry),
      then: Yup.string()
        .test(
          "expiryFormat",
          intl.formatMessage({
            id: "error.expiry.dateFormat",
            defaultMessage: "Expiry Override must be in YYYYMM format.",
          }),
          (value) => value == undefined || /^\d{4}(0[1-9]|1[0-2])$/.test(value)
        )
        .test(
          "expiryValidity",
          intl.formatMessage({
            id: "error.expiry.validDate",
            defaultMessage: "Value must be a valid expiry date.",
          }),
          (value) => {
            if (value !== undefined) {
              var today = new Date(),
                expiryDate = new Date(),
                exYear = parseInt(value.substring(0, 4)),
                exMonth = parseInt(value.substring(4, 6));

              expiryDate.setFullYear(exYear, exMonth - 1, today.getDate());

              return !isNaN(expiryDate.getTime()) && expiryDate > today;
            }
            return value == undefined;
          }
        ),
      otherwise: Yup.string(),
    }),
    attributeMergeStrategy: Yup.string().required(
      intl.formatMessage({
        id: "error.attributeMergeStrategy.required",
        defaultMessage: "Attribute Merge Strategy is a required field.",
      })
    ),
    attributes: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required(
          intl.formatMessage({
            id: "error.name.required",
            defaultMessage: "Name is a required field.",
          })
        ),
        value: Yup.string().required(
          intl.formatMessage({
            id: "error.value.required",
            defaultMessage: "Value is a required field.",
          })
        ),
      })
    ),
  });

  return (
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    <Grid container sx={{ width: "400px", pl: 2, pr: 2 }}>
      <Grid item sx={{ mb: 2 }}>
        <Header
          level={2}
          color="white"
          value={intl.formatMessage({
            id: "reissue.cards.title",
            defaultMessage: "Reissue Card",
          })}
          bold
        />
      </Grid>
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={ReIssueCardSchema}
        onSubmit={(values) => reissueCard(values)}
        enableReinitialize
      >
        {(props: any) => (
          <Box sx={{ width: "100%" }}>
            <form onSubmit={props.handleSubmit}>
              <Grid container direction="column">
                {cardType != "virtual" && (
                  <Grid item xs={12}>
                    <Field
                      name="deactivateCurrent"
                      as={QDCheckbox}
                      value={props.values.deactivateCurrent}
                      data={{
                        label: intl.formatMessage({
                          id: "reissue.cards.deactivateCurrent",
                          defaultMessage: "Deactivate Current",
                        }),
                        id: "deactivate-current",
                        key: "deactivateCurrent",
                        checkbox: {
                          color: "secondary",
                          size: "small",
                          checked: props.values.deactivateCurrent,
                        },
                      }}
                      {...props}
                    />

                    {props.errors.deactivateCurrent && (
                      <p className="label-material-form-error">
                        {props.errors.deactivateCurrent}
                      </p>
                    )}
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Field
                    name="samePan"
                    as={QDCheckbox}
                    value={props.values.samePan}
                    data={{
                      label: intl.formatMessage({
                        id: "reissue.cards.samePan",
                        defaultMessage: "Same PAN",
                      }),
                      id: "same-pan",
                      key: "samePan",
                      checkbox: {
                        color: "secondary",
                        size: "small",
                        checked: props.values.samePan,
                      },
                    }}
                    {...props}
                  />
                  {props.errors.samePan && (
                    <p className="label-material-form-error">
                      {props.errors.samePan}
                    </p>
                  )}
                </Grid>

                {props.values.samePan && (
                  <Grid item xs={12}>
                    <Field
                      name="sameExpiry"
                      as={QDCheckbox}
                      value={props.values.sameExpiry}
                      data={{
                        label: intl.formatMessage({
                          id: "reissue.cards.sameExpiry",
                          defaultMessage: "Same Expiry",
                        }),
                        id: "same-expiry",
                        key: "sameExpiry",
                        checkbox: {
                          color: "secondary",
                          size: "small",
                          checked: props.values.sameExpiry,
                        },
                      }}
                      {...props}
                    />
                    {props.errors.sameExpiry && (
                      <p className="label-material-form-error">
                        {props.errors.sameExpiry}
                      </p>
                    )}
                  </Grid>
                )}

                <Grid item sx={{ mt: 2 }}>
                  <InputWithPlaceholder
                    id="expiry-input"
                    name="expiry"
                    autoComplete="off"
                    type="text"
                    placeholder={
                      <FormattedMessage
                        id="expiryOverride"
                        description="Expiry Override (YYYYMM)"
                        defaultMessage="Expiry Override (YYYYMM)"
                      />
                    }
                    value={props.values.expiry}
                    {...props}
                    disabled={props.values.samePan && props.values.sameExpiry}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Field
                    name="chargeFee"
                    as={QDCheckbox}
                    value={props.values.chargeFee}
                    data={{
                      label: intl.formatMessage({
                        id: "reissue.cards.chargeFee",
                        defaultMessage: "Charge Fee",
                      }),
                      id: "add-fee-charge",
                      key: "add-fee-charge",
                      checkbox: {
                        color: "secondary",
                        size: "small",
                        checked: props.values.chargeFee,
                      },
                    }}
                    {...props}
                  />
                </Grid>

                {showExpedited ? (
                  <Grid item xs={12}>
                    <Field
                      name="expeditedShipping"
                      as={QDCheckbox}
                      value={props.values.expeditedShipping}
                      data={{
                        label: intl.formatMessage({
                          id: "reissue.cards.expeditedShipping",
                          defaultMessage: "Expedited Shipping",
                        }),
                        id: "expedited-shipping",
                        key: "expedited-shipping",
                        checkbox: {
                          color: "secondary",
                          size: "small",
                          checked: props.values.expeditedShipping,
                        },
                      }}
                      {...props}
                    />
                  </Grid>
                ) : null}

                <Grid item sx={{ mb: 2, mt: 2 }}>
                  <Label htmlFor="attributes">
                    <FormattedMessage
                      id="cardOrderAttributes"
                      defaultMessage="Card Order Attributes"
                    />
                  </Label>
                </Grid>

                <Grid item xs={12} className="mb-2">
                  <DropdownFloating
                    id="attribute-merge-strategy"
                    name="attributeMergeStrategy"
                    placeholder={intl.formatMessage({
                      id: "attributeMergeStrategy",
                      defaultMessage: "Attribute Merge Strategy*",
                    })}
                    value={props.values.attributeMergeStrategy}
                    list={attributeMergeStrategies}
                    valueKey="code"
                    validationMessage={props.errors.attributeMergeStrategy}
                    isActive
                    initialval={props.values.attributeMergeStrategy}
                    {...props}
                    handleChange={(e: any) => {
                      props.handleChange(e);
                      setSelectedMergeStrategy(e.target.value);
                      if (e.target.value === "UPDATE_PREVIOUS") {
                        props.setFieldValue(
                          "attributes",
                          cardOrderInfo.attributes.map((attribute: any) => ({
                            name: attribute.name,
                            value: attribute.value,
                          }))
                        );
                      } else {
                        props.setFieldValue("attributes", []);
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} className="mb-4">
                  <FieldArray
                    name="attributes"
                    render={({ remove, push }) => (
                      <Box>
                        {props.values.attributes &&
                        props.values.attributes.length > 0
                          ? props.values.attributes.map(
                              (_: any, index: any) => (
                                <Box>
                                  {selectedMergeStrategy !==
                                  "UPDATE_PREVIOUS" ? (
                                    <Grid
                                      container
                                      direction="column"
                                      /* eslint-disable-next-line react/no-array-index-key */
                                      key={`div.attributes.${index}`}
                                    >
                                      <Grid container>
                                        <Grid item sx={{ width: 40, pt: 4 }}>
                                          <QDButton
                                            type="button"
                                            onClick={() => remove(index)}
                                            id="ext-acct-remove-attribute"
                                            variant="icon"
                                          >
                                            <img
                                              height={16}
                                              width={16}
                                              src={Icon.deleteIcon}
                                              alt="delete icon"
                                            />
                                          </QDButton>
                                        </Grid>
                                        <Grid item flexGrow="1">
                                          {props.errors.attributes &&
                                            props.errors.attributes[index] &&
                                            props.errors.attributes[index]
                                              .name && (
                                              <Label variant="error" noMargin>
                                                {
                                                  props.errors.attributes[index]
                                                    .name
                                                }
                                              </Label>
                                            )}
                                          <InputWithPlaceholder
                                            type="text"
                                            name={`attributes.${index}.name`}
                                            autoComplete="off"
                                            placeholder={intl.formatMessage({
                                              id: "drawer.ext.acct.label.name",
                                              description: "Input Label",
                                              defaultMessage: "Name*",
                                            })}
                                            className="login-input"
                                            value={
                                              props.values.attributes[index]
                                                .name
                                            }
                                            index={index}
                                            altName="attributes"
                                            margin={0}
                                            {...props}
                                          />
                                        </Grid>
                                      </Grid>

                                      <Grid container>
                                        <Grid item sx={{ width: 40 }}>
                                          &nbsp;
                                        </Grid>
                                        <Grid item flexGrow="1">
                                          {props.errors.attributes &&
                                            props.errors.attributes[index] &&
                                            props.errors.attributes[index]
                                              .value && (
                                              <Label variant="error" noMargin>
                                                {
                                                  props.errors.attributes[index]
                                                    .value
                                                }
                                              </Label>
                                            )}
                                          <InputWithPlaceholder
                                            type="text"
                                            name={`attributes.${index}.value`}
                                            autoComplete="off"
                                            placeholder={intl.formatMessage({
                                              id: "drawer.ext.acct.label.value",
                                              description: "Input Label",
                                              defaultMessage: "Value*",
                                            })}
                                            className="login-input"
                                            value={
                                              props.values.attributes[index]
                                                .value
                                            }
                                            index={index}
                                            altName="attributes"
                                            {...props}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  ) : (
                                    <Grid
                                      container
                                      direction="column"
                                      /* eslint-disable-next-line react/no-array-index-key */
                                      key={`div.attributes.${index}`}
                                      mb={2}
                                    >
                                      <Grid container>
                                        <Grid item sx={{ width: 40, pt: 0.5 }}>
                                          <QDButton
                                            type="button"
                                            onClick={() => remove(index)}
                                            id="ext-acct-remove-attribute"
                                            variant="icon"
                                          >
                                            <img
                                              height={16}
                                              width={16}
                                              src={Icon.deleteIcon}
                                              alt="delete icon"
                                            />
                                          </QDButton>
                                        </Grid>
                                        <Grid item flexGrow="1">
                                          {props.errors.attributes &&
                                            props.errors.attributes[index] &&
                                            props.errors.attributes[index]
                                              .name && (
                                              <Label variant="error" noMargin>
                                                {
                                                  props.errors.attributes[index]
                                                    .name
                                                }
                                              </Label>
                                            )}
                                          <InputWithPlaceholder
                                            type="text"
                                            name={`attributes.${index}.value`}
                                            autoComplete="off"
                                            placeholder={
                                              selectedMergeStrategy !==
                                              "UPDATE_PREVIOUS"
                                                ? intl.formatMessage({
                                                    id: "drawer.ext.acct.label.value",
                                                    description: "Input Label",
                                                    defaultMessage: "Value*",
                                                  })
                                                : props.values.attributes[index]
                                                    .name
                                            }
                                            className="login-input"
                                            value={
                                              props.values.attributes[index]
                                                .value
                                            }
                                            index={index}
                                            altName="attributes"
                                            margin={0}
                                            {...props}
                                          />
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  )}
                                </Box>
                              )
                            )
                          : null}

                        {selectedMergeStrategy == "USE_NEW" && (
                          <Box sx={{ pb: 2, textAlign: "right" }}>
                            <QDButton
                              onClick={() => push("")}
                              id="drawer-ext-acct-add-attribute"
                              color="primary"
                              variant="contained"
                              size="small"
                              label={intl.formatMessage(
                                defineMessage({
                                  id: "drawer.ext.acct.add.attribute",
                                  defaultMessage: "ADD ADDITIONAL ATTRIBUTES",
                                  description: "header",
                                })
                              )}
                            />
                          </Box>
                        )}
                      </Box>
                    )}
                  />
                </Grid>

                <Grid
                  item
                  container
                  direction="row"
                  justifyContent="space-around"
                  mt={4}
                >
                  <Grid
                    item
                    xs={6}
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <CancelButton
                      id="re-issue-card-cancel-button"
                      onClick={() => showCardForm(false)}
                    >
                      <FormattedMessage
                        id="re.issue.card.cancel.button"
                        description="Cancel card button"
                        defaultMessage="Cancel"
                      />
                    </CancelButton>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    style={{ display: "flex", justifyContent: "flex-end" }}
                  >
                    <DebouncedButton
                      id="re-issue-card-submit-button"
                      disabled={!props.dirty}
                      type="submit"
                      variant="contained"
                      delay={2000}
                      onClick={props.submitForm}
                    >
                      <FormattedMessage
                        id="submit"
                        description="Submit button"
                        defaultMessage="Submit"
                      />
                    </DebouncedButton>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
      </Formik>
    </Grid>
  );
};

export default ReIssueCard;
