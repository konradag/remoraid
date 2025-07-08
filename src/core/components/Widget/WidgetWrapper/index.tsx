import { usePage } from "@/core/components/Page";
import { useRemoraidTheme } from "@/core/components/RemoraidProvider/ThemeProvider";
import { FrameLayoutSection, WidgetConfiguration } from "@/core/lib/types";
import {
  BoxProps,
  MantineSize,
  Paper,
  Transition,
  TransitionProps,
} from "@mantine/core";
import { PropsWithChildren, ReactNode, useEffect, useRef } from "react";
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
    container?: Partial<BoxProps>;
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controlsContainerRef = useRef<HTMLDivElement | null>(null);
  const handleEnter = () => {
    updateActiveWidget(config.widgetId);
  };
  const handleLeave = () => {
    updateActiveWidget(null);
  };
  let element = (
    <Transition
      mounted={page !== null && isWidgetSelected(page.pageId, config.widgetId)}
      transition="fade-left"
      duration={theme.transitionDurations.medium}
      timingFunction="ease"
      {...componentsProps?.transition}
    >
      {(transitionStyle) => (
        <Paper
          ref={containerRef}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          p="md"
          shadow="md"
          bg={theme.transparentBackground}
          mt={mt}
          pos="relative"
          h="fit-content"
          {...componentsProps?.container}
          style={merge(transitionStyle, componentsProps?.container?.style)}
          id={config.widgetId}
        >
          <Controls
            dragContainerRef={containerRef}
            groupRef={controlsContainerRef}
            mounted={withCloseButton && activeWidget === config.widgetId}
            {...componentsProps?.controls}
          >
            <ControlButton
              icon={IconX}
              tooltip="Hide widget"
              color="red"
              order={-200}
              {...componentsProps?.closeButton}
              onClick={(e) => {
                if (!page) {
                  return;
                }
                updateWidgetSelection(page.pageId, config.widgetId, false);
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
        controlsContainerRef={controlsContainerRef}
        {...componentsProps?.Pinnable}
        componentsProps={{
          ...componentsProps?.Pinnable?.componentsProps,
          // button: {
          //   ...componentsProps?.Pinnable?.componentsProps?.button,
          //   onClick: (e) => {
          //     const { clientX, clientY } = e;
          //     requestAnimationFrame(() => {
          //       if (!isPointInside(containerRef.current, clientX, clientY)) {
          //         handleLeave();
          //       }
          //     });
          //     componentsProps?.Pinnable?.componentsProps?.button?.onClick?.(e);
          //   },
          // },
          layoutElement: {
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
