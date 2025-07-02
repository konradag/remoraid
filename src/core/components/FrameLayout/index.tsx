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
  useMemo,
} from "react";
import ElementComponent from "./Element";
import {
  FrameLayoutSection,
  LayoutContext,
  LayoutType,
} from "@/core/lib/types";
import { useLayouts } from "../RemoraidProvider/LayoutsProvider";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";

const layoutContext = createContext<LayoutContext<LayoutType.Frame> | null>(
  null
);

export const useFrameLayout = (): LayoutContext<LayoutType.Frame> | null => {
  return useContext(layoutContext);
};

export interface FrameLayoutProps {
  layoutId: string;
  includeScrollArea?: boolean;
  componentsProps?: {
    childrenContainer?: Partial<BoxProps>;
    horizontalContainer?: Partial<GroupProps>;
    verticalContainer?: Partial<StackProps>;
    sectionContainers?: {
      [FrameLayoutSection.Left]?: Partial<GroupProps>;
      [FrameLayoutSection.Right]?: Partial<GroupProps>;
      [FrameLayoutSection.Top]?: Partial<StackProps>;
      [FrameLayoutSection.Bottom]?: Partial<StackProps>;
    };
    ScrollArea?: Partial<ScrollAreaProps>;
  };
}

function FrameLayout({
  layoutId,
  includeScrollArea = true,
  componentsProps,
  children,
}: PropsWithChildren<FrameLayoutProps>): ReactNode {
  // Contexts
  const theme = useRemoraidTheme();
  const { layouts, setLayouts } = useLayouts();

  // Helpers
  const layout = layouts[layoutId];
  const defaultSections = useMemo(
    () => ({
      [FrameLayoutSection.Bottom]: null,
      [FrameLayoutSection.Top]: null,
      [FrameLayoutSection.Left]: null,
      [FrameLayoutSection.Right]: null,
    }),
    []
  );
  const setSections = useCallback<
    Dispatch<SetStateAction<LayoutContext<LayoutType.Frame>["sections"]>>
  >(
    (value) => {
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
    },
    [layoutId, setLayouts, defaultSections]
  );
  const topSection = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        [FrameLayoutSection.Top]: n,
      }));
    },
    [setSections]
  );
  const bottomSection = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        [FrameLayoutSection.Bottom]: n,
      }));
    },
    [setSections]
  );
  const leftSection = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        [FrameLayoutSection.Left]: n,
      }));
    },
    [setSections]
  );
  const rightSection = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        [FrameLayoutSection.Right]: n,
      }));
    },
    [setSections]
  );
  let contentSection: ReactNode = children;
  const childrenContainerProps = {
    flex: 1,
    ...componentsProps?.childrenContainer,
  };
  if (includeScrollArea) {
    contentSection = (
      <ScrollArea
        {...theme.scrollAreaProps}
        {...childrenContainerProps}
        {...componentsProps?.ScrollArea}
      >
        {children}
      </ScrollArea>
    );
  } else {
    contentSection = <Box {...childrenContainerProps}>{contentSection}</Box>;
  }
  const layoutContextValue = useMemo(
    () => ({
      type: LayoutType.Frame,
      sections: defaultSections,
      ...layout,
      layoutId,
    }),
    [layout?.sections, defaultSections, layoutId]
  );

  return (
    <layoutContext.Provider value={layoutContextValue}>
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

export interface FrameLayout
  extends React.FC<ComponentProps<typeof FrameLayout>> {
  Element: typeof ElementComponent;
}
export default Object.assign(FrameLayout, {
  Element: ElementComponent,
}) as FrameLayout;
