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
  FrameLayoutContext,
  FrameLayoutSection,
  FrameLayoutVariant,
  Layout,
  LayoutType,
} from "@/core/lib/types";
import { useLayouts } from "../RemoraidProvider/LayoutsProvider";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";

export const isFrameLayout = (
  layout: Layout<LayoutType>
): layout is Layout<LayoutType.Frame> => {
  if (typeof layout !== "object" || layout === null) {
    return false;
  }
  if (!("sections" in layout)) {
    return false;
  }
  if (typeof layout.sections !== "object" || layout.sections === null) {
    return false;
  }
  return true;
};

export const defaultFrameLayoutContext: FrameLayoutContext = {
  layoutId: null,
  layout: {
    sections: {
      [FrameLayoutSection.Top]: null,
      [FrameLayoutSection.Bottom]: null,
      [FrameLayoutSection.Left]: null,
      [FrameLayoutSection.Right]: null,
    },
  },
  setLayout: () => {},
};

const layoutContext = createContext<FrameLayoutContext>(
  defaultFrameLayoutContext
);

export const useFrameLayout = (): FrameLayoutContext => {
  return useContext(layoutContext);
};

export interface FrameLayoutProps<T extends FrameLayoutVariant> {
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

function FrameLayout<T extends FrameLayoutVariant = FrameLayoutVariant.Sticky>({
  variant,
  layoutId,
  componentsProps,
  children,
}: PropsWithChildren<FrameLayoutProps<T>>): ReactNode {
  const theme = useRemoraidTheme();
  const { layouts, setLayouts } = useLayouts();

  // Helpers
  const layout = layouts[layoutId];
  const setLayout: Dispatch<SetStateAction<Layout<LayoutType.Frame>>> =
    useMemo(() => {
      return (value) => {
        setLayouts((prev) => ({
          ...prev,
          [layoutId]:
            typeof value === "function" ? value(prev[layoutId]) : value,
        }));
      };
    }, [layoutId, setLayouts]);
  const topSection = useCallback(
    (n: HTMLDivElement | null) => {
      setLayout((prev) => ({
        ...prev,
        sections: { ...prev?.sections, [FrameLayoutSection.Top]: n },
      }));
    },
    [setLayout]
  );
  const bottomSection = useCallback(
    (n: HTMLDivElement | null) => {
      setLayout((prev) => ({
        ...prev,
        sections: { ...prev?.sections, [FrameLayoutSection.Bottom]: n },
      }));
    },
    [setLayout]
  );
  const leftSection = useCallback(
    (n: HTMLDivElement | null) => {
      setLayout((prev) => ({
        ...prev,
        sections: { ...prev?.sections, [FrameLayoutSection.Left]: n },
      }));
    },
    [setLayout]
  );
  const rightSection = useCallback(
    (n: HTMLDivElement | null) => {
      setLayout((prev) => ({
        ...prev,
        sections: { ...prev?.sections, [FrameLayoutSection.Right]: n },
      }));
    },
    [setLayout]
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
    <layoutContext.Provider value={{ layoutId, layout, setLayout }}>
      <Group gap={0} {...componentsProps?.horizontalContainer}>
        <Group
          ref={leftSection}
          h="100%"
          gap={0}
          {...componentsProps?.sectionContainers?.[FrameLayoutSection.Left]}
        />
        <Stack
          h="100%"
          flex={1}
          gap={0}
          {...componentsProps?.verticalContainer}
        >
          <Stack
            ref={topSection}
            gap={0}
            {...componentsProps?.sectionContainers?.[FrameLayoutSection.Top]}
          />
          {contentSection}
          <Stack
            ref={bottomSection}
            gap={0}
            {...componentsProps?.sectionContainers?.[FrameLayoutSection.Bottom]}
          />
        </Stack>
        <Group
          gap={0}
          ref={rightSection}
          h="100%"
          {...componentsProps?.sectionContainers?.[FrameLayoutSection.Right]}
        />
      </Group>
    </layoutContext.Provider>
  );
}

export interface FrameLayout
  extends React.FC<PropsWithChildren<FrameLayoutProps<FrameLayoutVariant>>> {
  Element: typeof ElementComponent;
}
export default Object.assign(FrameLayout, {
  Element: ElementComponent,
}) as FrameLayout;
