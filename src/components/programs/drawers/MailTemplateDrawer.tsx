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

import React, { useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import { Container, Box, FormGroup, Grid } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik } from "formik";
import api from "../../../api/api";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import emitter from "../../../emitter";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";
import MailTypeConverter from "../../common/converters/MailTypeConverter";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Header from "../../common/elements/Header";
import { useQuery } from "@tanstack/react-query";

interface IMailTemplateDrawer {
  toggleDrawer?: any;
  templateSet?: string;
  edit?: boolean;
  mailTemplateId?: number | string;
}

const MailTemplateDrawer: React.FC<IMailTemplateDrawer> = ({
  templateSet = "",
  mailTemplateId = "",
  toggleDrawer = () => {},
  edit = false,
}) => {
  const { programName, mailLanguages, locales } =
    useContext(ProgramEditContext);

  const existingTemplateSets = mailLanguages;

  const intl = useIntl();
  const [eventTypes, setEventTypes] = useState([]);
  const [initialValues, setInitialValues] = useState({});

  const { data: getCustomerEventTypesData } = useQuery({
    queryKey: ["getCustomerEventTypes"],
    queryFn: () =>
      // @ts-ignore
      api.CommonAPI.getCustomerEventTypes(),
  });

  const getMailTemplate = () =>
    // @ts-ignore
    api.MailTemplateAPI.getMailTemplate(
      programName,
      templateSet,
      mailTemplateId
    ).catch((error: any) => error);

  const templateSetExists = (languageCode: any) => {
    if (
      existingTemplateSets.indexOf(languageCode.replaceAll("_", "-")) !== -1
    ) {
      return { exits: true, hyphenated: true };
    }
    if (existingTemplateSets.indexOf(languageCode) !== -1) {
      return { exists: true };
    }
    return { exists: false };
  };

  const addOrUpdateMailTemplate = async (values: any) => {
    let languageCode = values.language;

    // if template set does not exist, create new one
    if (!templateSetExists(languageCode).exits) {
      // @ts-ignore
      await api.MailTemplateAPI.createMailTemplateSet(programName, {
        language: languageCode,
      }).catch((error: any) => error);
    }

    // if template set exists and it uses hyphens, modify language code to use hyphens
    if (
      templateSetExists(languageCode).exits &&
      templateSetExists(languageCode).hyphenated
    ) {
      languageCode = languageCode.replaceAll("_", "-");
    }
    // @ts-ignore
    api.MailTemplateAPI.createMailTemplate(programName, languageCode, {
      id: edit ? mailTemplateId : null,
      sender: values.sender,
      mailKey: values.mailKey,
      subject: values.subject,
      template: values.template,
    })
      .then((result: any) => {
        toggleDrawer();
        emitter.emit("programs.edit.changed", {});
      })
      .catch((error: any) => error);
  };

  // @ts-ignore
  useEffect(async () => {
    let initial = {};
    if (edit) {
      await getMailTemplate().then((result: any) => {
        initial = {
          sender: result.sender,
          subject: result.subject,
          template: result.template,
          mailKey: result.mailKey,
          language:
            templateSet.indexOf("-") !== -1
              ? templateSet.replaceAll("-", "_")
              : templateSet,
        };
      });
    } else {
      initial = {
        sender: "",
        subject: "",
        template: "",
        mailKey: "",
        language: "",
      };
    }
    setInitialValues(initial);
  }, []);

  useEffect(() => {
    if (getCustomerEventTypesData) {
      const list = [].concat(getCustomerEventTypesData);
      const mailKeysMap = list.map((type) => ({
        mailKey: type,
        text: `${MailTypeConverter(type, intl)}`,
      }));
      // @ts-ignore
      setEventTypes(mailKeysMap);
    }
  }, [getCustomerEventTypesData]);

  const MailTemplateSchema = Yup.object().shape({
    mailKey: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.mailKey.required",
          defaultMessage: "Mail Key is a required field.",
        })
      ),
    edit: Yup.bool(),
    language: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.language.required",
          defaultMessage: "Language is a required field.",
        })
      ),
    sender: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.sender.required",
          defaultMessage: "Sender is a required field.",
        })
      ),
    subject: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.subject.required",
          defaultMessage: "Subject is a required field.",
        })
      ),
    template: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.template.required",
          defaultMessage: "Template is a required field.",
        })
      ),
  });

  return (
    <Container sx={{ width: "397px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={MailTemplateSchema}
        onSubmit={(values) => addOrUpdateMailTemplate(values)}
        enableReinitialize
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Box>
              <Header
                value={
                  edit
                    ? intl.formatMessage({
                        id: "editMailTemplate",
                        description: "drawer header",
                        defaultMessage: "Edit Mail Template",
                      })
                    : intl.formatMessage({
                        id: "addMailTemplate",
                        description: "drawer header",
                        defaultMessage: "Add Mail Template",
                      })
                }
                level={2}
                color="white"
                bold
                drawerTitle
              />
              <FormGroup sx={{ mb: 3 }}>
                {/* @ts-ignore */}
                <DropdownFloating
                  name="language"
                  placeholder={`${intl.formatMessage({
                    id: "language",
                    defaultMessage: "Language",
                  })}*`}
                  list={locales}
                  // @ts-ignore
                  value={props.values.language | ""}
                  valueKey="code"
                  disabled={edit}
                  {...props}
                />
                {/* @ts-ignore */}
                <DropdownFloating
                  name="mailKey"
                  placeholder={`${intl.formatMessage({
                    id: "mailKey",
                    defaultMessage: "Mail Key",
                  })}*`}
                  list={eventTypes}
                  valueKey="mailKey"
                  // @ts-ignore
                  value={props.values.mailKey | ""}
                  disabled={edit}
                  {...props}
                />
                {/* @ts-ignore */}
                <InputWithPlaceholder
                  name="sender"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "sender",
                    defaultMessage: "Sender",
                  })}*`}
                  // @ts-ignore
                  value={props.values.sender | ""}
                  {...props}
                />
                {/* @ts-ignore */}
                <InputWithPlaceholder
                  name="subject"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "subject",
                    defaultMessage: "Subject",
                  })}*`}
                  // @ts-ignore
                  value={props.values.subject | ""}
                  {...props}
                />
                {/* @ts-ignore */}
                <InputWithPlaceholder
                  name="template"
                  autoComplete="off"
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "template",
                    defaultMessage: "Template",
                  })}*`}
                  multiline
                  // @ts-ignore
                  value={props.values.template | ""}
                  as="textarea"
                  {...props}
                />
              </FormGroup>
              <Grid container rowSpacing={1} justifyContent="center">
                <Grid item xs={4}>
                  <CancelButton
                    onClick={() => toggleDrawer()}
                    id="mail-template-cancel-changes"
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
                    id="mail-template-save-changes"
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
            </Box>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default MailTemplateDrawer;
