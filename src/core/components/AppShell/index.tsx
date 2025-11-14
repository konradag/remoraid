import { BoxProps, Box } from "@mantine/core";
import { ComponentProps, PropsWithChildren, ReactNode, useEffect } from "react";
import AppProvider, { AppProviderProps } from "./AppProvider";
import { merge } from "lodash";
import AppShellUserExperienceProvider from "./AppShellUserExperienceProvider";
import Navbar, { NavbarProps } from "./Navbar";
import Footer, { FooterProps } from "./Footer";
import {
  AppShellUserExperience,
  CustomAppVariables,
  UserExperienceProviderProps,
} from "@/core/lib/types";
import FrameLayout, { FrameLayoutProps } from "../FrameLayout";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { useHydratedMantineColorScheme } from "../RemoraidProvider/HydrationStatusProvider";

export const remoraidAppShellLayoutId = "remoraid-app-shell";

export interface AppShellProps<V extends CustomAppVariables> {
  appContext: AppProviderProps<V>["appContext"];
  initialUserExperience?: UserExperienceProviderProps<AppShellUserExperience>["initialValue"];
  gutter?: FrameLayoutProps["gutter"];
  componentsProps?: {
    container?: Partial<BoxProps>;
    layout?: Partial<FrameLayoutProps>;
    navbar?: Partial<NavbarProps>;
    footer?: Partial<FooterProps>;
    AppProvider?: Partial<AppProviderProps<V>>;
    AppShellUserExperienceProvider?: Partial<
      UserExperienceProviderProps<AppShellUserExperience>
    >;
  };
}

function AppShell<V extends CustomAppVariables>({
  gutter,
  appContext,
  initialUserExperience,
  componentsProps,
  children,
}: PropsWithChildren<AppShellProps<V>>): ReactNode {
  // Contexts
  const theme = useRemoraidTheme();
  const { colorScheme } = useHydratedMantineColorScheme();

  // Effects
  useEffect(() => {
    let meta: HTMLMetaElement | null = document.querySelector(
      'meta[name="theme-color"]'
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    const { backgroundColor: computedBodyColor } = getComputedStyle(
      document.body
    );
    if (!computedBodyColor) {
      return;
    }
    meta.content = computedBodyColor;
  }, [colorScheme]);

  return (
    <AppProvider<V> appContext={appContext} {...componentsProps?.AppProvider}>
      <AppShellUserExperienceProvider
        {...componentsProps?.AppShellUserExperienceProvider}
        initialValue={merge(
          initialUserExperience,
          componentsProps?.AppShellUserExperienceProvider?.initialValue
        )}
      >
        <Box h="100dvh" {...componentsProps?.container}>
          <FrameLayout
            layoutId={remoraidAppShellLayoutId}
            gutter={gutter ?? theme.primaryGutter}
            {...componentsProps?.layout}
          >
            <Navbar {...componentsProps?.navbar} />
            {children}
            <Footer {...componentsProps?.footer} />
          </FrameLayout>
        </Box>
      </AppShellUserExperienceProvider>
    </AppProvider>
  );
}

export interface AppShell {
  <V extends CustomAppVariables>(
    props: ComponentProps<typeof AppShell<V>>
  ): ReactNode;
  Navbar: typeof Navbar;
  Footer: typeof Footer;
}
export default Object.assign(AppShell, {
  Navbar: Navbar,
  Footer: Footer,
}) as AppShell;
