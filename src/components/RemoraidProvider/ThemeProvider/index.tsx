import { RemoraidTheme } from "@/lib/types";
import React, { useContext, PropsWithChildren } from "react";

export const defaultRemoraidTheme: RemoraidTheme = {
  transitionDurations: {
    short: 200,
    medium: 350,
    long: 500,
  },
  breakpoints: {
    buttonCollapse: "md",
    badgeGroupCollapse: "md",
  },
  scrollAreaProps: {
    scrollbarSize: 8,
    scrollHideDelay: 20,
    type: "hover",
  },
};

const themeContext = React.createContext<RemoraidTheme>(defaultRemoraidTheme);

export const useRemoraidTheme = () => {
  return useContext(themeContext);
};
export interface ThemeProviderProps {
  theme?: RemoraidTheme;
}

export default function ThemeProvider({
  children,
  theme,
}: PropsWithChildren<ThemeProviderProps>) {
  return (
    <themeContext.Provider value={theme || defaultRemoraidTheme}>
      {children}
    </themeContext.Provider>
  );
}
