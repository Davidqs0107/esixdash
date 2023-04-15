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

import { useIntl, defineMessage, MessageDescriptor } from "react-intl";
import React from "react";
import LanguageCodeToFlag from "./LanguageCodeToFlag";
import { Box, Typography } from "@mui/material";

interface ILanguageConverter {
  locale: string;
  className?: string;
}

const LanguageConverter: React.FC<ILanguageConverter> = ({
  locale,
  className,
}) => {
  const intl = useIntl();

  /* Provides react-intl the info to perform message extraction */
  const sourceDefinition: Record<string, MessageDescriptor> = {
    en: defineMessage({
      id: "label.language.english",
      description: "Language dropdown selection",
      defaultMessage: "U.S. - English",
    }),
    ja: defineMessage({
      id: "label.language.japanese",
      description: "Language dropdown selection",
      defaultMessage: "Japanese",
    }),
    pt: defineMessage({
      id: "label.language.portuguese",
      description: "Language dropdown selection",
      defaultMessage: "Portuguese",
    }),
    es: defineMessage({
      id: "label.language.spanish",
      description: "Language dropdown selection",
      defaultMessage: "Spanish",
    }),
  };
  const newLocale = locale in sourceDefinition ? locale : "en";
  const languageName = intl.formatMessage(sourceDefinition[newLocale]);

  return (
    <Box
      className={className}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        justifyContent: "flex-end",
        fontWeight: className == "bold" ? 600 : undefined
      }}
    >
      <Typography variant="link" sx={{ marginRight: "12px" }}>
        {languageName}
      </Typography>
      <LanguageCodeToFlag className="shadowed" locale={newLocale} />
    </Box>
  );
};

export default LanguageConverter;
