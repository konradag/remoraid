import { Alert, MantineSize } from "@mantine/core";
import { PropsWithChildren } from "react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";

export interface EnvironmentShellProps {
  vars: string[];
  message?: string;
  m?: MantineSize | number;
  mt?: MantineSize | number;
}

export default function EnvironmentShell({
  children,
  vars,
  message,
  m,
  mt,
}: PropsWithChildren<EnvironmentShellProps>) {
  // Style
  const theme = useRemoraidTheme();

  // Helpers
  const missingVars = vars.filter((v) => !process.env[v]);

  if (missingVars.length !== 0) {
    return (
      <Alert
        {...theme.alertProps.neutral}
        title={`Please Specify Environment Variable${
          missingVars.length > 1 ? "s" : ""
        }`}
        m={m}
        mt={mt}
      >
        {message ??
          `
        Components could not be rendered because the following environment
        variables are not specified: ${missingVars.join(", ")}.
      `}
      </Alert>
    );
  }
  return <>{children}</>;
}
