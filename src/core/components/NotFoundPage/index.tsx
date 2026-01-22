import React, { PropsWithChildren, ReactNode } from "react";
import Page, { PageProps } from "../Page";
import AlertMinimal from "../AlertMinimal";
import { AlertCategory } from "@/core/lib/types";
import { useRemoraidRouter } from "../RemoraidProvider/RouterProvider";

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
  // Contexts
  const { pathname } = useRemoraidRouter();

  return (
    <Page name="Not Found" {...componentsProps?.page}>
      <AlertMinimal
        category={AlertCategory.Negative}
        title="404 - Page Not Found"
      >
        {message ?? `Could not find page ${pathname}.`}
      </AlertMinimal>
      {children}
    </Page>
  );
}
