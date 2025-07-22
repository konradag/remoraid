import {
  JsonForms,
  useJsonForms,
  withJsonFormsControlProps,
} from "@jsonforms/react";
import { ControlProps, OwnPropsOfControl } from "@jsonforms/core";
import { Input, Paper, Select } from "@mantine/core";
import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { ComponentType } from "react";
import { useRemoraidTheme } from "@/core";

function PlainAnyOfControl(props: ControlProps) {
  const { data, schema, label, required, handleChange, path } = props;
  const theme = useRemoraidTheme();
  const { formOptions } = useFormOptions();
  const { renderers, cells } = useJsonForms();

  // Helpers
  const defaultValues: { [index: string]: any } = {
    number: 0,
    integer: 0,
    string: "",
    array: [],
    object: {},
    null: null,
    boolean: false,
  };
  let type: string | undefined = undefined;
  if (typeof data === "number") {
    if (
      Number.isInteger(data) &&
      schema.anyOf &&
      schema.anyOf.find((a) => a.type && a.type === "integer")
    ) {
      type = "integer";
    } else {
      type = "number";
    }
  } else if (typeof data === "string") {
    type = "string";
  } else if (data === null) {
    type = "null";
  } else if (typeof data === "object" && Array.isArray(data)) {
    type = "array";
  } else if (typeof data === "object") {
    type = "object";
  } else if (typeof data === "boolean") {
    type = "boolean";
  }

  const typeProperties = schema.anyOf
    ? schema.anyOf.find((a) => a.type === type) || {}
    : {};

  return (
    <>
      <Input.Wrapper
        label={label}
        description={
          formOptions.withDescriptions ? schema.description ?? null : null
        }
        withAsterisk={required}
      >
        <Paper
          withBorder
          shadow="0"
          bg="var(--remoraid-transparent-background)"
          p={formOptions.gutter}
          mt={
            formOptions.withDescriptions &&
            schema.description &&
            schema.description.length > 0
              ? 4
              : 0
          }
        >
          <Select
            label={`Value Type`}
            data={schema.anyOf ? schema.anyOf.map((a) => String(a.type)) : []}
            value={type}
            onChange={(newValue) => {
              handleChange(
                path,
                newValue ? defaultValues[newValue] : undefined
              );
            }}
            allowDeselect={true}
            required={required}
            placeholder="Select Value Type"
            variant="default"
            mb={type && type !== "null" ? formOptions.gutter : undefined}
          />
          {type && type !== "null" && (
            <JsonForms
              schema={{
                ...typeProperties,
                $schema: undefined,
              }}
              data={data}
              renderers={renderers ?? []}
              cells={cells ?? []}
              onChange={({ data: newData }) => {
                handleChange(path, newData);
              }}
              validationMode="NoValidation"
            />
          )}
        </Paper>
      </Input.Wrapper>
    </>
  );
}
const AnyOfControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainAnyOfControl);
export default AnyOfControl;
