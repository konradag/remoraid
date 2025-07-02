import { usePage } from "@/core/components/Page";
import { useRemoraidTheme } from "@/core/components/RemoraidProvider/ThemeProvider";
import { FrameLayoutSection, WidgetConfiguration } from "@/core/lib/types";
import {
  Box,
  Group,
  GroupProps,
  MantineSize,
  Paper,
  PaperProps,
  Transition,
  TransitionProps,
} from "@mantine/core";
import {
  ComponentProps,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { useWidgets } from "../../RemoraidProvider/WidgetsProvider";
import ControlButton from "../../ControlButton";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import Pinnable, { PinnableProps } from "../../Pinnable";

export interface WidgetWrapperProps {
  config: WidgetConfiguration;
  mt?: MantineSize | number;
  withCloseButton?: boolean;
  pinnableSection?: Exclude<FrameLayoutSection, FrameLayoutSection.Content>;
  componentsProps?: {
    container?: Partial<ComponentProps<typeof Box<"div">>>;
    transition?: Partial<Omit<TransitionProps, "mounted">>;
    controlsContainer?: Partial<GroupProps>;
    Paper?: Partial<PaperProps>;
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
  let element = (
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
          {...componentsProps?.Paper}
          style={{
            ...transitionStyle,
            ...componentsProps?.Paper?.style,
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
  if (pinnableSection !== undefined) {
    element = (
      <Pinnable
        section={pinnableSection}
        controlsContainer={controlsContainer}
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

  return (
    <Box
      {...componentsProps?.container}
      onMouseEnter={(e) => {
        updateActiveWidget(config.widgetId);
        if (componentsProps?.container?.onMouseEnter) {
          componentsProps.container.onMouseEnter(e);
        }
      }}
      onMouseLeave={(e) => {
        updateActiveWidget(null);
        if (componentsProps?.container?.onMouseLeave) {
          componentsProps.container.onMouseLeave(e);
        }
      }}
    >
      {element}
    </Box>
  );
}
