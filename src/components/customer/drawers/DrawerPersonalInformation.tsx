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
 *
 */

import React, { useContext, useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, Container, FormGroup } from "@mui/material";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Header from "../../common/elements/Header";
import emitter from "../../../emitter";
import { IPersonalInfo } from "../../../pages/customer/CustomerEdit";
import InternationalizeGender from "../../common/converters/InternationalizeGender";
import DatePicker from "../../common/forms/inputs/DatePicker";
import { useQuery } from "@tanstack/react-query";

interface IPersonalInformation {
  personInfo: IPersonalInfo;
  toggleDrawer?: any;
}

const PersonalInformationDrawer: React.FC<IPersonalInformation> = ({
  personInfo,
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
}) => {
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const intl = useIntl();
  const [initialValues, setInitialValues] = useState({
    ...personInfo,
  });

  const ref = useRef<any>(null);
  const [titles, setTitles] = useState(["Mr", "Ms", "Mrs", null]);
  const [suffixes, setSuffixes] = useState([
    "Jr",
    "Sr",
    "I",
    "II",
    "III",
    null,
  ]);
  const [genders, setGenders] = useState([]);

  const { data: getGendersData } = useQuery({
    queryKey: ["getGenders"],
    queryFn: () =>
      // @ts-ignore
      api.CommonAPI.getGenders(),
    onError: (error: any) => setErrorMsg(error),
  });

  const PersonalInfoSchema = Yup.object().shape({
    title: Yup.string().nullable(true),
    firstName: Yup.string().required(
      intl.formatMessage({
        id: "error.givenName.required",
        defaultMessage: "Given name is a required field",
      })
    ),
    middleName: Yup.string(),
    lastName: Yup.string().required(
      intl.formatMessage({
        id: "error.familyName.required",
        defaultMessage: "Family name is a required field",
      })
    ),
    lastName2: Yup.string(),
    suffix: Yup.string().nullable(true),
    nickName: Yup.string(),
    gender: Yup.string().nullable(true),
    dob: Yup.string()
      .test("checkDateFormat", (value) => {
        return value !== "Invalid date";
      })
      .required(
        intl.formatMessage({
          id: "error.dateOfBirth.required",
          defaultMessage: "Date of birth is a required field.",
        })
      ),
  });

  useEffect(() => {
    if (getGendersData) {
      const genderList = getGendersData.map((r: string) => ({
        text: InternationalizeGender(r, intl),
        gender: r,
      }));
      genderList.push({ text: "", gender: null });
      setGenders(genderList);
    }
  }, [getGendersData]);

  const personInfoChanged = (values: any) => {
    return (
      values.title !== initialValues.title ||
      values.firstName !== initialValues.firstName ||
      values.middleName !== initialValues.middleName ||
      values.lastName !== initialValues.lastName ||
      values.lastName2 !== initialValues.lastName2 ||
      values.nickName !== initialValues.nickName ||
      values.gender !== initialValues.gender ||
      values.suffix !== initialValues.suffix ||
      values.dob !== initialValues.dob
    );
  };

  const saveChanges = async (values: any) => {
    if (personInfoChanged(values)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await api.PersonAPI.update(initialValues.personId, {
        title: values.title,
        firstName: values.firstName,
        middleName:
          values.middleName && values.middleName.length > 0
            ? values.middleName
            : null,
        lastName: values.lastName,
        lastName2:
          values.lastName2 && values.lastName2.length > 0
            ? values.lastName2
            : null,
        suffix: values.suffix,
        nickName:
          values.nickName && values.nickName.length > 0
            ? values.nickName
            : null,
        gender: values.gender,
        dob: values.dob.replaceAll("-", ""),
      })
        .then(() => {
          emitter.emit("customer.edit.info.changed", {});
          toggleDrawer();
          setSuccessMsg({
            responseCode: "200000",
            message: intl.formatMessage({
              id: "changes.success.saved",
              defaultMessage: "Your changes were saved successfully.",
            }),
          });
        })
        .catch((error: any) => setErrorMsg(error));
    }
  };

  return (
    <Container style={{ minWidth: "400px" }}>
      <Formik
        innerRef={ref}
        initialValues={initialValues}
        validationSchema={PersonalInfoSchema}
        onSubmit={(values) => saveChanges(values)}
      >
        {(props: any) => (
          <form className="mt-4" onSubmit={props.handleSubmit}>
            <Box>
              <Box sx={{ marginBottom: "24px" }}>
                <Header
                  level={2}
                  bold
                  color="white"
                  value={intl.formatMessage({
                    id: "customerEdit.drawer.personalInfo.header",
                    defaultMessage: "Edit Personal Information",
                  })}
                />
              </Box>
              <FormGroup>
                <Box sx={{ marginBottom: "8px" }}>
                  <Box>
                    {titles.length > 0 && (
                      <Field
                        name="title"
                        as={DropdownFloating}
                        id="customer-edit-title"
                        className="mb-1"
                        value={initialValues.title}
                        placeholder={intl.formatMessage({
                          id: "customer.edit.label.title",
                          defaultMessage: "Title",
                        })}
                        list={titles}
                        {...props}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ marginBottom: "8px" }}>
                  <Box>
                    <InputWithPlaceholder
                      id="input-firstName"
                      name="firstName"
                      autoComplete="off"
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "customerEdit.drawer.personalInfo.firstName",
                        defaultMessage: "Given Name*",
                      })}
                      className="login-input"
                      required
                      {...props}
                    />
                  </Box>
                </Box>
                <Box sx={{ marginBottom: "8px" }}>
                  <Box>
                    <InputWithPlaceholder
                      id="input-middleName"
                      name="middleName"
                      autoComplete="off"
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "customerEdit.drawer.personalInfo.MiddleName",
                        defaultMessage: "Middle Name",
                      })}
                      className="login-input"
                      {...props}
                    />
                  </Box>
                </Box>
                <Box sx={{ marginBottom: "8px" }}>
                  <Box>
                    <InputWithPlaceholder
                      id="input-lastName"
                      name="lastName"
                      autoComplete="off"
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "customerEdit.drawer.personalInfo.FamilyName",
                        defaultMessage: "Family Name*",
                      })}
                      className="login-input"
                      required
                      {...props}
                    />
                  </Box>
                </Box>
                <Box sx={{ marginBottom: "8px" }}>
                  <Box>
                    <InputWithPlaceholder
                      id="customer-edit-lastName2"
                      name="lastName2"
                      autoComplete="off"
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "customer.edit.label.secondFamilyName",
                        description: "Input Label for second family name",
                        defaultMessage: "Second Family Name",
                      })}
                      className="login-input mr-1"
                      {...props}
                    />
                  </Box>
                </Box>
                <Box sx={{ marginBottom: "8px" }}>
                  <Box>
                    {suffixes.length > 0 && (
                      <Field
                        name="suffix"
                        as={DropdownFloating}
                        id="customer-edit-suffix"
                        className="mb-1"
                        placeholder={intl.formatMessage({
                          id: "customer.edit.label.suffix",
                          defaultMessage: "Suffix",
                        })}
                        list={suffixes}
                        {...props}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ marginBottom: "8px" }}>
                  <Box>
                    <InputWithPlaceholder
                      id="customer-edit-nickname"
                      name="nickName"
                      autoComplete="off"
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "customer.edit.label.nickname",
                        description: "Input Label for nickname",
                        defaultMessage: "Nickname",
                      })}
                      className="login-input"
                      {...props}
                    />
                  </Box>
                </Box>
                <Box sx={{ marginBottom: "8px" }}>
                  <Box>
                    {genders.length > 0 && (
                      <Field
                        name="gender"
                        as={DropdownFloating}
                        id="customer-edit-gender"
                        className="mb-1"
                        placeholder={intl.formatMessage({
                          id: "customer.edit.label.gender",
                          defaultMessage: "Gender",
                        })}
                        valueKey="gender"
                        list={genders}
                        {...props}
                      />
                    )}
                  </Box>
                </Box>
                <Box sx={{ marginBottom: "8px" }}>
                  <Box>
                    <Field
                      id="customer-edit-dob"
                      name="dob"
                      label={intl.formatMessage({
                        id: "customer.edit.label.dob",
                        defaultMessage: "Date of Birth",
                      })}
                      component={DatePicker}
                      className="mt-0 mb-0"
                      value={props.values.dob}
                      helperText={props.errors.dob}
                      error={props.errors.dob}
                      maxDate={moment().format("YYYY-MM-DD")}
                    />
                  </Box>
                </Box>
              </FormGroup>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="drawer-personalInfo-button-cancel"
                  className="mt-1 mr-2"
                  onClick={() => toggleDrawer()}
                >
                  <FormattedMessage
                    id="drawer.personalInfo.button.cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <SubmitButton
                  id="drawer-personalInfo-button-saveChanges"
                  className="mt-1 mr-0"
                  disabled={!props.dirty}
                >
                  <FormattedMessage
                    id="drawer.personalInfo.button.saveChanges"
                    description="Save changes button"
                    defaultMessage="Save Changes"
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

export default PersonalInformationDrawer;
