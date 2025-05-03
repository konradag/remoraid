import CloseButton from "@/components/CloseButton";
import { usePage } from "@/components/Page";
import { useRemoraidTheme } from "@/components/RemoraidProvider/ThemeProvider";
import {
  useUpdateActiveWidget,
  useWidgetRegistration,
  useWidgetSelection,
} from "@/components/RemoraidProvider/WidgetsProvider";
import { WidgetConfiguration } from "@/lib/types";
import { getCustomStyles } from "@/lib/utils";
import {
  BoxProps,
  MantineSize,
  Paper,
  Transition,
  TransitionProps,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { PropsWithChildren, useEffect } from "react";

export interface WidgetWrapperComponentsProps {
  container?: BoxProps;
  transition?: Omit<TransitionProps, "mounted">;
}

export interface WidgetWrapperProps {
  config: WidgetConfiguration;
  mt?: MantineSize | number;
  withCloseButton?: boolean;
  componentsProps?: WidgetWrapperComponentsProps;
}

export default function WidgetWrapper({
  children,
  config,
  mt,
  withCloseButton,
  componentsProps,
}: PropsWithChildren<WidgetWrapperProps>) {
  const { isWidgetSelected } = useWidgetSelection();
  const { isPageRegistered, isWidgetRegistered, registerWidget } =
    useWidgetRegistration();
  const updateActiveWidget = useUpdateActiveWidget();
  const page = usePage();

  // Style
  const theme = useRemoraidTheme();
  const mantineTheme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground } = getCustomStyles(mantineTheme, colorScheme);

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

  return (
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
          bg={transparentBackground}
          mt={mt || 0}
          pos="relative"
          h="fit-content"
          style={transitionStyle}
          onMouseEnter={() => {
            updateActiveWidget(config.widgetId);
          }}
          onMouseLeave={() => {
            updateActiveWidget(null);
          }}
          {...componentsProps?.container}
        >
          {withCloseButton !== false && (
            <CloseButton widgetId={config.widgetId} />
          )}
          {children}
        </Paper>
      )}
    </Transition>
  );
}
