import { ContainerProps, MantineSize } from "@mantine/core";
import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { usePathname } from "next/navigation";
import { PageConfiguration } from "@/core/lib/types";
import { useWidgets } from "../RemoraidProvider/WidgetsProvider";
import PageContainer from "./PageContainer";

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
      <PageContainer
        pt={pt}
        componentsProps={{ container: componentsProps?.container }}
      >
        {children}
      </PageContainer>
    </pageContext.Provider>
  );
}
