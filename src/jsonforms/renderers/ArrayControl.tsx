import { ControlProps, JsonSchema, OwnPropsOfControl } from "@jsonforms/core";
import {
  JsonForms,
  useJsonForms,
  withJsonFormsControlProps,
} from "@jsonforms/react";
import {
  ActionIcon,
  Button,
  Flex,
  Input,
  Paper,
  Stack,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { ComponentType, ReactNode, useState } from "react";
import { useFormOptions } from "@/jsonforms/components/FormOptionsProvider";
import { useRemoraidTheme } from "remoraid/core";

function PlainArrayControl(props: ControlProps): ReactNode {
  const mantineTheme = useMantineTheme();
  const theme = useRemoraidTheme();
  const { label, schema, data, handleChange, path, required } = props;
  const {
    formOptions: { withDescriptions },
  } = useFormOptions();
  const { renderers, cells } = useJsonForms();

  // State
  const [isHoveringDelete, setIsHoveringDelete] = useState<number | null>(null);

  // Helpers
  let schemaItems: JsonSchema;
  if (schema.items && !Array.isArray(schema.items)) {
    schemaItems = schema.items;
  } else {
    return <>No applicable renderer found for '{label}'.</>;
  }

  return (
    <>
      <Input.Wrapper
        label={label}
        description={withDescriptions ? schema.description : undefined}
        withAsterisk={required}
      >
        <Paper
          withBorder={Array.isArray(data) && data.length > 0}
          shadow="0"
          p={Array.isArray(data) && data.length > 0 ? "sm" : 0}
          mt={
            withDescriptions &&
            schema.description &&
            schema.description.length > 0
              ? 4
              : 0
          }
        >
          <Stack align="stretch" justify="flex-start" gap="sm">
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
                    <Paper
                      p={schemaItems.type === "object" ? "sm" : 0}
                      withBorder={schemaItems.type === "object"}
                      style={{
                        borderColor:
                          isHoveringDelete === i
                            ? mantineTheme.colors.red[6]
                            : undefined,
                      }}
                      flex={1}
                    >
                      <JsonForms
                        schema={{
                          ...schemaItems,
                          $schema: undefined,
                        }}
                        data={item}
                        renderers={renderers ?? []}
                        cells={cells ?? []}
                        onChange={({ data: newData }) => {
                          const dataCopy = [...data];
                          dataCopy[i] = newData;
                          handleChange(path, dataCopy);
                        }}
                        validationMode="NoValidation"
                      />
                    </Paper>
                    <Tooltip label="Delete Item">
                      <ActionIcon
                        variant="default"
                        onClick={() => {
                          const dataCopy = [...data];
                          dataCopy.splice(i, 1);
                          handleChange(path, dataCopy);
                          setIsHoveringDelete(null);
                        }}
                        size="input-sm"
                        aria-label="Delete Item"
                        onMouseEnter={() => {
                          setIsHoveringDelete(i);
                        }}
                        onMouseLeave={() => {
                          setIsHoveringDelete(null);
                        }}
                      >
                        <IconTrash {...theme.componentsProps.icons.medium} />
                      </ActionIcon>
                    </Tooltip>
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
                handleChange(path, [...(data || []), defaultValue]);
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
