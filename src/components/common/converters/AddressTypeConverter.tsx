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

import { defineMessage } from "react-intl";

const AddressTypeConverter = (type: any, intl: any) => {
  const addressTypeDefinition: any = {
    home: defineMessage({
      id: "addressType.home",
      description: "Address type",
      defaultMessage: "Home",
    }),
    biz: defineMessage({
      id: "address.type.business",
      description: "Address type",
      defaultMessage: "Business",
    }),
    ship: defineMessage({
      id: "address.type.shipping",
      description: "Address type",
      defaultMessage: "Shipping",
    }),
  };

  return intl.formatMessage(addressTypeDefinition[type]);
};

export default AddressTypeConverter;
