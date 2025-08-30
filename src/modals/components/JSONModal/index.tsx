import { ReactNode } from "react";
import { ContextModalProps } from "@mantine/modals";
import { JsonInput, JsonInputProps } from "@mantine/core";
import { InputWrapperScrollArea, useRemoraidTheme } from "remoraid/core";

export interface JSONModalProps {
  content: any;
  componentsProps?: {
    jsonInput?: JsonInputProps;
  };
}

export default function JSONModal({
  innerProps,
}: ContextModalProps<JSONModalProps>): ReactNode {
  const theme = useRemoraidTheme();

  // Helpers
  const stringValue =
    typeof innerProps.content === "string"
      ? innerProps.content
      : JSON.stringify(innerProps.content, null, theme.jsonStringifySpace);

  return (
    <InputWrapperScrollArea mah={575}>
      <JsonInput
        onChange={() => {}}
        value={stringValue}
        formatOnBlur
        autosize
        minRows={4}
        variant="unstyled"
        {...innerProps.componentsProps?.jsonInput}
      />
    </InputWrapperScrollArea>
  );
}
