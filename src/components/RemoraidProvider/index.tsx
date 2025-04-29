import { PropsWithChildren } from "react";
import UserExperienceProvider, {
  UserExperienceProviderProps,
} from "./UserExperienceProvider";
import WidgetsProvider, { WidgetsProviderProps } from "./WidgetsProvider";
import ThemeProvider, { ThemeProviderProps } from "./ThemeProvider";
import { RemoraidTheme, UserExperience } from "@/lib/types";

interface RemoraidProviderProps {
  theme?: RemoraidTheme;
  initialUserExperience?: UserExperience;
  componentsProps?: {
    ThemeProvider?: ThemeProviderProps;
    UserExperienceProvider?: UserExperienceProviderProps;
    WidgetsProvider?: WidgetsProviderProps;
  };
}

export default function RemoraidProvider({
  children,
  theme,
  initialUserExperience,
  componentsProps,
}: PropsWithChildren<RemoraidProviderProps>) {
  return (
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
  );
}
