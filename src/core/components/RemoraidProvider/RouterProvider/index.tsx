import React, {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
} from "react";
import type { RouterAdapter } from "@/core/lib/types";

export interface RouterProviderProps {
  router?: RouterAdapter;
}

const defaultRouter: RouterAdapter = {
  pathname: "/",
  push: () => {},
};

const routerContext = createContext<RouterAdapter>(defaultRouter);

export const useRemoraidRouter = (): RouterAdapter => {
  return useContext(routerContext);
};

const getWindowRouter = (): RouterAdapter => {
  if (typeof window === "undefined") {
    return defaultRouter;
  }

  return {
    pathname: window.location.pathname,
    push: (href: string) => {
      window.location.assign(href);
    },
    replace: (href: string) => {
      window.location.replace(href);
    },
  };
};

export default function RouterProvider({
  children,
  router,
}: PropsWithChildren<RouterProviderProps>): ReactNode {
  return (
    <routerContext.Provider value={router ?? getWindowRouter()}>
      {children}
    </routerContext.Provider>
  );
}
