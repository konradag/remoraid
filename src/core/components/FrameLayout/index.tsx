import {
  Box,
  BoxProps,
  Group,
  GroupProps,
  ScrollArea,
  ScrollAreaProps,
  Stack,
  StackProps,
} from "@mantine/core";
import {
  ComponentProps,
  createContext,
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import ElementComponent from "./Element";
import {
  FrameLayoutSection,
  FrameLayoutVariant,
  LayoutContext,
  LayoutType,
} from "@/core/lib/types";
import { useLayouts } from "../RemoraidProvider/LayoutsProvider";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { Optional } from "@/core/lib/utils";

export type DefaultFrameLayoutVariant = FrameLayoutVariant.Sticky;

const layoutContext = createContext<LayoutContext<LayoutType.Frame> | null>(
  null
);

export const useFrameLayout = (): LayoutContext<LayoutType.Frame> | null => {
  return useContext(layoutContext);
};

export interface FrameLayoutPropsWithExplicitVariant<
  T extends FrameLayoutVariant
> {
  variant: T;
  layoutId: string;
  componentsProps?: {
    childrenContainer?: T extends FrameLayoutVariant.Plain
      ? Partial<BoxProps>
      : T extends FrameLayoutVariant.Sticky
      ? Partial<ScrollAreaProps>
      : never;
    horizontalContainer?: Partial<GroupProps>;
    verticalContainer?: Partial<StackProps>;
    sectionContainers?: {
      [FrameLayoutSection.Left]?: Partial<GroupProps>;
      [FrameLayoutSection.Right]?: Partial<GroupProps>;
      [FrameLayoutSection.Top]?: Partial<StackProps>;
      [FrameLayoutSection.Bottom]?: Partial<StackProps>;
    };
  };
}

export type FrameLayoutProps<
  T extends FrameLayoutVariant = DefaultFrameLayoutVariant
> = T extends DefaultFrameLayoutVariant
  ? Optional<FrameLayoutPropsWithExplicitVariant<T>, "variant">
  : FrameLayoutPropsWithExplicitVariant<T>;

function FrameLayout<T extends FrameLayoutVariant = DefaultFrameLayoutVariant>({
  variant: variantProp,
  layoutId,
  componentsProps,
  children,
}: PropsWithChildren<FrameLayoutProps<T>>): ReactNode {
  // Props default values
  const variant =
    variantProp ??
    (FrameLayoutVariant.Sticky satisfies DefaultFrameLayoutVariant);

  // Contexts
  const theme = useRemoraidTheme();
  const { layouts, setLayouts } = useLayouts();

  // Helpers
  const layout = layouts[layoutId];
  const defaultSections: LayoutContext<LayoutType.Frame>["sections"] = {
    [FrameLayoutSection.Bottom]: null,
    [FrameLayoutSection.Top]: null,
    [FrameLayoutSection.Left]: null,
    [FrameLayoutSection.Right]: null,
  };
  const setSections: Dispatch<
    SetStateAction<LayoutContext<LayoutType.Frame>["sections"]>
  > = (value) => {
    setLayouts((prev) => ({
      ...prev,
      [layoutId]: {
        type: LayoutType.Frame,
        sections:
          typeof value === "function"
            ? value(prev[layoutId]?.sections ?? defaultSections)
            : value,
      },
    }));
  };
  const topSection = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        sections: { ...prev, [FrameLayoutSection.Top]: n },
      }));
    },
    [setSections]
  );
  const bottomSection = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        sections: { ...prev, [FrameLayoutSection.Bottom]: n },
      }));
    },
    [setSections]
  );
  const leftSection = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        sections: { ...prev, [FrameLayoutSection.Left]: n },
      }));
    },
    [setSections]
  );
  const rightSection = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        sections: { ...prev, [FrameLayoutSection.Right]: n },
      }));
    },
    [setSections]
  );
  let contentSection: ReactNode = children;
  const childrenContainerProps = {
    flex: 1,
    ...componentsProps?.childrenContainer,
  };
  if (variant === FrameLayoutVariant.Plain) {
    contentSection = <Box {...childrenContainerProps}>{contentSection}</Box>;
  } else if (variant === FrameLayoutVariant.Sticky) {
    contentSection = (
      <ScrollArea {...theme.scrollAreaProps} {...childrenContainerProps}>
        {children}
      </ScrollArea>
    );
  }

  return (
    <layoutContext.Provider
      value={{
        type: LayoutType.Frame,
        sections: defaultSections,
        ...layout,
        layoutId,
      }}
    >
      <Group
        gap={0}
        h="100%"
        w="100%"
        wrap="nowrap"
        {...componentsProps?.horizontalContainer}
      >
        <Group
          ref={leftSection}
          h="100%"
          gap={0}
          wrap="nowrap"
          {...componentsProps?.sectionContainers?.[FrameLayoutSection.Left]}
        />
        <Stack
          h="100%"
          flex={1}
          gap={0}
          {...componentsProps?.verticalContainer}
        >
          <Stack
            h="100%"
            ref={topSection}
            gap={0}
            flex={0}
            {...componentsProps?.sectionContainers?.[FrameLayoutSection.Top]}
          />
          {contentSection}
          <Stack
            h="100%"
            ref={bottomSection}
            gap={0}
            flex={0}
            {...componentsProps?.sectionContainers?.[FrameLayoutSection.Bottom]}
          />
        </Stack>
        <Group
          gap={0}
          ref={rightSection}
          h="100%"
          wrap="nowrap"
          {...componentsProps?.sectionContainers?.[FrameLayoutSection.Right]}
        />
      </Group>
    </layoutContext.Provider>
  );
}

export interface FrameLayout {
  <T extends FrameLayoutVariant = DefaultFrameLayoutVariant>(
    props: ComponentProps<typeof FrameLayout<T>>
  ): ReactNode;
  Element: typeof ElementComponent;
}
export default Object.assign(FrameLayout, {
  Element: ElementComponent,
}) as FrameLayout;
