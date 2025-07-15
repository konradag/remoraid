import {
  Chip,
  ChipGroupProps,
  Flex,
  FlexProps,
  MantineSize,
  ScrollArea,
  ScrollAreaProps,
} from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { merge } from "lodash";

export interface ScrollableChipGroupProps {
  value: string[];
  onChange?: (value: string[]) => void;
  gap?: MantineSize | number;
  componentsProps?: {
    chipGroup?: Partial<ChipGroupProps<true>>;
    container?: Partial<FlexProps>;
    ScrollArea?: Partial<ScrollAreaProps>;
  };
}

export default function ScrollableChipGroup({
  value,
  onChange,
  gap = "xs",
  componentsProps,
  children,
}: PropsWithChildren<ScrollableChipGroupProps>): ReactNode {
  // Contexts
  const theme = useRemoraidTheme();

  return (
    <ScrollArea
      {...merge(
        {},
        theme.componentsProps.ScrollArea,
        componentsProps?.ScrollArea
      )}
    >
      <Chip.Group
        value={value}
        onChange={onChange}
        {...componentsProps?.chipGroup}
        multiple
      >
        <Flex
          justify="flex-start"
          align="center"
          gap={gap}
          h="auto"
          {...componentsProps?.container}
        >
          {children}
        </Flex>
      </Chip.Group>
    </ScrollArea>
  );
}
