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
import { Container, Box, FormGroup } from "@mui/material";
import {
  FormattedDate,
  FormattedMessage,
  FormattedTime,
  useIntl,
} from "react-intl";
import { Formik } from "formik";
import api from "../../../api/api";
import InputWithPlaceholder from "../../common/forms/inputs/InputWithPlaceholder";
import DropdownFloating from "../../common/forms/dropdowns/DropdownFloating";
import emitter from "../../../emitter";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Header from "../../common/elements/Header";
import QDButton from "../../common/elements/QDButton";
import Label from "../../common/elements/Label";
import TextRender from "../../common/TextRender";
import { MessageContext } from "../../../contexts/MessageContext";
import Typography from "@mui/material/Typography";
import ConfirmationModal from "../../common/containers/ConfirmationModal";
import Icon from "../../common/Icon";

interface IMerchantControlDrawer {
  toggleDrawer?: any;
  edit?: boolean;
  controlId?: number | string;
  readOnly?: boolean;
}

const MerchantControlDrawer: React.FC<IMerchantControlDrawer> = ({
  controlId = "",
  toggleDrawer = () => {},
  edit = false,
  readOnly = false,
}) => {
  const intl = useIntl();
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const { programName } = useContext(ProgramEditContext);
  const [isEdit, setIsEdit] = useState<boolean>(edit);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [isReadOnly, setIsReadOnly] = useState<boolean>(readOnly);
  const [currencies, setCurrencies] = useState([]);

  const [initialValues, setInitialValues] = useState<any>({
    network: "",
    description: "",
    currency: "",
    amountFrom: "",
    amountTo: "",
    merchantId: "",
    acquirerId: "",
    terminalIdFrom: "",
    terminalIdTo: "",
    action: "",
    merchantLocation: "",
    merchantCity: "",
    merchantCountryCode: "",
    merchantCategoryCode: "",
  });

  const actions = [
    {
      text: intl.formatMessage({
        id: "allow",
        defaultMessage: "Allow",
      }),
      id: "ALLOW",
    },
    {
      text: intl.formatMessage({
        id: "reject",
        defaultMessage: "Reject",
      }),
      id: "REJECT",
    },
  ];

  const networks = [
    {
      text: intl.formatMessage({
        id: "BKN",
        defaultMessage: "BKN",
      }),
      id: "BKN",
    },
    {
      text: intl.formatMessage({
        id: "VSA",
        defaultMessage: "VSA",
      }),
      id: "VSA",
    },
  ];

  const getMerchantControl = () =>
    // @ts-ignore
    api.MerchantAPI.get(programName, controlId).catch((error: any) => error);

  const getCurrencies = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CommonAPI.getCurrencyList()
      .then((result: any) => {
        setCurrencies(
          result.map((currency: any) => ({
            text: currency,
            code: currency,
          }))
        );
      })
      .catch((error: any) => error);

  const addOrUpdateMerchantControl = async (values: any) => {
    try {
      if (controlId) {
        // @ts-ignore
        api.MerchantAPI.update(programName, controlId, values)
          .then(() => {
            toggleDrawer();
            emitter.emit("merchantControl.edit.changed", {});
            setSuccessMsg({
              responseCode: "200000",
              message: intl.formatMessage({
                id: "merchantControl.success.updated",
                defaultMessage: `Merchant Control has been Updated Successfully`,
              }),
            });
          })
          .catch((error: any) => setErrorMsg(error));
      } else {
        // @ts-ignore
        const matchResult = await api.MerchantAPI.match(programName, values);
        if (matchResult.match) {
          const { id } = matchResult.match;
          setErrorMsg({
            responseCode: "214095",
            message: intl.formatMessage(
              {
                id: "error.merchantControl.ruleConflict",
                defaultMessage: `This rule is in conflict with Merchant Control ${id}. Please enter a valid To/From amount and Merchant ID.`,
              },
              {
                fieldName: intl.formatMessage({
                  id: "id",
                  defaultMessage: id,
                }),
              }
            ),
          });
        } else {
          // @ts-ignore
          api.MerchantAPI.create(programName, values)
            .then(() => {
              toggleDrawer();
              emitter.emit("merchantControl.edit.changed", {});
              setSuccessMsg({
                responseCode: "200000",
                message: intl.formatMessage({
                  id: "merchantControl.success.created",
                  defaultMessage: `Merchant Control has been Created Successfully`,
                }),
              });
            })
            .catch((error: any) => setErrorMsg(error));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  // @ts-ignore
  useEffect(async () => {
    if (isEdit || isReadOnly) {
      let initial = {};
      await getMerchantControl().then((result: any) => {
        initial = {
          network: result.network,
          description: result.description,
          amountTo: result.amountTo,
          amountFrom: result.amountFrom,
          currency: result.currency,
          terminalIdTo: result.terminalIdTo,
          terminalIdFrom: result.terminalIdFrom,
          merchantId: result.merchantId,
          acquirerId: result.acquirerId,
          action: result.action,
          merchantLocation: result.merchantLocation,
          merchantCity: result.merchantCity,
          merchantCountryCode: result.merchantCountryCode,
          merchantCategoryCode: result.merchantCategoryCode,
          creationTime: result.creationTime,
          modifiedTime: result.modifiedTime,
        };
      });
      setInitialValues(initial);
    }

    getCurrencies();
  }, []);

  const MerchantControlSchema = Yup.object().shape({
    description: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Description is a required field.",
        },
        {
          fieldName: intl.formatMessage({
            id: "description",
            defaultMessage: "Description",
          }),
        }
      )
    ),
    action: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Action is a required field.",
        },
        {
          fieldName: intl.formatMessage({
            id: "action",
            defaultMessage: "Action",
          }),
        }
      )
    ),
    network: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Network is a required field.",
        },
        {
          fieldName: intl.formatMessage({
            id: "network",
            defaultMessage: "Network",
          }),
        }
      )
    ),
    currency: Yup.string().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "Amount currency is a required field.",
        },
        {
          fieldName: intl.formatMessage({
            id: "amountCurrency",
            defaultMessage: "Amount currency",
          }),
        }
      )
    ),
    amountTo: Yup.number().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "To amount is a required field.",
        },
        {
          fieldName: intl.formatMessage({
            id: "toAmount",
            defaultMessage: "To amount",
          }),
        }
      )
    ),
    amountFrom: Yup.number().required(
      intl.formatMessage(
        {
          id: "error.field.required",
          defaultMessage: "From amount is a required field.",
        },
        {
          fieldName: intl.formatMessage({
            id: "fromAmount",
            defaultMessage: "From amount",
          }),
        }
      )
    ),
  });

  const handleEditMerchantControl = () => {
    setIsEdit(true);
    setIsReadOnly(false);
  };

  const handleConfirmDelete = () => {
    setShowConfirmation(true);
  };

  const handleDelete = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.MerchantAPI.delete(programName, controlId)
      .then(() => {
        setSuccessMsg({
          responseCode: "200000",
          message: intl.formatMessage({
            id: "merchantControl.success.deleted",
            defaultMessage: `Merchant Control Deleted Successfully`,
          }),
        });
        emitter.emit("merchantControl.edit.changed", {});
      })
      .catch((error: any) => setErrorMsg(error));
  };

  return (
    <>
      {isReadOnly ? (
        <Box
          sx={{
            width: "400px",
            padding: "0 14px",
            marginTop: "40px",
            ".MuiTypography-grey": {
              display: "block",
            },
          }}
        >
          <Box sx={{ marginBottom: "40px" }}>
            <Header
              level={2}
              bold
              color="white"
              value={intl.formatMessage({
                id: "viewMerchantControlDetails",
                defaultMessage: "Merchant Control ID",
              })}
            />
          </Box>
          <Box sx={{ marginBottom: "70px" }}>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage
                  id="description"
                  defaultMessage="Description"
                />
              </Label>
              <TextRender data={initialValues.description} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage id="network" defaultMessage="Network" />
              </Label>
              <TextRender data={initialValues.network} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage id="action" defaultMessage="Action" />
              </Label>
              <TextRender data={initialValues.action} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage id="currency" defaultMessage="Currency" />
              </Label>
              <TextRender data={initialValues.currency} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage
                  id="amountFrom"
                  defaultMessage="Amount - From"
                />
              </Label>
              <TextRender data={initialValues.amountFrom} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage id="amountTo" defaultMessage="Amount - To" />
              </Label>
              <TextRender data={initialValues.amountTo} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage
                  id="acquirerId"
                  defaultMessage="Acquirer ID"
                />
              </Label>
              <TextRender data={initialValues.acquirerId} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage
                  id="merchantID"
                  defaultMessage="Merchant ID"
                />
              </Label>
              <TextRender data={initialValues.merchantId} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage
                  id="terminalIDFrom"
                  defaultMessage="Terminal ID - From"
                />
              </Label>
              <TextRender data={initialValues.terminalIdFrom} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage
                  id="terminalIDTo"
                  defaultMessage="Terminal ID - To"
                />
              </Label>
              <TextRender data={initialValues.terminalIdTo} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage
                  id="merchantLocation"
                  defaultMessage="Merchant Location"
                />
              </Label>
              <TextRender data={initialValues.merchantLocation} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage
                  id="merchantCity"
                  defaultMessage="Merchant City"
                />
              </Label>
              <TextRender data={initialValues.merchantCity} truncated={false}/>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage
                  id="merchantCountryCode"
                  defaultMessage="Merchant Country Code"
                />
              </Label>
              <TextRender data={initialValues.merchantCountryCode} truncated={false} />
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Label variant="grey">
                <FormattedMessage
                  id="merchantCategoryCode"
                  defaultMessage="Merchant Category Code"
                />
              </Label>
              <TextRender data={initialValues.merchantCategoryCode} truncated={false} />
            </Box>
            <Box sx={{ marginBottom: "22px" }}>
              <Box sx={{ marginBottom: "6px" }}>
                <Label variant="grey">
                  <FormattedMessage
                    id="createdDate"
                    defaultMessage="Created Date"
                  />
                </Label>
              </Box>
              <Typography fontWeight={400}>
                <FormattedDate
                  value={new Date(initialValues.creationTime)}
                  year="numeric"
                  month="long"
                  day="2-digit"
                />{" "}
                <FormattedTime value={new Date(initialValues.creationTime)} />
              </Typography>
            </Box>
            <Box sx={{ marginBottom: "14px" }}>
              <Box sx={{ marginBottom: "6px" }}>
                <Label variant="grey">
                  <FormattedMessage
                    id="modifiedDate"
                    defaultMessage="Modified Date"
                  />
                </Label>
              </Box>
              <Typography fontWeight={400}>
                <FormattedDate
                  value={new Date(initialValues.modifiedTime)}
                  year="numeric"
                  month="long"
                  day="2-digit"
                />{" "}
                <FormattedTime value={new Date(initialValues.modifiedTime)} />
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "block",
              marginTop: "30px",
              textAlign: "center",
            }}
          >
            <QDButton
              type="button"
              id="merchant-control-delete"
              label={intl.formatMessage({
                id: "edit",
                defaultMessage: "Edit",
              })}
              onClick={handleEditMerchantControl}
              variant="contained"
              size="large"
              textCase="provided"
              fullWidth
              style={{ width: "305px", marginBottom: "20px" }}
            />
            <QDButton
              type="button"
              id="merchant-control-delete"
              label={intl.formatMessage({
                id: "Delete",
                defaultMessage: "Delete",
              })}
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
              size="large"
              textCase="provided"
              fullWidth
              style={{ width: "305px", marginBottom: "20px" }}
            />
            <CancelButton
              onClick={() => toggleDrawer()}
              style={{ marginRight: "-24px" }}
              id="merchant-control-cancel-changes"
            >
              <FormattedMessage
                id="cancel"
                description="Cancel button"
                defaultMessage="Cancel"
              />
            </CancelButton>
          </Box>
        </Box>
      ) : (
        <Container sx={{ width: "397px" }}>
          <Formik
            initialValues={initialValues}
            validationSchema={MerchantControlSchema}
            onSubmit={(values) => addOrUpdateMerchantControl(values)}
            enableReinitialize
          >
            {(props: any) => {
              return (
                <form onSubmit={props.handleSubmit}>
                  <Box>
                    <Header
                      value={
                        isEdit
                          ? intl.formatMessage({
                              id: "editMerchantControl",
                              description: "drawer header",
                              defaultMessage: "Edit Merchant Control",
                            })
                          : intl.formatMessage({
                              id: "createMerchantControl",
                              description: "drawer header",
                              defaultMessage: "Create Merchant Control",
                            })
                      }
                      level={2}
                      color="white"
                      bold
                      drawerTitle
                    />
                    <FormGroup sx={{ mb: 3 }}>
                      <DropdownFloating
                        name="network"
                        placeholder={`${intl.formatMessage({
                          id: "network",
                          defaultMessage: "Network",
                        })}*`}
                        list={networks}
                        value={props.values.network}
                        valueKey="id"
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="description"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "description",
                          defaultMessage: "Description",
                        })}*`}
                        value={props.values.description}
                        {...props}
                      />
                      <DropdownFloating
                        name="action"
                        placeholder={`${intl.formatMessage({
                          id: "action",
                          defaultMessage: "Action",
                        })}*`}
                        list={actions}
                        value={props.values.action}
                        valueKey="id"
                        {...props}
                      />
                      <DropdownFloating
                        name="currency"
                        placeholder={`${intl.formatMessage({
                          id: "amountCurrency",
                          defaultMessage: "Amount currency",
                        })}*`}
                        list={currencies}
                        value={props.values.currency}
                        valueKey="code"
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="amountTo"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "toAmount",
                          defaultMessage: "To amount",
                        })}*`}
                        value={props.values.amountTo}
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="amountFrom"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "fromAmount",
                          defaultMessage: "From amount",
                        })}*`}
                        value={props.values.amountFrom}
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="merchantId"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "merchantId",
                          defaultMessage: "Merchant ID",
                        })}`}
                        value={props.values.merchantId}
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="acquirerId"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "acquirerId",
                          defaultMessage: "Acquirer ID",
                        })}`}
                        value={props.values.acquirerId}
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="terminalIdFrom"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "terminalIDFrom",
                          defaultMessage: "Terminal ID from",
                        })}`}
                        value={props.values.terminalIdFrom}
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="terminalIdTo"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "TerminalIDTo",
                          defaultMessage: "Terminal ID to",
                        })}`}
                        value={props.values.terminalIdTo}
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="merchantLocation"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "merchantLocation",
                          defaultMessage: "Merchant Location",
                        })}`}
                        value={props.values.merchantCity}
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="merchantCity"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "merchantCity",
                          defaultMessage: "Merchant City",
                        })}`}
                        value={props.values.merchantCity}
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="merchantCountryCode"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "merchantCountryCode",
                          defaultMessage: "Merchant Country Code",
                        })}`}
                        value={props.values.merchantCountryCode}
                        {...props}
                      />
                      <InputWithPlaceholder
                        name="merchantCategoryCode"
                        autoComplete="off"
                        type="text"
                        placeholder={`${intl.formatMessage({
                          id: "merchantCategoryCode",
                          defaultMessage: "Merchant Category Code",
                        })}`}
                        value={props.values.merchantCategoryCode}
                        {...props}
                      />
                    </FormGroup>
                    <Box sx={{ textAlign: "center" }}>
                      <SubmitButton
                        id="merchant-control-save-changes"
                        disabled={!props.dirty}
                        style={{ width: "305px", marginBottom: "20px" }}
                      >
                        <FormattedMessage
                          id="saveChanges"
                          description="Save changes button"
                          defaultMessage="Save Changes"
                        />
                      </SubmitButton>
                      {isEdit && (
                        <QDButton
                          type="button"
                          id="merchant-control-delete"
                          label={intl.formatMessage({
                            id: "deleteMerchantControl",
                            defaultMessage: "Delete merchant control",
                          })}
                          onClick={handleConfirmDelete}
                          variant="contained"
                          color="error"
                          size="large"
                          textCase="provided"
                          fullWidth
                          style={{ width: "305px", marginBottom: "20px" }}
                        />
                      )}
                      <CancelButton
                        onClick={() => toggleDrawer()}
                        style={{ marginRight: "-24px" }}
                        id="merchant-control-cancel-changes"
                      >
                        <FormattedMessage
                          id="discardChanges"
                          description="Cancel button"
                          defaultMessage="Discard Changes"
                        />
                      </CancelButton>
                    </Box>
                  </Box>
                </form>
              );
            }}
          </Formik>
        </Container>
      )}
      {showConfirmation && (
        <ConfirmationModal
          icon={Icon.warningIcon}
          body={intl.formatMessage(
            {
              id: "warning.confirmation.delete",
              defaultMessage:
                "Are you sure you want to delete this Merchant Control?",
            },
            {
              fieldName: intl.formatMessage({
                id: "merchantControl",
                defaultMessage: "Merchant Control",
              }),
            }
          )}
          toggleDrawer={() => {
            setShowConfirmation(false);
          }}
          handleConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default MerchantControlDrawer;
