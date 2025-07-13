import { Alert, AlertProps, Transition, TransitionProps } from "@mantine/core";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { PropsWithChildren, ReactNode } from "react";
import { AlertCategory, RemoraidIconSize } from "@/core/lib/types";
import { Icon, IconProps } from "@tabler/icons-react";
import { merge } from "lodash";

export interface AlertMinimalProps {
  category: AlertCategory;
  title?: AlertProps["title"];
  color?: AlertProps["color"];
  onClose?: AlertProps["onClose"];
  text?: string;
  icon?: Icon;
  iconSize?: RemoraidIconSize;
  mounted?: TransitionProps["mounted"];
  componentsProps?: {
    icon?: Partial<IconProps>;
    alert?: Partial<AlertProps>;
    transition?: Omit<TransitionProps, "mounted">;
  };
}

export default function AlertMinimal({
  category,
  children,
  ...props
}: PropsWithChildren<AlertMinimalProps>): ReactNode {
  // Contexts
  const theme = useRemoraidTheme();

  // Props default values
  const {
    title,
    text,
    color,
    onClose,
    mounted = true,
    icon: Icon,
    iconSize = RemoraidIconSize.Medium,
    componentsProps,
  } = merge(theme.componentsProps.alerts[category], props);

  return (
    <Transition
      mounted={mounted}
      transition="fade"
      duration={theme.transitionDurations.short}
      timingFunction="ease"
      {...componentsProps?.transition}
    >
      {(transitionStyle) => (
        <Alert
          title={title}
          color={color}
          variant="light"
          onClose={onClose}
          withCloseButton={onClose !== undefined}
          icon={
            Icon ? (
              <Icon
                {...merge(
                  theme.componentsProps.icons[iconSize],
                  componentsProps?.icon
                )}
              />
            ) : undefined
          }
          style={merge(transitionStyle, componentsProps?.alert?.style)}
        >
          {text}
          {children}
        </Alert>
      )}
    </Transition>
  );
}
