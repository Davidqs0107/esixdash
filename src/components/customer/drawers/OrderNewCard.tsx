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

import React, { FC, useContext, useEffect, useState } from "react";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import * as Yup from "yup";
import { Field, FieldArray, Formik } from "formik";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import emitter from "../../../emitter";
import { CustomerDetailContext } from "../../../contexts/CustomerDetailContext";
import { CardsEvent } from "../WalletCards";
import CancelButton from "../../common/elements/CancelButton";
import { CustomerWalletsEvents } from "../pagenavs/PageNavWallets";
import Header from "../../common/elements/Header";
import QDButton from "../../common/elements/QDButton";
import Icon from "../../common/Icon";
import Label from "../../common/elements/Label";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import QDCheckbox from "../../common/forms/inputs/QDCheckbox";
import SubmitButton from "../../common/elements/SubmitButton";

interface IOrderNewCard {
  toggleDrawer?: () => void;
}

const OrderNewCard: FC<IOrderNewCard> = (props) => {
  const { toggleDrawer } = props;
  const intl = useIntl();

  const { customerNumber, programName } = useContext(CustomerDetailContext);

  const initialState = {
    cardProfile: "",
    personName: "",
    attributes: [],
    expiry: "",
    chargeFee: false,
    expeditedShipping: false,
  };

  const [initialValues] = useState(initialState);

  const [cardProfiles, setCardProfiles] = useState<any>([]);
  const [profiles, setProfiles] = useState<any>([]);
  const [persons, setPersons] = useState<any>([]);
  const [personNames, setPersonNames] = useState<any>([]);

  const getPersons = () =>
    // @ts-ignore
    api.CustomerAPI.getPersons(customerNumber).catch((error) => error);
  // eslint-disable-next-line max-len
  const getCardProfiles = () =>
    // @ts-ignore
    api.CardProfileAPI.getCardProfiles(programName, null).catch(
      (error: any) => []
    );
  const orderPersonalized = (customerIdentifier: any, dto: any) =>
    // @ts-ignore
    api.CustomerAPI.orderPersonalized(customerIdentifier, dto).catch(
      (error: any) => error
    );

  const buildFormValues = async () => {
    getCardProfiles().then((profiles: any) => {
      setProfiles(profiles);
      const profileNames: any[] = [];
      profiles.map((profile: { name: any }) => profileNames.push(profile.name));
      setCardProfiles(profileNames);
    });

    await getPersons().then((personList: any) => {
      setPersons(personList);
      const list = personList.map(
        (person: { lastName: any; firstName: any }) =>
          `${person.lastName}, ${person.firstName}`
      );
      setPersonNames(list);
    });
  };

  const findPersonId = (personName: string) => {
    const found = persons.find(
      (person: { lastName: any; firstName: any }) =>
        `${person.lastName}, ${person.firstName}` === personName
    );
    return found ? found.id : null;
  };

  const findCardType = (cardProfileName: string) => {
    const found = profiles.find(
      (profile: any) => profile.name === cardProfileName
    );
    return found ? found.cardType : null;
  };

  const orderNewCard = async (values: any) => {
    await orderPersonalized(customerNumber, {
      cardProfileName: values.cardProfile,
      personId: findPersonId(values.personName),
      cardOrderAttributes: values.attributes,
      attributeMergeStrategy:
        values.attributes.length > 0 ? "USE_NEW" : undefined,
      chargeFee: values.chargeFee,
      expeditedShipping: values.expeditedShipping,
      expiry: values.expiry,
    });

    await emitter.emit(CardsEvent.CardsChanged, {});
    await emitter.emit(CustomerWalletsEvents.CustomerWalletsChanged, {});
    await emitter.emit("customer.block.changed", {});
    await emitter.emit("customer.details.changed", {});
    if (toggleDrawer) {
      toggleDrawer();
    }
  };

  useEffect(() => {
    buildFormValues();
  }, []);

  const OrderNewCardSchema = Yup.object().shape({
    cardProfile: Yup.string().required(
      intl.formatMessage({
        id: "error.cardProfile.required",
        defaultMessage: "Card Profile is a required field.",
      })
    ),
    personName: Yup.string().required(
      intl.formatMessage({
        id: "error.personName.required",
        defaultMessage: "Account Holder is a required field.",
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
    chargeFee: Yup.bool(),
    expeditedShipping: Yup.bool(),
    expiry: Yup.string()
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
  });

  // @ts-ignore
  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          bold
          color="white"
          value={intl.formatMessage({
            id: "orderNewCard",
            description: "drawer header",
            defaultMessage: "Order New Card",
          })}
        />
      </Box>
      <Box sx={{ marginBottom: "70px" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={OrderNewCardSchema}
          onSubmit={(values) => orderNewCard(values)}
          enableReinitialize
        >
          {(props: any) => (
            <form onSubmit={props.handleSubmit}>
              <Box>
                <Box>
                  <DropdownFloating
                    name="personName"
                    placeholder={
                      <FormattedMessage
                        id="accountHolder"
                        description="Input Label"
                        defaultMessage="Account Holder*"
                      />
                    }
                    list={personNames}
                    value={props.values.personName}
                    {...props}
                  />
                  <DropdownFloating
                    name="cardProfile"
                    placeholder={
                      <FormattedMessage
                        id="drawer.orderNewCard.label.cardProfile"
                        description="Input Label"
                        defaultMessage="Card Profile*"
                      />
                    }
                    list={cardProfiles}
                    value={props.values.cardProfile}
                    {...props}
                  />
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
                    {...props}
                  />
                </Box>

                <Box>
                  <Field
                    name="chargeFee"
                    as={QDCheckbox}
                    value={props.values.chargeFee}
                    data={{
                      label: (
                        <FormattedMessage
                          id="drawer.orderNewCard.label.chargeFee"
                          description="Charge Fee"
                          defaultMessage="Charge Fee"
                        />
                      ),
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
                </Box>

                {findCardType(props.values.cardProfile) === "phy" && (
                  <Box>
                    <Field
                      name="expeditedShipping"
                      as={QDCheckbox}
                      value={props.values.expeditedShipping}
                      data={{
                        label: intl.formatMessage({
                          id: "expeditedShipping",
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
                  </Box>
                )}

                <Box sx={{ mt: 2 }}>
                  <Label htmlFor="attributes">
                    <FormattedMessage
                      id="cardOrderAttributes"
                      defaultMessage="Card Order Attributes"
                    />
                  </Label>
                </Box>

                <FieldArray
                  name="attributes"
                  render={({ remove, push }) => (
                    <div>
                      {props.values.attributes &&
                      props.values.attributes.length > 0
                        ? props.values.attributes.map((_: any, index: any) => (
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
                                    props.errors.attributes[index].name && (
                                      <Label variant="error" noMargin>
                                        {props.errors.attributes[index].name}
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
                                    value={props.values.attributes[index].name}
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
                                    props.errors.attributes[index].value && (
                                      <Label variant="error" noMargin>
                                        {props.errors.attributes[index].value}
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
                                    value={props.values.attributes[index].value}
                                    index={index}
                                    altName="attributes"
                                    {...props}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          ))
                        : null}

                      <Box sx={{ textAlign: "right", mb: 2 }}>
                        <QDButton
                          onClick={() => push("")}
                          id="drawer-ext-acct-add-attribute"
                          color="primary"
                          variant="contained"
                          size="small"
                          label={intl.formatMessage(
                            defineMessage({
                              id: "drawer.ext.acct.add.attribute",
                              defaultMessage: "ADD ADDITIONAL ATTRIBUTE",
                              description: "header",
                            })
                          )}
                        />
                      </Box>
                    </div>
                  )}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "40px",
                  alignItems: "center",
                }}
              >
                <Box sx={{ marginRight: "24px" }}>
                  <CancelButton
                    id="drawer-ordercard-button-cancel"
                    onClick={() => {
                      if (toggleDrawer) {
                        toggleDrawer();
                      }
                    }}
                  >
                    <FormattedMessage
                      id="drawer.orderNewCard.button.cancel"
                      description="Cancel button"
                      defaultMessage="Cancel"
                    />
                  </CancelButton>
                </Box>
                <SubmitButton
                  id="drawer-ordercard-button-submit"
                  disabled={!props.dirty}
                >
                  <FormattedMessage
                    id="drawer.orderNewCard.button.placeOrder"
                    description="Save changes button"
                    defaultMessage="Place Order"
                  />
                </SubmitButton>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default OrderNewCard;
