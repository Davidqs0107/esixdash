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
import * as Yup from "yup";
import { Container, Box, FormGroup, Grid } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Formik } from "formik";
import api from "../../../api/api";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import emitter from "../../../emitter";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";
import Header from "../../common/elements/Header";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";

interface IMemoTemplateDrawer {
  toggleDrawer?: any;
  templateSet?: string;
  edit?: boolean;
  memoTemplateId?: string | number;
}

const MemoTemplateDrawer: React.FC<IMemoTemplateDrawer> = ({
  templateSet = "",
  memoTemplateId = "",
  toggleDrawer = () => {},
  edit = false,
}) => {
  const { programName, memoLanguages, locales } =
    useContext(ProgramEditContext);
  const intl = useIntl();

  const existingTemplateSets = memoLanguages;

  const [initialValues, setInitialValues] = useState({});
  const getMemoTemplate = () =>
    // @ts-ignore
    api.MemoAPI.getMemoTemplate(programName, templateSet, memoTemplateId).catch(
      (error: any) => error
    );

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

  const addOrUpdateMemoTemplate = async (values: any) => {
    let languageCode = values.language;

    // if template set does not exist, create new one
    if (!templateSetExists(languageCode).exits) {
      // @ts-ignore
      await api.MemoAPI.createMemoTemplateSet(programName, {
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
    api.MemoAPI.createMemoTemplate(
      programName,
      edit ? templateSet : languageCode,
      {
        id: edit ? memoTemplateId : null,
        sender: values.sender,
        memoKey: values.memoKey,
        subject: values.subject,
        template: values.template,
      }
    )
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
      await getMemoTemplate().then((result: any) => {
        initial = {
          edit,
          template: result.template,
          memoKey: result.memoKey,
          language:
            templateSet.indexOf("-") !== -1
              ? templateSet.replaceAll("-", "_")
              : templateSet,
        };
      });
    } else {
      initial = {
        edit,
        template: "",
        memoKey: "",
        language: "",
      };
    }
    setInitialValues(initial);
  }, []);

  const MemoTemplateSchema = Yup.object().shape({
    memoKey: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.memoKey.required",
          description: "drawer header",
          defaultMessage: "Memo Key is required.",
        })
      ),
    edit: Yup.bool(),
    language: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.language.required",
          description: "drawer header",
          defaultMessage: "Language is required.",
        })
      ),
    template: Yup.string()
      .min(1)
      .required(
        intl.formatMessage({
          id: "error.template.required",
          description: "drawer header",
          defaultMessage: "Template is required.",
        })
      ),
  });

  return (
    <Container sx={{ width: "397px" }}>
      <Formik
        initialValues={initialValues}
        validationSchema={MemoTemplateSchema}
        onSubmit={(values) => addOrUpdateMemoTemplate(values)}
        enableReinitialize
      >
        {(props: any) => (
          <form onSubmit={props.handleSubmit}>
            <Box>
              <Header
                value={
                  edit
                    ? intl.formatMessage({
                        id: "editTransactionMemoTemplate",
                        description: "drawer header",
                        defaultMessage: "Edit Transaction Memo Template",
                      })
                    : intl.formatMessage({
                        id: "addTransactionMemoTemplate",
                        description: "drawer header",
                        defaultMessage: "Add Transaction Memo Template",
                      })
                }
                level={2}
                color="white"
                bold
                drawerTitle
              />
              <FormGroup sx={{ mb: 3 }}>
                <DropdownFloating
                  name="language"
                  placeholder={`${intl.formatMessage({
                    id: "language",
                    defaultMessage: "Language",
                  })}*`}
                  list={locales}
                  value={props.values.language}
                  valueKey="code"
                  disabled={edit}
                  {...props}
                />
                <InputWithPlaceholder
                  name="memoKey"
                  placeholder={`${intl.formatMessage({
                    id: "memoKey",
                    defaultMessage: "Memo Key",
                  })}*`}
                  value={props.values.memoKey}
                  disabled={edit}
                  readOnly={edit}
                  {...props}
                />
                <InputWithPlaceholder
                  name="template"
                  autoComplete="off"
                  type="text"
                  multiline
                  placeholder={`${intl.formatMessage({
                    id: "template",
                    defaultMessage: "Template",
                  })}*`}
                  value={props.values.template}
                  shrink={props.values.template}
                  {...props}
                />
              </FormGroup>

              <Grid container rowSpacing={1} justifyContent="center">
                <Grid item xs={4}>
                  <CancelButton
                    onClick={() => toggleDrawer()}
                    id="memo-template-cancel-changes"
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
                    id="memo-template-save-changes"
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

export default MemoTemplateDrawer;
