import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { ControlProps, OwnPropsOfControl } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { Select } from "@mantine/core";
import { ComponentType } from "react";

function PlainTimestampControl({
  data,
  handleChange,
  path,
  label,
  schema,
  required,
}: ControlProps) {
  const {
    formOptions: { withDescriptions },
  } = useFormOptions();

  return (
    <>
      <Select
        label={label}
        data={schema.enum}
        value={data}
        onChange={(newValue) => {
          handleChange(path, newValue);
        }}
        required={required}
        placeholder="Select an option"
        variant="default"
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
}
const TimestampControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainTimestampControl);
export default TimestampControl;
