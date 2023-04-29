/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import { defineMessages, FormattedMessage, useIntl } from "react-intl";
import { Formik } from "formik";
import React, { useState, FC, useEffect } from "react";
import * as Yup from "yup";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Box from "@mui/material/Box";
import Header from "../../common/elements/Header";
import CardBlockReasonConverter from "../../common/converters/CardBlockReasonConverter";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import api from "../../../api/api";
import DebouncedButton from "../../common/elements/DebouncedButton";

interface IReleaseMemo {
  release: (values: any) => void;
  cancel: () => void;
  type: string;
  blockType?: string;
  altId?: string;
  blockId?: string;
}

const ReleaseMemo: FC<IReleaseMemo> = ({
  release,
  cancel,
  type,
  blockType,
  altId,
  blockId,
}) => {
  const isCardBlock = blockType && blockType !== "customer";
  const intl = useIntl();
  const titleDefinition = defineMessages({
    block: {
      id: "releaseBlock",
      description: "The action of releasing a block",
      defaultMessage: "Release Block",
    },
    hold: {
      id: "releaseHold",
      description: "The action of releasing a hold",
      defaultMessage: "Release Hold",
    },
  });
  const fixDateTime = (creationTime: string | number | Date | undefined) =>
    `${intl.formatDate(creationTime)}, ${intl.formatTime(creationTime)}`;

  // @ts-ignore
  const releaseDrawerTitle = () => intl.formatMessage(titleDefinition[type]);

  const MemoSchema = Yup.object().shape({
    memo: Yup.string()
      .required(
        intl.formatMessage({
          id: "error.memo.required",
          defaultMessage: "Memo is a required field.",
        })
      )
      .max(
        300,
        intl.formatMessage({
          id: "error.memo.mustBe300Chars",
          defaultMessage: "Memo must be 300 characters or less.",
        })
      ),
    isCardBlock: Yup.boolean(),
    reasonBlockId: Yup.string().when("isCardBlock", {
      is: true,
      then: Yup.string()
        .min(1)
        .required(
          intl.formatMessage({
            id: "error.reason.required",
            defaultMessage: "Reason is a required field",
          })
        ),
      otherwise: Yup.string(),
    }),
  });

  const [initialValues] = useState({
    memo: "",
    reasonBlockId: blockId ? blockId : "",
    isCardBlock: isCardBlock,
  });

  const [cardBlockReasons, setCardBlockReasons] = useState<any>([]);

  const getCardBlockReasons = () =>
    // @ts-ignore
    api.CardAPI.getCardBlocks(altId)
      .then((result: any) => {
        const cardBlockReasonList = result.map((block: any) => ({
          blockId: block.id,
          text:
            CardBlockReasonConverter(block.reason, intl) +
            " - " +
            fixDateTime(block.creationTime),
          reason: block.reason,
          customerReleaseable: block.customerReleaseable,
        }));

        // @ts-ignore
        setCardBlockReasons(cardBlockReasonList);
      })
      .catch((error: any) => error);

  const isCustomerReleaseable = (blockId: string) => {
    const search = cardBlockReasons.find( (block: any) => block.blockId === blockId);
    if (search && isCardBlock)
      return search.reason !== "deactivation";
    return true;
  };

  useEffect(() => {
    if (isCardBlock) {
      getCardBlockReasons();
    }
  }, [isCardBlock]);

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header value={releaseDrawerTitle()} level={2} bold color="white" />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={MemoSchema}
          onSubmit={(values) => release(values)}
          enableReinitialize
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Box sx={{ marginBottom: "60px" }}>
                {isCardBlock && (
                  <DropdownFloating
                    id="add-block-reason-dropdown"
                    name="reasonBlockId"
                    placeholder={`${intl.formatMessage({
                      id: "reason",
                      defaultMessage: "Reason",
                    })}*`}
                    list={cardBlockReasons}
                    valueKey="blockId"
                    {...props}
                  />
                )}
                <InputWithPlaceholder
                  id="release-hold-memo-message-input-field"
                  name="memo"
                  autoComplete="off"
                  className="memo-input"
                  type="text"
                  as="textarea"
                  multiline
                  placeholder={`${intl.formatMessage({
                    id: "memo.input.placeholder",
                    description: "Details",
                    defaultMessage: "Memo (300 characters max.)",
                  })}*`}
                  {...props}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="release-hold-cancel-button"
                  onClick={() => cancel()}
                  style={{ marginRight: "14px" }}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
                <DebouncedButton
                  id="release-hold-confirm-button"
                  disabled={
                    !props.dirty ||
                    isCustomerReleaseable(props.values.reasonBlockId) === false
                  }
                  type="submit"
                  variant="contained"
                  delay={2000}
                  onClick={props.submitForm}
                >
                  <FormattedMessage
                    id="confirm"
                    description="Confirm button"
                    defaultMessage="Confirm"
                  />
                </DebouncedButton>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ReleaseMemo;
