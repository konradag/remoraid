import {
  JsonForms,
  useJsonForms,
  withJsonFormsControlProps,
} from "@jsonforms/react";
import { Input, Paper } from "@mantine/core";
import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { ControlProps, OwnPropsOfControl } from "@jsonforms/core";
import { ComponentType } from "react";
import { AlertCategory, AlertMinimal, useRemoraidTheme } from "@/core";

function PlainObjectControl(props: ControlProps) {
  const { label, schema, data, handleChange, path, required } = props;
  const { formOptions } = useFormOptions();
  const { renderers, cells } = useJsonForms();
  const theme = useRemoraidTheme();

  // Helpers
  const mt =
    formOptions.withDescriptions &&
    schema.description &&
    schema.description.length > 0
      ? 4
      : 0;

  return (
    <>
      <Input.Wrapper
        label={label !== "remoraid-array-item" ? label : null}
        description={
          formOptions.withDescriptions ? schema.description : undefined
        }
        withAsterisk={required}
      >
        {schema.properties && Object.keys(schema.properties).length > 0 ? (
          <Paper
            withBorder
            bg="var(--remoraid-transparent-background)"
            shadow="0"
            p={formOptions.gutter}
            mt={mt}
          >
            <JsonForms
              schema={{
                ...schema,
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
          </Paper>
        ) : (
          <AlertMinimal
            category={AlertCategory.Negative}
            title="No properties specified"
            text="The JSON schema for this object did not specify any properties."
            componentsProps={{ alert: { mt } }}
          />
        )}
      </Input.Wrapper>
    </>
  );
}

const ObjectControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainObjectControl);
export default ObjectControl;
