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

import React, { FC, useContext, useEffect, useState } from "react";
import { Formik } from "formik";
import Box from "@mui/material/Box";
import * as Yup from "yup";
import { FormattedMessage, useIntl } from "react-intl";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import { CustomerDetailContext } from "../../../contexts/CustomerDetailContext";
import api from "../../../api/api";
import emitter from "../../../emitter";
import CardBlockReasonConverter from "../../common/converters/CardBlockReasonConverter";
import CustomerBlockReasonConverter from "../../common/converters/CustomerBlockReasonConverter";
import BlockTypeConverter from "../../common/converters/BlockTypeConverter";
import CancelButton from "../../common/elements/CancelButton";
import Header from "../../common/elements/Header";
import DebouncedButton from "../../common/elements/DebouncedButton";
import { useQueries } from "@tanstack/react-query";

interface IAddNewBlock {
  toggleDrawer?: () => void;
  cardId?: string;
  type?: string;
}

const AddNewBlock: FC<IAddNewBlock> = (props) => {
  const cardId = props.cardId;
  const intl = useIntl();
  const { customerNumber, primaryPerson } = useContext(CustomerDetailContext);
  const [cardLast4List, setCardLast4List] = useState<any>([]);
  const { toggleDrawer } = props;
  const [initialValues] = useState({
    type: props.type ? props.type : "",
    reason: "",
    memo: "",
    cardId: props.cardId ? props.cardId : "",
  });

  const [customerBlockReasons, setCustomerBlockReasons] = useState<any>([]);
  const [cardBlockReasons, setCardBlockReasons] = useState<any>([]);
  const [blockTypes, setBlockTypes] = useState<any>([]);

  const [getCardBlockReasonsQuery, getCustomerBlockReasonsQuery] = useQueries({
    queries: [
      {
        queryKey: ["getCardBlockReasons"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getCardBlockReasons(),
      },

      {
        queryKey: ["getCustomerBlockReasons"],
        queryFn: () =>
          // @ts-ignore
          api.CommonAPI.getCustomerBlockReasons(),
      },
    ],
  });

  const cancel = () => {
    if (toggleDrawer) toggleDrawer();
  };

  const getCardList = () =>
    // @ts-ignore
    api.CardAPI.listCards(primaryPerson.id).catch((error) => error);

  const addNewBlock = async (values: {
    type: any;
    reason: any;
    memo: any;
    cardId: any;
  }) => {
    const dto = {
      reason: values.reason,
      memo: values.memo.replace(/^\s*[\r\n]/gm, ""),
    };

    if (values.type === "Customer") {
      // @ts-ignore
      await api.CustomerAPI.createCustomerBlock(customerNumber, dto).catch(
        (error: any) => error
      );
    } else {
      // @ts-ignore
      // eslint-disable-next-line max-len
      await api.CardAPI.createCardBlock(values.cardId, dto).catch(
        (error: any) => error
      );
    }
    if (toggleDrawer) toggleDrawer();
    emitter.emit("customer.block.changed", {});
    emitter.emit("customer.details.changed", {});
  };

  useEffect(() => {
    const promises = [getCardList()];
    Promise.all(promises).then((results) => {
      const last4List = results[0]
        .map((card: any) => ({
          text: `*${card.panLast4} - ${intl.formatDate(
            new Date(
              card.expiry.substring(0, 4),
              card.expiry.substring(4, 6),
              0
            ),
            { year: "2-digit", month: "2-digit" }
          )}`,
          cardId: card.id,
        }))
        .filter((card: any) => {
          return cardId ? cardId === card.cardId : true;
        });
      setCardLast4List(last4List);

      const typesDropdown = [];
      typesDropdown.push({
        text: BlockTypeConverter("Customer", intl),
        type: "Customer",
      });
      if (last4List.length > 0) {
        typesDropdown.push({
          text: BlockTypeConverter("Card", intl),
          type: "Card",
        });
      }
      setBlockTypes(typesDropdown);
    });
  }, []);

  useEffect(() => {
    if (getCardBlockReasonsQuery.data && getCustomerBlockReasonsQuery.data) {
      const cardBlockReasonList = getCardBlockReasonsQuery.data.map(
        (reason: any) => ({
          text: CardBlockReasonConverter(reason, intl),
          cardReason: reason,
        })
      );
      setCardBlockReasons(cardBlockReasonList);

      const customerBlockReasonList = getCustomerBlockReasonsQuery.data.map(
        (reason: any) => ({
          text: CustomerBlockReasonConverter(reason, intl),
          customerReason: reason,
        })
      );
      setCustomerBlockReasons(customerBlockReasonList);
    }
  }, [getCardBlockReasonsQuery.data, getCustomerBlockReasonsQuery.data]);

  const AddBlockSchema = Yup.object().shape({
    type: Yup.string()
      .min(1)
      .required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Type is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "type",
              defaultMessage: "Type",
            }),
          }
        )
      ),
    reason: Yup.string()
      .min(1)
      .required(
        intl.formatMessage(
          {
            id: "error.field.required",
            defaultMessage: "Reason is a required field.",
          },
          {
            fieldName: intl.formatMessage({
              id: "reason",
              defaultMessage: "Reason",
            }),
          }
        )
      ),
    memo: Yup.string()
      .max(
        128,
        intl.formatMessage({
          id: "error.memo.mustBe128Chars",
          defaultMessage: "Memo must be 128 characters or less.",
        })
      )
      .required(
        intl.formatMessage({
          id: "error.memo.required",
          defaultMessage: "Memo is a required field.",
        })
      ),
    cardId: Yup.string().when("type", {
      is: "Card",
      then: Yup.string()
        .min(1)
        .required(
          intl.formatMessage({
            id: "error.cardLast4.required",
            defaultMessage: "Card last 4 is a required field.",
          })
        ),
      otherwise: Yup.string(),
    }),
  });

  return (
    <Box sx={{ width: "400px", padding: "0 14px", marginTop: "40px" }}>
      <Box sx={{ marginBottom: "40px" }}>
        <Header
          level={2}
          bold
          color="white"
          value={intl.formatMessage({
            id: "addNewBlock",
            description: "drawer header",
            defaultMessage: "Add New Block",
          })}
        />
      </Box>
      <Box>
        <Formik
          initialValues={initialValues}
          validationSchema={AddBlockSchema}
          onSubmit={(values) => addNewBlock(values)}
          enableReinitialize
        >
          {(props) => (
            <form onSubmit={props.handleSubmit}>
              <Box sx={{ marginBottom: "60px" }}>
                {blockTypes.length > 0 ? (
                  <DropdownFloating
                    id="add-block-type-dropdown"
                    name="type"
                    placeholder={`${intl.formatMessage({
                      id: "type",
                      defaultMessage: "Type",
                    })}*`}
                    disabled={initialValues.type?.length > 0}
                    list={blockTypes}
                    valueKey="type"
                    value={props.values.type}
                    {...props}
                  />
                ) : null}
                {props.values.type !== undefined &&
                props.values.type === "Card" &&
                cardLast4List.length > 0 ? (
                  <DropdownFloating
                    id="add-block-card-last-four-dropdown"
                    name="cardId"
                    placeholder={`${intl.formatMessage({
                      id: "cardEndingIn",
                      defaultMessage: "Card Ending In",
                    })}*`}
                    // disabled={initialValues.cardId?.length > 0}
                    list={cardLast4List}
                    valueKey="cardId"
                    value={props.values.cardId}
                    {...props}
                  />
                ) : null}
                {props.values.type !== undefined &&
                  props.values.type === "Card" && (
                    <DropdownFloating
                      id="add-block-reason-dropdown"
                      name="reason"
                      placeholder={`${intl.formatMessage({
                        id: "reason",
                        defaultMessage: "Reason",
                      })}*`}
                      list={cardBlockReasons}
                      valueKey="cardReason"
                      {...props}
                    />
                  )}
                {props.values.type !== undefined &&
                  props.values.type === "Customer" && (
                    <DropdownFloating
                      id="add-block-reason-dropdown"
                      name="reason"
                      placeholder={`${intl.formatMessage({
                        id: "reason",
                        defaultMessage: "Reason",
                      })}*`}
                      list={customerBlockReasons}
                      valueKey="customerReason"
                      {...props}
                    />
                  )}
                <InputWithPlaceholder
                  id="add-block-memo-input-field"
                  name="memo"
                  autoComplete="off"
                  type="text"
                  className="memo-input"
                  multiline
                  placeholder={`${intl.formatMessage({
                    id: "memo.input.placeholder.max128Chars",
                    defaultMessage: "Memo (128 characters max.)",
                  })}*`}
                  as="textarea"
                  {...props}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CancelButton
                  id="drawer-add-block-button-cancel"
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
                  id="drawer-add-block-button-save-changes"
                  disabled={!props.dirty}
                  type="submit"
                  variant="contained"
                  delay={2000}
                  onClick={props.submitForm}
                >
                  <FormattedMessage
                    id="saveChanges"
                    description="Save changes button"
                    defaultMessage="Save Changes"
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

export default AddNewBlock;
