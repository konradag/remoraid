import {
  JsonForms,
  useJsonForms,
  withJsonFormsControlProps,
} from "@jsonforms/react";
import {
  Box,
  Flex,
  Group,
  Input,
  Paper,
  Stack,
  TextInput,
} from "@mantine/core";
import {
  composePaths,
  ControlElement,
  ControlProps,
  OwnPropsOfControl,
} from "@jsonforms/core";
import { ComponentType, useState } from "react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useFormOptions } from "../components/FormOptionsProvider";
import { RemoraidButton } from "@/core";

function PlainObjectControl({
  label: labelProp,
  schema,
  data,
  handleChange,
  path,
  required,
}: ControlProps) {
  // Contexts
  const { formOptions } = useFormOptions();
  const { renderers, cells } = useJsonForms();

  // State
  const [newKey, setNewKey] = useState<string>("");

  // Helpers
  const hasProperties =
    schema.properties && Object.keys(schema.properties).length > 0;
  const hasAdditionalProperties =
    schema.additionalProperties === true ||
    (schema.additionalProperties !== undefined &&
      Object.keys(schema.additionalProperties).length > 0);
  const label = labelProp !== "remoraid-array-item" ? labelProp : null;
  const description = formOptions.withDescriptions
    ? schema.description
    : undefined;
  const declaredKeys = new Set(Object.keys(schema.properties ?? {}));
  const objectData =
    data && typeof data === "object" && !Array.isArray(data) ? data : {};
  const additionalEntries = Object.entries(objectData).filter(
    ([key]) => !declaredKeys.has(key)
  );

  return (
    <Input.Wrapper
      label={label}
      description={description}
      withAsterisk={required}
    >
      <Paper
        withBorder
        bg="var(--remoraid-transparent-background)"
        shadow="0"
        p={formOptions.gutter}
        mt={Boolean(description) ? 4 : 0}
      >
        <Stack align="stretch" justify="flex-start" gap={formOptions.gutter}>
          {hasProperties && (
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
          )}
          {hasAdditionalProperties && (
            <>
              {additionalEntries.length > 0 && (
                <Stack
                  align="stretch"
                  justify="flex-start"
                  gap={formOptions.gutter}
                >
                  {additionalEntries.map(([key, data]) => (
                    <Flex
                      gap={formOptions.gutter}
                      justify="flex-start"
                      align="center"
                      direction="row"
                      wrap="nowrap"
                      key={key}
                    >
                      <Box flex={1}>
                        <JsonForms
                          schema={{
                            ...(schema.additionalProperties === true
                              ? {}
                              : schema.additionalProperties),
                            title: key,
                            $schema: undefined,
                          }}
                          uischema={
                            {
                              type: "Control",
                              scope: "#",
                            } as ControlElement
                          }
                          data={data}
                          renderers={renderers ?? []}
                          cells={cells ?? []}
                          validationMode="ValidateAndHide"
                          onChange={({ data: newVal }) => {
                            handleChange(composePaths(path, key), newVal);
                          }}
                        />
                      </Box>
                      <RemoraidButton
                        responsive={false}
                        collapsed
                        label={`Delete ${key}`}
                        icon={IconTrash}
                        onClick={() => {
                          if (declaredKeys.has(key)) {
                            return;
                          }
                          const next = { ...(objectData ?? {}) };
                          delete next[key];
                          handleChange(path, next);
                        }}
                        size="sm"
                      />
                    </Flex>
                  ))}
                </Stack>
              )}
              <Group gap={formOptions.gutter} wrap="nowrap" align="flex-end">
                <TextInput
                  label="New key"
                  variant="default"
                  value={newKey}
                  onChange={(event) => {
                    setNewKey(event.currentTarget.value);
                  }}
                  required={required}
                  description={
                    formOptions.withDescriptions
                      ? "Key for new additional property value"
                      : null
                  }
                  flex={1}
                />
                <RemoraidButton
                  responsive={false}
                  collapsed
                  label="Add key"
                  icon={IconPlus}
                  onClick={() => {
                    const key = newKey.trim();
                    if (!key) {
                      return;
                    }
                    const next = { ...(objectData ?? {}) };
                    if (key in next) {
                      return;
                    }
                    next[key] = null;
                    handleChange(path, next);
                    setNewKey("");
                  }}
                  size="sm"
                  componentsProps={{
                    button: {
                      disabled: !Boolean(newKey) || declaredKeys.has(newKey),
                    },
                  }}
                />
              </Group>
            </>
          )}
        </Stack>
      </Paper>
    </Input.Wrapper>
  );
}

const ObjectControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainObjectControl);
export default ObjectControl;
