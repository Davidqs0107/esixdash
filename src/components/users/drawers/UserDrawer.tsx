/*
 * Copyright (c) 2015-2023, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import React, { SyntheticEvent, useContext, useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import * as Yup from "yup";
import { Field, Formik } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import RadioButtonGroup from "../../common/forms/buttons/RadioButtonGroup";
import InternationalizePhoneType from "../../common/converters/PhoneTypesI18nMap";
import InternationalizeEmailType from "../../common/converters/EmailTypesI18nMap";
import EmailStateConverter from "../../common/converters/EmailStateConverter";
import RoleConverter from "../../common/converters/RoleConverter";
import emitter from "../../../emitter";
import { MessageContext } from "../../../contexts/MessageContext";
import UsersEvent from "../../../pages/users/UserEvents";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import QDCheckbox from "../../common/forms/inputs/QDCheckbox";
import Label from "../../common/elements/Label";
import Header from "../../common/elements/Header";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
import PhoneNumber from "../../common/forms/inputs/PhoneNumber";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import "react-phone-number-input/style.css";
import { styled } from "@mui/material/styles";
import Icon from "../../common/Icon";
import { useQueries } from "@tanstack/react-query";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  background: "transparent",
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <img src={Icon.caretRightWhite} alt="close icon" height={11} width={11} />
    }
    {...props}
  />
))(({ theme }) => ({
  padding: 0,
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: "16px",
    padding: 0,
    "& .MuiTypography-root": {
      fontSize: "12px",
      marginBottom: 0,
    },
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  paddingLeft: "16px",
}));

interface IUserDrawer {
  toggleDrawer?: any;
  user?: any;
  edit?: boolean;
}
const UserDrawer: React.FC<IUserDrawer> = ({
  toggleDrawer = () => {
    /* provided by comp drawer */
  },
  user,
  edit = false,
}) => {
  const { setErrorMsg } = useContext(MessageContext);
  const intl = useIntl();

  const initialState = {
    edit,
    userName: edit ? user.userName : "",
    firstName: edit ? user.person.firstName : "",
    middleName: edit ? user.person.middleName : "",
    lastName: edit ? user.person.lastName : "",
    lastName2: edit ? user.person.lastName2 : "",
    // eslint-disable-next-line no-nested-ternary
    countryCode: edit
      ? user.person.phones.length > 0
        ? user.person.phones[0].countryCode
        : ""
      : "",
    // eslint-disable-next-line no-nested-ternary
    phoneType: edit
      ? user.person.phones.length > 0
        ? user.person.phones[0].type
        : ""
      : "",
    // eslint-disable-next-line no-nested-ternary
    phoneNumber: edit
      ? user.person.phones.length > 0
        ? user.person.phones[0].phoneNumber
        : ""
      : "",
    phoneNumberFull: edit
      ? user.person.phones.length > 0
        ? `+${user.person.phones[0].countryCode}${user.person.phones[0].phoneNumber}`
        : ""
      : "",
    // eslint-disable-next-line no-nested-ternary
    emailAddress: edit
      ? user.person.emails.length > 0
        ? user.person.emails[0].email
        : ""
      : "",
    // eslint-disable-next-line no-nested-ternary
    emailType: edit
      ? user.person.emails.length > 0
        ? user.person.emails[0].type
        : ""
      : "",
    // eslint-disable-next-line no-nested-ternary
    emailState: edit
      ? user.person.emails.length > 0
        ? user.person.emails[0].state
        : ""
      : "",
    securityLevel: edit ? user.securityLevel : "",
    roles: edit ? user.roles.map((role: any) => role.name) : [],
    password: "",
    state: edit ? user.state : "",
  };

  const [initialValues] = useState(initialState);

  const [roles, setRoles] = useState<string[]>([]);
  const [assignableRoles, setAssignableRoles] = useState<string[]>([]);
  const [emailTypes, setEmailTypes] = useState([]);
  const [phoneTypes, setPhoneTypes] = useState([]);
  const [emailStates, setEmailStates] = useState([]);
  const [securityLevels, setSecurityLevels] = useState([]);
  const [expanded, setExpanded] = useState<string | false>();

  const [
    getRolesQuery,
    getEmailTypesQuery,
    getEmailStatesQuery,
    getPhoneTypesQuery,
    getRiskLevelsQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: ["getRoles"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getRoles(),
        onError: (error: any) => setErrorMsg(error),
      },
      {
        queryKey: ["getEmailTypes"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getEmailTypes(),
        onError: (error: any) => setErrorMsg(error),
      },
      {
        queryKey: ["getEmailStates"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getEmailStates(),
        onError: (error: any) => setErrorMsg(error),
      },
      {
        queryKey: ["getPhoneTypes"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getPhoneTypes(),
        onError: (error: any) => setErrorMsg(error),
      },
      {
        queryKey: ["getRiskLevels"],
        queryFn: () =>
          // @ts-ignore
          api.PartnerRiskAPI.getRiskLevels(),
        onError: (error: any) => setErrorMsg(error),
      },
    ],
  });

  const getAssignableRoles = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.UserAPI.getAssignableRoles().catch((error: any) => setErrorMsg(error));

  const buildFormValues = () => {
    const promises = [
      // 0
      getAssignableRoles(),
    ];
    Promise.all(promises).then((results) => {
      setAssignableRoles(results[0]);
    });
  };

  const CheckboxBuilder = (
    checkedRoles: string[],
    name: string,
    value: string,
    formikProps: any
  ) => {
    return (
      <Field
        name={name}
        as={QDCheckbox}
        value={value}
        data={{
          label: RoleConverter(value, intl),
          key: `${name}-${value}`,
          id: `${name}-${value}`,
          disabled: assignableRoles.indexOf(value) === -1,
          checkbox: {
            color: "secondary",
            size: "small",
            checked: [...checkedRoles].indexOf(value) !== -1,
          },
        }}
        {...formikProps}
      />
    );
  };

  const RolesCheckBoxes = (checkedRoles: any, formikProps: any) => {
    const list = [];
    for (let i = 0; i < roles.length; ) {
      if (i + 1 < roles.length) {
        list.push(
          <Grid container>
            <Grid item md={6} lg={6}>
              {CheckboxBuilder(checkedRoles, "roles", roles[i], formikProps)}
            </Grid>
            <Grid item md={6} lg={6}>
              {CheckboxBuilder(
                checkedRoles,
                "roles",
                roles[i + 1],
                formikProps
              )}
            </Grid>
          </Grid>
        );
      } else {
        list.push(
          <Grid container>
            <Grid item md={12} lg={12}>
              {CheckboxBuilder(checkedRoles, "roles", roles[i], formikProps)}
            </Grid>
          </Grid>
        );
      }
      i += 2;
    }
    return list;
  };

  useEffect(() => {
    buildFormValues();
  }, []);

  useEffect(() => {
    if (
      getRolesQuery.data &&
      getEmailTypesQuery.data &&
      getEmailStatesQuery.data &&
      getPhoneTypesQuery.data &&
      getRiskLevelsQuery.data
    ) {
      // adding undefined to email states, and security levels b/c of dropdown options
      const states = getEmailStatesQuery.data.map((r: string) => ({
        emailState: r,
        text: EmailStateConverter(r, intl),
      }));
      states.unshift("");

      const emailTypes = getEmailTypesQuery.data.map((r: string) => ({
        emailType: r,
        text: InternationalizeEmailType(r, intl),
      }));
      emailTypes.unshift("");

      const phoneTypes = getPhoneTypesQuery.data.map((r: string) => ({
        phoneType: r,
        text: InternationalizePhoneType(r, intl),
      }));
      phoneTypes.unshift("");

      const levels = getRiskLevelsQuery.data.map(
        (level: any) => level.securityLevel
      );
      levels.unshift("");

      // remove Store Manager and Store Agent roles from list
      const roles = getRolesQuery.data.filter(
        (item: string) => !["StoreManager", "StoreAgent"].includes(item)
      );

      setEmailTypes(emailTypes);
      setEmailStates(states);
      setPhoneTypes(phoneTypes);
      setSecurityLevels(levels);
      setRoles(roles);
    }
  }, [
    getRolesQuery.data,
    getEmailTypesQuery.data,
    getEmailStatesQuery.data,
    getPhoneTypesQuery.data,
    getRiskLevelsQuery.data,
  ]);

  const createNewUser = (dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.UserAPI.create(dto)
      .then(() => {
        emitter.emit(UsersEvent.PartnerUserChanged, {});
        toggleDrawer();
      })
      .catch((error: any) => setErrorMsg(error));

  const updateRoles = (partnerUserId: string, newRoles: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.UserAPI.updateRoles(partnerUserId, newRoles)
      .then(() => {
        emitter.emit(UsersEvent.PartnerUserChanged, {});
        toggleDrawer();
      })
      .catch((error: any) => setErrorMsg(error));

  const updatePartnerUser = (partnerUserId: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.UserAPI.update(partnerUserId, dto)
      .then(() => {
        emitter.emit(UsersEvent.PartnerUserChanged, {});
        toggleDrawer();
      })
      .catch((error: any) => setErrorMsg(error));

  const updateUser = async (values: any) => {
    const dto: any = {
      userName: values.userName,
      securityLevel: values.securityLevel,
      person: {
        emails: [
          {
            type: values.emailType,
            email: values.emailAddress,
            state: values.emailState,
          },
        ],
        firstName: values.firstName,
        middleName: values.middleName,
        lastName: values.lastName,
        lastName2: values.lastName2,
      },
    };

    if (values.phoneType && values.phoneNumberFull) {
      const parsed = parsePhoneNumber(values.phoneNumberFull);
      dto.person["phones"] = [
        {
          type: values.phoneType,
          countryCode:
            parsed && parsed.countryCallingCode
              ? parsed.countryCallingCode
              : "",
          phoneNumber:
            parsed && parsed.nationalNumber ? parsed.nationalNumber : "",
          // countryCode: values.countryCode,
          // phoneNumber: values.phoneNumber,
        },
      ];
    }

    if (edit) {
      await updateRoles(user.id, values.roles);
      updatePartnerUser(user.id, dto);
    } else {
      createNewUser({ ...dto, password: values.password, roles: values.roles });
    }
  };

  const PartnerUserSchema = Yup.object().shape({
    userName: Yup.string()
      .trim()
      .matches(
        /^[a-z0-9._-]+$/,
        intl.formatMessage({
          id: "error.username.specialChar",
          defaultMessage:
            "Username must only contain lowercase characters, numbers, and .-_",
        })
      )
      .min(
        8,
        intl.formatMessage({
          id: "error.username.minChar",
          defaultMessage: "Username must contain at least 8 characters",
        })
      )
      .max(
        32,
        intl.formatMessage({
          id: "error.username.maxChar",
          defaultMessage: "Username must contain no more than 32 characters",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.username.required",
          defaultMessage: "Username is a required field",
        })
      ),
    edit: Yup.bool(),
    password: Yup.string().when("edit", {
      is: false,
      then: Yup.string()
        .trim()
        .matches(
          /^(?=.*[a-z]).*$/,
          intl.formatMessage({
            id: "error.password.lowercase",
            defaultMessage:
              "Password must include at least one lowercase letter",
          })
        )
        .matches(
          /^(?=.*[A-Z]).*$/,
          intl.formatMessage({
            id: "error.password.uppercase",
            defaultMessage:
              "Password must include at least one uppercase letter",
          })
        )
        .matches(
          /^(?=.*[0-9]).*$/,
          intl.formatMessage({
            id: "error.password.digit",
            defaultMessage: "Password must include at least one digit",
          })
        )
        .matches(
          /^(?=.*[!@#$%^&*()~`\-=_+[\]{}|:";',./<>?]).*$/,
          intl.formatMessage({
            id: "error.password.specialChar",
            defaultMessage:
              "Password must contain at least one special character",
          })
        )
        .min(
          8,
          intl.formatMessage({
            id: "error.password.minChar",
            defaultMessage: "Password must contain at least 8 characters",
          })
        )
        .max(
          32,
          intl.formatMessage({
            id: "error.password.maxChar",
            defaultMessage: "Password must contain no more than 32 characters",
          })
        )
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
        ),
      otherwise: Yup.string(),
    }),
    securityLevel: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.securityLevel.required",
          defaultMessage: "Security level is a required field",
        },
        {
          fieldName: intl.formatMessage({
            id: "securityLevel",
            defaultMessage: "Security level",
          }),
        }
      )
    ),
    phoneNumberFull: Yup.string().test(
      "test-valid-phone",
      intl.formatMessage({
        id: "error.phone.invalidFormat",
        defaultMessage: "Invalid phone format",
      }),
      (value) =>
        value !== undefined && value.trim().length > 0
          ? isValidPhoneNumber(value)
          : true
    ),
    phoneType: Yup.string().when("phoneNumberFull", {
      is: (phoneNumberFull: any) => {
        return phoneNumberFull !== undefined &&
          phoneNumberFull.trim().length > 0
          ? isValidPhoneNumber(phoneNumberFull)
          : false;
      },
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.phoneType.required",
            defaultMessage: "Phone type is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "phoneType",
              defaultMessage: "Phone type",
            }),
          }
        )
      ),
    }),
    //countryCode: Yup.string().required(
    //  intl.formatMessage(
    //     {
    //    id: "error.field.required",
    //   defaultMessage: "Country code is a required field.",
    // },
    //     {
    //   fieldName: intl.formatMessage({
    //     id: "countryCode",
    //     defaultMessage: "Country code",
    //   }),
    // }
    // )
    //),
    emailAddress: Yup.string()
      .email(
        intl.formatMessage({
          id: "error.field.validEmail",
          defaultMessage: "A valid email address is required.",
        })
      )
      .required(
        intl.formatMessage(
          {
            id: "error.emailAddress.required",
            defaultMessage: "Email address is a required field",
          },
          {
            fieldName: intl.formatMessage({
              id: "emailAddress",
              defaultMessage: "Email address",
            }),
          }
        )
      ),
    emailType: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.emailType.required",
          defaultMessage: "Email type is a required field.",
        },
        {
          fieldName: intl.formatMessage({
            id: "emailType",
            defaultMessage: "Email type",
          }),
        }
      )
    ),
    emailState: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.emailState.required",
          defaultMessage: "Email state is a required field.",
        },
        {
          fieldName: intl.formatMessage({
            id: "emailState",
            defaultMessage: "Email state",
          }),
        }
      )
    ),
    firstName: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.firstName.required",
          defaultMessage: "First name is a required field",
        },
        {
          fieldName: intl.formatMessage({
            id: "firstName",
            defaultMessage: "First name",
          }),
        }
      )
    )
    .max(
      64,
      intl.formatMessage({
        id: "error.firstName.maxChar",
        defaultMessage: "Must contain no more than 64 characters",
      })
    ),
    middleName: Yup.string()
    .max(
      64,
      intl.formatMessage({
        id: "error.firstName.maxChar",
        defaultMessage: "Must contain no more than 64 characters",
      })
    ),
    lastName: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Last name is a required field",
        },
        {
          fieldName: intl.formatMessage({
            id: "lastName",
            defaultMessage: "Last name",
          }),
        }
      )
    )
    .max(
      64,
      intl.formatMessage({
        id: "error.firstName.maxChar",
        defaultMessage: "Must contain no more than 64 characters",
      })
    ),
    lastName2: Yup.string()
    .max(
      64,
      intl.formatMessage({
        id: "error.firstName.maxChar",
        defaultMessage: "Must contain no more than 64 characters",
      })
    ),
    roles: Yup.array().min(
      1,
      intl.formatMessage({
        id: "error.role.minSelection",
        defaultMessage: "At least one role must be selected",
      })
    ),
  });

  const handleChangeAccordion =
    (panel: string) => (event: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <Container sx={{ width: "365px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={PartnerUserSchema}
        onSubmit={(values) => updateUser(values)}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit} noValidate>
            <Box>
              <Box
                sx={{
                  marginTop: "20px",
                  marginBottom: "40px",
                }}
              >
                <Header
                  value={
                    edit
                      ? intl.formatMessage({
                          id: "editUser",
                          description: "drawer header",
                          defaultMessage: "Edit User",
                        })
                      : intl.formatMessage({
                          id: "addNewUser",
                          description: "drawer header",
                          defaultMessage: "Add New User",
                        })
                  }
                  level={2}
                  color="white"
                  bold
                  drawerTitle
                />
              </Box>
              <Box>
                <Box>
                  <InputWithPlaceholder
                    required={true}
                    name="userName"
                    autoComplete="off"
                    type="text"
                    placeholder={
                      <FormattedMessage
                        id="username"
                        description="Input Label"
                        defaultMessage="Username*"
                      />
                    }
                    value={props.values.userName}
                    readOnly={edit}
                    {...props}
                  />
                </Box>
                {!edit ? (
                  <Box>
                    <InputWithPlaceholder
                      required={true}
                      name="password"
                      autoComplete="off"
                      type="password"
                      placeholder={
                        <FormattedMessage
                          id="password"
                          description="Input Label"
                          defaultMessage="Password*"
                        />
                      }
                      {...props}
                    />
                  </Box>
                ) : null}
              </Box>

              <Box>
                <InputWithPlaceholder
                  name="firstName"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "givenName",
                    defaultMessage: "First Name",
                  })}*`}
                  value={props.values.firstName}
                  {...props}
                />
              </Box>
              <Box>
                <InputWithPlaceholder
                  name="middleName"
                  autoComplete="off"
                  type="text"
                  placeholder={
                    <FormattedMessage
                      id="middleName"
                      description="Input Label"
                      defaultMessage="Middle Name"
                    />
                  }
                  value={props.values.middleName}
                  {...props}
                />
              </Box>
              <Box>
                <InputWithPlaceholder
                  name="lastName"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "familyName",
                    defaultMessage: "Last Name",
                  })}*`}
                  value={props.values.lastName}
                  {...props}
                />
              </Box>
              <Box>
                <InputWithPlaceholder
                  name="lastName2"
                  autoComplete="off"
                  type="text"
                  placeholder={
                    <FormattedMessage
                      id="secondLastName"
                      description="Input Label"
                      defaultMessage="Second Last Name"
                    />
                  }
                  value={props.values.lastName2}
                  {...props}
                />
              </Box>

              <Box>
                <InputWithPlaceholder
                  name="emailAddress"
                  autoComplete="off"
                  type="email"
                  placeholder={`${intl.formatMessage({
                    id: "emailAddress",
                    defaultMessage: "Email Address",
                  })}*`}
                  value={props.values.emailAddress}
                  {...props}
                />
              </Box>

              <Box>
                <DropdownFloating
                  name="emailType"
                  placeholder={`${intl.formatMessage({
                    id: "emailType",
                    defaultMessage: "Email Type",
                  })}*`}
                  list={emailTypes}
                  valueKey="emailType"
                  value={props.values.emailType}
                  {...props}
                />
              </Box>

              <Box>
                <DropdownFloating
                  name="emailState"
                  placeholder={`${intl.formatMessage({
                    id: "emailStatus",
                    defaultMessage: "Email Status",
                  })}*`}
                  list={emailStates}
                  valueKey="emailState"
                  value={props.values.emailState}
                  {...props}
                />
              </Box>
              <Box>
                <DropdownFloating
                  name="securityLevel"
                  placeholder={`${intl.formatMessage({
                    id: "riskLevelAccess",
                    defaultMessage: "Risk Level Access",
                  })}*`}
                  list={securityLevels}
                  value={props.values.securityLevel}
                  {...props}
                />
              </Box>

              <Box>
                <Label htmlFor="roleGroup">
                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontSize: "12px",
                      letterSpacing: "-0.2px",
                      lineHeight: "15px",
                      marginBottom: "0px !important",
                    }}
                  >
                    <FormattedMessage
                      id="roles"
                      description="Partner User Roles"
                      defaultMessage="Roles"
                    />
                    *
                  </Typography>
                </Label>
                <div>
                  <RadioButtonGroup
                    id="genderGroup"
                    value={props.values.roles}
                    error={props.errors.roles}
                    touched={props.touched.roles}
                  >
                    {RolesCheckBoxes(props.values.roles, props)}
                  </RadioButtonGroup>
                </div>
              </Box>

              <Box>
                <Accordion
                  expanded={expanded === "additionalAttributesPanel"}
                  onChange={handleChangeAccordion("additionalAttributesPanel")}
                >
                  <AccordionSummary
                    aria-controls="additionalAttributesPaneld-content"
                    id="additionalAttributesPaneld-header"
                  >
                    <Typography>
                      <FormattedMessage
                        id="additionalAttributes"
                        defaultMessage="Additional Attributes"
                      />
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      <Box>
                        <PhoneNumber
                          name="phoneNumberFull"
                          autoComplete="off"
                          type="text"
                          value={props.values.phoneNumberFull}
                          placeholder={`${intl.formatMessage({
                            id: "phoneNumber",
                            defaultMessage: "Phone Number",
                          })}`}
                          {...props}
                        />
                      </Box>

                      <Box>
                        <DropdownFloating
                          name="phoneType"
                          placeholder={`${intl.formatMessage({
                            id: "type",
                            defaultMessage: "Type",
                          })}`}
                          list={phoneTypes}
                          valueKey="phoneType"
                          value={props.values.phoneType}
                          {...props}
                        />
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "60px",
                  marginBottom: "60px",
                }}
              >
                <CancelButton
                  id="drawer.user.button.cancel"
                  onClick={() => toggleDrawer()}
                  style={{
                    fontSize: "12px",
                    lineHeight: "15px",
                    fontWeight: "normal",
                    marginRight: "20px",
                  }}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <SubmitButton
                  id="drawer.user.button.submit"
                  disabled={
                    !props.dirty ||
                    !(props.isValid && Object.keys(props.touched).length >= 1)
                  }
                >
                  <FormattedMessage
                    id="save"
                    description="Save changes button"
                    defaultMessage="Save"
                  />
                </SubmitButton>
              </Box>
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default UserDrawer;
