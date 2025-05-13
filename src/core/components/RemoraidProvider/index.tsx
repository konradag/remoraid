import { PropsWithChildren, ReactNode } from "react";
import UserExperienceProvider, {
  UserExperienceProviderProps,
} from "./UserExperienceProvider";
import WidgetsProvider, { WidgetsProviderProps } from "./WidgetsProvider";
import ThemeProvider, { ThemeProviderProps } from "./ThemeProvider";
import {
  PartialRemoraidTheme,
  RemoraidTheme,
  RemoraidThemeCallback,
  UserExperience,
} from "@/core/lib/types";
import { CookiesProvider, ReactCookieProps } from "react-cookie";

interface RemoraidProviderProps {
  theme?: RemoraidTheme | RemoraidThemeCallback | PartialRemoraidTheme;
  initialUserExperience?: Partial<UserExperience>;
  componentsProps?: {
    ThemeProvider?: ThemeProviderProps;
    UserExperienceProvider?: UserExperienceProviderProps;
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
        <UserExperienceProvider
          initialValue={initialUserExperience}
          {...componentsProps?.UserExperienceProvider}
        >
          <WidgetsProvider {...componentsProps?.WidgetsProvider}>
            {children}
          </WidgetsProvider>
        </UserExperienceProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}
