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

import React, { useState } from "react";
import Box from "@mui/material/Box";
import { Formik } from "formik";
import GenericAccordion from "../common/forms/accordions/GenericAccordion";
import Icon from "../common/Icon";
import InlineCheckbox from "../common/forms/checkboxes/InlineCheckbox";

interface IProductsFilterAccordion {
  filterFunc: Function;
}

const ProductsFilterAccordion: React.FC<IProductsFilterAccordion> = ({
  filterFunc,
}) => {
  const [productsList, setProductsList] = useState([]);

  const applyFilter = (values: any) => {};

  return (
    <GenericAccordion icon={Icon.productsIcon} label="Products">
      {/* @ts-ignore */}
      <Formik onSubmit={(values) => applyFilter(values)} enableReinitialize>
        {(props) => (
          <Box>
            {productsList.map((products: any) => (
              // @ts-ignore
              <InlineCheckbox
                key={products.name}
                id="customerSearch-filter-new"
                value={props.values[products.name]}
                label={products.name}
                func={setProductsList}
              />
            ))}
          </Box>
        )}
      </Formik>
    </GenericAccordion>
  );
};

export default ProductsFilterAccordion;
