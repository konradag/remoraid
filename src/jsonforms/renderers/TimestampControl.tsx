import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { ControlProps, OwnPropsOfControl } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { DatePickerInput } from "@mantine/dates";
import { ComponentType } from "react";

function PlainTimestampControl({
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
      <DatePickerInput
        variant="default"
        label={label}
        placeholder="Pick a date"
        value={new Date(data * 1000)}
        onChange={(newValue: any) => {
          if (newValue) {
            handleChange(path, newValue.getTime() / 1000);
          }
        }}
        required={required}
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
}

const TimestampControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainTimestampControl);
export default TimestampControl;
