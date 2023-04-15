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
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import React, { lazy, useContext, useEffect, useState } from "react";
import { Box, Container, FormGroup, Grid, Typography } from "@mui/material";
import { FieldArray, Formik } from "formik";
import * as Yup from "yup";
import { useQuery } from "@tanstack/react-query";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import emitter from "../../../emitter";
import { MessageContext } from "../../../contexts/MessageContext";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";
import CardTypeConverter from "../../common/converters/CardTypeConverter";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Label from "../../common/elements/Label";
import Header from "../../common/elements/Header";
import Icon from "../../common/Icon";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

interface IDrawerInfo {
  edit?: boolean;
  profileName?: string;
  programName: string;
  toggleDrawer: () => boolean;
  bankName: string;
  partnerName?: string;
  readOnly?: boolean;
}

interface IAddOrUpdateCardProfile {
  IINs?: any;
  name?: string;
  description?: string;
  cardType?: string;
  bankIIN?: string;
  serviceCode?: string;
  iinSegment?: string;
  expiry?: string;
  embossedName?: string;
  pinLength?: string;
  panLength?: string;
  schemeId?: string;
  tokenActivationMethods?: [];
}

type TokenActivationMethod = {
  value?: string;
  method?: string;
};

interface IGetCardProfile {
  name?: string;
  description?: string;
  cardType?: string;
  iin: string;
  serviceCode?: string;
  iinSegment?: string;
  expiry?: any;
  embossedName?: string;
  pinLength?: string;
  panLength?: string;
  schemeId?: string;
  tokenActivationMethods?: TokenActivationMethod[];
}

const ProgramCardProfileDrawer: React.FC<IDrawerInfo> = (props) => {
  const intl = useIntl();
  const { edit, profileName, toggleDrawer, bankName, partnerName, readOnly } =
    props;
  const { programName } = useContext(ProgramEditContext);
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const [initialValues, setInitialValues] = useState({});
  const [combinedIINs, setCombinedIINs] = useState([]);
  const [cardTypes, setCardTypes] = useState([{}]);
  const [panLengths] = useState(["", "16", "17", "18", "19"]);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(readOnly || false);
  const [pansIssued, setPansIssued] = useState("");
  const nullActivationMethodValues = ["SMS", "EMAIL"];

  const tokenActivationMethods = [
    {
      text: intl.formatMessage({
        id: "tokenActivationMethod.SMS",
        defaultMessage: "SMS",
      }),
      method: "SMS",
    },
    {
      text: intl.formatMessage({
        id: "tokenActivationMethod.EMAIL",
        defaultMessage: "Email",
      }),
      method: "EMAIL",
    },
    {
      text: intl.formatMessage({
        id: "tokenActivationMethod.WEBSITE",
        defaultMessage: "Website",
      }),
      method: "WEBSITE",
    },
    {
      text: intl.formatMessage({
        id: "tokenActivationMethod.MOBILE_APP",
        defaultMessage: "Mobile App",
      }),
      method: "MOBILE_APP",
    },
    {
      text: intl.formatMessage({
        id: "tokenActivationMethod.CALL_CENTER",
        defaultMessage: "Call Center",
      }),
      method: "CALL_CENTER",
    },
  ];

  const { data: getCardTypesData } = useQuery({
    queryKey: ["getCardTypes"],
    queryFn: () =>
      // @ts-ignore
      api.CommonAPI.getCardTypes(),
    onError: (error: any) => setErrorMsg(error),
  });

  const getCardProfile = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CardProfileAPI.getCardProfile(programName, profileName)
      .then((profile: IGetCardProfile) => {
        setInitialValues({
          name: profile.name,
          description: profile.description,
          cardType: profile.cardType,
          serviceCode: profile.serviceCode,
          iinSegment: profile.iinSegment,
          expiry: profile.expiry,
          embossedName: profile.embossedName,
          pinLength: profile.pinLength,
          panLength: profile.panLength,
          schemeId: profile.schemeId,
          IINs: profile.iin,
          tokenActivationMethods: profile.tokenActivationMethods,
        });
      })
      .catch((error: []) => setErrorMsg(error));
  };

  const getBankIINs = async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const partnerIINS = await api.PartnerAPI.getPartnerIINs(partnerName).catch(
      (error: []) => setErrorMsg(error)
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const bankIINs = await api.BankAPI.getIINs(bankName).catch((error: []) =>
      setErrorMsg(error)
    );

    if (!partnerIINS || partnerIINS.length === 0) {
      setCombinedIINs(bankIINs);
    } else {
      setCombinedIINs(partnerIINS);
    }
  };

  const getPartnerIINs = (name: string) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.getPartnerIINs(name)
      .then((iins: any) => iins)
      .catch((error: []) => setErrorMsg(error));
  };

  const getUniquePanCounts = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CardAPI.getUniquePanCounts(programName, profileName)
      .then((res: any) => {
        let count = parseInt(res.count).toLocaleString();
        setPansIssued(count);
      })
      .catch((error: []) => setErrorMsg(error));
  };

  const getCardTypeFormattedName = (cardType: string) => {
    if (!cardType || !cardTypes) {
      return "";
    }

    const card: any = cardTypes.find((e: any) => e.type === cardType);
    return card ? card.text : "";
  };

  const addOrUpdateCardProfile = async (values: IAddOrUpdateCardProfile) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await api.CardProfileAPI.createCardProfile(programName, {
      name: values.name,
      description: values.description,
      cardType: values.cardType,
      iin: values.IINs,
      serviceCode: values.serviceCode,
      iinSegment: values.iinSegment,
      expiry: values.expiry,
      embossedName: values.embossedName,
      pinLength: values.pinLength,
      panLength: values.panLength,
      schemeId: values.schemeId,
      tokenActivationMethods: values.tokenActivationMethods,
    })
      .then(() => {
        toggleDrawer();
        emitter.emit("programs.edit.changed", {});

        setSuccessMsg(
          edit
            ? {
                responseCode: "200000",
                message: (
                  <FormattedMessage
                    id="cardProfile.success.update"
                    defaultMessage="Card Profile Has Been Updated Successfully"
                  />
                ),
              }
            : {
                responseCode: "200000",
                message: (
                  <FormattedMessage
                    id="cardProfile.success.save"
                    defaultMessage="Card Profile Has Been Saved Successfully"
                  />
                ),
              }
        );
      })
      .catch((error: []) => setErrorMsg(error));
  };

  const toggleEdit = (value: boolean) => {
    setIsReadOnly(!value);
  };

  const CardProfileSchema = Yup.object().shape({
    name: Yup.string()
      .max(
        64,
        intl.formatMessage({
          id: "error.maxLength64",
          defaultMessage: "Max length is 64",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.name.required",
          defaultMessage: "Name is required.",
        })
      ),
    description: Yup.string()
      .max(
        64,
        intl.formatMessage({
          id: "error.maxLength64",
          defaultMessage: "Max length is 64",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.description.required",
          defaultMessage: "Description is required.",
        })
      ),
    IINs: Yup.string().required(
      intl.formatMessage({
        id: "error.IINs.required",
        defaultMessage: "IIN is required.",
      })
    ),
    serviceCode: Yup.string().required(
      intl.formatMessage({
        id: "error.serviceCode.required",
        defaultMessage: "Service Code is required",
      })
    ),
    iinSegment: Yup.number().typeError(
      intl.formatMessage({
        id: "error.IINSegment.numberType",
        defaultMessage: "IIN Segment must be a number",
      })
    ),
    expiry: Yup.string().required(
      intl.formatMessage({
        id: "error.expiryMonths.required",
        defaultMessage: "Expiration time in months is required",
      })
    ),
    embossedName: Yup.string()
      .max(
        26,
        intl.formatMessage({
          id: "error.maxLength26",
          defaultMessage: "Max length is 26",
        })
      )
      .notRequired(),
    cardType: Yup.string().required(
      intl.formatMessage({
        id: "error.cardType.required",
        defaultMessage: "Card Type is required.",
      })
    ),
    panLength: Yup.string().required(
      intl.formatMessage({
        id: "error.PANLength.required",
        defaultMessage: "PAN Length is required.",
      })
    ),
    pinLength: Yup.string().required(
      intl.formatMessage({
        id: "error.PINLength.required",
        defaultMessage: "PIN Length is required.",
      })
    ),
    schemeId: Yup.string().max(
      10,
      intl.formatMessage({
        id: "error.maxLength10",
        defaultMessage: "Max length is 10",
      })
    ),
    tokenActivationMethods: Yup.array().of(
      Yup.object().shape({
        method: Yup.string().required(
          intl.formatMessage(
            {
              id: "error.field.required",
              defaultMessage: "Activation Method is a required field",
            },
            {
              fieldName: intl.formatMessage({
                id: "activationMethod",
                defaultMessage: "Activation Method",
              }),
            }
          )
        ),
        value: Yup.string().when("method", (method, schema) => {
          return !nullActivationMethodValues.includes(method)
            ? schema.required(
                intl.formatMessage({
                  id: "error.value.required",
                  defaultMessage: "Value is a required field.",
                })
              )
            : Yup.string();
        }),
      })
    ),
  });

  useEffect(() => {
    if (edit) {
      getCardProfile();
      getUniquePanCounts();
    } else {
      setInitialValues({
        name: "",
        description: "",
        cardType: "",
        IINs: "",
        serviceCode: "",
        iinSegment: "",
        expiry: "",
        embossedName: undefined,
        pinLength: "",
        panLength: "",
        schemeId: undefined,
        tokenActivationMethods: [],
      });
    }
    getBankIINs();
  }, []);

  useEffect(() => {
    if (getCardTypesData) {
      setCardTypes(
        getCardTypesData
          .filter((t: string) => t !== "router")
          .map((t: string) => ({
            type: t,
            text: CardTypeConverter(t, intl),
          }))
      );
    }
  }, [getCardTypesData]);

  return (
    <Container sx={{ width: "397px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={CardProfileSchema}
        onSubmit={(values) => addOrUpdateCardProfile(values)}
        enableReinitialize
        initialTouched={
          edit
            ? {
                name: true,
                description: true,
                cardType: true,
                IINs: true,
                serviceCode: true,
                iinSegment: true,
                expiry: true,
                embossedName: true,
                pinLength: true,
                panLength: true,
                schemeId: true,
              }
            : {}
        }
      >
        {(FormProps: any) => {
          return (
            <form onSubmit={FormProps.handleSubmit}>
              <Box>
                <Header
                  value={
                    edit
                      ? isReadOnly
                        ? intl.formatMessage({
                            id: "drawer.header.viewCardProfile",
                            description: "drawer header",
                            defaultMessage: "View Card Profile",
                          })
                        : intl.formatMessage({
                            id: "drawer.header.editCardProfile",
                            description: "drawer header",
                            defaultMessage: "Edit Card Profile",
                          })
                      : intl.formatMessage({
                          id: "drawer.header.addCardProfile",
                          description: "drawer header",
                          defaultMessage: "Add New Card Profile",
                        })
                  }
                  level={2}
                  color="white"
                  bold
                  drawerTitle
                />
                <FormGroup>
                  <FormGroup sx={{ mb: 2 }}>
                    {edit ? (
                      <div>
                        <Label htmlFor="cardProfileName">
                          <FormattedMessage
                            id="drawer.programs.edit.label.cardProfileName"
                            description="Section Label"
                            defaultMessage="Card Profile Name"
                          />
                        </Label>
                        <Typography>{FormProps.values.name}</Typography>
                      </div>
                    ) : (
                      <InputWithPlaceholder
                        name="name"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "cardProfileName",
                          defaultMessage: "Card Profile Name",
                        })}*`}
                        {...FormProps}
                        disabled={edit}
                      />
                    )}
                  </FormGroup>
                  {edit && isReadOnly ? (
                    <FormGroup sx={{ mb: 2 }}>
                      <div>
                        <Label htmlFor="pansIssued">
                          <FormattedMessage
                            id="drawer.programs.edit.label.pansIssued"
                            description="Section Label"
                            defaultMessage="PANs Issued"
                          />
                        </Label>
                        <Typography>{pansIssued}</Typography>
                      </div>
                    </FormGroup>
                  ) : null}
                  <FormGroup sx={{ mb: 2 }}>
                    {isReadOnly ? (
                      <div>
                        <Label htmlFor="description">
                          <FormattedMessage
                            id="description"
                            description="Section Label"
                            defaultMessage="Description"
                          />
                        </Label>
                        <Typography>{FormProps.values.description}</Typography>
                      </div>
                    ) : (
                      <InputWithPlaceholder
                        name="description"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "description",
                          defaultMessage: "Description",
                        })}*`}
                        //value={FormProps.values.description}
                        touchOnChange
                        disabled={isReadOnly}
                        {...FormProps}
                      />
                    )}
                  </FormGroup>
                  <FormGroup sx={{ mb: 2 }}>
                    {isReadOnly ? (
                      <div>
                        <Label htmlFor="cardType">
                          <FormattedMessage
                            id="cardType"
                            description="Section Label"
                            defaultMessage="Card Type"
                          />
                        </Label>
                        <Typography>
                          {getCardTypeFormattedName(FormProps.values.cardType)}
                        </Typography>
                      </div>
                    ) : (
                      <DropdownFloating
                        name="cardType"
                        placeholder={`${intl.formatMessage({
                          id: "cardType",
                          defaultMessage: "Card Type",
                        })}*`}
                        list={cardTypes}
                        valueKey="type"
                        value=""
                        disabled={isReadOnly}
                        {...FormProps}
                        handleChange={(e: any) => {
                          if (e.target.value == "virtual") {
                            FormProps.setFieldValue("serviceCode", "211");
                          }
                          FormProps.handleChange(e);
                        }}
                      />
                    )}
                  </FormGroup>
                  <FormGroup sx={{ mb: 2 }}>
                    {isReadOnly ? (
                      <div>
                        <Label htmlFor="drawer.cardProfile.label.IINs">
                          <FormattedMessage
                            id="drawer.cardProfile.label.IINs"
                            description="Section Label"
                            defaultMessage="IIN*"
                          />
                        </Label>
                        <Typography>{FormProps.values.IINs}</Typography>
                      </div>
                    ) : (
                      <DropdownFloating
                        name="IINs"
                        placeholder={
                          <FormattedMessage
                            id="drawer.cardProfile.label.IINs"
                            description="Input Label"
                            defaultMessage="IIN*"
                          />
                        }
                        list={combinedIINs}
                        value=""
                        disabled={isReadOnly}
                        {...FormProps}
                      />
                    )}
                  </FormGroup>
                  <FormGroup sx={{ mb: 2 }}>
                    {isReadOnly ? (
                      <div>
                        <Label htmlFor="serviceCode">
                          <FormattedMessage
                            id="serviceCode"
                            description="Section Label"
                            defaultMessage="Service Code"
                          />
                        </Label>
                        <Typography>{FormProps.values.serviceCode}</Typography>
                      </div>
                    ) : (
                      <InputWithPlaceholder
                        name="serviceCode"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "serviceCode",
                          defaultMessage: "Service Code",
                        })}*`}
                        value=""
                        disabled={isReadOnly}
                        {...FormProps}
                      />
                    )}
                  </FormGroup>
                  <FormGroup sx={{ mb: 2 }}>
                    {isReadOnly ? (
                      <div>
                        <Label htmlFor="IINSegment">
                          <FormattedMessage
                            id="IINSegment"
                            description="Section Label"
                            defaultMessage="IIN Segment"
                          />
                        </Label>
                        <Typography>{FormProps.values.iinSegment}</Typography>
                      </div>
                    ) : (
                      <InputWithPlaceholder
                        name="iinSegment"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "IINSegment",
                          defaultMessage: "IIN Segment",
                        })}`}
                        value=""
                        disabled={isReadOnly}
                        {...FormProps}
                      />
                    )}
                  </FormGroup>
                  <FormGroup sx={{ mb: 2 }}>
                    {isReadOnly ? (
                      <div>
                        <Label htmlFor="expiryMonths">
                          <FormattedMessage
                            id="expiryMonths"
                            description="Section Label"
                            defaultMessage="Expiry (number of months)"
                          />
                        </Label>
                        <Typography>{FormProps.values.expiry}</Typography>
                      </div>
                    ) : (
                      <InputWithPlaceholder
                        name="expiry"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "expiryMonths",
                          defaultMessage: "Expiry (number of months)",
                        })}*`}
                        value=""
                        disabled={isReadOnly}
                        {...FormProps}
                      />
                    )}
                  </FormGroup>
                  <FormGroup sx={{ mb: 2 }}>
                    {isReadOnly ? (
                      <div>
                        <Label htmlFor="embossedName">
                          <FormattedMessage
                            id="embossedName"
                            description="Section Label"
                            defaultMessage="Expiry (number of months)"
                          />
                        </Label>
                        <Typography>{FormProps.values.embossedName}</Typography>
                      </div>
                    ) : (
                      <InputWithPlaceholder
                        name="embossedName"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "embossedName",
                          defaultMessage: "Embossed Name",
                        })}`}
                        value=""
                        disabled={isReadOnly}
                        {...FormProps}
                      />
                    )}
                  </FormGroup>
                  <FormGroup sx={{ mb: 2 }}>
                    {isReadOnly ? (
                      <div>
                        <Label htmlFor="PINLength">
                          <FormattedMessage
                            id="PINLength"
                            description="Section Label"
                            defaultMessage="PIN Length"
                          />
                        </Label>
                        <Typography>{FormProps.values.pinLength}</Typography>
                      </div>
                    ) : (
                      <InputWithPlaceholder
                        name="pinLength"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "PINLength",
                          defaultMessage: "PIN Length",
                        })}*`}
                        value=""
                        disabled={isReadOnly}
                        {...FormProps}
                      />
                    )}
                  </FormGroup>
                  <FormGroup sx={{ mb: 2 }}>
                    {isReadOnly ? (
                      <div>
                        <Label htmlFor="panLength">
                          <FormattedMessage
                            id="panLength"
                            description="Section Label"
                            defaultMessage="PAN Length"
                          />
                        </Label>
                        <Typography>{FormProps.values.panLength}</Typography>
                      </div>
                    ) : (
                      <DropdownFloating
                        name="panLength"
                        placeholder={`${intl.formatMessage({
                          id: "PANLength",
                          defaultMessage: "PAN Length",
                        })}*`}
                        list={panLengths}
                        value=""
                        disabled={isReadOnly}
                        {...FormProps}
                      />
                    )}
                  </FormGroup>
                  <FormGroup sx={{ mb: 2 }}>
                    {isReadOnly ? (
                      <div>
                        <Label htmlFor="issuerIdentifier">
                          <FormattedMessage
                            id="issuerIdentifier"
                            description="Section Label"
                            defaultMessage="Issuer Identifier"
                          />
                        </Label>
                        <Typography>{FormProps.values.schemeId}</Typography>
                      </div>
                    ) : (
                      <InputWithPlaceholder
                        handleBlur={undefined}
                        handleChange={undefined}
                        touched={undefined}
                        errors={undefined}
                        required={false}
                        id=""
                        name="schemeId"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "issuerIdentifier",
                          defaultMessage: "Issuer identifier",
                        })}`}
                        value=""
                        disabled={isReadOnly}
                        {...FormProps}
                      />
                    )}
                  </FormGroup>

                  <Label htmlFor="activationMethods">
                    <FormattedMessage
                      id="activationMethods"
                      defaultMessage="Activation Methods"
                    />
                  </Label>

                  {isReadOnly && FormProps.values.tokenActivationMethods ? (
                    <Box>
                      {FormProps.values.tokenActivationMethods.map(
                        ({ method, value }: any) => {
                          return (
                            <Typography
                              sx={{ marginBottom: "15px !important" }}
                            >
                              {intl.formatMessage({
                                id: `tokenActivationMethod.${method}`,
                                defaultMessage: method,
                              })}
                              {" - "}
                              {value}
                            </Typography>
                          );
                        }
                      )}
                    </Box>
                  ) : (
                    <FieldArray
                      name="tokenActivationMethods"
                      render={({ remove, push }) => (
                        <Box mt={2}>
                          {FormProps.values.tokenActivationMethods &&
                          FormProps.values.tokenActivationMethods.length > 0
                            ? FormProps.values.tokenActivationMethods.map(
                                (_: any, index: any) => (
                                  <Grid
                                    container
                                    direction="column"
                                    /* eslint-disable-next-line react/no-array-index-key */
                                    key={`div.tokenActivationMethods.${index}`}
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
                                        {FormProps.errors
                                          .tokenActivationMethods &&
                                          FormProps.errors
                                            .tokenActivationMethods[index] &&
                                          FormProps.errors
                                            .tokenActivationMethods[index]
                                            .method && (
                                            <Box sx={{ marginTop: "-11px" }}>
                                              <Label variant="error" noMargin>
                                                {
                                                  FormProps.errors
                                                    .tokenActivationMethods[
                                                    index
                                                  ].method
                                                }
                                              </Label>
                                            </Box>
                                          )}
                                        <DropdownFloating
                                          name={`tokenActivationMethods.${index}.method`}
                                          placeholder={`${intl.formatMessage({
                                            id: "activationMethod",
                                            defaultMessage: "Activation Method",
                                          })}*`}
                                          list={tokenActivationMethods}
                                          value={
                                            FormProps.values
                                              .tokenActivationMethods[index]
                                              .method
                                          }
                                          index={index}
                                          altName="attributes"
                                          disabled={isReadOnly}
                                          {...FormProps}
                                          valueKey="method"
                                        />
                                      </Grid>
                                    </Grid>

                                    <Grid container>
                                      <Grid item sx={{ width: 40 }}>
                                        &nbsp;
                                      </Grid>
                                      <Grid item flexGrow="1">
                                        {!nullActivationMethodValues.includes(
                                          FormProps.values
                                            .tokenActivationMethods[index]
                                            .method
                                        ) &&
                                          FormProps.errors
                                            .tokenActivationMethods &&
                                          FormProps.errors
                                            .tokenActivationMethods[index] &&
                                          FormProps.errors
                                            .tokenActivationMethods[index]
                                            .value && (
                                            <Box sx={{ marginTop: "-12px" }}>
                                              <Label variant="error" noMargin>
                                                {
                                                  FormProps.errors
                                                    .tokenActivationMethods[
                                                    index
                                                  ].value
                                                }
                                              </Label>
                                            </Box>
                                          )}

                                        <InputWithPlaceholder
                                          type="text"
                                          name={`tokenActivationMethods.${index}.value`}
                                          autoComplete="off"
                                          placeholder={intl.formatMessage({
                                            id: "drawer.ext.acct.label.value",
                                            description: "Input Label",
                                            defaultMessage: "Value*",
                                          })}
                                          className="login-input"
                                          value={
                                            FormProps.values
                                              .tokenActivationMethods[index]
                                              .value
                                          }
                                          index={index}
                                          altName="attributes"
                                          disabled={nullActivationMethodValues.includes(
                                            FormProps.values
                                              .tokenActivationMethods[index]
                                              .method
                                          )}
                                          {...FormProps}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                )
                              )
                            : null}

                          <Box sx={{ textAlign: "right" }}>
                            <QDButton
                              className="float-right mr-0"
                              onClick={() => push("")}
                              id="drawer-ext-acct-add-attribute"
                              color="primary"
                              variant="contained"
                              size="small"
                              label={intl.formatMessage(
                                defineMessage({
                                  id: "button.addNewMethod",
                                  defaultMessage: "ADD NEW METHOD",
                                  description: "header",
                                })
                              )}
                            />
                          </Box>
                        </Box>
                      )}
                    />
                  )}

                  <Grid container rowSpacing={1} justifyContent="center" mt={5}>
                    <Grid item xs={4}>
                      <CancelButton
                        onClick={() => toggleDrawer()}
                        id="program-card-profile-cancel-changes"
                      >
                        <FormattedMessage
                          id="cancel"
                          description="Cancel button"
                          defaultMessage="Cancel"
                        />
                      </CancelButton>
                    </Grid>
                    <Grid item xs={7}>
                      {isReadOnly ? (
                        <QDButton
                          id="program-card-profile-edit"
                          color="primary"
                          variant="contained"
                          textCase="provided"
                          label={intl.formatMessage(
                            defineMessage({
                              id: "drawer.card.profile.button.edit",
                              defaultMessage: "Edit",
                              description: "Edit",
                            })
                          )}
                          onClick={() => toggleEdit(true)}
                          size="large"
                        />
                      ) : (
                        <SubmitButton
                          id="program-card-profile-save-changes"
                          disabled={!FormProps.dirty}
                        >
                          <FormattedMessage
                            id="drawer.card.profile.button.saveChanges"
                            description="Save changes button"
                            defaultMessage="Save Changes"
                          />
                        </SubmitButton>
                      )}
                    </Grid>
                  </Grid>
                </FormGroup>
              </Box>
            </form>
          );
        }}
      </Formik>
    </Container>
  );
};

export default ProgramCardProfileDrawer;
