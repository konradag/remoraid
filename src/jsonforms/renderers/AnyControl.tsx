import { InputWrapperScrollArea, useRemoraidTheme } from "@/core";
import { ControlProps, OwnPropsOfControl } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { JsonInput } from "@mantine/core";
import { ComponentType, useState } from "react";
import { useFormOptions } from "../components/FormOptionsProvider";

function PlainAnyControl({
  data,
  handleChange,
  path,
  label: labelProp,
  required,
  schema,
}: ControlProps) {
  // Contexts
  const theme = useRemoraidTheme();
  const {
    formOptions: { withDescriptions },
  } = useFormOptions();

  // State
  const [input, setInput] = useState<string>(
    JSON.stringify(data, null, theme.jsonStringifySpace)
  );
  const [error, setError] = useState<boolean>(false);

  // Helpers
  const label = labelProp !== "remoraid-array-item" ? labelProp : null;
  const description = withDescriptions ? schema.description : undefined;

  return (
    <InputWrapperScrollArea
      label={label ?? undefined}
      error={error ? "Invalid JSON" : undefined}
      description={description}
      required={required}
      mah={140}
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
        styles={{ input: { border: "none" } }}
      />
    </InputWrapperScrollArea>
  );
}

const AnyControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainAnyControl);
export default AnyControl;
