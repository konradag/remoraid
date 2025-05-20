import { EnvironmentShellProps } from "@/core/components/EnvironmentShell";
import { PropsWithChildren, ReactNode } from "react";

export interface ServerEnvironmentShellProps extends EnvironmentShellProps {}

export default function EnvironmentShell({
  children,
  environment,
  message,
}: PropsWithChildren<ServerEnvironmentShellProps>): ReactNode {
  // Helpers
  const undefinedKeys = Object.keys(environment).filter(
    (key) => environment[key] === undefined
  );

  if (undefinedKeys.length === 0) {
    return <>{children}</>;
  }
  return (
    <div style={{ padding: 5 }}>
      <h1 style={{ fontWeight: 700 }}>
        Environment variable{undefinedKeys.length > 1 ? "s" : ""} missing:
      </h1>
      <ul style={{ margin: 5 }}>
        {undefinedKeys.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
      <p>Please specify in your &apos;.env&apos; file.</p>
      {message !== undefined && <p>message</p>}
    </div>
  );
}
