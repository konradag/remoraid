import {
  Box,
  Chip,
  Divider,
  Flex,
  FlexProps,
  Menu,
  MenuProps,
  Text,
  TextProps,
} from "@mantine/core";
import { useWidgets } from "@/core/components/RemoraidProvider/WidgetsProvider";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { usePage } from "../Page";
import { IconCheck, IconFocus, IconNavigation } from "@tabler/icons-react";
import { ReactNode, useState } from "react";
import ScrollableChipGroup, {
  ScrollableChipGroupProps,
} from "../ScrollableChipGroup";
import { InvalidComponentUsageError } from "@/core/lib/errors";
import { merge } from "lodash";
import { FrameLayoutSection } from "@/core/lib/types";
import Pinnable, { PinnableProps } from "../Pinnable";
import clsx from "clsx";

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
  const theme = useRemoraidTheme();
  const { isPageRegistered, updateWidgetSelectionBulk, ...widgetsContext } =
    useWidgets();
  const page = usePage();
  if (!page) {
    throw new InvalidComponentUsageError(
      "WidgetSelectionHeader",
      "must be used as child of 'Page'."
    );
  }

  // State
  const [hover, setHover] = useState<boolean>(false);

  // Helpers
  const handleEnter = () => {
    setHover(true);
  };
  const handleLeave = () => {
    setHover(false);
  };
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
                {...merge(
                  {},
                  theme.componentsProps.Menu,
                  { trigger: "hover" },
                  componentsProps?.widgetMenu
                )}
              >
                <Menu.Target>
                  <Box>
                    <Chip
                      value={widgetId}
                      size="sm"
                      disabled={disabledWidgets?.includes(widgetId)}
                      icon={
                        <IconCheck {...theme.componentsProps.icons.small} />
                      }
                    >
                      {widget.name}
                    </Chip>
                  </Box>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Widget menu</Menu.Label>
                  <Menu.Item
                    leftSection={
                      <IconNavigation {...theme.componentsProps.icons.small} />
                    }
                    onClick={() => {
                      const widgetElement = document.getElementById(widgetId);
                      if (!widgetElement) {
                        return;
                      }
                      widgetElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
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
