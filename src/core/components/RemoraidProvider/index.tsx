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
import RouterProvider, { RouterProviderProps } from "./RouterProvider";

export interface RemoraidProviderProps {
  theme?: ThemeProviderProps["theme"];
  initialUserExperience?: UserExperienceProviderProps<CoreUserExperience>["initialValue"];
  router?: RouterProviderProps["router"];
  componentsProps?: {
    ThemeProvider?: Partial<ThemeProviderProps>;
    CoreUserExperienceProvider?: Partial<
      UserExperienceProviderProps<CoreUserExperience>
    >;
    WidgetsProvider?: Partial<WidgetsProviderProps>;
    CookiesProvider?: Partial<ReactCookieProps>;
    HydrationStatusProviderProps?: Partial<HydrationStatusProviderProps>;
    LayoutsProviderProps?: Partial<LayoutsProviderProps>;
    RouterProvider?: Partial<RouterProviderProps>;
  };
}

export default function RemoraidProvider({
  children,
  theme,
  initialUserExperience,
  router,
  componentsProps,
}: PropsWithChildren<RemoraidProviderProps>): ReactNode {
  return (
    <CookiesProvider {...componentsProps?.CookiesProvider}>
      <RouterProvider router={router} {...componentsProps?.RouterProvider}>
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
      </RouterProvider>
    </CookiesProvider>
  );
}
