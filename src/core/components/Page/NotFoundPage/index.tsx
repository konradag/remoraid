import React, { PropsWithChildren, ReactNode } from "react";
import Page, { PageProps } from "..";
import { Alert } from "@mantine/core";
import { useRemoraidTheme } from "@/core/components/RemoraidProvider/ThemeProvider";
import { usePathname } from "next/navigation";

export interface NotFoundPageProps {
  message?: string;
  componentsProps?: {
    page?: PageProps;
  };
}

export default function NotFoundPage({
  children,
  message,
  componentsProps,
}: PropsWithChildren<NotFoundPageProps>): ReactNode {
  const pathname = usePathname();

  // Style
  const theme = useRemoraidTheme();

  return (
    <Page name="Not Found" {...componentsProps?.page}>
      <Alert {...theme.alertProps.negative} title="404 - Page Not Found">
        {message ?? `Could not find page ${pathname}.`}
      </Alert>
      {children}
    </Page>
  );
}
