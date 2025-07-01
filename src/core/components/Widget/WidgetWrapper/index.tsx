import { usePage } from "@/core/components/Page";
import { useRemoraidTheme } from "@/core/components/RemoraidProvider/ThemeProvider";
import { FrameLayoutSection, WidgetConfiguration } from "@/core/lib/types";
import {
  Group,
  GroupProps,
  MantineSize,
  Paper,
  PaperProps,
  Transition,
  TransitionProps,
} from "@mantine/core";
import { PropsWithChildren, ReactNode, useEffect, useRef } from "react";
import { useWidgets } from "../../RemoraidProvider/WidgetsProvider";
import ControlButton from "../../ControlButton";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import Pinnable, { PinnableProps } from "../../Pinnable";

export interface WidgetWrapperComponentsProps {
  container?: Partial<Omit<PaperProps, "id">>;
  transition?: Partial<Omit<TransitionProps, "mounted">>;
  controlsContainer?: Partial<GroupProps>;
  Pinnable?: Partial<PinnableProps>;
}

export interface WidgetWrapperProps {
  config: WidgetConfiguration;
  mt?: MantineSize | number;
  withCloseButton?: boolean;
  pinnableSection?: Exclude<FrameLayoutSection, FrameLayoutSection.Content>;
  componentsProps?: WidgetWrapperComponentsProps;
}

export default function WidgetWrapper({
  config,
  mt = 0,
  withCloseButton = true,
  pinnableSection,
  componentsProps,
  children,
}: PropsWithChildren<WidgetWrapperProps>): ReactNode {
  // Contexts
  const {
    isWidgetSelected,
    isPageRegistered,
    isWidgetRegistered,
    registerWidget,
    updateActiveWidget,
    updateWidgetSelection,
    activeWidget,
  } = useWidgets();
  const page = usePage();
  const theme = useRemoraidTheme();

  // Helpers
  const pageRegistered: boolean = page ? isPageRegistered(page.pageId) : false;

  // Effects
  useEffect(() => {
    if (!page) {
      return;
    }
    if (!isWidgetRegistered(page.pageId, config.widgetId)) {
      registerWidget(page.pageId, config);
    }
  }, [pageRegistered]);

  // Helpers
  const controlsContainer = useRef<HTMLDivElement | null>(null);
  const element = (
    <Transition
      mounted={page !== null && isWidgetSelected(page.pageId, config.widgetId)}
      transition="fade-left"
      duration={theme.transitionDurations.medium}
      timingFunction="ease"
    >
      {(transitionStyle) => (
        <Paper
          p="md"
          shadow="md"
          bg={theme.transparentBackground}
          mt={mt}
          pos="relative"
          h="fit-content"
          {...componentsProps?.container}
          style={{ ...transitionStyle, ...componentsProps?.container?.style }}
          onMouseEnter={() => {
            updateActiveWidget(config.widgetId);
          }}
          onMouseLeave={() => {
            updateActiveWidget(null);
          }}
          id={config.widgetId}
        >
          <Group
            ref={controlsContainer}
            gap="xs"
            {...componentsProps?.controlsContainer}
            className={clsx(
              "remoraid-controls",
              componentsProps?.controlsContainer?.className
            )}
          >
            <ControlButton
              icon={IconX}
              mounted={withCloseButton && activeWidget === config.widgetId}
              color="red"
              onClick={() => {
                if (!page) {
                  return;
                }
                updateWidgetSelection(page.pageId, config.widgetId, false);
              }}
            />
          </Group>
          {children}
        </Paper>
      )}
    </Transition>
  );

  if (pinnableSection !== undefined && controlsContainer.current) {
    return (
      <Pinnable
        section={pinnableSection}
        controlsContainer={controlsContainer.current ?? undefined}
        {...componentsProps?.Pinnable}
        componentsProps={{
          ...componentsProps?.Pinnable?.componentsProps,
          button: {
            ...componentsProps?.Pinnable?.componentsProps?.button,
            mounted: activeWidget === config.widgetId,
          },
        }}
      >
        {element}
      </Pinnable>
    );
  }
  return element;
}
