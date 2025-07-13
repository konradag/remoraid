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
import { asChildrenOfType, PropsWithChildrenOfType } from "@/core/lib/utils";
import { merge } from "lodash";

export interface ScrollbleChipGroupProps {
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
  gap,
  componentsProps,
  children: childrenProp,
}: PropsWithChildrenOfType<typeof Chip, ScrollbleChipGroupProps>): ReactNode {
  // Type safety
  const children = asChildrenOfType(
    Chip,
    childrenProp,
    "Check children passed to 'ScrollableChipGroup' component."
  );

  // Contexts
  const theme = useRemoraidTheme();

  return (
    <ScrollArea
      {...merge(theme.componentsProps.ScrollArea, componentsProps?.ScrollArea)}
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
