import {
  Group,
  GroupProps,
  MantineSize,
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
import clsx from "clsx";

const layoutContext = createContext<LayoutContext<LayoutType.Frame> | null>(
  null
);

export const useFrameLayout = (): LayoutContext<LayoutType.Frame> | null => {
  return useContext(layoutContext);
};

export interface FrameLayoutProps {
  layoutId: string;
  includeScrollArea?: boolean;
  gutter?: MantineSize | number;
  componentsProps?: {
    horizontalContainer?: Partial<GroupProps>;
    verticalContainer?: Partial<StackProps>;
    sectionContainers?: {
      [FrameLayoutSection.Left]?: Partial<GroupProps>;
      [FrameLayoutSection.Right]?: Partial<GroupProps>;
      [FrameLayoutSection.Top]?: Partial<StackProps>;
      [FrameLayoutSection.Bottom]?: Partial<StackProps>;
      [FrameLayoutSection.Content]?: Partial<StackProps>;
    };
    ScrollArea?: Partial<ScrollAreaProps>;
  };
}

function FrameLayout({
  layoutId,
  includeScrollArea = true,
  gutter = 0,
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
      [FrameLayoutSection.Right]: null,
      [FrameLayoutSection.Top]: null,
      [FrameLayoutSection.Left]: null,
      [FrameLayoutSection.Content]: null,
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
  const topSectionRef = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        [FrameLayoutSection.Top]: n,
      }));
    },
    [setSections]
  );
  const bottomSectionRef = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        [FrameLayoutSection.Bottom]: n,
      }));
    },
    [setSections]
  );
  const leftSectionRef = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        [FrameLayoutSection.Left]: n,
      }));
    },
    [setSections]
  );
  const rightSectionRef = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        [FrameLayoutSection.Right]: n,
      }));
    },
    [setSections]
  );
  const contentSectionRef = useCallback(
    (n: HTMLDivElement | null) => {
      setSections((prev) => ({
        ...prev,
        [FrameLayoutSection.Content]: n,
      }));
    },
    [setSections]
  );
  const contentSection = (
    <Stack
      ref={contentSectionRef}
      h="100%"
      gap={gutter}
      flex={1}
      {...componentsProps?.sectionContainers?.[FrameLayoutSection.Content]}
      className={clsx(
        "remoraid-frame-layout-section",
        "remoraid-frame-layout-content-section",
        componentsProps?.sectionContainers?.[FrameLayoutSection.Content]
          ?.className
      )}
    >
      {children}
    </Stack>
  );
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
        style={{
          "--remoraid-frame-layout-gutter":
            typeof gutter === "string"
              ? `var(--mantine-spacing-${gutter})`
              : `${gutter}px`,
        }}
        className={clsx(
          "remoraid-frame-layout",
          componentsProps?.horizontalContainer?.className
        )}
      >
        <Group
          ref={leftSectionRef}
          h="100%"
          wrap="nowrap"
          gap={gutter}
          pr={0}
          {...componentsProps?.sectionContainers?.[FrameLayoutSection.Left]}
          className={clsx(
            "remoraid-frame-layout-section",
            componentsProps?.sectionContainers?.[FrameLayoutSection.Left]
              ?.className
          )}
        />
        <Stack
          h="100%"
          flex={1}
          gap={0}
          {...componentsProps?.verticalContainer}
        >
          <Stack
            ref={topSectionRef}
            gap={gutter}
            flex={0}
            {...componentsProps?.sectionContainers?.[FrameLayoutSection.Top]}
            className={clsx(
              "remoraid-frame-layout-section",
              "remoraid-frame-layout-top-section",
              componentsProps?.sectionContainers?.[FrameLayoutSection.Top]
                ?.className
            )}
          />
          {includeScrollArea ? (
            <ScrollArea
              flex={1}
              {...theme.scrollAreaProps}
              {...componentsProps?.ScrollArea}
            >
              {contentSection}
            </ScrollArea>
          ) : (
            contentSection
          )}
          <Stack
            ref={bottomSectionRef}
            gap={gutter}
            flex={0}
            {...componentsProps?.sectionContainers?.[FrameLayoutSection.Bottom]}
            className={clsx(
              "remoraid-frame-layout-section",
              "remoraid-frame-layout-bottom-section",
              componentsProps?.sectionContainers?.[FrameLayoutSection.Bottom]
                ?.className
            )}
          />
        </Stack>
        <Group
          ref={rightSectionRef}
          h="100%"
          gap={gutter}
          pl={0}
          wrap="nowrap"
          {...componentsProps?.sectionContainers?.[FrameLayoutSection.Right]}
          className={clsx(
            "remoraid-frame-layout-section",
            componentsProps?.sectionContainers?.[FrameLayoutSection.Right]
              ?.className
          )}
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
