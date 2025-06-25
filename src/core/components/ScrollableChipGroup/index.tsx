import {
  Chip,
  ChipGroupProps,
  Flex,
  FlexProps,
  MantineSize,
  ScrollArea,
  ScrollAreaProps,
} from "@mantine/core";
import { ReactNode } from "react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { PropsWithChildrenOfType } from "@/core/lib/utils";

export interface ScrollbleChipGroupProps {
  value: string[];
  onChange?: (value: string[]) => void;
  gap?: MantineSize | number;
  componentsProps?: {
    chipGroup?: Partial<ChipGroupProps<true>>;
    scrollArea?: Partial<ScrollAreaProps>;
    container?: Partial<FlexProps>;
  };
}

export default function ScrollableChipGroup({
  value,
  onChange,
  gap,
  componentsProps,
  children,
}: PropsWithChildrenOfType<typeof Chip, ScrollbleChipGroupProps>): ReactNode {
  const theme = useRemoraidTheme();

  return (
    <ScrollArea {...theme.scrollAreaProps} {...componentsProps?.scrollArea}>
      <Chip.Group
        value={value}
        onChange={onChange}
        {...componentsProps?.chipGroup}
        multiple
      >
        <Flex
          justify="flex-start"
          align="center"
          gap={gap ?? "xs"}
          h="auto"
          {...componentsProps?.container}
        >
          {children}
        </Flex>
      </Chip.Group>
    </ScrollArea>
  );
}
