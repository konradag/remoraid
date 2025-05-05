import { PropsWithChildren } from "react";
import { EnvironmentShellProps } from "..";

interface ServerSideEnvironmentShellProps extends EnvironmentShellProps {}

export default function ServerSideEnvironmentShell({
  children,
  vars,
  message,
}: PropsWithChildren<ServerSideEnvironmentShellProps>) {
  // Helpers
  const missingVars = vars.filter((v) => !process.env[v]);

  if (missingVars.length !== 0) {
    return (
      <div style={{ padding: 5 }}>
        <h1 style={{ fontWeight: 700 }}>
          Environment variable{missingVars.length > 1 ? "s" : ""} missing:
        </h1>
        <ul style={{ margin: 5 }}>
          {missingVars.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
        <p>Please specify in your &apos;.env&apos; file.</p>
        {message !== undefined && <p>message</p>}
      </div>
    );
  }
  return <>{children}</>;
}
