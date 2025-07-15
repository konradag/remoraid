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
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { merge } from "lodash";

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
  // Contexts
  const theme = useRemoraidTheme();

  return (
    <ScrollArea
      ref={ref}
      {...merge(
        {},
        theme.componentsProps.ScrollArea,
        { style: { contain: "inline-size" } },
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
