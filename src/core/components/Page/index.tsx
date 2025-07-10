import { ContainerProps, Stack, StackProps } from "@mantine/core";
import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { PageConfiguration } from "@/core/lib/types";
import { useWidgets } from "../RemoraidProvider/WidgetsProvider";
import PageContainer, { PageContainerProps } from "./PageContainer";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import clsx from "clsx";

const pageContext = React.createContext<PageConfiguration | null>(null);

export const usePage = (): PageConfiguration | null => {
  return useContext(pageContext);
};

export interface PageProps {
  name?: string;
  config?: Partial<Omit<PageConfiguration, "name">>;
  gap?: StackProps["gap"];
  componentsProps?: {
    container?: ContainerProps;
    PageContainer: Partial<PageContainerProps>;
    Stack?: Partial<StackProps>;
  };
}

export default function Page({
  children,
  name,
  config,
  gap,
  componentsProps,
}: PropsWithChildren<PageProps>): ReactNode {
  // Contexts
  const theme = useRemoraidTheme();
  const pathname = usePathname();
  const { isPageRegistered, registerPage } = useWidgets();

  // Helpers
  const pageId = config?.pageId ?? pathname;

  // Effects
  useEffect(() => {
    if (!isPageRegistered(pageId)) {
      if (config?.registerPageDirectly) {
        registerPage(pageId, []);
      }
    }
  }, []);

  return (
    <pageContext.Provider value={{ name: name ?? pathname, pageId, ...config }}>
      <PageContainer {...componentsProps?.PageContainer}>
        <Stack
          gap={gap ?? theme.primaryGutter}
          {...componentsProps?.Stack}
          className={clsx("remoraid-page", componentsProps?.Stack?.className)}
        >
          {children}
        </Stack>
      </PageContainer>
    </pageContext.Provider>
  );
}
