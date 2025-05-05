import { RemoraidTheme } from "@/lib/types";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import React, { useContext, PropsWithChildren } from "react";

const defaultMediumIconProps = { size: "1.125em" };
export const defaultTheme: RemoraidTheme = {
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
  containerSize: 1300,
  alertProps: {
    negative: {
      icon: <IconAlertCircle {...defaultMediumIconProps} />,
      variant: "default",
      title: "Attention!",
    },
    neutral: {
      icon: <IconInfoCircle {...defaultMediumIconProps} />,
      variant: "default",
      title: "Information",
    },
    positive: {
      icon: <IconCircleCheck {...defaultMediumIconProps} />,
      variant: "default",
      title: "Success",
    },
  },
  iconProps: {
    medium: defaultMediumIconProps,
    tiny: { size: 14, stroke: 3 },
  },
};

const themeContext = React.createContext<RemoraidTheme>(defaultTheme);

export const useRemoraidTheme = () => {
  return useContext(themeContext);
};
export interface ThemeProviderProps {
  theme?: Partial<RemoraidTheme>;
}

export default function ThemeProvider({
  children,
  theme,
}: PropsWithChildren<ThemeProviderProps>) {
  return (
    <themeContext.Provider value={{ ...defaultTheme, ...theme }}>
      {children}
    </themeContext.Provider>
  );
}
