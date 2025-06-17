import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import {
  AppContextProps,
  CustomAppVariables,
  RemoraidAppContext,
} from "@/core/lib/types";

export const defaultAppContext: RemoraidAppContext<CustomAppVariables> = {
  navigablePages: [],
};
const appContext =
  createContext<RemoraidAppContext<CustomAppVariables>>(defaultAppContext);

export const useRemoraidApp = (): RemoraidAppContext<CustomAppVariables> => {
  return useContext(appContext);
};

export interface AppProviderProps<V extends CustomAppVariables = {}> {
  appContext: AppContextProps<V>;
}

export default function AppProvider<V extends CustomAppVariables = {}>({
  appContext: appContextProps,
  children,
}: PropsWithChildren<AppProviderProps<V>>): ReactNode {
  return (
    <appContext.Provider value={{ ...appContextProps }}>
      {children}
    </appContext.Provider>
  );
}
