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
import { useIntl, FormattedMessage, defineMessage } from "react-intl";
import { Box, Grid } from "@mui/material";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";
import StandardTable from "../../common/table/StandardTable";
import Header from "../../common/elements/Header";
import api from "../../../api/api";
import TextRender from "../../common/TextRender";
import DrawerComp from "../../common/DrawerComp";
import MerchantControlDrawer from "../../programs/drawers/MerchantControlDrawer";
import emitter from "../../../emitter";
import EllipseMenu from "../../common/EllipseMenu";
import QDButton from "../../common/elements/QDButton";
import { MessageContext } from "../../../contexts/MessageContext";
import ConfirmationModal from "../../common/containers/ConfirmationModal";
import Icon from "../../common/Icon";
import RiskLevelWizardDrawer from "../drawers/RiskLevelWizardDrawer";
import ProgramsRiskLevelDrawer from "../drawers/ProgramsRiskLevelDrawer";
import ProgramRiskParamsLevelTwo from "../drawers/level-two/ProgramRiskParamsLevelTwo";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";
import ProgramDetailContextProvider from "../../../contexts/ProgramDetailContext";

const PageNavControls = () => {
  const intl = useIntl();
  const { programName, riskLevels } = useContext(ProgramEditContext);
  const { setErrorMsg, setSuccessMsg } = useContext(MessageContext);
  const { canManageControlLevel, canManageMerchantControl } = useContext(
    ContentVisibilityContext
  );
  const [cursor, setCursor] = useState({ programName });
  const [merchantControls, setMerchantControls] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState<string>("");

  const riskLevelDisplay = defineMessage({
    id: "programs.riskLevel.label.riskLevel",
    defaultMessage: "Risk Level - {name}",
    description: "Risk level display name",
  });

  const getMerchantControls = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.MerchantAPI.list(programName, cursor)
      .then((mechantControlsList: any) => {
        const { results } = mechantControlsList;
        setMerchantControls(results);
      })
      .catch((error: any) => setMerchantControls(error));

  const handleConfirmDelete = (id: string) => {
    setShowConfirmation(id);
  };

  const deleteMerchantControl = (id: string) => {
    setShowConfirmation("");
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.MerchantAPI.delete(programName, id)
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

  const riskLevelsTableMetadata = [
    {
      width: "90%",
      header: (
        <FormattedMessage id="description" defaultMessage="Description" />
      ),
      render: (rowData: any) =>
        intl.formatMessage(riskLevelDisplay, {
          name: rowData.securityLevel,
        }),
    },
    {
      width: "10%",
      header: <> </>,
      render: (rowData: any) => {
        return (
          <>
            <EllipseMenu
              anchorOriginVertical="top"
              anchorOriginHorizontal="left"
              transformOriginVertical={10}
              transformOriginHorizontal={260}
              icon="faEllipsisV"
            >
              <ProgramDetailContextProvider
                programName={programName}
                currentLevel={rowData.securityLevel}
              >
                <DrawerComp
                  id="risk-levels-view"
                  label={intl.formatMessage({
                    id: "view",
                    defaultMessage: "View",
                  })}
                  asLink
                  truncateAt={50}
                  LevelTwo={ProgramRiskParamsLevelTwo}
                >
                  <ProgramsRiskLevelDrawer
                    programName={programName}
                    riskLevelList={riskLevels}
                    selectedRiskLevel={intl.formatMessage(riskLevelDisplay, {
                      name: rowData.securityLevel,
                    })}
                  />
                </DrawerComp>
              </ProgramDetailContextProvider>
            </EllipseMenu>
          </>
        );
      },
    },
  ];

  const merchantControlsTableMetadata = [
    {
      width: "90%",
      header: (
        <FormattedMessage id="description" defaultMessage="Description" />
      ),
      render: (rowData: any) => <TextRender data={rowData.description} />,
    },
    {
      width: "10%",
      header: <> </>,
      render: (rowData: any) => (
        <>
          <EllipseMenu
            anchorOriginVertical="top"
            anchorOriginHorizontal="left"
            transformOriginVertical={10}
            transformOriginHorizontal={260}
            icon="faEllipsisV"
          >
            <DrawerComp
              id="merchant-control-view-details"
              label={intl.formatMessage({
                id: "viewDetails",
                defaultMessage: "View Details",
              })}
              asLink
              truncateAt={50}
            >
              <MerchantControlDrawer controlId={rowData.id} readOnly={true} />
            </DrawerComp>
            <DrawerComp
              id="merchant-control-edit"
              label={intl.formatMessage({
                id: "edit",
                defaultMessage: "Edit",
              })}
              asLink
              truncateAt={50}
            >
              <MerchantControlDrawer controlId={rowData.id} edit={true} />
            </DrawerComp>
            <QDButton
              className="MuiMenuItem-delete"
              onClick={() => handleConfirmDelete(rowData.id)}
              id="customer-delete-address-button"
              color="primary"
              variant="text"
              size="small"
              label={intl.formatMessage({
                id: "delete",
                defaultMessage: "Delete",
              })}
            />
          </EllipseMenu>
        </>
      ),
    },
  ];

  useEffect(() => {
    getMerchantControls();

    emitter.on("merchantControl.edit.changed", () => {
      getMerchantControls();
    });
  }, []);

  return (
    <>
      <Box>
        <Grid container justifyContent="space-between" spacing={12}>
          <Grid item xs={6} md={6} lg={6}>
            {canManageControlLevel && (
              <>
                <Box
                  sx={{
                    marginBottom: "18px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Header
                    value={intl.formatMessage({
                      id: "riskLevels",
                      defaultMessage: "Risk Levels",
                    })}
                    level={2}
                    bold
                    color="primary"
                  />
                  <DrawerComp
                    id="merchant-control-add-new-button"
                    label={intl.formatMessage({
                      id: "button.addNewRiskLevel",
                      defaultMessage: "ADD NEW RISK LEVEL",
                    })}
                  >
                    <RiskLevelWizardDrawer
                      programName={programName}
                      toggleDrawer={() => true}
                    />
                  </DrawerComp>
                </Box>
                <StandardTable
                  id="riskLevels-list"
                  dataList={riskLevels}
                  tableMetadata={riskLevelsTableMetadata}
                  tableRowPrefix="riskLevels-table"
                />
              </>
            )}
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            {canManageMerchantControl && (
              <>
                <Box
                  sx={{
                    marginBottom: "18px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Header
                    value={intl.formatMessage({
                      id: "merchantControls",
                      defaultMessage: "Merchant Controls",
                    })}
                    level={2}
                    bold
                    color="primary"
                  />
                  <DrawerComp
                    id="merchant-control-add-new-button"
                    label={intl.formatMessage({
                      id: "button.addNewMerchantControl",
                      defaultMessage: "ADD NEW MERCHANT CONTROL",
                    })}
                  >
                    <MerchantControlDrawer />
                  </DrawerComp>
                </Box>
                <StandardTable
                  id="program-merchant-controls-table"
                  tableRowPrefix="program-merchant-controls-table"
                  dataList={merchantControls}
                  tableMetadata={merchantControlsTableMetadata}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Box>
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
            setShowConfirmation("");
          }}
          handleConfirm={() => deleteMerchantControl(showConfirmation)}
        />
      )}
    </>
  );
};

export default PageNavControls;
