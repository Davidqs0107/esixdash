import * as React from "react";
import { withJsonFormsControlProps } from "@jsonforms/react";
import {
  RankedTester,
  rankWith,
  and,
  isStringControl,
  isNumberControl,
  ControlProps,
} from "@jsonforms/core";

import InputWithPlaceholder from "../forms/inputs/InputWithPlaceholder";

const InputWithPlaceholderControl = (props: ControlProps) => {
  const { label, data, required, id } = props;
  return (
    <>
      {/* @ts-ignore */}
      <InputWithPlaceholder
        name="Test-name"
        autoComplete="off"
        type="text"
        handleChange={(ev: any) => {
          props.handleChange(props.path, ev.target.value);
        }}
        placeholder={label}
        value={data}
        values={[]}
        className="test-class"
        required={required ?? true}
        id={id}
      />
    </>
  );
};

export const InputWithPlaceHolderTester: RankedTester = rankWith(
  3, // default components rated 2
  and(isNumberControl || isStringControl) // this should be uischema.json @ scope key
);

export default withJsonFormsControlProps(InputWithPlaceholderControl);
