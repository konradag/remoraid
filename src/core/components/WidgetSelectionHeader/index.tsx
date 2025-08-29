import {
  Box,
  Chip,
  ChipProps,
  Divider,
  Flex,
  FlexProps,
  Menu,
  MenuProps,
  Text,
  TextProps,
  useMantineTheme,
} from "@mantine/core";
import { useWidgets } from "@/core/components/RemoraidProvider/WidgetsProvider";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { usePage } from "../Page";
import { IconCheck, IconFocus, IconNavigation } from "@tabler/icons-react";
import { ReactNode, useEffect, useRef, useState } from "react";
import ScrollableChipGroup, {
  ScrollableChipGroupProps,
} from "../ScrollableChipGroup";
import { InvalidComponentUsageError } from "@/core/lib/errors";
import { merge } from "lodash";
import { FrameLayoutSection } from "@/core/lib/types";
import Pinnable, { PinnableProps } from "../Pinnable";
import clsx from "clsx";
import { scrollToWidget } from "@/core/lib/utils";

export interface WidgetSelectionHeaderProps {
  title?: string;
  pinnableSection?: FrameLayoutSection.Top | FrameLayoutSection.Bottom | null;
  initiallyPinned?: boolean;
  disabledWidgets?: string[];
  componentsProps?: {
    container?: Partial<FlexProps>;
    widgetMenu?: Partial<MenuProps>;
    title?: Partial<TextProps>;
    ScrollableChipGroup?: Partial<ScrollableChipGroupProps>;
    Chip?: Partial<ChipProps>;
    Pinnable?: Partial<PinnableProps>;
  };
}

export default function WidgetSelectionHeader({
  title,
  pinnableSection = FrameLayoutSection.Top,
  initiallyPinned = true,
  disabledWidgets,
  componentsProps,
}: WidgetSelectionHeaderProps): ReactNode {
  // Contexts
  const theme = useRemoraidTheme();
  const mantineTheme = useMantineTheme();
  const {
    activeWidget,
    isPageRegistered,
    updateWidgetSelectionBulk,
    ...widgetsContext
  } = useWidgets();
  const page = usePage();
  if (!page) {
    throw new InvalidComponentUsageError(
      "WidgetSelectionHeader",
      "must be used as child of 'Page'."
    );
  }

  // State
  const [hover, setHover] = useState<boolean>(false);
  const [isPinned, setIsPinned] = useState<boolean>(initiallyPinned);

  // Helpers
  const handleEnter = () => {
    setHover(true);
  };
  const handleLeave = () => {
    setHover(false);
  };
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const widgets = widgetsContext.widgets[page.pageId] ?? {};
  const selectedWidgets = Object.entries(widgets).reduce(
    (t: string[], [widgetId, widget]) =>
      widget?.selected ? [...t, widgetId] : t,
    []
  );
  const element = (
    <Flex
      justify="flex-start"
      align="center"
      gap="md"
      {...componentsProps?.container}
      onMouseEnter={(e) => {
        if (!pinnableSection) {
          handleEnter();
        }
        componentsProps?.container?.onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        if (!pinnableSection) {
          handleEnter();
        }
        componentsProps?.container?.onMouseEnter?.(e);
      }}
      className={clsx(
        !pinnableSection ? "remoraid-non-widget-segment" : undefined,
        !pinnableSection ? "remoraid-segment" : undefined,
        componentsProps?.container?.className
      )}
    >
      <Text size="md" {...componentsProps?.title}>
        {title ?? page.name}
      </Text>
      <Divider orientation="vertical" />
      {isPageRegistered(page.pageId) && (
        <ScrollableChipGroup
          value={selectedWidgets}
          ref={scrollAreaRef}
          {...componentsProps?.ScrollableChipGroup}
          onChange={(value: string[]) => {
            updateWidgetSelectionBulk(page.pageId, value);
            componentsProps?.ScrollableChipGroup?.onChange?.(value);
          }}
          componentsProps={merge(
            { ScrollArea: { flex: 1 } },
            componentsProps?.ScrollableChipGroup?.componentsProps
          )}
        >
          {Object.entries(widgets).map(([widgetId, widget]) => {
            if (!widget) {
              return;
            }
            return (
              <Menu
                key={widgetId}
                trigger="hover"
                {...componentsProps?.widgetMenu}
              >
                <Menu.Target>
                  <Box>
                    <Chip
                      variant={
                        selectedWidgets.includes(widgetId)
                          ? "filled"
                          : "outline"
                      }
                      color={
                        activeWidget === widgetId
                          ? mantineTheme.primaryColor
                          : "gray"
                      }
                      value={widgetId}
                      size="sm"
                      disabled={disabledWidgets?.includes(widgetId)}
                      icon={
                        <IconCheck {...theme.componentsProps.icons.small} />
                      }
                      {...componentsProps?.Chip}
                      styles={merge(
                        {
                          label: {
                            transition:
                              "background-color var(--remoraid-transition-duration-short)",
                          },
                        },
                        componentsProps?.Chip?.styles
                      )}
                      id={`remoraid-widget-selection-header-chip-${widgetId}`}
                    >
                      {widget.name}
                    </Chip>
                  </Box>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={
                      <IconNavigation {...theme.componentsProps.icons.small} />
                    }
                    onClick={() => {
                      scrollToWidget(widgetId);
                      handleLeave();
                    }}
                    disabled={!widget.selected}
                  >
                    Scroll to widget
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <IconFocus {...theme.componentsProps.icons.small} />
                    }
                    onClick={() => {
                      updateWidgetSelectionBulk(page.pageId, [widgetId]);
                      handleLeave();
                    }}
                    disabled={
                      selectedWidgets.length === 1 &&
                      selectedWidgets.includes(widgetId)
                    }
                  >
                    Isolate widget
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            );
          })}
        </ScrollableChipGroup>
      )}
    </Flex>
  );

  // Effects
  useEffect(() => {
    if (!activeWidget) {
      return;
    }
    if (!isPinned) {
      return;
    }
    if (!scrollAreaRef?.current) {
      return;
    }
    const activeWidgetChipElement = scrollAreaRef.current.querySelector(
      `#remoraid-widget-selection-header-chip-${activeWidget}`
    );
    if (!activeWidgetChipElement) {
      return;
    }
    activeWidgetChipElement.scrollIntoView({
      behavior: "smooth",
      inline: "center",
    });
  }, [activeWidget]);

  if (pinnableSection) {
    return (
      <Pinnable
        section={pinnableSection}
        initialValue={initiallyPinned}
        {...componentsProps?.Pinnable}
        componentsProps={{
          ...componentsProps?.Pinnable?.componentsProps,
          container: {
            ...componentsProps?.Pinnable?.componentsProps?.container,
            onMouseEnter: (e) => {
              handleEnter();
              componentsProps?.Pinnable?.componentsProps?.container?.onMouseEnter?.(
                e
              );
            },
            onMouseLeave: (e) => {
              handleLeave();
              componentsProps?.Pinnable?.componentsProps?.container?.onMouseLeave?.(
                e
              );
            },
            className: clsx(
              "remoraid-segment",
              "remoraid-non-widget-segment",
              componentsProps?.Pinnable?.componentsProps?.container?.className
            ),
          },
          button: {
            ...componentsProps?.Pinnable?.componentsProps?.button,
            onClick: (e) => {
              setIsPinned(!isPinned);
              handleLeave();
              componentsProps?.Pinnable?.componentsProps?.button?.onClick?.(e);
            },
          },
          layoutElement: {
            includeContainer: false,
            includePageContainer:
              pinnableSection === FrameLayoutSection.Top ||
              pinnableSection === FrameLayoutSection.Bottom,
            ...componentsProps?.Pinnable?.componentsProps?.layoutElement,
          },
          controls: {
            mounted: hover,
            ...componentsProps?.Pinnable?.componentsProps?.controls,
          },
        }}
      >
        {element}
      </Pinnable>
    );
  }

  return element;
}
