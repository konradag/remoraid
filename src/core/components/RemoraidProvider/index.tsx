import { PropsWithChildren, ReactNode } from "react";
import WidgetsProvider, { WidgetsProviderProps } from "./WidgetsProvider";
import ThemeProvider, { ThemeProviderProps } from "./ThemeProvider";
import {
  CoreUserExperience,
  PartialRemoraidTheme,
  RemoraidTheme,
  RemoraidThemeCallback,
  UserExperienceProviderProps,
} from "@/core/lib/types";
import { CookiesProvider, ReactCookieProps } from "react-cookie";
import CoreUserExperienceProvider from "./CoreUserExperienceProvider";

export interface RemoraidProviderProps {
  theme?: RemoraidTheme | RemoraidThemeCallback | PartialRemoraidTheme;
  initialUserExperience?: Partial<CoreUserExperience>;
  componentsProps?: {
    ThemeProvider?: ThemeProviderProps;
    CoreUserExperienceProvider?: UserExperienceProviderProps<CoreUserExperience>;
    WidgetsProvider?: WidgetsProviderProps;
    CookiesProvider?: ReactCookieProps;
  };
}

export default function RemoraidProvider({
  children,
  theme,
  initialUserExperience,
  componentsProps,
}: PropsWithChildren<RemoraidProviderProps>): ReactNode {
  return (
    <CookiesProvider {...componentsProps?.CookiesProvider}>
      <ThemeProvider theme={theme} {...componentsProps?.ThemeProvider}>
        <CoreUserExperienceProvider
          initialValue={initialUserExperience}
          {...componentsProps?.CoreUserExperienceProvider}
        >
          <WidgetsProvider {...componentsProps?.WidgetsProvider}>
            {children}
          </WidgetsProvider>
        </CoreUserExperienceProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}
