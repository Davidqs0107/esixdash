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

import React, { useState, useEffect } from "react";
//@ts-ignore
import { resolveObjectProperty } from "@e6tech/common/src/util";
import { useIntl } from "react-intl";
import { FormatTxSource, FormatTxType } from "../../converters/FormatTxSource";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Label from "../../elements/Label";
import api from "../../../../api/api";

interface ITxSourceTypeDropdown {
  filterType: any;
  isActive: boolean;
  children?: any;
}

const TxSourceTypeDropdown: React.FC<ITxSourceTypeDropdown> = ({
  isActive = false,
  filterType,
  ...props
}) => {
  const intl = useIntl();
  const [list, setList] = useState([]);

  const { name, touched, errors, handleChange, handleBlur, placeholder } =
    props as any;

  const getTxSources = () =>
    //@ts-ignore
    api.CommonAPI.getTransactionSources()
      .then((txSourceList: any) => {
        const formattedTxSource = txSourceList.map((txSource: any) => {
          // eslint-disable-next-line no-param-reassign
          txSource.formattedName = FormatTxSource(txSource.code, intl);
          return txSource;
        });
        setList(formattedTxSource);
      })
      .catch((error: any) => error); // TODO Handle error

  const getTxTypes = () =>
    // @ts-ignore
    api.CommonAPI.getTransactionTypes()
      .then((txTypes: any) => {
        const formattedTxType = txTypes.map((txType: any) => {
          txType.formattedName = FormatTxType(txType.code, intl);
          return txType;
        });
        setList(formattedTxType);
      })
      .catch((error: any) => error); // TODO Handle error

  useEffect(() => {
    if (filterType === "source") {
      getTxSources();
    } else if (filterType === "type") {
      getTxTypes();
    }
  }, []);

  return (
    <div className="input-float-label">
      <Select
        name={name}
        error={
          !!(
            resolveObjectProperty(name, touched) &&
            resolveObjectProperty(name, errors)
          )
        }
        onChange={handleChange}
        onBlur={handleBlur}
      >
        {list.map((opt: any) => (
          // eslint-disable-next-line radix
          <MenuItem value={parseInt(opt.code)} key={`${name}-${opt.code}`}>
            {opt.formattedName}
          </MenuItem>
        ))}
      </Select>
      <Label className={`${isActive ? "active" : ""}`} htmlFor={placeholder}>
        {placeholder}
      </Label>
    </div>
  );
};

export default TxSourceTypeDropdown;
