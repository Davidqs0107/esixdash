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
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import { MessageContext } from "../../../contexts/MessageContext";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import QDFormattedCurrency from "../../common/converters/QDFormattedCurrency";
import { Menu, MenuItem } from "@mui/material";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import SubmitButton from "../../common/elements/SubmitButton";
import CancelButton from "../../common/elements/CancelButton";
import * as Yup from "yup";
import { Formik } from "formik";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import QDButton from "../../common/elements/QDButton";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// eslint-disable-next-line no-use-before-define
import api from "../../../api/api";
import emitter from "../../../emitter";
// eslint-disable-next-line import/no-cycle
import Header from "../../common/elements/Header";
import Label from "../../common/elements/Label";

interface BalanceAdjustmentInput {
  toggleDrawer?: () => boolean;
  drawBalances: any;
  currency: any;
  customerNumber: any;
}

const BalanceAdjustment: React.FC<BalanceAdjustmentInput> = ({
  toggleDrawer = () => Yup.boolean,
  drawBalances,
  currency,
  customerNumber,
}) => {
  const intl = useIntl();

  const initialState = {};
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const [initialValues] = useState(initialState);
  const [adjustmentTypes, setAdjustmentTypes] = useState<string[]>([]);
  const [totalBalance, setTotalBalance] = useState<any>(0);
  const [adjustment, setAdjustment] = useState<any>(null);
  const [drawBalancesMap] = useState<any>(new Map<string, string>());
  const [selected, setSelected] = useState("");
  const [adjustmentMap] = useState<any>(new Map<string, string>());
  const [anchorAdjustmentMenu, setAnchorAdjustmentMenu] =
    React.useState<null | HTMLElement>(null);
  const openAdjustmentMenu = Boolean(anchorAdjustmentMenu);
  const [actionKey, setActionKey] = useState("");

  const handleAdjustmentMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAdjustmentMenu(event.currentTarget);
  };
  const handleCloseAdjustmentMenu = () => {
    setAnchorAdjustmentMenu(null);
  };

  const formatStr = (str: string) => {
    switch (str) {
      case "principalBalance":
        return "Period Principal";
      case "interestBalance":
        return "Period Interest";
      case "period principal":
        return "PRINCIPAL";
      case "period interest":
        return "INTEREST";
      case "billedInterestBalance":
        return "Billed Interest";
      case "billed interest":
        return "BILLED_INTEREST";
      default:
        break;
    }

    return str
      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word: string, index: number) {
        return index === 0 || index == str.indexOf("_") + 1
          ? word.toUpperCase()
          : word.toLowerCase();
      })
      .replace(/_/g, " ");
  };

  const buildAdjustmentTypes = () => {
    if (adjustmentTypes.length == 0) {
      let total = 0;
      Object.keys(drawBalances)
        .sort((a: any, b: any) => (a > b ? 1 : -1))
        .sort((a: any, b: any) => (a.startsWith("F") ? 1 : -1))
        .forEach((drawType: any) => {
          Object.keys(drawBalances[drawType])
            .sort((a, b) => (a < b ? 1 : -1))
            .sort((a, b) => (a.startsWith("O") ? 1 : -1))
            .forEach((drawSubType: any) => {
              Object.keys(drawBalances[drawType][drawSubType]).forEach(
                (balanceType: any) => {
                  let item =
                    formatStr(drawType) +
                    " - " +
                    formatStr(drawSubType) +
                    " " +
                    formatStr(balanceType);
                  adjustmentTypes.push(item);
                  total =
                    total + drawBalances[drawType][drawSubType][balanceType];
                  drawBalancesMap.set(
                    item,
                    drawBalances[drawType][drawSubType][balanceType]
                  );
                }
              );
            });
        });
      setAdjustmentTypes(adjustmentTypes);
      setTotalBalance(total);
    }
    return adjustmentTypes;
  };

  useEffect(() => {}, []);

  const cancel = (props: any) => {
    toggleDrawer();
    props.resetForm();
    emitter.emit("drawbalances.cancel", {});
  };

  const handleAdjustmentChange = (value: any) => {
    setSelected(value);
  };

  const addAdditionalAdjustment = () => {
    if (selected) {
      adjustmentMap.set(selected, adjustment);
      setSelected("");
      setAdjustment(null);
    }
  };

  const getAdjustments = () => {
    const list = [];

    for (let key of adjustmentMap.keys()) {
      list.push(
        <Grid container spacing={2}>
          <Grid item lg={7}>
            <Label variant="labelLight">{key}</Label>
          </Grid>
          <Grid item lg={3}>
            <QDFormattedCurrency
              currency={currency}
              amount={adjustmentMap.get(key)}
            />
          </Grid>
          <Grid item>
            <FontAwesomeIcon
              className="text-center"
              icon={faEllipsisH}
              onClick={(event: any) => {
                handleAdjustmentMenuClick(event);
                setActionKey(key);
              }}
              style={{
                color: "#FFF",
                cursor: "pointer",
              }}
            />
          </Grid>
          <Menu
            open={openAdjustmentMenu}
            onClose={handleCloseAdjustmentMenu}
            anchorEl={anchorAdjustmentMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: 130,
            }}
          >
            <MenuItem>
              <QDButton
                onClick={(e: any) => {
                  const key = e.target.parentElement.id.split("_")[1];
                  setSelected(actionKey);
                  setAdjustment(adjustmentMap.get(actionKey));
                  handleCloseAdjustmentMenu();
                }}
                size="small"
                color="primary"
                variant="text"
                label={intl.formatMessage(
                  defineMessage({
                    id: "edit",
                    defaultMessage: "Edit",
                    description: "Input Label",
                  })
                )}
              />
            </MenuItem>
            <MenuItem>
              <QDButton
                onClick={(e: any) => {
                  adjustmentMap.delete(actionKey);
                  handleCloseAdjustmentMenu();
                }}
                size="small"
                color="primary"
                variant="text"
                label={intl.formatMessage(
                  defineMessage({
                    id: "remove",
                    defaultMessage: "Remove",
                    description: "Input Label",
                  })
                )}
              />
            </MenuItem>
          </Menu>
        </Grid>
      );
    }

    return list;
  };

  const getTotalAdjustmentAmount = (
    totalBalance: any,
    adjustmentAmount?: any
  ): string => {
    let total = parseFloat(totalBalance).toString();
    for (let value of adjustmentMap.values()) {
      total = (parseFloat(total) + parseFloat(value)).toString();
    }

    if (adjustmentAmount && !validateAdjustment()) {
      total = (parseFloat(total) + parseFloat(adjustmentAmount)).toString();
    }

    if (adjustmentMap.get(selected)) {
      total = (
        parseFloat(total) - parseFloat(adjustmentMap.get(selected))
      ).toString();
    }
    return total;
  };

  const parseAdjustment = (key: any, value: any) => {
    let str = key.split(" - ");
    return {
      drawType: str[0].replace(" ", "_").toUpperCase(),
      drawBalanceType: str[1].split(" ")[0].toUpperCase(),
      drawBalanceSubType: formatStr(
        str[1].replace(str[1].split(" ")[0], "").trim().toLowerCase()
      ),
      amount: value,
    };
  };

  const getAdjustmentList = () => {
    let adjustments: any[] = [];
    for (let key of adjustmentMap.keys()) {
      let adjustmentObject = parseAdjustment(key, adjustmentMap.get(key));
      adjustments.push(adjustmentObject);
    }

    return adjustments;
  };

  const validateAdjustment = (validateNaN: boolean = true) => {
    let positiveAmountNotAllowed = false;
    if (selected && selected.indexOf("Current Period Principal") == -1) {
      positiveAmountNotAllowed =
        drawBalancesMap.get(selected) + parseFloat(adjustment) > 0;
    }
    return (
      !adjustment ||
      (validateNaN ? isNaN(adjustment) : false) ||
      0 == parseFloat(adjustment) ||
      positiveAmountNotAllowed
    );
  };

  const validationSchema = Yup.object().shape({
    adjustmentAmount: Yup.number()
      .test(
        "test-name",
        intl.formatMessage({
          id: "error.adjustmentAmount.cannotLeadToACreditOn",
          defaultMessage: "Adjustment cannot lead to a credit on",
        }) +
          selected +
          '"',
        function () {
          return !(
            selected &&
            selected.indexOf("Current Period Principal") == -1 &&
            drawBalancesMap.get(selected) + parseFloat(adjustment) > 0
          );
        }
      )
      .test(
        "test-name",
        intl.formatMessage({
          id: "error.adjustment.mustBeANumber",
          defaultMessage: "Adjustment must be a number",
        }),
        function () {
          return !isNaN(adjustment);
        }
      ),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={selected ? validationSchema : null}
      onSubmit={() => {
        if (adjustment) {
          addAdditionalAdjustment();
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        api.ProductAPI.getOfferingActions(customerNumber).then((res: any) => {
          let req = res.find(
            (a: { name: string }) => a.name == "adjustBalances"
          );
          if (req) {
            const attribute = req.attributes.find(
              (attribute: { name: string }) =>
                attribute.name == "balanceAdjustments"
            );
            attribute.value = JSON.stringify({
              adjustments: getAdjustmentList(),
            });

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            api.ProductAPI.executeOfferingAction(customerNumber, req)
              .then((res: any) => {
                toggleDrawer();
                emitter.emit("drawbalances.changed", {});
              })
              .then(() =>
                setSuccessMsg({
                  responseCode: "200000",
                  message: intl.formatMessage({
                    id: "request.success.completed",
                    defaultMessage: `Request Completed Successfully`,
                  }),
                })
              )
              .catch((error: any) => setErrorMsg(error));
          }
        });
      }}
    >
      {(props: any) => (
        <form onSubmit={props.handleSubmit}>
          <Grid
            container
            sx={{
              maxWidth: "520px",
              paddingLeft: "20px",
              paddingRight: "20px",
            }}
          >
            <Grid item>
              <Box sx={{ mb: 4 }}>
                <Header
                  level={2}
                  bold
                  color="white"
                  value={intl.formatMessage({
                    id: "makeAnAdjustment",
                    description: "drawer header",
                    defaultMessage: "Make an Adjustment",
                  })}
                />
              </Box>
            </Grid>

            {adjustmentMap.size > 0 ? (
              <Grid container sx={{ mb: 2 }}>
                <Grid item lg={7}>
                  <Label variant="grey" regular>
                    <FormattedMessage id="type" defaultMessage="Type" />
                  </Label>
                </Grid>
                <Grid item lg={3}>
                  <Label variant="grey" regular>
                    <FormattedMessage id="amount" defaultMessage="Amount" />
                  </Label>
                </Grid>
                {getAdjustments()}
              </Grid>
            ) : null}

            <Grid container direction="column">
              <Grid item>
                <DropdownFloating
                  {...props}
                  id="adjustmentType"
                  name="adjustmentType"
                  placeholder={
                    <FormattedMessage
                      id="adjustmentType"
                      description="Adjustment Type"
                      defaultMessage="Adjustment Type"
                    />
                  }
                  list={buildAdjustmentTypes()}
                  handleChange={(e: any) => {
                    handleAdjustmentChange(e.target.value);
                  }}
                  value={selected}
                />
              </Grid>

              {selected ? (
                <Grid container direction="column">
                  <Grid item>
                    <Grid container direction="column" sx={{ mb: 2 }}>
                      <Label>
                        {selected ? selected.split(" - ")[1] : null}
                      </Label>
                      <QDFormattedCurrency
                        className="label-white-regular"
                        currency={currency}
                        amount={drawBalancesMap.get(selected) || "0"}
                      />
                    </Grid>
                  </Grid>
                  <Grid item>
                    <InputWithPlaceholder
                      name={"adjustmentAmount"}
                      autoComplete="off"
                      type="text"
                      placeholder={
                        <FormattedMessage
                          id="adjustmentAmount"
                          description="Adjustment amount"
                          defaultMessage="Adjustment amount"
                        />
                      }
                      value={adjustment}
                      className="login-input"
                      {...props}
                      handleChange={(ev: any) => {
                        setAdjustment(ev.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <QDButton
                      id="add-additional-adjustment"
                      className="ml-0"
                      color="primary"
                      variant="contained"
                      onClick={() => addAdditionalAdjustment()}
                      disabled={validateAdjustment()}
                      label={intl.formatMessage(
                        defineMessage({
                          id: "addAdditionalAdjustment",
                          defaultMessage: "ADD ADDITIONAL ADJUSTMENT",
                          description: "header",
                        })
                      )}
                      size="small"
                    />
                  </Grid>
                </Grid>
              ) : (
                <Grid container style={{ height: "170px" }}></Grid>
              )}

              <Grid container sx={{ my: 4 }} spacing={2}>
                <Grid item container lg={6} direction="column">
                  <Label variant="grey" regular>
                    <FormattedMessage
                      id="currentTotalBalance"
                      defaultMessage="Current total balance"
                    />
                  </Label>
                  <QDFormattedCurrency
                    className="label-white-regular"
                    currency={currency}
                    amount={totalBalance}
                    variant="labelLight"
                  />
                </Grid>

                <Grid item container lg={6} direction="column">
                  <Label variant="grey" regular>
                    <FormattedMessage
                      id="totalAdjustmentAmount"
                      defaultMessage="Total adjustment amount"
                    />
                  </Label>
                  <QDFormattedCurrency
                    className="label-white-regular"
                    currency={currency}
                    amount={getTotalAdjustmentAmount(0, adjustment)}
                    variant="labelLight"
                  />
                </Grid>
                <Grid item container lg={6} direction="column">
                  <Label variant="grey" regular>
                    <FormattedMessage
                      id="projected"
                      defaultMessage="Projected"
                    />
                  </Label>
                  <QDFormattedCurrency
                    currency={currency}
                    amount={getTotalAdjustmentAmount(totalBalance, adjustment)}
                    variant="labelLight"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Box
              sx={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "30px",
                alignItems: "center",
              }}
            >
              <Box sx={{ marginRight: "24px" }}>
                <CancelButton
                  id="drawer-phone-button-cancel"
                  size="large"
                  onClick={() => cancel(props)}
                >
                  <FormattedMessage
                    id="cancel"
                    description="Cancel button"
                    defaultMessage="Cancel"
                  />
                </CancelButton>
              </Box>
              <SubmitButton
                id="drawer-balance-adjustment-button-savechanges"
                size="large"
                disabled={validateAdjustment() && adjustmentMap.size == 0}
              >
                <FormattedMessage
                  id="save"
                  description="Save changes button"
                  defaultMessage="Save"
                />
              </SubmitButton>
            </Box>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default BalanceAdjustment;
