import { BoxProps, Box } from "@mantine/core";
import NavbarMinimal, { NavbarMinimalProps } from "./NavbarMinimal";
import FooterMinimal, { FooterMinimalProps } from "./FooterMinimal";
import { PropsWithChildren, ReactNode } from "react";
import {
  AppContextProps,
  CustomAppVariables,
  FooterVariant,
  FrameLayoutFooterPosition,
  FrameLayoutNavbarPosition,
  FrameLayoutSection,
  FrameLayoutVariant,
  NavbarVariant,
} from "@/core/lib/types";
import AppProvider, { AppProviderProps } from "./AppProvider";
import { OptionalIfExtends } from "@/core/lib/utils";
import FrameLayout, { FrameLayoutProps } from "../FrameLayout";

export const defaultAppShellLayoutId = "remoraidAppShell";

export type AppShellNavbarVariant = NavbarVariant | null;
export type AppShellFooterVariant = FooterVariant | null;

export type DefaultNavbarVariant = null;
export type DefaultFooterVariant = null;

export interface ExplicitAppShellProps<
  N extends AppShellNavbarVariant,
  F extends AppShellFooterVariant,
  V extends CustomAppVariables
> {
  navbarVariant: N;
  footerVariant: F;
  navbarPosition: N extends NavbarVariant
    ? FrameLayoutNavbarPosition<N>
    : never;
  footerPosition: F extends FooterVariant
    ? FrameLayoutFooterPosition<F>
    : never;
  appContext: AppContextProps<V>;
  componentsProps?: {
    navbar?: N extends NavbarVariant.Minimal
      ? Partial<NavbarMinimalProps>
      : never;
    footer?: N extends FooterVariant.Minimal
      ? Partial<FooterMinimalProps>
      : never;
    layout?: Partial<FrameLayoutProps<FrameLayoutVariant.Sticky>>;
    childrenContainer?: Partial<BoxProps>;
    AppProvider?: Partial<AppProviderProps>;
  };
}

export type AppShellProps<
  N extends AppShellNavbarVariant = DefaultNavbarVariant,
  F extends AppShellFooterVariant = DefaultFooterVariant,
  V extends CustomAppVariables = {}
> = OptionalIfExtends<
  OptionalIfExtends<
    ExplicitAppShellProps<N, F, V>,
    "footerVariant",
    F,
    DefaultFooterVariant
  >,
  "navbarVariant",
  N,
  DefaultNavbarVariant
>;

const defaultProps = {
  navbarVariant: null as DefaultNavbarVariant,
  footerVariant: null as DefaultFooterVariant,
};

function AppShell<
  N extends AppShellNavbarVariant = DefaultNavbarVariant,
  F extends AppShellFooterVariant = DefaultFooterVariant,
  V extends CustomAppVariables = {}
>(props: PropsWithChildren<AppShellProps<N, F, V>>): ReactNode {
  const {
    children,
    navbarVariant,
    footerVariant,
    navbarPosition,
    footerPosition,
    appContext,
    componentsProps,
  } = {
    ...defaultProps,
    ...props,
  };

  // Helpers
  let navbar;
  let footer;
  if (navbarVariant === NavbarVariant.Minimal) {
    navbar = <NavbarMinimal {...componentsProps?.navbar} />;
  }
  if (footerVariant === FooterVariant.Minimal) {
    footer = <FooterMinimal {...componentsProps?.footer} />;
  }

  return (
    <AppProvider appContext={appContext} {...componentsProps?.AppProvider}>
      <FrameLayout
        layoutId={defaultAppShellLayoutId}
        {...componentsProps?.layout}
      >
        {navbarPosition !== undefined &&
          navbarPosition !== FrameLayoutSection.Content && (
            <FrameLayout.Element section={navbarPosition}>
              {navbar}
            </FrameLayout.Element>
          )}
        {footerPosition !== undefined &&
          footerPosition !== FrameLayoutSection.Content && (
            <FrameLayout.Element section={footerPosition}>
              {footer}
            </FrameLayout.Element>
          )}
        {navbarPosition !== undefined &&
          navbarPosition === FrameLayoutSection.Content && <>{navbar}</>}
        <Box {...componentsProps?.childrenContainer}>{children}</Box>
        {footerPosition !== undefined &&
          footerPosition === FrameLayoutSection.Content && <>{footer}</>}
      </FrameLayout>
    </AppProvider>
  );
}

export interface AppShell {
  <
    N extends AppShellNavbarVariant = DefaultNavbarVariant,
    F extends AppShellFooterVariant = DefaultFooterVariant,
    V extends CustomAppVariables = {}
  >(
    props: PropsWithChildren<AppShellProps<N, F, V>>
  ): ReactNode;
  NavbarMinimal: typeof NavbarMinimal;
  FooterMinimal: typeof FooterMinimal;
}
export default Object.assign(AppShell, {
  NavbarMinimal: NavbarMinimal,
  FooterMinimal: FooterMinimal,
}) as AppShell;
