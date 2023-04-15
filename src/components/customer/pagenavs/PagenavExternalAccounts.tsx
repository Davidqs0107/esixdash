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

import Box from "@mui/material/Box";
import { defineMessage, FormattedMessage, useIntl } from "react-intl";
import React, { useContext, useEffect, useState } from "react";
import Header from "../../common/elements/Header";
import StandardTable from "../../common/table/StandardTable";
import api from "../../../api/api";
import { MessageContext } from "../../../contexts/MessageContext";
import DrawerComp from "../../common/DrawerComp";
import ExternalAccountDrawer from "../drawers/ExternalAccountDrawer";
import emitter from "../../../emitter";
import TextRender from "../../common/TextRender";
import { ContentVisibilityContext } from "../../../contexts/ContentVisibilityContext";

interface IPagenavExternalAccounts {
  customerNumber: string;
}

const PagenavExternalAccounts: React.FC<IPagenavExternalAccounts> = ({
  customerNumber,
}) => {
  const intl = useIntl();
  const { setErrorMsg } = useContext(MessageContext);
  const [externalAccounts, setExternalAccounts] = useState([]);
  const { readOnly } = useContext(ContentVisibilityContext);

  const getExternalReferences = () =>
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    api.CustomerAPI.getExternalReferences(customerNumber)
      .then((result: any) => setExternalAccounts(result))
      .catch((error: any) => setErrorMsg(error));

  const externalAccountsMetadata = [
    {
      width: "30%",
      header: (
        <FormattedMessage
          id="referenceNumber"
          description="Ext account reference number"
          defaultMessage="Reference Number"
        />
      ),
      render: (rowData: any) => {
        const { referenceNumber } = rowData;
        return <TextRender data={referenceNumber} />;
      },
    },
    {
      width: "30%",
      header: (
        <FormattedMessage
          id="identifierCode"
          description="Ext account identifier code"
          defaultMessage="Identifier Code"
        />
      ),
      render: (rowData: any) => {
        const { identifierCode } = rowData;
        return <TextRender data={identifierCode} />;
      },
    },
    {
      width: "30%",
      header: (
        <FormattedMessage
          id="partnerName"
          description="Partner name"
          defaultMessage="Partner Name"
        />
      ),
      render: (rowData: any) => {
        const { partnerName } = rowData;
        return <TextRender data={partnerName} />;
      },
    },
    {
      width: "10%",
      header: <> </>,
      render: (rowData: any) => (
        <DrawerComp
          id={`partner-edit-${rowData.name}-button`}
          label={intl.formatMessage({
            id: "button.edit",
            defaultMessage: "EDIT",
          })}
        >
          <ExternalAccountDrawer
            customerNumber={customerNumber}
            externalAccount={rowData}
            edit
          />
        </DrawerComp>
      ),
    },
  ];

  useEffect(() => {
    getExternalReferences();
    emitter.on("external.accounts.changed", () => getExternalReferences());
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <Header
          value={intl.formatMessage(
            defineMessage({
              id: "externalAccounts",
              description: "section header",
              defaultMessage: "External Accounts",
            })
          )}
          level={2}
          bold
          color="primary"
        />
        <Box>
          <DrawerComp
            disabled={readOnly}
            label={intl.formatMessage(
              defineMessage({
                id: "button.addNewExternalAccount",
                description: "Button Label",
                defaultMessage: "ADD NEW EXTERNAL ACCOUNT",
              })
            )}
          >
            <ExternalAccountDrawer customerNumber={customerNumber} />
          </DrawerComp>
        </Box>
      </Box>
      <Box>
        <StandardTable
          id="external-accounts-table"
          tableRowPrefix="external-accounts"
          tableMetadata={externalAccountsMetadata}
          dataList={externalAccounts}
        />
      </Box>
    </Box>
  );
};

export default PagenavExternalAccounts;
