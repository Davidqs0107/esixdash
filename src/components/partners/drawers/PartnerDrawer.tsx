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

import React, { useEffect, useState, lazy, useContext } from "react";
import { FormattedMessage, useIntl, defineMessage } from "react-intl";
import { Field, FieldArray, Formik, FormikProps } from "formik";
import { Box, Grid, Container, FormGroup } from "@mui/material";

import * as Yup from "yup";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import api from "../../../api/api";
import RadioButtonGroup from "../../common/forms/buttons/RadioButtonGroup";
import RadioButton from "../../common/forms/buttons/RadioButton";
import InternationalizeGender from "../../common/converters/InternationalizeGender";
import emitter from "../../../emitter";
import Icon from "../../common/Icon";
import TextRender from "../../common/TextRender";
import { MessageContext } from "../../../contexts/MessageContext";
import { PartnerUserContext } from "../../../contexts/PartnerUserContext";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Header from "../../common/elements/Header";
import QDCheckbox from "../../common/forms/inputs/QDCheckbox";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";
import Label from "../../common/elements/Label";
import LanguageToIntl from "../../common/converters/LanguageToIntl";
import { useQueries } from "@tanstack/react-query";

const QDButton = lazy(() => import("../../common/elements/QDButton"));

interface IPartnerDrawer {
  toggleDrawer?: any;
  edit?: boolean;
  partner?: any;
}

interface IPartnerForm {
  name: string;
  description: string;
  bank: string;
  timezone: string;
  location: string;
  language: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  lastName2: string;
  suffix: string;
  nickName: string;
  gender: string;
  userName: string;
  email: string;
  password: string;
  newLinkedPartners: string[];
  newLinkedPrograms: string[];
  newIINs: any[];
}

const PartnerDrawer: React.FC<IPartnerDrawer> = ({
  toggleDrawer,
  edit = false,
  partner = {},
}) => {
  const intl = useIntl();
  const { partnerName } = useContext(PartnerUserContext);
  const { canSeeExchanges, canSeePartnerProfile, canAddNewPartner } =
    useContext(ContentVisibilityContext);
  const context = useContext(MessageContext);
  const { setErrorMsg } = context;

  const [titles, setTitles] = useState<string[]>([]);
  const [suffixes, setSuffixes] = useState<string[]>([]);
  const [availibleBanks, setAvailibleBanks] = useState<string[]>([]);
  const [timezones, setTimezones] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [linkablePartners, setLinkablePartners] = useState<string[]>([]);
  const [linkablePrograms, setLinkablePrograms] = useState(new Map());
  const [exchanges, setExchanges] = useState<string[]>([]);
  const [partnerIINs, setPartnerIINs] = useState<string[]>([]);
  const [partnerIINList, setPartnerIINList] = useState<string[]>([]);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [updatedPartnerName, setUpdatedPartnerName] = useState<string>("");

  const initialState = {
    edit,
    name: "",
    description: "",
    bank: "",
    timezone: "",
    location: "",
    language: "",
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    lastName2: "",
    suffix: "",
    nickName: "",
    gender: "",
    userName: "",
    email: "",
    password: "",
    newLinkedPartners: [],
    newLinkedPrograms: [],
    newIINs: [],
  };

  const [initialValues, setInitialValues] =
    useState<IPartnerForm>(initialState);

  const [getTimezoneListQuery, getGendersQuery, getLocalesQuery] = useQueries({
    queries: [
      {
        queryKey: ["getTimeZoneList"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getTimeZoneList(),
        onError: (error: any) => setErrorMsg(error),
      },
      {
        queryKey: ["getGenders"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getGenders(),
        onError: (error: any) => setErrorMsg(error),
      },
      {
        queryKey: ["getLocales"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getLocales(),
        onError: (error: any) => setErrorMsg(error),
      },
    ],
  });

  Yup.addMethod(
    Yup.array,
    "unique",
    function (message, mapper = (a: any) => a) {
      // eslint-disable-next-line react/no-this-in-sfc
      return this.test(
        "unique",
        message,
        (list) => !list || list.length === new Set(list.map(mapper)).size
      );
    }
  );

  const PartnerSchema = Yup.object().shape({
    name: Yup.string().when("edit", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Name is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "name",
              defaultMessage: "Name",
            }),
          }
        )
      ),
      otherwise: Yup.string(),
    }),
    description: Yup.string(),
    bank: Yup.string().when("edit", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Bank is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "bank",
              defaultMessage: "Bank",
            }),
          }
        )
      ),
      otherwise: Yup.string(),
    }),
    timezone: Yup.string().when("edit", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Time Zone is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "timeZone",
              defaultMessage: "Time Zone",
            }),
          }
        )
      ),
      otherwise: Yup.string(),
    }),
    location: Yup.string().when("edit", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Location is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "location",
              defaultMessage: "Location",
            }),
          }
        )
      ),
      otherwise: Yup.string(),
    }),
    language: Yup.string().when("edit", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Language is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "language",
              defaultMessage: "Language",
            }),
          }
        )
      ),
      otherwise: Yup.string(),
    }),
    title: Yup.string(),
    firstName: Yup.string().when("edit", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "First name is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "firstName",
              defaultMessage: "First name",
            }),
          }
        )
      ),
      otherwise: Yup.string(),
    }),
    middleName: Yup.string(),
    lastName: Yup.string().when("edit", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Last name is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "lastName",
              defaultMessage: "Last Name",
            }),
          }
        )
      ),
      otherwise: Yup.string(),
    }),
    lastName2: Yup.string(),
    suffix: Yup.string(),
    nickName: Yup.string(),
    gender: Yup.string().when("edit", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Gender is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "genders",
              defaultMessage: "Gender",
            }),
          }
        )
      ),
      otherwise: Yup.string(),
    }),
    userName: Yup.string().when("edit", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Username is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "username",
              defaultMessage: "Username",
            }),
          }
        )
      ),
      otherwise: Yup.string(),
    }),
    email: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Email is a required field.",
        },
        {
          fieldName: intl.formatMessage({
            id: "email",
            defaultMessage: "Email",
          }),
        }
      )
    ),
    password: Yup.string().when("edit", {
      is: false,
      then: Yup.string().required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Password is a required field.",
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
    newLinkedPartners: Yup.array()
      .of(Yup.string())
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .unique(
        intl.formatMessage(
          {
            id: "error.field.unique",
            defaultMessage: "Linked Partners must be unique",
          },
          {
            fieldName: intl.formatMessage({
              id: "linkedPartners",
              defaultMessage: "Linked Partners",
            }),
          }
        )
      ),

    newLinkedPrograms: Yup.array()
      .of(Yup.string())
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .unique(
        intl.formatMessage(
          {
            id: "error.field.unique",
            defaultMessage: "Linked Programs must be unique",
          },
          {
            fieldName: intl.formatMessage({
              id: "linkedPrograms",
              defaultMessage: "Linked Programs",
            }),
          }
        )
      ),
    newIINs: Yup.array()
      .of(Yup.string())
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      .unique(
        intl.formatMessage(
          {
            id: "error.field.unique",
            defaultMessage: "IINs must be unique",
          },
          {
            fieldName: intl.formatMessage({
              id: "iins",
              defaultMessage: "IINs",
            }),
          }
        )
      ),
  });

  const getCountries = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CommonAPI.getCountryList2().catch((e: any) => setErrorMsg(e));

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const getBanks = () => api.BankAPI.list().catch((e: any) => setErrorMsg(e));

  const getPartnerProfile = (name: string) => {
    if (canSeePartnerProfile) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return api.PartnerAPI.getPartnerProfile(name).catch((e: any) =>
        setErrorMsg(e)
      );
    }
    return {};
  };

  const getIINs = (name: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.BankAPI.getIINs(name)
      .then((iins: any) => iins)
      .catch((error: []) => setErrorMsg(error));

  const getPartnerIINs = (name: string) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.getPartnerIINs(name)
      .then((iins: any) => iins)
      .catch((error: []) => setErrorMsg(error));

  const removeIIN = async (pname: any, iin: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.removePartnerIIN(pname.name, iin).catch((error: []) =>
      setErrorMsg(error)
    );
    const newPartnerIINList = partnerIINList.filter((l) => !l.includes(iin));
    const promises = [
      ...(await getIINs(partner.bankName)),
      ...(await getPartnerIINs(partner.name)),
    ];
    const newListOfCombinedIINs = [...new Set(promises)];

    setPartnerIINList(newPartnerIINList);
    setPartnerIINs(
      newListOfCombinedIINs.filter((i: any) => !newPartnerIINList.includes(i))
    );
  };

  const addPartnerIINs = (name: string, inn: any) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.addPartnerIINs(name, inn)
      .then((iins: any) => iins)
      .catch((error: []) => setErrorMsg(error));
  };

  const createPartnerProgram = (name: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.createPartnerProgram(name, dto).catch((e: any) =>
      setErrorMsg(e)
    );
  const addLinkedPartner = (name: string, dto: any) =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.addLinkedPartner(name, dto).catch((e: any) =>
      setErrorMsg(e)
    );

  const addLinkages = (pName: string, values: any) => {
    const promises: any[] = [];
    values.newLinkedPartners.map((p: any) =>
      promises.push(addLinkedPartner(pName, { name: p }))
    );
    values.newLinkedPrograms.map((p: any) =>
      promises.push(createPartnerProgram(pName, { programName: p }))
    );
    Promise.all(promises).then(() => {
      emitter.emit("partner.created", {});
      emitter.emit("programs.changed", {});
      emitter.emit("programs.edit.changed", {});
      toggleDrawer();
    });
  };

  const getLinkablePartners = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.list().then((result: any) => {
      const nonSelected = edit
        ? result.filter(
            (p: any) =>
              partner.linkedPartners &&
              !partner.linkedPartners.find((l: any) => p.name === l.name) &&
              p.name !== partner.name
          )
        : result;
      const names = nonSelected.map((p: any) => p.name);
      setLinkablePartners(names);
    });

  const getLinkablePrograms = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.OperatingAPI.list().then((result: any) => {
      const nonSelected = edit
        ? result.filter(
            (p: any) =>
              !partner.linkedPrograms.find((l: any) => p.name === l.programName)
          )
        : result;
      const linkableByProgramMap = new Map();
      // creating a map of bankName -> list of programs
      // per business rule, you can only link programs which share a bank in
      // common with the selected partner
      nonSelected.forEach(async (p: any) => {
        if (!linkableByProgramMap.get(p.bankName)) {
          linkableByProgramMap.set(p.bankName, [""]);
        }
        linkableByProgramMap.get(p.bankName).push(p.name);
      });
      setLinkablePrograms(linkableByProgramMap);
    });

  const listExchanges = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.PartnerAPI.listExchanges().catch((e) => setErrorMsg(e));

  const getExchangesForPartner = () => {
    if (edit && canSeeExchanges) {
      listExchanges().then((fxs: any) => {
        setExchanges(fxs);
      });
    }
  };

  const createPartner = async (values: any) => {
    const checkEmptyINNs = !!values.newIINs.filter((a: any) => a).length;

    if (edit && checkEmptyINNs) {
      await Promise.all(
        values.newIINs.map((inn: any) => addPartnerIINs(partner.name, [inn]))
      );
    }
    if (!edit) {
      const dto = {
        bankName: values.bank,
        country: values.location.split("/")[0].trim(),
        description: values.description,
        name: values.name,
        partnerProfile: {
          userName: values.userName,
          password: values.password,
        },
        partnerUser: {
          password: values.password,
          userName: values.userName,
          person: {
            addresses: [],
            dob: "",
            emails: [
              {
                email: values.email,
                type: "work",
                state: "unverified",
              },
            ],
            firstName: values.firstName,
            gender: values.gender,
            lastName: values.lastName,
            lastName2: values.lastName2,
            middleName: values.middleName,
            nickName: values.nickName,
            officialIds: [],
            phones: [],
            suffix: values.suffix,
            title: values.title,
          },
        },
        primaryContact: {
          addresses: [],
          dob: "",
          emails: [
            {
              email: values.email,
              type: "work",
              state: "unverified",
            },
          ],
          firstName: values.firstName,
          gender: values.gender,
          lastName: values.lastName,
          lastName2: values.lastName2,
          middleName: values.middleName,
          nickName: values.nickName,
          officialIds: [],
          phones: [],
          suffix: values.suffix,
          title: values.title,
        },
        timeZone: values.timezone,
        language: values.language,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const createdPartner = await api.PartnerAPI.create(dto).catch((e: any) =>
        setErrorMsg(e)
      );

      if (createdPartner) {
        addLinkages(createdPartner.name, values);
      }
      if (createdPartner && checkEmptyINNs) {
        await Promise.all(
          values.newIINs.map((inn: any) =>
            addPartnerIINs(createdPartner.name, [inn])
          )
        );
      }
    } else {
      addLinkages(values.name, values);
    }
  };

  const findDisplayName = (countryCode: string, countryList: any) => {
    const entry = countryList.find((c: any) => c.code === countryCode);
    return entry ? `${entry.code} / ${entry.name}` : "";
  };

  const setup = () => {
    const promises = [getBanks(), getCountries()];

    if (edit) {
      promises.push(getIINs(partner.bankName));
      promises.push(getPartnerProfile(partner.name));
      promises.push(getPartnerIINs(partner.name));
    }

    Promise.all(promises)
      .then((results) => {
        const banks = results[0];
        const locs = results[1];

        setPartnerIINs([]);
        if (edit) {
          const BINNs = results[2];
          const profile = results[3];
          if (results[4]) {
            const PINNs = results[4];
            const uniqueIINList = BINNs.filter((x: any) => !PINNs.includes(x));
            setPartnerIINList([...PINNs]);
            setPartnerIINs(uniqueIINList);
          }

          setInitialValues({
            newIINs: [],
            name: partner.name !== undefined ? partner.name : "",
            description:
              partner.description !== undefined ? partner.description : "",
            bank: partner.bankName !== undefined ? partner.bankName : "",
            timezone: partner.timeZone !== undefined ? partner.timeZone : "",
            language:
              partner.language !== undefined
                ? partner.language.replace("en-US", "en")
                : "",
            location:
              partner.country !== undefined
                ? findDisplayName(partner.country, locs)
                : "",
            title:
              partner.primaryContact !== undefined
                ? partner.primaryContact.title
                : "",
            firstName:
              partner.primaryContact !== undefined
                ? partner.primaryContact.firstName
                : "",
            middleName:
              partner.primaryContact !== undefined
                ? partner.primaryContact.middleName
                : "",
            lastName:
              partner.primaryContact !== undefined
                ? partner.primaryContact.lastName
                : "",
            lastName2:
              partner.primaryContact !== undefined
                ? partner.primaryContact.lastName2
                : "",
            suffix:
              partner.primaryContact !== undefined
                ? partner.primaryContact.suffix
                : "",
            nickName:
              partner.primaryContact !== undefined
                ? partner.primaryContact.nickName
                : "",
            gender:
              partner.primaryContact !== undefined
                ? partner.primaryContact.gender
                : "",
            userName: profile.userName !== undefined ? profile.userName : "",
            // email: "",
            email:
              partner.primaryContact !== undefined
                ? partner.primaryContact.emails[0].email
                : "",
            password: "",
            newLinkedPartners: [],
            newLinkedPrograms: [],
          });
        }
        const combinedLocationInfo: string[] = [];
        const bankNames: string[] = [];
        let index = -1;

        // Finland has a duplicate entry and it breaks the dropdown.
        // eslint-disable-next-line no-restricted-syntax
        for (const [i, v] of locs.entries()) {
          if (v.code === "FIN") {
            index = i;
          }
        }

        if (index > -1) {
          locs.splice(index, 1);
        }

        locs.forEach((l: any) =>
          combinedLocationInfo.push(`${l.code} / ${l.name}`)
        );
        setLocations(combinedLocationInfo);

        banks.map((b: any) => bankNames.push(b.name));
        bankNames.unshift("");
        setAvailibleBanks(bankNames);
        setTitles(["", "Mr", "Ms", "Mrs"]);
        setSuffixes(["", "Jr", "Sr", "I", "II", "III"]);
      })
      .catch((e: any) => setErrorMsg(e));
  };

  const checkBankForINN = () => {
    if (!edit && !!selectedBank.length) {
      getIINs(selectedBank).then((r: any) => setPartnerIINs(r));
    }
  };

  useEffect(() => {
    setup();
    getLinkablePartners();
    getLinkablePrograms();
    getExchangesForPartner();
  }, []);

  useEffect(() => {
    checkBankForINN();
  }, [selectedBank]);

  useEffect(() => {
    if (
      getTimezoneListQuery.data &&
      getGendersQuery.data &&
      getLocalesQuery.data
    ) {
      const tzs = getTimezoneListQuery.data;
      const gens = getGendersQuery.data;
      const languages = getLocalesQuery.data;
      tzs.unshift(undefined);
      setTimezones(tzs);
      setGenders(gens);

      const languageList: string[] = ([] = languages.map((l: any) => ({
        text: l.displayName,
        code: l.code,
      })));
      setLanguages(languageList);
    }
  }, [getTimezoneListQuery.data, getGendersQuery.data, getLocalesQuery.data]);

  const defineProfileSection = (props: any) => {
    return (
      <>
        <FormGroup>
          <Box>
            <Grid>
              <InputWithPlaceholder
                required
                id="name"
                name="name"
                autoComplete="off"
                type="text"
                placeholder={intl.formatMessage({
                  id: "name",
                  description: "Input Label for name",
                  defaultMessage: "Name",
                })}
                value={props.values.name}
                disabled={edit}
                onchange={setUpdatedPartnerName(props.values.name)}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <InputWithPlaceholder
                id="description"
                name="description"
                autoComplete="off"
                type="text"
                placeholder={intl.formatMessage({
                  id: "description",
                  description: "Input Label for description",
                  defaultMessage: "Description",
                })}
                value={props.values.description}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <DropdownFloating
                required
                id="select-bank-dropdown"
                name="bank"
                placeholder={intl.formatMessage({
                  id: "bank",
                  description: "Bank",
                  defaultMessage: "Bank",
                })}
                list={availibleBanks}
                value={props.values.bank}
                disabled={edit}
                onchange={setSelectedBank(props.values.bank)}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <DropdownFloating
                id="languageInput"
                required
                name="language"
                placeholder={
                  <FormattedMessage
                    id="language"
                    description="Input Label"
                    defaultMessage="Language"
                  />
                }
                list={languages}
                valueKey="code"
                value={props.values.language}
                disabled={edit}
                formattedDisplayName={
                  <LanguageToIntl value={props.values.language} />
                }
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <DropdownFloating
                required
                id="select-partner-timezone"
                name="timezone"
                placeholder={intl.formatMessage({
                  id: "timeZone",
                  description: "Timezone",
                  defaultMessage: "Time Zone",
                })}
                list={timezones}
                value={props.values.timezone}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <DropdownFloating
                required
                id="select-partner-location"
                name="location"
                placeholder={intl.formatMessage({
                  id: "location",
                  description: "Location",
                  defaultMessage: "Location",
                })}
                list={locations}
                value={props.values.location}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid sx={{ mb: 2 }}>
              <Label>
                <FormattedMessage
                  id="partnerManagerDetails"
                  description="Text"
                  defaultMessage="Partner Manager Details"
                />
              </Label>
            </Grid>
          </Box>
          <Box>
            <Grid>
              <InputWithPlaceholder
                required
                id="drawer.addPartner.username"
                name="userName"
                autoComplete="off"
                type="text"
                placeholder={intl.formatMessage({
                  id: "username",
                  description: "Input Label",
                  defaultMessage: "Username",
                })}
                value={props.values.userName}
                disabled={edit}
                {...props}
              />
              <InputWithPlaceholder
                required
                id="drawer.addPartner.email"
                name="email"
                autoComplete="off"
                type="text"
                placeholder={intl.formatMessage({
                  id: "drawer.addPartner.label.email",
                  description: "Input Label",
                  defaultMessage: "Email",
                })}
                value={props.values.email}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
          {!edit && (
            <Box>
              <Grid>
                <InputWithPlaceholder
                  required={true}
                  id="drawer.addPartner.password"
                  name="password"
                  autoComplete="off"
                  type="password"
                  placeholder={intl.formatMessage({
                    id: "password",
                    description: "Input Label",
                    defaultMessage: "Password",
                  })}
                  value={props.values.password}
                  {...props}
                />
              </Grid>
            </Box>
          )}
          <Box>
            <Grid>
              <DropdownFloating
                id="select-partner-title"
                name="title"
                placeholder={intl.formatMessage({
                  id: "title",
                  description: "Contact title",
                  defaultMessage: "Title",
                })}
                list={titles}
                value={props.values.title}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <InputWithPlaceholder
                required
                id="drawer.addPartner.first.name"
                name="firstName"
                autoComplete="off"
                type="text"
                placeholder={intl.formatMessage({
                  id: "firstName",
                  description: "Input Label",
                  defaultMessage: "First Name",
                })}
                value={props.values.firstName}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <InputWithPlaceholder
                id="drawer.addPartner.middle.name"
                name="middleName"
                autoComplete="off"
                type="text"
                placeholder={intl.formatMessage({
                  id: "middleName",
                  description: "Input Label",
                  defaultMessage: "Middle Name",
                })}
                value={props.values.middleName}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <InputWithPlaceholder
                required
                id="drawer.addPartner.last.name"
                name="lastName"
                autoComplete="off"
                type="text"
                placeholder={intl.formatMessage({
                  id: "lastName",
                  description: "Input Label",
                  defaultMessage: "Last Name",
                })}
                value={props.values.lastName}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <InputWithPlaceholder
                id="drawer.addPartner.last.name2"
                name="lastName2"
                autoComplete="off"
                type="text"
                placeholder={intl.formatMessage({
                  id: "secondLastName",
                  description: "Input Label",
                  defaultMessage: "Second last name",
                })}
                value={props.values.lastName2}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <DropdownFloating
                id="select-partner-suffix"
                name="suffix"
                placeholder={intl.formatMessage({
                  id: "suffix",
                  description: "Contact suffix",
                  defaultMessage: "Suffix",
                })}
                list={suffixes}
                value={props.values.suffix}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
          <Box>
            <Grid>
              <InputWithPlaceholder
                id="nickname"
                name="nickName"
                autoComplete="off"
                type="text"
                placeholder={intl.formatMessage({
                  id: "nickName",
                  description: "Input Label",
                  defaultMessage: "Nickname",
                })}
                value={props.values.nickName}
                disabled={edit}
                {...props}
              />
            </Grid>
          </Box>
        </FormGroup>
        <FormGroup sx={{ mb: 2 }}>
          <Label htmlFor="genderGroup">
            <FormattedMessage
              id="genders"
              description="Section Label"
              defaultMessage="Gender"
            />
          </Label>
          <RadioButtonGroup
            id="genderGroup"
            value={props.values.gender}
            error={props.errors.gender}
            touched={props.touched.gender}
          >
            <FormGroup>
              {genders.map((gender: string) => (
                <Field
                  name="gender"
                  as={RadioButton}
                  label={InternationalizeGender(gender, intl)}
                  id={`gender-${gender}`}
                  key={`gender-${gender}`}
                  checked={props.values.gender === gender}
                  value={gender}
                  disabled={edit}
                  {...props}
                />
              ))}
            </FormGroup>
          </RadioButtonGroup>
        </FormGroup>
      </>
    );
  };

  return (
    <Container style={{ minWidth: "400px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={PartnerSchema}
        onSubmit={(values) => createPartner(values)}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit} noValidate>
            <Grid>
              <Header
                value={
                  edit
                    ? intl.formatMessage({
                        id: "editPartner",
                        description: "drawer header",
                        defaultMessage: "Edit Partner",
                      })
                    : intl.formatMessage({
                        id: "addNewPartner",
                        description: "drawer header",
                        defaultMessage: "Add Partner",
                      })
                }
                level={2}
                color="white"
                bold
                drawerTitle
              />
              {((edit && canSeePartnerProfile) ||
                (!edit && canAddNewPartner)) &&
                defineProfileSection(props)}
              {edit && canSeeExchanges && partner.name === partnerName && (
                <FormGroup>
                  <Label htmlFor="exchangesGroup">
                    <FormattedMessage
                      id="exchanges"
                      description="Section Label"
                      defaultMessage="Exchanges"
                    />
                  </Label>
                  {exchanges.map((exchange: any) => (
                    <TextRender data={exchange.name} />
                  ))}
                </FormGroup>
              )}
              <FormGroup>
                <Label htmlFor="linkedPartnerGroup">
                  <FormattedMessage
                    id="linkedPartners"
                    description="Section Label"
                    defaultMessage="Linked Partners"
                  />
                </Label>
                {partner && partner.linkedPartners
                  ? partner.linkedPartners.map((p: any) => (
                      <div key={`linkedPartner-${p.name}`}>
                        <TextRender
                          data={p.name}
                          key={`linkedPartner-${p.name}`}
                        />
                      </div>
                    ))
                  : null}
                <FieldArray
                  name="newLinkedPartners"
                  render={({ remove, push }) => (
                    <div>
                      {props.errors.newLinkedPartners && (
                        <Box>
                          <Label variant="error" noMargin>
                            {props.errors.newLinkedPartners}
                          </Label>
                        </Box>
                      )}

                      {props.values.newLinkedPartners &&
                        props.values.newLinkedPartners.map(
                          (newLink: any, index: number) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Grid
                              container
                              /* eslint-disable-next-line react/no-array-index-key */
                              key={`div.newLinkedPartners.${index}`}
                            >
                              <Grid
                                item
                                sx={{ pt: 1 }}
                                key={`btn.newLinkedPartners.${index}`}
                              >
                                <QDButton
                                  /* eslint-disable-next-line react/no-array-index-key */
                                  type="button"
                                  onClick={() => remove(index)}
                                  id="partner-delete-linked-partner"
                                  variant="icon"
                                >
                                  <img
                                    /* eslint-disable-next-line react/no-array-index-key */
                                    key={`img.newLinkedPartners.${index}`}
                                    height={16}
                                    width={16}
                                    src={Icon.deleteIcon}
                                    alt="delete icon"
                                  />
                                </QDButton>
                              </Grid>
                              <Grid item sx={{ flexGrow: 1 }}>
                                <DropdownFloating
                                  /* eslint-disable-next-line react/no-array-index-key */
                                  key={`dropdown.newLinkedPartners.${index}`}
                                  id={`select-linked-partner-${index}`}
                                  name={`newLinkedPartners.${index}`}
                                  placeholder={intl.formatMessage({
                                    id: "linkedPartner",
                                    description: "Input Label",
                                    defaultMessage: "Linked Partner",
                                  })}
                                  list={linkablePartners}
                                  value={props.values.newLinkedPartners[index]}
                                  {...props}
                                />
                              </Grid>
                            </Grid>
                          )
                        )}

                      <Grid
                        container
                        justifyContent="right"
                        sx={{ mt: 2, mb: 6 }}
                      >
                        <QDButton
                          onClick={() => push("")}
                          id="partner-add-linked-partner"
                          color="primary"
                          size="small"
                          variant="contained"
                          label={intl.formatMessage(
                            defineMessage({
                              id: "addAdditionalPartner",
                              defaultMessage: "ADD ADDITIONAL PARTNER",
                              description: "Input Label",
                            })
                          )}
                        />
                      </Grid>
                    </div>
                  )}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="linkedProgramsGroup">
                  <FormattedMessage
                    id="linkedPrograms"
                    description="Section Label"
                    defaultMessage="Linked Programs"
                  />
                </Label>
                {partner && partner.linkedPrograms
                  ? partner.linkedPrograms.map((p: any) => (
                      <div key={`linkedProgram-${p.programName}`}>
                        <TextRender
                          data={p.programName}
                          key={`linkedProgram-${p.programName}`}
                        />
                      </div>
                    ))
                  : null}
                <FieldArray
                  name="newLinkedPrograms"
                  render={({ remove, push }) => (
                    <div>
                      {props.errors.newLinkedPrograms && (
                        <Box>
                          <Label variant="error" noMargin>
                            {props.errors.newLinkedPrograms}
                          </Label>
                        </Box>
                      )}
                      {props.values.newLinkedPrograms &&
                        props.values.newLinkedPrograms.map(
                          (newLink: any, index: number) => (
                            <Grid
                              container
                              // eslint-disable-next-line react/no-array-index-key
                              key={`div.newLinkedPrograms.${index}`}
                            >
                              <Grid
                                item
                                sx={{ pt: 1 }}
                                key={`btn.newLinkedPrograms.${index}`}
                              >
                                <QDButton
                                  /* eslint-disable-next-line react/no-array-index-key */
                                  type="button"
                                  onClick={() => remove(index)}
                                  id="partners-delete-linked-program"
                                  variant="icon"
                                >
                                  <img
                                    /* eslint-disable-next-line react/no-array-index-key */
                                    key={`img.newLinkedPrograms.${index}`}
                                    height={16}
                                    width={16}
                                    src={Icon.deleteIcon}
                                    alt="delete icon"
                                  />
                                </QDButton>
                              </Grid>
                              <Grid item sx={{ flexGrow: 1 }}>
                                <DropdownFloating
                                  id={`select-linked-program-${index}`}
                                  /* eslint-disable-next-line react/no-array-index-key */
                                  key={`dropdown.newLinkedPrograms.${index}`}
                                  name={`newLinkedPrograms.${index}`}
                                  placeholder={intl.formatMessage({
                                    id: "linkedProgram",
                                    description: "Input Label",
                                    defaultMessage: "Linked Program",
                                  })}
                                  list={
                                    linkablePrograms.get(props.values.bank)
                                      ? linkablePrograms.get(props.values.bank)
                                      : []
                                  }
                                  value={props.values.newLinkedPrograms[index]}
                                  {...props}
                                />
                              </Grid>
                            </Grid>
                          )
                        )}

                      <Grid
                        container
                        justifyContent="right"
                        sx={{ mt: 2, mb: 6 }}
                      >
                        <QDButton
                          onClick={() => push("")}
                          id="partner-add-linked-program"
                          color="primary"
                          size="small"
                          variant="contained"
                          label={intl.formatMessage(
                            defineMessage({
                              id: "addAdditionalProgram",
                              defaultMessage: "ADD ADDITIONAL PROGRAM",
                              description: "Input Label",
                            })
                          )}
                        />
                      </Grid>
                    </div>
                  )}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="AddInnPartnerGroup">
                  <FormattedMessage
                    id="drawer.addPartner.label.inns"
                    description="Section Label"
                    defaultMessage="IINs"
                  />
                </Label>

                {partnerIINList.map((p: any) => (
                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center"
                    columnGap={1}
                    key={`partnerIINs-${p}`}
                  >
                    <Grid item>
                      <TextRender
                        data={p}
                        truncated
                        key={`partnerIINs-${p}`}
                        noMargin
                      />
                    </Grid>
                    <QDButton
                      key={`btn.newIINs.${p}`}
                      type="button"
                      onClick={() => removeIIN(partner, p)}
                      id="partner-delete-iin"
                      variant="icon"
                    >
                      <img
                        key={`img.newIINs.${p}`}
                        height={16}
                        width={16}
                        src={Icon.deleteIcon}
                        alt="delete icon"
                      />
                    </QDButton>
                  </Grid>
                ))}

                <FieldArray
                  name="newIINs"
                  render={({ remove, push }) => (
                    <div>
                      {props.errors.newIINs && (
                        <Box>
                          <Label variant="error" noMargin>
                            {props.errors.newIINs}
                          </Label>
                        </Box>
                      )}

                      {props.values.newIINs &&
                        props.values.newIINs.map(
                          (newLink: any, index: number) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Grid
                              container
                              // eslint-disable-next-line react/no-array-index-key
                              key={`div.newIINs.${index}`}
                            >
                              <Grid
                                item
                                sx={{ pt: 1 }}
                                key={`btn.newIINs.${index}`}
                              >
                                <QDButton
                                  /* eslint-disable-next-line react/no-array-index-key */
                                  key={`btn.newIINs.${index}`}
                                  type="button"
                                  onClick={() => remove(index)}
                                  id="partner-delete-inn"
                                  variant="icon"
                                >
                                  <img
                                    /* eslint-disable-next-line react/no-array-index-key */
                                    key={`img.newIINs.${index}`}
                                    height={16}
                                    width={16}
                                    src={Icon.deleteIcon}
                                    alt="delete icon"
                                  />
                                </QDButton>
                              </Grid>
                              <Grid item sx={{ flexGrow: 1 }}>
                                <DropdownFloating
                                  /* eslint-disable-next-line react/no-array-index-key */
                                  key={`dropdown.Inns.${index}`}
                                  id={`select-Inns-${index}`}
                                  name={`newIINs.${index}`}
                                  placeholder={intl.formatMessage({
                                    id: "drawer.partners.label.Inns",
                                    description: "Input Label",
                                    defaultMessage: "IINs",
                                  })}
                                  list={partnerIINs}
                                  value={props.values.newIINs[index]}
                                  {...props}
                                />
                              </Grid>
                            </Grid>
                          )
                        )}

                      <Grid
                        container
                        justifyContent="right"
                        sx={{ mt: 2, mb: 6 }}
                      >
                        <QDButton
                          onClick={() => push("")}
                          id="partner-add-additional-inns"
                          color="primary"
                          size="small"
                          variant="contained"
                          label={intl.formatMessage(
                            defineMessage({
                              id: "partner.add.additional.inns.button",
                              defaultMessage: "ADD ADDITIONAL IIN",
                              description: "Input Label",
                            })
                          )}
                        />
                      </Grid>
                    </div>
                  )}
                />
              </FormGroup>

              <Grid
                container
                rowSpacing={1}
                justifyContent="center"
                sx={{ marginTop: "48px" }}
              >
                <Grid item xs={4}>
                  <CancelButton
                    id="drawer-addpartner-button-cancel"
                    onClick={() => toggleDrawer()}
                  >
                    <FormattedMessage
                      id="cancel"
                      description="Cancel button"
                      defaultMessage="Cancel"
                    />
                  </CancelButton>
                </Grid>
                <Grid item xs={7}>
                  <SubmitButton
                    id="drawer-addpartner-button-savechanges"
                    disabled={!props.dirty}
                  >
                    <FormattedMessage
                      id="saveChanges"
                      description="Save changes button"
                      defaultMessage="Save Changes"
                    />
                  </SubmitButton>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default PartnerDrawer;
