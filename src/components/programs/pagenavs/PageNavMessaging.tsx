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

import React, { useContext, FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, Grid, Typography } from "@mui/material";
import DrawerComp from "../../../components/common/DrawerComp";
import MemoTemplateDrawer from "../../../components/programs/drawers/MemoTemplateDrawer";
import MailTypeConverter from "../../../components/common/converters/MailTypeConverter";
import MailTemplateDrawer from "../../../components/programs/drawers/MailTemplateDrawer";
import TableCellAccordion from "../../../components/common/forms/accordions/TableCellAccordion";
import { ProgramEditContext } from "../../../contexts/ProgramEditContext";

const PageNavMessaging: FC = () => {
  const intl = useIntl();
  const {
    program,
    locales,
    mailTemplates,
    mailTemplateCount,
    memoTemplateCount,
    memoTemplates,
  } = useContext(ProgramEditContext);

  const getDisplayName = (localeCode: any) => {
    const entry: any = locales.find((l: any) => l.code === localeCode);
    return entry ? entry.text : "";
  };

  const MailTemplate = (mailKey: any, key: any, id: number) => {
    let locale = intl.formatDisplayName(key, { type: "language" });
    if (!locale) {
      locale = getDisplayName(key);
    }
    return (
      <Grid container sx={{ mb: 1 }} key={`div.mailTemplates.${program.id}`}>
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography>{`${MailTypeConverter(
            mailKey,
            intl
          )} (${locale})`}</Typography>
        </Grid>
        <Grid item>
          <DrawerComp
            buttonProps=""
            label={intl.formatMessage({
              id: "button.edit",
              description: "Edit program mailTemplates information",
              defaultMessage: "EDIT",
            })}
            widthPercentage={40}
          >
            <MailTemplateDrawer templateSet={key} mailTemplateId={id} edit />
          </DrawerComp>
        </Grid>
      </Grid>
    );
  };

  const TopMailTemplate = () => {
    for (const [key, value] of mailTemplates) {
      for (const v of value) {
        return MailTemplate(v.mailKey, key, v.id);
      }
    }
  };

  const MailTemplateAddDrawer = () => (
    <DrawerComp
      asLink
      bodyInteractive="small"
      label={`${intl.formatMessage({
        id: "addNewMailTemplate",
        description: "Add New Mail Template button",
        defaultMessage: "Add New Mail Template",
      })} >>`}
      overrideWidth
      widthPercentage={30}
      truncateAt={50}
      buttonStyle={{ paddingTop: "8px", lineHeight: "15px" }}
    >
      <MailTemplateDrawer />
    </DrawerComp>
  );

  const MailTemplates = () => {
    const templates = [];
    let first = true;
    for (const [key, value] of mailTemplates) {
      for (const v of value) {
        if (first) {
          first = false;
        } else {
          templates.push(MailTemplate(v.mailKey, key, v.id));
        }
      }
    }
    return templates;
  };

  const TopMemoTemplate = () => {
    for (const [key, value] of memoTemplates) {
      for (const v of value) {
        return MemoTemplate(v.memoKey, key, v.id);
      }
    }
  };

  const MemoTemplate = (memoKey: any, key: any, id: number) => {
    let memoLocale = intl.formatDisplayName(key, { type: "language" });
    if (!memoLocale) {
      memoLocale = getDisplayName(key);
    }

    return (
      <Grid container sx={{ mb: 1 }} key={memoKey}>
        <Grid item sx={{ flexGrow: 1 }}>
          <Typography>{`${memoKey} (${memoLocale})`}</Typography>
        </Grid>
        <Grid item>
          <DrawerComp
            buttonProps="mr-0"
            label={intl.formatMessage({
              id: "button.edit",
              description: "Edit program memo templates information",
              defaultMessage: "EDIT",
            })}
            overrideWidth
            widthPercentage={30}
          >
            <MemoTemplateDrawer memoTemplateId={id} templateSet={key} edit />
          </DrawerComp>
        </Grid>
      </Grid>
    );
  };

  const MemoTemplates = () => {
    const templates = [];
    let first = true;
    for (const [key, value] of memoTemplates) {
      for (const v of value) {
        if (first) {
          first = false;
        } else {
          templates.push(MemoTemplate(v.memoKey, key, v.id));
        }
      }
    }
    return templates;
  };

  const MemoTemplateAddDrawer = () => (
    <DrawerComp
      asLink
      bodyInteractive="small"
      overrideWidth
      widthPercentage={30}
      truncateAt={60}
      label={`${intl.formatMessage({
        id: "addNewTransactionMemoTemplate",
        description: "Add New Transaction Memo Template button",
        defaultMessage: "Add New Transaction Memo Template",
      })} >>`}
      buttonStyle={{ paddingTop: "8px", lineHeight: "15px" }}
    >
      <MemoTemplateDrawer />
    </DrawerComp>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "350px", marginRight: "112px" }}>
        <Box sx={{ marginBottom: "15px" }}>
          <Typography variant="labelDark">
            <FormattedMessage
              id="mailTemplates"
              defaultMessage="Mail Templates"
            />
          </Typography>
        </Box>
        <Box>
          <Box>
            {TopMailTemplate()}

            {mailTemplateCount > 1 && (
              <TableCellAccordion
                showNumber={mailTemplateCount}
                hideNumber={mailTemplateCount - 1}
                addDrawer={MailTemplateAddDrawer()}
              >
                {MailTemplates()}
              </TableCellAccordion>
            )}
          </Box>
          <Box sx={{ textAlign: "right" }}>
            {mailTemplateCount <= 1 && MailTemplateAddDrawer()}
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: "350px" }}>
        <Box sx={{ marginBottom: "15px" }}>
          <Typography variant="labelDark">
            <FormattedMessage
              id="transactionMemoTemplates"
              defaultMessage="Transaction Memo Templates"
            />
          </Typography>
        </Box>
        <Box>
          <Box>
            {TopMemoTemplate()}

            {memoTemplateCount > 1 && (
              <TableCellAccordion
                showNumber={memoTemplateCount}
                hideNumber={memoTemplateCount - 1}
                addDrawer={MemoTemplateAddDrawer()}
              >
                {MemoTemplates()}
              </TableCellAccordion>
            )}
          </Box>
          <Box sx={{ textAlign: "right" }}>
            {memoTemplateCount <= 1 && MemoTemplateAddDrawer()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PageNavMessaging;
