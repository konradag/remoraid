import {
  Alert,
  AlertProps,
  MantineSize,
  Transition,
  TransitionProps,
} from "@mantine/core";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { PropsWithChildren, ReactNode } from "react";
import { AlertCategory } from "@/core/lib/types";

export interface AlertMinimalProps {
  category: AlertCategory;
  title?: string;
  text?: string;
  onClose?: () => void;
  mounted?: boolean;
  mt?: MantineSize | number;
  mb?: MantineSize | number;
  componentsProps?: {
    alert?: AlertProps;
    transition?: Omit<TransitionProps, "mounted">;
  };
}

export const isAlertMinimalProps = (e: any): e is AlertMinimalProps => {
  if (typeof e !== "object") {
    return false;
  }
  if (!("category" in e)) {
    return false;
  }
  return true;
};

export default function AlertMinimal({
  children,
  title,
  category,
  text,
  onClose,
  mounted,
  mt,
  mb,
  componentsProps,
}: PropsWithChildren<AlertMinimalProps>): ReactNode {
  // Style
  const theme = useRemoraidTheme();

  return (
    <Transition
      mounted={mounted !== false}
      transition="fade"
      duration={theme.transitionDurations.short}
      timingFunction="ease"
      {...componentsProps?.transition}
    >
      {(transitionStyle) => (
        <Alert
          {...theme.alertProps[category]}
          title={title ?? theme.alertProps[category].title}
          withCloseButton={onClose !== undefined}
          onClose={onClose}
          mt={mt}
          mb={mb}
          {...componentsProps?.alert}
          style={{
            ...transitionStyle,
            ...(componentsProps?.alert?.style ??
              theme.alertProps[category].style),
          }}
        >
          {text}
          {children}
        </Alert>
      )}
    </Transition>
  );
}
