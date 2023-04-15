import * as React from "react";
import { withJsonFormsControlProps } from "@jsonforms/react";
import {
  rankWith,
  and,
  ControlProps,
  uiTypeIs,
  schemaMatches,
  isEnumControl,
  JsonSchema,
} from "@jsonforms/core";

import DropdownFloating from "../forms/dropdowns/DropdownFloating";

const DropDownFloatingControl = (props: ControlProps) => {
  const { label, data, required, id, schema } = props;

  let dataList = [{}];

  // @ts-ignore
  if (schema !== undefined && schema.hasOwnProperty("enum")) {
    // @ts-ignore
    dataList = schema.enum.map((l: any) => l);
  }

  return (
    <>
      {/* @ts-ignore */}
      <DropdownFloating
        {...props}
        name="Test-name"
        handleChange={(ev: any) => {
          props.handleChange(props.path, ev.target.value);
        }}
        placeholder={`${label}`}
        value={data}
        values={[]}
        list={dataList}
        id={id}
        // @ts-ignore
        handleBlur={() => {}}
      />
    </>
  );
};

const findEnumSchema = (schemas: JsonSchema[]) =>
  schemas.find(
    (s) => s.enum !== undefined && (s.type === "string" || s.type === undefined)
  );
const findTextSchema = (schemas: JsonSchema[]) =>
  schemas.find((s) => s.type === "string" && s.enum === undefined);

const hasEnumAndText = (schemas: JsonSchema[]) => {
  // idea: map to type,enum and check that all types are string and at least one item is of type enum,
  const enumSchema = findEnumSchema(schemas);
  const stringSchema = findTextSchema(schemas);
  const remainingSchemas = schemas.filter(
    (s) => s !== enumSchema || s !== stringSchema
  );
  const wrongType = remainingSchemas.find((s) => s.type && s.type !== "string");
  return enumSchema && stringSchema && !wrongType;
};

const simpleAnyOf = and(
  uiTypeIs("Control"),
  schemaMatches(
    // @ts-ignore
    (schema) => schema.hasOwnProperty("anyOf") && hasEnumAndText(schema.anyOf)
  )
);

export const DropDownFloatingTester = rankWith(
  7, // default components rated 2
  // simpleAnyOf // this should be uischema.json @ scope key
  isEnumControl
);

export default withJsonFormsControlProps(DropDownFloatingControl);
