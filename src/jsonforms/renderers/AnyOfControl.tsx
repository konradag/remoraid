import {
  JsonForms,
  useJsonForms,
  withJsonFormsControlProps,
} from "@jsonforms/react";
import {
  ControlProps,
  JsonSchema,
  OwnPropsOfControl,
  Resolve,
} from "@jsonforms/core";
import { Input, Paper, Select } from "@mantine/core";
import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { ComponentType, useMemo, useState } from "react";

function PlainAnyOfControl({
  data,
  schema,
  label,
  required,
  handleChange,
  path,
  rootSchema,
}: ControlProps) {
  const { formOptions } = useFormOptions();
  const { core, renderers, cells } = useJsonForms();

  // Helpers 1
  const inferType = (schema: JsonSchema | undefined): string | undefined => {
    if (!schema) {
      return undefined;
    }
    const type = schema.type;
    if (Array.isArray(type)) {
      return type.join(" | ");
    }
    if (typeof type === "string") {
      return type;
    }
    if (schema.properties) {
      return "object";
    }
    if (schema.items) {
      return "array";
    }
    return undefined;
  };
  const options = useMemo(() => {
    const anyOf = schema.anyOf ?? [];
    return anyOf.map((opt, idx) => {
      const resolved = opt.$ref
        ? Resolve.schema(rootSchema, opt.$ref, rootSchema)
        : opt;
      const refLabel =
        typeof opt.$ref === "string"
          ? opt.$ref.split("/").slice(-1)[0]
          : undefined;
      const typeLabel = inferType(resolved) ?? inferType(opt);
      const label =
        resolved?.title ?? refLabel ?? typeLabel ?? `Option ${idx + 1}`;
      return { original: opt, resolved, label };
    });
  }, [schema.anyOf, rootSchema]);
  const isValidOptionIndex = useMemo(() => {
    return (optionIndex: number): boolean => {
      if (!core?.ajv || data === undefined) {
        return false;
      }
      const validate = core.ajv.compile(options[optionIndex].resolved);
      return validate(data);
    };
  }, [core?.ajv, data, options]);
  const validOptionIndex = useMemo(() => {
    for (let i = 0; i < options.length; i++) {
      if (isValidOptionIndex(i)) {
        return i;
      }
    }
    return -1;
  }, [options, isValidOptionIndex]);

  // State
  const [selectedOption, setSelectedOption] = useState<string | null>(
    validOptionIndex >= 0 ? String(validOptionIndex) : null
  );

  // Helpers 2
  const schemaDefaultValue = (opt: JsonSchema) => {
    const t =
      opt.type ?? (opt.properties ? "object" : opt.items ? "array" : undefined);
    switch (t) {
      case "string":
        return "";
      case "number":
      case "integer":
        return 0;
      case "boolean":
        return false;
      case "array":
        return [];
      case "object":
        return {};
      case "null":
        return null;
      default:
        return null;
    }
  };
  const selectedSchema = options[Number(selectedOption)].resolved;
  const selectData = options.map((o, i) => ({
    value: String(i),
    label: o.label,
  }));

  return (
    <>
      <Input.Wrapper
        label={label}
        description={
          formOptions.withDescriptions ? schema.description ?? null : null
        }
        withAsterisk={required}
      >
        <Paper
          withBorder
          shadow="0"
          bg="var(--remoraid-transparent-background)"
          p={formOptions.gutter}
          mt={
            formOptions.withDescriptions &&
            schema.description &&
            schema.description.length > 0
              ? 4
              : 0
          }
        >
          <Select
            label="Value type"
            data={selectData}
            value={selectedOption}
            onChange={(value) => {
              setSelectedOption(value);
              if (value == null) {
                handleChange(path, undefined);
                return;
              }
              if (!isValidOptionIndex(Number(value))) {
                const picked = options[Number(value)]?.resolved;
                handleChange(path, schemaDefaultValue(picked ?? {}));
              }
            }}
            allowDeselect
            required={required}
            placeholder="Select value type"
            variant="default"
            mb={
              selectedOption !== null && inferType(selectedSchema) !== "null"
                ? formOptions.gutter
                : undefined
            }
          />
          {selectedOption !== null && (
            <JsonForms
              schema={{
                ...selectedSchema,
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
          )}
        </Paper>
      </Input.Wrapper>
    </>
  );
}
const AnyOfControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainAnyOfControl);
export default AnyOfControl;
