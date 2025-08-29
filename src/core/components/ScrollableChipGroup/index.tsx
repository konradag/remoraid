import {
  Chip,
  ChipGroupProps,
  Flex,
  FlexProps,
  MantineSize,
  ScrollArea,
  ScrollAreaProps,
} from "@mantine/core";
import { PropsWithChildren, ReactNode, RefObject } from "react";

export interface ScrollableChipGroupProps {
  value: string[];
  ref?: RefObject<HTMLDivElement | null>;
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
  ref,
  onChange,
  gap = "xs",
  componentsProps,
  children,
}: PropsWithChildren<ScrollableChipGroupProps>): ReactNode {
  return (
    <ScrollArea
      ref={ref}
      {...componentsProps?.ScrollArea}
      style={{ contain: "inline-size", ...componentsProps?.ScrollArea?.style }}
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
