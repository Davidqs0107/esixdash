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

import React, { useState, lazy, ReactNode, FC, useContext } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import { Formik } from "formik";
import { FormattedMessage, useIntl } from "react-intl";
import * as Yup from "yup";
import CancelButton from "../../common/elements/CancelButton";
import SubmitButton from "../../common/elements/SubmitButton";
import Icon from "../../common/Icon";
import Header from "../../common/elements/Header";
import { styled } from "@mui/material/styles";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";

const QDButton = lazy(() => import("../../common/elements/QDButton"));
const InputWithPlaceholder = lazy(
  () => import("../../common/forms/inputs/InputWithPlaceholder")
);

interface IApproveChangeOrderMemo {
  name: string;
  label: string;
  callbackFunc: () => void;
  LevelTwo?: () => false;
  disabled: boolean;
  widthPercentage: number;
  children: ReactNode;
  buttonProps: string;
  deleteChangeOrder: any;
  data: any;
  approveChangeOrder: any;
  approveResponse: any;
  overrideWidth?: boolean;
}

const DarkContainer = styled(Container)(({ theme }) => ({
  width: "400px",
  "& p.MuiTypography-body1, & span.MuiTypography-body1": {
    color: "#FFFFFF",
    marginBottom: "10px",
  },
  "& label.MuiTypography-body1": {
    color: "#8995AD",
    marginBottom: "10px",
  },
  "& .Mui-error": {
    color: "#EE0351",
  },
}));

const ApproveChangeOrderMemo: FC<IApproveChangeOrderMemo> = ({
  name,
  label,
  callbackFunc,
  LevelTwo,
  widthPercentage = 20,
  disabled = false,
  deleteChangeOrder,
  data,
  approveChangeOrder,
  approveResponse,
  overrideWidth = false,
  ...props
}) => {
  const intl = useIntl();
  const { buttonProps } = props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLevelTwoOpen, setIsLevelTwoOpen] = useState(false);
  const [levelTwoColumn] = useState(LevelTwo ? 3 : 12);
  const [isDisabled] = useState(disabled);
  const [confirm, setConfirm] = useState(false);
  const { canDeleteChangeOrder, canApproveChangeOrder } = useContext(
    ContentVisibilityContext
  );

  const toggleDrawer = () => {
    if (callbackFunc) {
      callbackFunc();
    }
    setIsDrawerOpen(!isDrawerOpen);
  };

  const MemoSchema = Yup.object().shape({
    memo: Yup.string().max(
      255,
      intl.formatMessage({
        id: "error.memo.max255Chars",
        defaultMessage: "Memo must be 255 characters or less.",
      })
    ),
  });

  return (
    <div>
      <QDButton
        name={name}
        className={buttonProps}
        onClick={() => toggleDrawer()}
        label={label}
        disabled={isDisabled}
        color="primary"
        size="small"
        variant="contained"
      />
      <Drawer
        PaperProps={{
          style: {
            minWidth:
              (LevelTwo && isLevelTwoOpen) || overrideWidth
                ? `${widthPercentage}%`
                : "24%",
            backgroundColor: "#292750",
            paddingRight: "0px",
            paddingBottom: "40px",
          },
        }}
        anchor="right"
        open={isDrawerOpen}
        onClose={() => {
          toggleDrawer();
          setConfirm(false);
        }}
      >
        <DarkContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "20px 0",
            }}
          >
            <QDButton
              label=""
              type="button"
              onClick={() => toggleDrawer()}
              id="drawer-close-btn"
              variant="icon"
            >
              <img
                height={11}
                width={11}
                src={Icon.closeIconWhite}
                alt="close icon"
              />
            </QDButton>
          </Box>
          <Grid container spacing={1}>
            <Grid item xs={11} md={11} lg={11}>
              {!confirm ? (
                <Box sx={{ marginLeft: "14px" }}>
                  <Box
                    sx={{
                      marginTop: "40px",
                      marginBottom: "40px",
                    }}
                  >
                    <Header
                      value={intl.formatMessage({
                        id: "approveChangeOrder",
                        description: "drawer header",
                        defaultMessage: "Approve Change Order",
                      })}
                      level={2}
                      bold
                      color="white"
                    />
                  </Box>
                  <Box>
                    <Formik
                      initialValues={{}}
                      validationSchema={MemoSchema}
                      onSubmit={(values) => approveChangeOrder(values, data)}
                      enableReinitialize
                    >
                      {(props) => (
                        <form id="new-memo-form" onSubmit={props.handleSubmit}>
                          <Box sx={{ marginBottom: "60px" }}>
                            <InputWithPlaceholder
                              required={false}
                              id="memo-message-input-field"
                              name="memo"
                              autoComplete="off"
                              type="text"
                              as="textarea"
                              multiline
                              placeholder={intl.formatMessage({
                                id: "input.memo.placeholder",
                                defaultMessage: "Memo (300 characters max.)",
                              })}
                              {...props}
                            />
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",
                              mb: "20px",
                            }}
                          >
                            <CancelButton
                              id="drawer-cancel-memo-button"
                              style={{ fontSize: "12px" }}
                              onClick={() => {
                                toggleDrawer();
                              }}
                            >
                              <FormattedMessage
                                id="cancel"
                                description="Cancel button"
                                defaultMessage="Cancel"
                              />
                            </CancelButton>
                            {canApproveChangeOrder && (
                              <SubmitButton id="drawer-submit-memo-button">
                                <FormattedMessage
                                  id="approve"
                                  description="Approve Change Order Button"
                                  defaultMessage="Approve"
                                />
                              </SubmitButton>
                            )}
                          </Box>
                          {canDeleteChangeOrder && (
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <SubmitButton
                                id="drawer-delete-order-button"
                                onClick={() => setConfirm(true)}
                                color="error"
                              >
                                <FormattedMessage
                                  id="drawer.delete.delete"
                                  description="Delete Change Order Button"
                                  defaultMessage="Delete"
                                />
                              </SubmitButton>
                            </Box>
                          )}
                        </form>
                      )}
                    </Formik>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ marginLeft: "14px" }}>
                  <Box
                    sx={{
                      marginLeft: "14px",
                      marginTop: "40px",
                      marginBottom: "40px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        fontSize: "24px",
                        fontWeight: "600",
                        lineHeight: "29px",
                      }}
                    >
                      <FormattedMessage
                        id="drawer.delete.changeOrder"
                        description="drawer header"
                        defaultMessage="Are you sure you want to delete the change order?"
                      />
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      sx={{
                        marginRight: "16px",
                      }}
                    >
                      <CancelButton
                        id="drawer-cancel-memo-button"
                        onClick={() => setConfirm(false)}
                      >
                        <FormattedMessage
                          id="cancel"
                          description="Cancel button"
                          defaultMessage="Cancel"
                        />
                      </CancelButton>
                    </Box>
                    <Box>
                      <SubmitButton
                        id="drawer-submit-memo-button"
                        onClick={() => deleteChangeOrder(data)}
                        color="error"
                      >
                        <FormattedMessage id="delete" defaultMessage="Delete" />
                      </SubmitButton>
                    </Box>
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        </DarkContainer>
      </Drawer>
    </div>
  );
};

export default ApproveChangeOrderMemo;
