import { ControlProps, JsonSchema7, OwnPropsOfControl } from "@jsonforms/core";
import {
  JsonForms,
  useJsonForms,
  withJsonFormsControlProps,
} from "@jsonforms/react";
import { Box, Button, Flex, Input, Paper, Stack, Tooltip } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { ComponentType, ReactNode } from "react";
import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import {
  AlertCategory,
  AlertMinimal,
  RemoraidButton,
  useRemoraidTheme,
} from "remoraid/core";
import { isEqual } from "lodash";

function PlainArrayControl(props: ControlProps): ReactNode {
  const theme = useRemoraidTheme();
  const { label, schema, data, handleChange, path, required } = props;
  const { formOptions } = useFormOptions();
  const { renderers, cells } = useJsonForms();

  // Helpers
  let schemaItems: JsonSchema7;
  if (schema.items && !Array.isArray(schema.items)) {
    schemaItems = {
      type: "object",
      properties: {
        item: {
          ...(schema.items as JsonSchema7),
          title: "remoraid-array-item",
        },
      },
      required: ["item"],
    };
  } else {
    return (
      <AlertMinimal
        category={AlertCategory.Negative}
        title="Renderer missing"
        text={`Could not find applicable renderer for property '${label}'.`}
      />
    );
  }

  return (
    <>
      <Input.Wrapper
        label={label}
        description={
          formOptions.withDescriptions ? schema.description : undefined
        }
        withAsterisk={required}
      >
        <Paper
          withBorder={Array.isArray(data) && data.length > 0}
          shadow="0"
          bg="var(--remoraid-transparent-background)"
          p={Array.isArray(data) && data.length > 0 ? formOptions.gutter : 0}
          mt={
            formOptions.withDescriptions &&
            schema.description &&
            schema.description.length > 0
              ? 4
              : 0
          }
        >
          <Stack align="stretch" justify="flex-start" gap={formOptions.gutter}>
            {Array.isArray(data) ? (
              data.map((item, i) => {
                return (
                  <Flex
                    gap="xs"
                    justify="flex-start"
                    align="center"
                    direction="row"
                    wrap="nowrap"
                    key={i}
                  >
                    <Box flex={1}>
                      <JsonForms
                        schema={schemaItems}
                        data={{ item }}
                        renderers={renderers ?? []}
                        cells={cells ?? []}
                        onChange={({ data: newData }) => {
                          if (isEqual(data[i], newData.item)) {
                            return;
                          }
                          const dataCopy = [...data];
                          dataCopy[i] = newData.item;
                          handleChange(path, dataCopy);
                        }}
                        validationMode="NoValidation"
                      />
                    </Box>
                    <RemoraidButton
                      responsive={false}
                      collapsed
                      label="Delete item"
                      icon={IconTrash}
                      onClick={() => {
                        handleChange(
                          path,
                          data.filter((_, index) => index !== i)
                        );
                      }}
                      size="sm"
                    />
                  </Flex>
                );
              })
            ) : (
              <></>
            )}
            <Button
              variant="default"
              leftSection={<IconPlus {...theme.componentsProps.icons.medium} />}
              onClick={() => {
                let defaultValue: any = "";
                if (schemaItems.type === "string" && schemaItems.enum) {
                  if (schemaItems.enum.length > 0) {
                    defaultValue = schemaItems.enum[0];
                  }
                } else if (schemaItems.type === "string") {
                  defaultValue = "";
                } else if (schemaItems.type === "object") {
                  defaultValue = {};
                }
                handleChange(path, [...(data ?? []), defaultValue]);
              }}
            >
              Add Item
            </Button>
          </Stack>
        </Paper>
      </Input.Wrapper>
    </>
  );
}

const ArrayControl: ComponentType<OwnPropsOfControl> =
  withJsonFormsControlProps(PlainArrayControl);
export default ArrayControl;
