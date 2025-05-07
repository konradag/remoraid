import { useFormOptions } from "@/components/FormOptionsProvider";
import { JsonSchema } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { DatePickerInput } from "@mantine/dates";

interface TimestampControlProps {
  data: any;
  handleChange(path: string, value: any): void;
  path: string;
  label: string;
  schema: JsonSchema;
  required?: boolean;
}

const TimestampControl = ({
  data,
  handleChange,
  path,
  label,
  required,
  schema,
}: TimestampControlProps) => {
  const {
    formOptions: { withDescriptions },
  } = useFormOptions();

  return (
    <>
      <DatePickerInput
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
};

export default withJsonFormsControlProps(TimestampControl);
