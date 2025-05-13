import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { ControlProps, OwnPropsOfControl } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { NumberInput } from "@mantine/core";
import { ComponentType } from "react";

function PlainNumberControl({
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
      <NumberInput
        label={label}
        variant="filled"
        value={data}
        onChange={(newValue) => {
          if (newValue === "") {
            handleChange(path, undefined);
          }
          handleChange(path, Number(newValue));
        }}
        required={required}
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
}

export const NumberControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainNumberControl);
export default NumberControl;
