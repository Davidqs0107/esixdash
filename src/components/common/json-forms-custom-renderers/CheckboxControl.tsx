import * as React from "react";
import { withJsonFormsControlProps } from "@jsonforms/react";
import {
  RankedTester,
  rankWith,
  and,
  isBooleanControl,
  ControlProps,
} from "@jsonforms/core";

import { Field } from "formik";
import QDCheckbox from "../forms/inputs/QDCheckbox";

const CheckboxControl = (props: ControlProps) => {
  const { label, data, required, id } = props;
  return (
    <Field
      {...props}
      name="Checkbox"
      as={QDCheckbox}
      onclick={(ev: any) => {
        props.handleChange(props.path, ev.target.value);
      }}
      value={data}
      values={[]}
    />
  );
};

export const CheckboxTester: RankedTester = rankWith(
  3, // default components rated 2
  and(isBooleanControl) // this should be uischema.json @ scope key
);

export default withJsonFormsControlProps(CheckboxControl);
