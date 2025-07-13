import { usePage } from "@/core/components/Page";
import { useRemoraidTheme } from "@/core/components/RemoraidProvider/ThemeProvider";
import { FrameLayoutSection, WidgetConfiguration } from "@/core/lib/types";
import { MantineSize, Paper, Transition, TransitionProps } from "@mantine/core";
import {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useWidgets } from "../../RemoraidProvider/WidgetsProvider";
import { IconX } from "@tabler/icons-react";
import Pinnable, { PinnableProps } from "../../Pinnable";
import { merge } from "lodash";
import Controls, { ControlsProps } from "../../Controls";
import ControlButton, {
  ControlButtonProps,
} from "../../Controls/ControlButton";

export interface WidgetWrapperProps {
  config: WidgetConfiguration;
  mt?: MantineSize | number;
  withCloseButton?: boolean;
  pinnableSection?: Exclude<FrameLayoutSection, FrameLayoutSection.Content>;
  componentsProps?: {
    container?: Partial<ComponentProps<typeof Paper<"div">>>;
    transition?: Partial<TransitionProps>;
    controls?: Partial<ControlsProps>;
    closeButton?: Partial<ControlButtonProps>;
    Pinnable?: Partial<PinnableProps>;
  };
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
    widgets,
    hideWidget,
    isPageRegistered,
    isWidgetRegistered,
    registerWidget,
    updateActiveWidget,
    updateWidgetSelection,
    activeWidget,
  } = useWidgets();
  const page = usePage();
  const theme = useRemoraidTheme();

  // State
  const [controlsContainer, setControlsContainer] =
    useState<HTMLDivElement | null>(null);

  // Helpers
  const widget = page ? widgets[page.pageId]?.[config.widgetId] : undefined;
  const pageRegistered: boolean = page ? isPageRegistered(page.pageId) : false;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsContainerRef = useCallback(
    (n: HTMLDivElement | null) => {
      setControlsContainer(n);
    },
    [setControlsContainer]
  );
  const handleEnter = () => {
    updateActiveWidget(config.widgetId);
  };
  const handleLeave = () => {
    updateActiveWidget(null);
  };
  let element = (
    <Transition
      mounted={Boolean(widget?.selected)}
      transition="fade-left"
      duration={theme.transitionDurations.medium}
      timingFunction="ease"
      {...componentsProps?.transition}
      onExited={() => {
        if (page) {
          hideWidget(page.pageId, config.widgetId);
        }
        componentsProps?.transition?.onExited?.();
      }}
    >
      {(transitionStyle) => (
        <Paper
          ref={containerRef}
          p="md"
          shadow="md"
          bg={theme.transparentBackground}
          mt={mt}
          pos="relative"
          h="fit-content"
          {...componentsProps?.container}
          onMouseEnter={(e) => {
            if (!pinnableSection) {
              handleEnter();
            }
            componentsProps?.container?.onMouseEnter?.(e);
          }}
          onMouseLeave={(e) => {
            if (!pinnableSection) {
              handleLeave();
            }
            componentsProps?.container?.onMouseLeave?.(e);
          }}
          style={merge(transitionStyle, componentsProps?.container?.style)}
          id={config.widgetId}
        >
          <Controls
            dragContainerRef={containerRef}
            groupRef={controlsContainerRef}
            mounted={activeWidget === config.widgetId}
            {...componentsProps?.controls}
          >
            <ControlButton
              mounted={withCloseButton}
              icon={IconX}
              tooltip="Hide widget"
              color="red"
              order={200}
              {...componentsProps?.closeButton}
              onClick={(e) => {
                if (!page) {
                  return;
                }
                updateWidgetSelection(page.pageId, config.widgetId, false);
                handleLeave();
                componentsProps?.closeButton?.onClick?.(e);
              }}
            />
          </Controls>
          {children}
        </Paper>
      )}
    </Transition>
  );
  if (pinnableSection !== undefined) {
    element = (
      <Pinnable
        section={pinnableSection}
        controlsContainer={controlsContainer}
        hidden={Boolean(widget?.hidden)}
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
        }}
      >
        {element}
      </Pinnable>
    );
  }

  // Effects
  useEffect(() => {
    if (!page) {
      return;
    }
    if (!isWidgetRegistered(page.pageId, config.widgetId)) {
      registerWidget(page.pageId, config);
    }
  }, [pageRegistered]);

  return element;
}
