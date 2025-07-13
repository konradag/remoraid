import { PropsWithChildren, ReactNode } from "react";
import AlertMinimal, { AlertMinimalProps } from "../AlertMinimal";
import { AlertCategory } from "@/core/lib/types";
import PageContainer, { PageContainerProps } from "../Page/PageContainer";

export enum EnvironmentShellVariant {
  Alert = "alert",
  Error = "error",
  Silent = "silent",
}

export interface EnvironmentShellProps {
  environment: Partial<Record<string, string | undefined>>;
  variant?: EnvironmentShellVariant;
  message?: string;
  includeAlertContainer?: boolean;
  componentsProps?: {
    alert: Partial<AlertMinimalProps>;
    alertContainer: Partial<PageContainerProps>;
  };
}

export default function EnvironmentShell({
  environment,
  variant = EnvironmentShellVariant.Alert,
  message,
  includeAlertContainer = false,
  componentsProps,
  children,
}: PropsWithChildren<EnvironmentShellProps>): ReactNode {
  // Helpers
  const undefinedKeys = Object.keys(environment).filter(
    (key) => environment[key] === undefined
  );
  const defaultMessage = `Components could not be rendered because the following environment variable${
    undefinedKeys.length > 1 ? "s" : ""
  } are not specified: ${undefinedKeys.join(", ")}.`;
  const alertElement = (
    <AlertMinimal
      mounted={undefinedKeys.length > 0}
      title={`Please specify environment variable${
        undefinedKeys.length > 1 ? "s" : ""
      }`}
      category={AlertCategory.Negative}
      text={message ?? defaultMessage}
      {...componentsProps?.alert}
    />
  );

  if (undefinedKeys.length === 0) {
    return children;
  }
  if (variant === EnvironmentShellVariant.Alert) {
    if (includeAlertContainer) {
      return (
        <PageContainer {...componentsProps?.alertContainer}>
          {alertElement}
        </PageContainer>
      );
    }
    return alertElement;
  }
  if (variant === EnvironmentShellVariant.Error) {
    throw new ReferenceError(message ?? defaultMessage);
  }
  return null;
}
