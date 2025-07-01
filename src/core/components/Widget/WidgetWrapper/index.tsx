import CloseButtonComponent from "@/core/components/Widget/WidgetWrapper/CloseButton";
import { usePage } from "@/core/components/Page";
import { useRemoraidTheme } from "@/core/components/RemoraidProvider/ThemeProvider";
import { WidgetConfiguration } from "@/core/lib/types";
import {
  MantineSize,
  Paper,
  PaperProps,
  Transition,
  TransitionProps,
} from "@mantine/core";
import { PropsWithChildren, ReactNode, useEffect } from "react";
import { useWidgets } from "../../RemoraidProvider/WidgetsProvider";

export interface WidgetWrapperComponentsProps {
  container?: Partial<Omit<PaperProps, "id">>;
  transition?: Partial<Omit<TransitionProps, "mounted">>;
}

export interface WidgetWrapperProps {
  config: WidgetConfiguration;
  mt?: MantineSize | number;
  withCloseButton?: boolean;
  componentsProps?: WidgetWrapperComponentsProps;
}

function WidgetWrapper({
  children,
  config,
  mt,
  withCloseButton,
  componentsProps,
}: PropsWithChildren<WidgetWrapperProps>): ReactNode {
  const {
    isWidgetSelected,
    isPageRegistered,
    isWidgetRegistered,
    registerWidget,
    updateActiveWidget,
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
          bg={theme.transparentBackground}
          mt={mt || 0}
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
          {withCloseButton !== false && (
            <CloseButtonComponent widgetId={config.widgetId} />
          )}
          {children}
        </Paper>
      )}
    </Transition>
  );
}

export interface WidgetWrapper
  extends React.FC<PropsWithChildren<WidgetWrapperProps>> {
  CloseButton: typeof CloseButtonComponent;
}
export default Object.assign(WidgetWrapper, {
  CloseButton: CloseButtonComponent,
}) as WidgetWrapper;
