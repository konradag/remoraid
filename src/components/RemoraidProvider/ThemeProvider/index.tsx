import { RemoraidTheme } from "@/lib/types";
import React, { useContext, PropsWithChildren } from "react";
import scrollAreaClasses from "@/styles/scroll.css";

export const defaultRemoraidTheme: RemoraidTheme = {
  transitionDurations: {
    short: 200,
    medium: 250,
    long: 500,
  },
  scrollAreaProps: {
    scrollbarSize: 8,
    scrollHideDelay: 20,
    classNames: scrollAreaClasses,
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
