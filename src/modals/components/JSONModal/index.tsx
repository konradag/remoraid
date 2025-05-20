import { ReactNode } from "react";
import { ContextModalProps } from "@mantine/modals";
import { JsonInput, JsonInputProps } from "@mantine/core";
import { useRemoraidTheme } from "@/core";

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

  //Helpers
  const stringValue =
    typeof innerProps.content === "string"
      ? innerProps.content
      : JSON.stringify(innerProps.content, null, theme.jsonStringifySpace);

  return (
    <>
      <JsonInput
        variant="filled"
        value={stringValue}
        validationError="Invalid JSON"
        formatOnBlur
        autosize
        minRows={4}
        maxRows={24}
        {...innerProps.componentsProps?.jsonInput}
      />
    </>
  );
}
