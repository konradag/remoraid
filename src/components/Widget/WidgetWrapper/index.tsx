import CloseButton from "@/components/CloseButton";
import { useRemoraidTheme } from "@/components/RemoraidProvider/ThemeProvider";
import {
  useUpdateActiveWidget,
  useWidgetSelection,
} from "@/components/RemoraidProvider/WidgetsProvider";
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
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

export interface WidgetWrapperComponentsProps {
  container?: BoxProps;
  transition?: Omit<TransitionProps, "mounted">;
}

export interface WidgetWrapperProps {
  widgetId: string;
  mt?: MantineSize | number;
  withCloseButton?: boolean;
  componentsProps?: WidgetWrapperComponentsProps;
}

export default function WidgetWrapper({
  children,
  widgetId,
  mt,
  withCloseButton,
  componentsProps,
}: PropsWithChildren<WidgetWrapperProps>) {
  const { isWidgetSelected } = useWidgetSelection();
  const pathname = usePathname();
  const updateActiveWidget = useUpdateActiveWidget();

  // Style
  const theme = useRemoraidTheme();
  const mantineTheme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { transparentBackground } = getCustomStyles(mantineTheme, colorScheme);

  return (
    <Transition
      mounted={isWidgetSelected(pathname, widgetId)}
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
            updateActiveWidget(widgetId);
          }}
          onMouseLeave={() => {
            updateActiveWidget(null);
          }}
          {...componentsProps?.container}
        >
          {withCloseButton !== false && <CloseButton widgetId={widgetId} />}
          {children}
        </Paper>
      )}
    </Transition>
  );
}
