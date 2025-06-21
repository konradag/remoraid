import { BoxProps, Box } from "@mantine/core";
import NavbarMinimal, { NavbarMinimalProps } from "./NavbarMinimal";
import FooterMinimal, { FooterMinimalProps } from "./FooterMinimal";
import { PropsWithChildren, ReactNode } from "react";
import {
  AppContextProps,
  CustomAppVariables,
  FooterVariant,
  FrameLayoutSection,
  FrameLayoutVariant,
  NavbarVariant,
} from "@/core/lib/types";
import AppProvider, { AppProviderProps } from "./AppProvider";
import { OptionalIfExtends } from "@/core/lib/utils";
import FrameLayout, { FrameLayoutProps } from "../FrameLayout";
import { FrameLayoutElementProps } from "../FrameLayout/Element";

export const defaultAppShellLayoutId = "remoraidAppShell";

export type AppShellNavbarVariant = NavbarVariant | null;
export type AppShellFooterVariant = FooterVariant | null;

export type DefaultNavbarVariant = null;
export type DefaultFooterVariant = null;

export type AppShellNavbarPosition<N extends AppShellNavbarVariant> =
  N extends NavbarVariant.Minimal
    ? FrameLayoutSection.Left | FrameLayoutSection.Right
    : N extends null
    ? never
    : FrameLayoutSection;
export type AppShellFooterPosition<F extends AppShellFooterVariant> =
  F extends FooterVariant.Minimal
    ? FrameLayoutSection.Content | FrameLayoutSection.Bottom
    : F extends null
    ? never
    : FrameLayoutSection;

export const defaultAppShellNavbarPositions: {
  [N in Exclude<AppShellNavbarVariant, null>]: AppShellNavbarPosition<N>;
} = { [NavbarVariant.Minimal]: FrameLayoutSection.Left };
export const defaultAppShellFooterPositions: {
  [F in Exclude<AppShellFooterVariant, null>]: AppShellFooterPosition<F>;
} = { [FooterVariant.Minimal]: FrameLayoutSection.Content };

export interface ExplicitAppShellProps<
  N extends AppShellNavbarVariant,
  F extends AppShellFooterVariant,
  V extends CustomAppVariables
> {
  navbarVariant: N;
  footerVariant: F;
  appContext: AppContextProps<V>;
  navbarPosition?: AppShellNavbarPosition<N>;
  footerPosition?: AppShellFooterPosition<F>;
  componentsProps?: {
    container?: Partial<BoxProps>;
    navbar?: N extends NavbarVariant.Minimal
      ? Partial<NavbarMinimalProps>
      : never;
    footer?: N extends FooterVariant.Minimal
      ? Partial<FooterMinimalProps>
      : never;
    layout?: Partial<FrameLayoutProps<FrameLayoutVariant.Sticky>>;
    childrenContainer?: Partial<BoxProps>;
    navbarLayoutElement?: Omit<Partial<FrameLayoutElementProps>, "section">;
    footerLayoutElement?: Omit<Partial<FrameLayoutElementProps>, "section">;
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

function AppShell<
  N extends AppShellNavbarVariant = DefaultNavbarVariant,
  F extends AppShellFooterVariant = DefaultFooterVariant,
  V extends CustomAppVariables = {}
>(props: PropsWithChildren<AppShellProps<N, F, V>>): ReactNode {
  const {
    children,
    navbarVariant,
    footerVariant,
    appContext,
    componentsProps,
  } = {
    navbarVariant: null as DefaultNavbarVariant,
    footerVariant: null as DefaultFooterVariant,
    ...props,
  };
  let { navbarPosition, footerPosition } = props;
  if (navbarVariant !== null && navbarPosition === undefined) {
    navbarPosition = defaultAppShellNavbarPositions[navbarVariant];
  }
  if (footerVariant !== null && footerPosition === undefined) {
    footerPosition = defaultAppShellFooterPositions[footerVariant];
  }

  // Helpers
  let navbar: ReactNode;
  let footer: ReactNode;
  let navbarContainerProps: Partial<BoxProps> = {};
  let footerContainerProps: Partial<BoxProps> = {};
  if (navbarVariant === NavbarVariant.Minimal) {
    navbar = <NavbarMinimal {...componentsProps?.navbar} />;
    navbarContainerProps.py = "md";
    if (navbarPosition === FrameLayoutSection.Left) {
      navbarContainerProps.pl = "md";
    } else if (navbarPosition === FrameLayoutSection.Right) {
      navbarContainerProps.pr = "md";
    }
  }
  if (footerVariant === FooterVariant.Minimal) {
    footer = <FooterMinimal {...componentsProps?.footer} />;
  }

  return (
    <AppProvider appContext={appContext} {...componentsProps?.AppProvider}>
      <Box h="100vh" {...componentsProps?.container}>
        <FrameLayout
          layoutId={defaultAppShellLayoutId}
          {...componentsProps?.layout}
        >
          {navbarPosition !== undefined &&
            navbarPosition !== FrameLayoutSection.Content && (
              <FrameLayout.Element
                section={navbarPosition}
                {...componentsProps?.navbarLayoutElement}
                componentsProps={{
                  ...componentsProps?.navbarLayoutElement?.componentsProps,
                  container: {
                    ...navbarContainerProps,
                    ...componentsProps?.navbarLayoutElement?.componentsProps
                      ?.container,
                  },
                }}
              >
                {navbar}
              </FrameLayout.Element>
            )}
          {footerPosition !== undefined &&
            footerPosition !== FrameLayoutSection.Content && (
              <FrameLayout.Element
                section={footerPosition}
                {...componentsProps?.footerLayoutElement}
                componentsProps={{
                  ...componentsProps?.footerLayoutElement?.componentsProps,
                  container: {
                    ...footerContainerProps,
                    ...componentsProps?.footerLayoutElement?.componentsProps
                      ?.container,
                  },
                }}
              >
                {footer}
              </FrameLayout.Element>
            )}
          {navbarPosition !== undefined &&
            navbarPosition === FrameLayoutSection.Content && <>{navbar}</>}
          <Box {...componentsProps?.childrenContainer}>{children}</Box>
          {footerPosition !== undefined &&
            footerPosition === FrameLayoutSection.Content && <>{footer}</>}
        </FrameLayout>
      </Box>
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
