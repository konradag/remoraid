import {
  Box,
  BoxProps,
  Input,
  InputWrapperProps,
  Paper,
  ScrollArea,
  ScrollAreaProps,
} from "@mantine/core";
import { PropsWithChildren, ReactNode, useState } from "react";
import { useRemoraidTheme } from "remoraid/core";

export interface InputWrapperScrollAreaProps {
  label: string;
  mah?: number;
  error?: ReactNode;
  componentsProps?: {
    container?: Partial<InputWrapperProps>;
    ScrollArea?: Partial<ScrollAreaProps>;
    childrenContainer?: Partial<BoxProps>;
  };
}

export default function InputWrapperScrollArea({
  children,
  label,
  mah,
  error,
  componentsProps,
}: PropsWithChildren<InputWrapperScrollAreaProps>): ReactNode {
  // Style
  const theme = useRemoraidTheme();

  // State
  const [isHovering, setIsHovering] = useState<boolean>(false);

  return (
    <Input.Wrapper
      label={label}
      error={error}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...componentsProps?.container}
    >
      <Paper
        shadow="none"
        p={0}
        withBorder
        display="flex"
        bg={theme.transparentBackground}
        style={{
          transition: "border-color .1s",
          borderColor: error
            ? "var(--mantine-color-error)"
            : isHovering
            ? "var(--mantine-primary-color-filled)"
            : undefined,
        }}
      >
        <ScrollArea mah={mah} px="md" flex={1} {...componentsProps?.ScrollArea}>
          <Box {...componentsProps?.childrenContainer}>{children}</Box>
        </ScrollArea>
      </Paper>
    </Input.Wrapper>
  );
}
