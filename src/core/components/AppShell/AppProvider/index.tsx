import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import { SetRequired } from "type-fest";
import { merge } from "lodash";
import {
  CustomAppVariables,
  FooterVariant,
  NavbarVariant,
  RemoraidAppContext,
} from "@/core/lib/types";

export const defaultAppContext: RemoraidAppContext<CustomAppVariables> = {
  name: "Hello, World!",
  nav: [],
  navbarVariant: NavbarVariant.Minimal,
  footerVariant: FooterVariant.Minimal,
  navbarMobileVariant: null,
};

const appContext =
  createContext<RemoraidAppContext<CustomAppVariables>>(defaultAppContext);

export const useRemoraidApp = (): RemoraidAppContext<CustomAppVariables> => {
  return useContext(appContext);
};

export interface AppProviderProps<V extends CustomAppVariables> {
  appContext: SetRequired<Partial<RemoraidAppContext<V>>, "name" | "nav">;
}

export default function AppProvider<V extends CustomAppVariables>({
  appContext: appContextProp,
  children,
}: PropsWithChildren<AppProviderProps<V>>): ReactNode {
  return (
    <appContext.Provider value={merge(defaultAppContext, appContextProp)}>
      {children}
    </appContext.Provider>
  );
}
