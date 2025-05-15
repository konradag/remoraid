import { ReactNode } from "react";
import { ContextModalProps } from "@mantine/modals";
import { JsonInput, JsonInputProps } from "@mantine/core";

export interface JSONModalProps {
  content: string;
  componentsProps?: {
    jsonInput?: JsonInputProps;
  };
}

export default function JSONModal({
  innerProps,
}: ContextModalProps<JSONModalProps>): ReactNode {
  return (
    <>
      <JsonInput
        variant="filled"
        pt="md"
        value={innerProps.content}
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
