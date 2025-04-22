import { PropsWithChildren } from "react";

interface EnvironmentShellProps {
  vars: string[];
}

export default function EnvironmentShell({
  children,
  vars,
}: PropsWithChildren<EnvironmentShellProps>) {
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
        <p>
          Please specify in your &apos;.env&apos; file. See README for details.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}
