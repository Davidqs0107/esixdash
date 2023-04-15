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

import Box from "@mui/material/Box";
import * as Yup from "yup";
import { Formik } from "formik";
import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { isValidPhoneNumber } from "react-phone-number-input";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import emitter from "../../../emitter";
import { MessageContext } from "../../../contexts/MessageContext";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import ContactMethodConverter from "../../common/converters/ContactMethodConverter";
import PhoneNumber from "../../common/forms/inputs/PhoneNumber";
import Header from "../../common/elements/Header";

interface IMemoDrawer {
  toggleDrawer?: any; // provided by Drawer comp
  customerNumber: string;
  memoId?: string;
  isEditMemo?: boolean;
}

interface IAttribute {
  name: string;
  value: string;
}

const MemoDrawer: React.FC<IMemoDrawer> = ({
  toggleDrawer = () => {
    /* provided by drawer comp */
  },
  customerNumber,
  memoId = "",
  isEditMemo = false,
}) => {
  const intl = useIntl();

  const [memoData, setMemoData] = useState({
    externalReference: "",
    attributes: [],
    memo: "",
  });
  const [contactMethods] = useState([
    { code: "Phone", text: ContactMethodConverter("Phone", intl) },
    { code: "Email", text: ContactMethodConverter("Email", intl) },
  ]);
  const [initialValues, setInitialValues] = useState({
    memo: "",
    contactMethod: "",
    contactInfo: "",
    externalReference: "",
  });

  const { setErrorMsg } = useContext(MessageContext);

  const cancel = () => {
    toggleDrawer();
  };

  const isEditMemoDrawerHeader = () => {
    return isEditMemo
      ? intl.formatMessage({
          id: "editMemo",
          description: "drawer header",
          defaultMessage: "Edit Memo",
        })
      : intl.formatMessage({
          id: "addNewMemo",
          description: "drawer header",
          defaultMessage: "Add New Memo",
        });
  };

  const isEditMemoSaveChangesButton: () => JSX.Element = () => {
    return isEditMemo ? (
      <FormattedMessage
        id="addMemo"
        description="Save changes button"
        defaultMessage="Add Memo"
      />
    ) : (
      <FormattedMessage
        id="saveMemo"
        description="Save changes button"
        defaultMessage="Save Memo"
      />
    );
  };

  const findContactAttr = (attrs: IAttribute[]) =>
    attrs.find((i) => i.name === "contactPhone" || i.name === "contactEmail");
  const parseContactMethod = (attr: IAttribute | undefined) =>
    attr ? attr.name.replace("contact", "") : "";
  const getContactInfo = (attr: IAttribute | undefined) =>
    attr ? attr.value : "";

  const findAndUpdateAttr = (
    name: string,
    newData: string,
    attrs: IAttribute[]
    // eslint-disable-next-line no-param-reassign,no-return-assign
  ) => attrs.find((i) => (i.name === name ? (i.value = newData) : ""));

  const editMemo = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerMemoAPI.getCustomerMemo(customerNumber, memoId)
      .then((data: any) => {
        setMemoData(data);
        setInitialValues({
          memo: data.memo,
          contactMethod: parseContactMethod(findContactAttr(data.attributes)),
          contactInfo: getContactInfo(findContactAttr(data.attributes)),
          externalReference:
            data.externalReference !== undefined ? data.externalReference : "",
        });
      })
      .catch((error: any) => {
        setErrorMsg(error);
      });
  };

  const createOrUpdateMemo = (data: any) => {
    const { memo, contactMethod, contactInfo, externalReference } = data;
    if (isEditMemo) {
      findAndUpdateAttr(
        `contact${contactMethod}`,
        contactInfo,
        memoData.attributes
      );
      memoData.memo = data.memo;
      memoData.externalReference = data.externalReference;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.CustomerMemoAPI.updateCustomerMemo(customerNumber, memoId, memoData)
        .then(() => {
          emitter.emit("customer.memo.changed", {});
          toggleDrawer();
        })
        .catch((error: any) => setErrorMsg(error));
    } else {
      const attributes = [];
      attributes.push({ name: `contact${contactMethod}`, value: contactInfo });

      const dto = {
        attributes,
        memo,
        externalReference,
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      api.CustomerMemoAPI.createCustomerMemo(customerNumber, dto)
        .then(() => {
          emitter.emit("customer.memo.changed", {});
          emitter.emit("customer.details.changed", {});
          toggleDrawer();
        })
        .catch((error: any) => setErrorMsg(error));
    }
  };

  useEffect(() => {
    if (isEditMemo) {
      editMemo();
    }
  }, []);

  const MemoSchema = Yup.object().shape({
    memo: Yup.string()
      .max(
        300,
        intl.formatMessage({
          id: "error.memo.mustBe300Chars",
          defaultMessage: "Memo must be 300 characters or less.",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.memo.required",
          defaultMessage: "Memo is a required field.",
        })
      ),
    contactMethod: Yup.string().required(
      intl.formatMessage({
        id: "error.contactChannel.required",
        defaultMessage: "Contact channel is a required field",
      })
    ),
    contactInfo: Yup.string().when("contactMethod", {
      is: "Email",
      then: Yup.string()
        .email(
          intl.formatMessage({
            id: "error.email.valid",
            defaultMessage: "Must be a valid email.",
          })
        )
        .required(
          intl.formatMessage({
            id: "error.email.required",
            defaultMessage: "Email is a required field.",
          })
        ),
      otherwise: Yup.string().when("contactMethod", {
        is: "Phone",
        then: Yup.string()
          .test(
            "test-valid-phone",
            intl.formatMessage({
              id: "error.phone.invalidFormat",
              defaultMessage: "Invalid phone format",
            }),
            (value) => value !== undefined && isValidPhoneNumber(value)
          )
          .required(
            intl.formatMessage({
              id: "error.phone.required",
              defaultMessage: "Phone is a required field.",
            })
          ),
        otherwise: Yup.string().required(
          intl.formatMessage({
            id: "error.contactInfo.required",
            defaultMessage: "Contact info is a required field.",
          })
        ),
      }),
    }),
    externalReference: Yup.string().notRequired(),
  });

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header level={2} bold color="white" value={isEditMemoDrawerHeader()} />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={MemoSchema}
          onSubmit={(values) => createOrUpdateMemo(values)}
          enableReinitialize
        >
          {(props) => (
            <form id="new-memo-form" onSubmit={props.handleSubmit}>
              <Box sx={{ marginBottom: "60px" }}>
                <InputWithPlaceholder
                  id="memo-message-input-field"
                  name="memo"
                  autoComplete="off"
                  className="memo-input"
                  type="text"
                  multiline
                  value={props.values.memo}
                  placeholder={intl.formatMessage({
                    id: "memo.input.placeholder",
                    description: "form label",
                    defaultMessage: "Memo (300 characters max.)",
                  })}
                  required
                  {...props}
                />
                <DropdownFloating
                  id="memo-contact-method-dropdown"
                  name="contactMethod"
                  placeholder={intl.formatMessage({
                    id: "contactChannel.input.placeholder",
                    description: "form label",
                    defaultMessage: "Contact Channel*",
                  })}
                  value={props.values.contactMethod}
                  list={contactMethods}
                  valueKey="code"
                  validationMessage={props.errors.contactMethod}
                  disabled={isEditMemo}
                  isActive
                  initialval={props.values.contactMethod}
                  {...props}
                />
                {props.values.contactMethod === "Phone" ? (
                  <PhoneNumber
                    {...props}
                    name="contactInfo"
                    id="customer-edit-drawer-phone-number"
                    values={props.values}
                    placeholder={intl.formatMessage({
                      id: "phoneNumber",
                      defaultMessage: "Phone Number",
                    })}
                  />
                ) : (
                  <InputWithPlaceholder
                    id="memo-contact-info-input-field"
                    name="contactInfo"
                    autoComplete="off"
                    className="login-input"
                    type="text"
                    value={props.values.contactInfo}
                    placeholder={intl.formatMessage({
                      id: "email.input.placeholder",
                      description: "form label",
                      defaultMessage: "Email",
                    })}
                    required
                    {...props}
                  />
                )}
                <InputWithPlaceholder
                  id="memo-external-reference-input-field"
                  name="externalReference"
                  autoComplete="off"
                  className="login-input"
                  type="text"
                  value={props.values.externalReference}
                  placeholder={intl.formatMessage({
                    id: "externalReference",
                    description: "form label",
                    defaultMessage: "External Reference",
                  })}
                  required={false}
                  {...props}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="drawer-cancel-memo-button"
                  onClick={() => cancel()}
                  style={{ marginRight: "14px" }}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <SubmitButton
                  id="drawer-submit-memo-button"
                  disabled={!(props.isValid && props.dirty)}
                >
                  {isEditMemoSaveChangesButton()}
                </SubmitButton>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default MemoDrawer;
