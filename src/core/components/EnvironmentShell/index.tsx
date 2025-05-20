import { Alert, MantineSize } from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";

export interface EnvironmentShellProps {
  environment: string | Record<string, string | undefined>;
  message?: string;
  m?: MantineSize | number;
  mt?: MantineSize | number;
}

export default function EnvironmentShell({
  children,
  environment,
  message,
  m,
  mt,
}: PropsWithChildren<EnvironmentShellProps>): ReactNode {
  // Style
  const theme = useRemoraidTheme();

  // Helpers
  let undefinedKeys: string[];
  if (typeof environment === "string") {
    undefinedKeys = process.env[environment] === undefined ? [environment] : [];
  } else {
    undefinedKeys = Object.keys(environment).filter(
      (key) => environment[key] === undefined
    );
  }

  if (undefinedKeys.length !== 0) {
    return (
      <Alert
        {...theme.alertProps.neutral}
        title={`Please Specify Environment Variable${
          undefinedKeys.length > 1 ? "s" : ""
        }`}
        m={m}
        mt={mt}
      >
        {message ??
          `
        Components could not be rendered because the following environment
        variables are not specified: ${undefinedKeys.join(", ")}.
      `}
      </Alert>
    );
  }
  return <>{children}</>;
}
