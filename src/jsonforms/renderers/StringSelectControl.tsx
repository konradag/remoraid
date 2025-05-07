import { useFormOptions } from "@/components/FormOptionsProvider";
import { JsonSchema } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { Select } from "@mantine/core";

interface StringSelectControlProps {
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
  schema,
  required,
}: StringSelectControlProps) => {
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
        variant="filled"
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
};

export default withJsonFormsControlProps(TimestampControl);
