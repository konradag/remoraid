import { Container, ContainerProps, MantineSize } from "@mantine/core";
import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { usePathname } from "next/navigation";
import { PageConfiguration } from "@/core/lib/types";
import { useWidgets } from "../RemoraidProvider/WidgetsProvider";

const pageContext = React.createContext<PageConfiguration | null>(null);

export const usePage = (): PageConfiguration | null => {
  return useContext(pageContext);
};

export interface PageProps {
  name?: string;
  config?: Partial<Omit<PageConfiguration, "name">>;
  pt?: MantineSize | number;
  componentsProps?: { container?: ContainerProps };
}

export default function Page({
  children,
  name,
  config,
  pt,
  componentsProps,
}: PropsWithChildren<PageProps>): ReactNode {
  const pathname = usePathname();
  const { isPageRegistered, registerPage } = useWidgets();

  // Style
  const theme = useRemoraidTheme();

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
      <Container
        size={theme.containerSize}
        pt={pt ?? "md"}
        {...componentsProps?.container}
      >
        {children}
      </Container>
    </pageContext.Provider>
  );
}
