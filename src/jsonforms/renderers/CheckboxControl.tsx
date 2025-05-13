import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { ControlProps, OwnPropsOfControl } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import { Checkbox } from "@mantine/core";
import { ComponentType } from "react";

function PlainCheckboxControl({
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
      <Checkbox
        label={label}
        py="sm"
        size="sm"
        labelPosition="left"
        checked={data}
        onChange={(event) => {
          handleChange(path, event.target.checked);
        }}
        required={required}
        description={withDescriptions ? schema.description || null : null}
      />
    </>
  );
}

const CheckboxControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainCheckboxControl);
export default CheckboxControl;
