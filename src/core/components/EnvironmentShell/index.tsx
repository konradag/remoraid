import { Alert, ContainerProps, MantineSize } from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import PageContainer from "../Page/PageContainer";

export interface EnvironmentShellProps {
  environment: Record<string, string | undefined>;
  message?: string;
  m?: MantineSize | number;
  mt?: MantineSize | number;
  withContainer?: boolean;
  componentsProps?: {
    container?: ContainerProps;
  };
}

export default function EnvironmentShell({
  children,
  environment,
  message,
  m,
  mt,
  withContainer,
  componentsProps,
}: PropsWithChildren<EnvironmentShellProps>): ReactNode {
  // Style
  const theme = useRemoraidTheme();

  // Helpers
  const undefinedKeys = Object.keys(environment).filter(
    (key) => environment[key] === undefined
  );
  const alertTitle = `Please Specify Environment Variable${
    undefinedKeys.length > 1 ? "s" : ""
  }`;
  const alertMessage = `Components could not be rendered because the following environment variables are not specified: ${undefinedKeys.join(
    ", "
  )}.`;
  const alert = (
    <Alert {...theme.alertProps.neutral} title={alertTitle} m={m} mt={mt}>
      {message ?? alertMessage}
    </Alert>
  );

  if (undefinedKeys.length === 0) {
    return <>{children}</>;
  }
  if (withContainer) {
    return (
      <PageContainer
        componentsProps={{ container: componentsProps?.container }}
      >
        {alert}
      </PageContainer>
    );
  }
  return alert;
}
