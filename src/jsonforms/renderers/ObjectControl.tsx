import {
  JsonForms,
  useJsonForms,
  withJsonFormsControlProps,
} from "@jsonforms/react";
import { Input, Paper } from "@mantine/core";
import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { ControlProps, OwnPropsOfControl } from "@jsonforms/core";
import { ComponentType } from "react";

function PlainObjectControl(props: ControlProps) {
  const { label, schema, data, handleChange, path, required } = props;
  const {
    formOptions: { withDescriptions },
  } = useFormOptions();
  const { renderers, cells } = useJsonForms();

  return (
    <>
      <Input.Wrapper
        label={label}
        description={withDescriptions ? schema.description : undefined}
        withAsterisk={required}
      >
        <Paper
          withBorder
          shadow="0"
          p="sm"
          mt={
            withDescriptions &&
            schema.description &&
            schema.description.length > 0
              ? 4
              : 0
          }
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
      </Input.Wrapper>
    </>
  );
}

const ObjectControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainObjectControl);
export default ObjectControl;
