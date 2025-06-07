import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import { RemoraidAppContext, RemoraidUser } from "@/core/lib/types";

export const defaultAppContext: RemoraidAppContext = { navigablePages: [] };
const appContext = createContext<RemoraidAppContext>(defaultAppContext);
export const useRemoraidApp = (): RemoraidAppContext => {
  return useContext(appContext);
};

export interface AppProviderProps {
  navigablePages: RemoraidAppContext["navigablePages"];
  user?: RemoraidUser;
}

export default function AppProvider({
  children,
  navigablePages,
  user,
}: PropsWithChildren<AppProviderProps>): ReactNode {
  return (
    <appContext.Provider value={{ navigablePages, user }}>
      {children}
    </appContext.Provider>
  );
}
