import { BoxProps, Box } from "@mantine/core";
import NavbarMinimal, { NavbarMinimalProps } from "./NavbarMinimal";
import FooterMinimal, { FooterMinimalProps } from "./FooterMinimal";
import { ComponentProps, PropsWithChildren, ReactNode } from "react";
import {
  AppContextProps,
  CustomAppVariables,
  FooterVariant,
  FrameLayoutSection,
  NavbarVariant,
} from "@/core/lib/types";
import AppProvider, { AppProviderProps } from "./AppProvider";
import { OptionalIfExtends } from "@/core/lib/utils";
import FrameLayout, { FrameLayoutProps } from "../FrameLayout";
import { FrameLayoutElementProps } from "../FrameLayout/Element";
import { merge } from "lodash";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";

export const remoraidAppShellLayoutId = "remoraid-app-shell";

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

interface ExplicitAppShellProps<
  N extends AppShellNavbarVariant,
  F extends AppShellFooterVariant,
  V extends CustomAppVariables
> {
  navbarVariant: N;
  footerVariant: F;
  appContext: AppContextProps<V>;
  navbarPosition?: AppShellNavbarPosition<N>;
  footerPosition?: AppShellFooterPosition<F>;
  gutter?: FrameLayoutProps["gutter"];
  componentsProps?: {
    container?: Partial<BoxProps>;
    navbar?: N extends NavbarVariant.Minimal
      ? Partial<NavbarMinimalProps>
      : never;
    footer?: F extends FooterVariant.Minimal
      ? Partial<FooterMinimalProps>
      : never;
    layout?: Partial<FrameLayoutProps>;
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
    DefaultFooterVariant,
    F
  >,
  "navbarVariant",
  DefaultNavbarVariant,
  N
>;

function AppShell<
  N extends AppShellNavbarVariant = DefaultNavbarVariant,
  F extends AppShellFooterVariant = DefaultFooterVariant,
  V extends CustomAppVariables = {}
>({
  navbarVariant: navbarVariantProp,
  footerVariant: footerVariantProp,
  navbarPosition: navbarPositionProp,
  footerPosition: footerPositionProp,
  gutter,
  appContext,
  componentsProps,
  children,
}: PropsWithChildren<AppShellProps<N, F, V>>): ReactNode {
  // Props default values
  const navbarVariant: AppShellNavbarVariant =
    navbarVariantProp ?? (null satisfies DefaultNavbarVariant);
  const footerVariant: AppShellFooterVariant =
    footerVariantProp ?? (null satisfies DefaultFooterVariant);
  const navbarPosition: FrameLayoutSection | null =
    navbarPositionProp ??
    (navbarVariant === null
      ? null
      : defaultAppShellNavbarPositions[navbarVariant]);
  const footerPosition: FrameLayoutSection | null =
    footerPositionProp ??
    (footerVariant === null
      ? null
      : defaultAppShellFooterPositions[footerVariant]);

  // Contexts
  const theme = useRemoraidTheme();

  // Helpers
  let navbar: ReactNode;
  let footer: ReactNode;
  let navbarLayoutElementProps: Partial<FrameLayoutElementProps> = {
    includeContainer: false,
  };
  let footerLayoutElementProps: Partial<FrameLayoutElementProps> = {
    includeContainer: true,
    componentsProps: { container: { style: { order: 1 } } },
  };
  if (navbarVariant === NavbarVariant.Minimal) {
    navbar = <NavbarMinimal {...componentsProps?.navbar} />;
  }
  if (footerVariant === FooterVariant.Minimal) {
    footer = <FooterMinimal {...componentsProps?.footer} />;
  }

  return (
    <AppProvider appContext={appContext} {...componentsProps?.AppProvider}>
      <Box h="100vh" {...componentsProps?.container}>
        <FrameLayout
          layoutId={remoraidAppShellLayoutId}
          gutter={gutter ?? theme.primaryGutter}
          {...componentsProps?.layout}
        >
          {navbarPosition !== null && (
            <FrameLayout.Element
              section={navbarPosition}
              includeContainer={false}
              {...merge(
                navbarLayoutElementProps,
                componentsProps?.navbarLayoutElement
              )}
            >
              {navbar}
            </FrameLayout.Element>
          )}
          {children}
          {footerPosition !== null && (
            <FrameLayout.Element
              section={footerPosition}
              {...merge(
                footerLayoutElementProps,
                componentsProps?.footerLayoutElement
              )}
            >
              {footer}
            </FrameLayout.Element>
          )}
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
    props: ComponentProps<typeof AppShell<N, F, V>>
  ): ReactNode;
  NavbarMinimal: typeof NavbarMinimal;
  FooterMinimal: typeof FooterMinimal;
}
export default Object.assign(AppShell, {
  NavbarMinimal: NavbarMinimal,
  FooterMinimal: FooterMinimal,
}) as AppShell;
