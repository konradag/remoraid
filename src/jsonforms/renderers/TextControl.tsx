import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { ControlProps, OwnPropsOfControl } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { TextInput } from "@mantine/core";
import { ComponentType } from "react";

function PlainTextControl({
  data,
  handleChange,
  path,
  label,
  required,
  schema,
}: ControlProps) {
  const {
    formOptions: { withDescriptions },
  } = useFormOptions();

  return (
    <>
      <TextInput
        label={label}
        variant="filled"
        placeholder=""
        value={data}
        onChange={(event) => {
          handleChange(path, event.currentTarget.value);
        }}
        required={required}
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
}

const TextControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainTextControl);
export default TextControl;
