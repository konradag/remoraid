import { PropsWithChildren, ReactNode } from "react";
import WidgetsProvider, { WidgetsProviderProps } from "./WidgetsProvider";
import ThemeProvider, { ThemeProviderProps } from "./ThemeProvider";
import {
  CoreUserExperience,
  UserExperienceProviderProps,
} from "@/core/lib/types";
import { CookiesProvider, ReactCookieProps } from "react-cookie";
import CoreUserExperienceProvider from "./CoreUserExperienceProvider";
import HydrationStatusProvider, {
  HydrationStatusProviderProps,
} from "./HydrationStatusProvider";
import LayoutsProvider, { LayoutsProviderProps } from "./LayoutsProvider";

export interface RemoraidProviderProps {
  theme?: ThemeProviderProps["theme"];
  initialUserExperience?: UserExperienceProviderProps<CoreUserExperience>["initialValue"];
  componentsProps?: {
    ThemeProvider?: Partial<ThemeProviderProps>;
    CoreUserExperienceProvider?: Partial<
      UserExperienceProviderProps<CoreUserExperience>
    >;
    WidgetsProvider?: Partial<WidgetsProviderProps>;
    CookiesProvider?: Partial<ReactCookieProps>;
    HydrationStatusProviderProps?: Partial<HydrationStatusProviderProps>;
    LayoutsProviderProps?: Partial<LayoutsProviderProps>;
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
      <HydrationStatusProvider
        {...componentsProps?.HydrationStatusProviderProps}
      >
        <ThemeProvider theme={theme} {...componentsProps?.ThemeProvider}>
          <CoreUserExperienceProvider
            initialValue={initialUserExperience}
            {...componentsProps?.CoreUserExperienceProvider}
          >
            <WidgetsProvider {...componentsProps?.WidgetsProvider}>
              <LayoutsProvider {...componentsProps?.LayoutsProviderProps}>
                {children}
              </LayoutsProvider>
            </WidgetsProvider>
          </CoreUserExperienceProvider>
        </ThemeProvider>
      </HydrationStatusProvider>
    </CookiesProvider>
  );
}
