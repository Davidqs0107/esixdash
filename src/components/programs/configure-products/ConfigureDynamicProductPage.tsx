/*
 * Copyright (c) 2015-2022, Episode Six and/or its affiliates. All rights reserved.
 * EPISODE SIX PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 * Copying is only permitted per the terms of an executed Non-Disclosure Agreement
 * with Episode Six. Use is only permitted for conducting an evaluation of
 * Episode Six APIs as authorized by Episode Six.
 *
 */

import React, { useContext, useState } from "react";
import { Formik, FormikProps, FormikValues } from "formik";
import { useIntl } from "react-intl";
import { JsonForms } from "@jsonforms/react";
import {
  materialRenderers,
  materialCells,
} from "@jsonforms/material-renderers";
import { Grid } from "@mui/material";

import { createStyles, makeStyles } from "@mui/styles";
import { Theme } from "@mui/material/styles";
import { useHistory } from "react-router-dom";

import { MessageContext } from "../../../contexts/MessageContext";

import InputWithPlaceholderControl, {
  InputWithPlaceHolderTester,
} from "../../common/json-forms-custom-renderers/InputWithPlaceholderControl";
import DropDownFloatingControl, {
  DropDownFloatingTester,
} from "../../common/json-forms-custom-renderers/DropDownFloatingControl";
import CheckboxControl, {
  CheckboxTester,
} from "../../common/json-forms-custom-renderers/CheckboxControl";
import InterestConfigControl, {
  InterestConfigTester,
} from "../../common/json-forms-custom-renderers/InterestConfigControl";

const useStyles = makeStyles(() =>
  createStyles({
    fields: {
      paddingRight: "30px",
      marginTop: "10px",

      "& .MuiSelect-select": {
        boxShadow: "0 15px 5px -10px #0b0d100a",
      },
      "& .MuiTextField-root": {
        boxShadow: "0 15px 5px -10px #0b0d100a",
      },
    },
    checkBox: {
      "& Label": { marginBottom: 0 },
    },
  })
);

// @todo - Need to define this based on the dynamic input mappings once we get to that ticket (H3-9675)
interface IFormBase {
  setPlugInObject: any;
  setConfirmSelection: any;
  selectedProduct: any;
  selectedTemplateConfigurationSchema: any;
  selectedProductTemplateUISchema: any;
  submitForm: any;
  refId: any;
}

const ConfigureDynamicProductPage: React.FC<IFormBase> = ({
  selectedTemplateConfigurationSchema,
  selectedProductTemplateUISchema,
  submitForm,
  refId,
}) => {
  const { setErrorMsg } = useContext(MessageContext);
  const [fieldData, setFieldData] = useState(
    selectedTemplateConfigurationSchema.defaultConfig
  );
  const [errors, setErrors] = useState({});


  const formValues = useState({
    productName: "",
    productNameInput: "",
    partner: "",
    language: "",
    location: "",
    timeZone: "",
    homeCurrency: "",
    day: 1,
    hour: 0,
    minute: 0,
    daysPerYear: "",
    drawTypes: [],
    interestConfig: "",
    term: "",
  });

  const renderers = [
    ...materialRenderers,
    {
      tester: InputWithPlaceHolderTester,
      renderer: InputWithPlaceholderControl,
    },
    {
      tester: DropDownFloatingTester,
      renderer: DropDownFloatingControl,
    },
    {
      tester: CheckboxTester,
      renderer: CheckboxControl,
    },
    {
      tester: InterestConfigTester,
      renderer: InterestConfigControl,
    },
  ];

  const materialCellRenderers = [
    ...materialCells,
    {
      tester: InputWithPlaceHolderTester,
      cell: InputWithPlaceholderControl,
    },
    {
      tester: DropDownFloatingTester,
      cell: DropDownFloatingControl,
    },
    {
      tester: CheckboxTester,
      cell: CheckboxControl,
    },
  ];

  return (
    // @ts-ignore
    <Formik
      initialValues={formValues}
      enableReinitialize
      onSubmit={(values) => submitForm(values)}
    >
      {/* @ts-ignore */}
      {(props: FormikProps<FormikValues>) => (
        <form id="product-form-mattic" onSubmit={props.handleSubmit}>
          <Grid container spacing={2} xs={12}>
            {selectedTemplateConfigurationSchema.defaultConfig &&
            selectedProductTemplateUISchema !== undefined ? (
              <>
                <JsonForms
                  schema={selectedTemplateConfigurationSchema.configSchema}
                  data={fieldData}
                  uischema={selectedProductTemplateUISchema}
                  renderers={renderers}
                  cells={materialCellRenderers}
                  onChange={(data) => {
                    return props.setValues(data);
                  }}
                />
                <button
                  ref={refId}
                  id="boo"
                  type="submit"
                  style={{ display: "none" }}
                  value="Validate"
                />
              </>
            ) : (
              <>
                <JsonForms
                  schema={selectedTemplateConfigurationSchema.configSchema}
                  data={fieldData}
                  renderers={renderers}
                  cells={materialCellRenderers}
                  onChange={(data) => {
                    props.setValues(data);
                  }}
                  {...props}
                />
                <button
                  ref={refId}
                  id="boo"
                  type="submit"
                  style={{ display: "none" }}
                  value="Validate"
                />
              </>
            )}
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default ConfigureDynamicProductPage;
