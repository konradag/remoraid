import {
  JsonForms,
  useJsonForms,
  withJsonFormsControlProps,
} from "@jsonforms/react";
import { Input, JsonInput, Paper } from "@mantine/core";
import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { ControlProps, OwnPropsOfControl } from "@jsonforms/core";
import { ComponentType, useState } from "react";
import {
  AlertCategory,
  AlertMinimal,
  InputWrapperScrollArea,
  useRemoraidTheme,
} from "@/core";

function PlainObjectControl(props: ControlProps) {
  const { label, schema, data, handleChange, path, required } = props;
  const { formOptions } = useFormOptions();
  const { renderers, cells } = useJsonForms();
  const theme = useRemoraidTheme();

  // State
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  // Helpers
  const mt =
    formOptions.withDescriptions &&
    schema.description &&
    schema.description.length > 0
      ? 4
      : 0;

  return (
    <>
      {schema.properties && Object.keys(schema.properties).length > 0 ? (
        <Input.Wrapper
          label={label !== "remoraid-array-item" ? label : null}
          description={
            formOptions.withDescriptions ? schema.description : undefined
          }
          withAsterisk={required}
        >
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
        </Input.Wrapper>
      ) : (
        // <AlertMinimal
        //   category={AlertCategory.Negative}
        //   title="No properties specified"
        //   text="The JSON schema for this object did not specify any properties."
        //   componentsProps={{ alert: { mt } }}
        // />
        <InputWrapperScrollArea
          label={label !== "remoraid-array-item" ? label : undefined}
          mah={100}
        >
          <JsonInput
            onChange={(newValue) => {
              setInput(newValue);
              try {
                const parsedValue = JSON.parse(newValue);
                handleChange(path, parsedValue);
                setError(false);
              } catch {
                setError(true);
                return;
              }
            }}
            value={input}
            minRows={4}
            autosize
            formatOnBlur
            variant="unstyled"
            error={error ? "Invalid JSON" : undefined}
          />
        </InputWrapperScrollArea>
      )}
    </>
  );
}

const ObjectControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainObjectControl);
export default ObjectControl;
