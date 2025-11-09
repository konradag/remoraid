import {
  MantineBreakpoint,
  MantineColorScheme,
  MantineSize,
  MantineTheme,
} from "@mantine/core";
import { Icon, IconProps } from "@tabler/icons-react";
import { ImageProps } from "next/image";
import React, {
  Dispatch,
  MouseEventHandler,
  ReactElement,
  SetStateAction,
} from "react";
import { PartialDeep } from "type-fest";
import { AlertMinimalProps } from "../components/AlertMinimal";

export type RemoraidUser = { name: string } | null; // null when logged out
export interface RemoraidAuthContext {
  user: RemoraidUser;
  onLogout?: () => void;
}
export enum NavbarVariant {
  Minimal = "minimal",
}
export enum FooterVariant {
  Minimal = "minimal",
}
export enum NavbarMode {
  Responsive = "responsive",
  Collapsed = "collapsed",
  Expanded = "expanded",
}
export enum NavigationElementType {
  Anchor = "anchor",
  Button = "button",
}
export interface NavigationElementBase {
  label: string;
  children?: NavigationElement[];
  priority?: number;
  icon?: Icon;
  static?: boolean;
  mounted?: boolean;
}
export interface NavigationElementAnchor extends NavigationElementBase {
  type: NavigationElementType.Anchor;
  href: string;
}
export interface NavigationElementButton extends NavigationElementBase {
  type: NavigationElementType.Button;
  onClick: MouseEventHandler;
}
export type NavigationElement =
  | NavigationElementButton
  | NavigationElementAnchor;
export type AppLogo = (props: Omit<ImageProps, "src" | "alt">) => ReactElement;
export type NavbarMobileVariant = null;
export type AppShellFooterVariant = FooterVariant | null;
export type AppShellNavbarVariant = NavbarVariant | null;
export type AppShellNavbarMobileVariant = NavbarMobileVariant | null;
export interface StaticRemoraidAppContext {
  name: string;
  nav: NavigationElement[];
  navbarVariant: AppShellNavbarVariant;
  navbarMobileVariant: AppShellNavbarMobileVariant;
  footerVariant: AppShellFooterVariant;
  logo?: Icon | ImageProps["src"] | ReactElement;
  auth?: RemoraidAuthContext;
}
export type CustomAppVariables = {
  [K in Exclude<string, keyof StaticRemoraidAppContext>]: any;
};
export type RemoraidAppContext<V extends CustomAppVariables> =
  StaticRemoraidAppContext & V;
export enum NavbarOrientation {
  Vertical = "vertical",
  Horizontal = "horizontal",
}
export type NavbarPosition = FrameLayoutSection | null;
export type NavbarMobilePosition = FrameLayoutSection | null;
export type FooterPosition = FrameLayoutSection | null;
export interface AppShellUserExperience {
  navbar: {
    position: NavbarPosition;
    mobilePosition: NavbarMobilePosition;
    mode: NavbarMode;
  };
  footer: {
    position: FooterPosition;
  };
}
export interface DefaultNavigationElementsDependencies {
  colorScheme: MantineColorScheme;
  setColorScheme: (value: MantineColorScheme) => void;
  auth: RemoraidAuthContext;
}
export type PrimitiveUserExperience = string | number | boolean;
export type UserExperience =
  | Partial<Record<string, any>>
  | PrimitiveUserExperience
  | PrimitiveUserExperience[];
export interface CoreUserExperience {
  showWelcomeMessage: boolean;
  navbar: { hiddenPages: string[]; mode: NavbarMode };
}
export type UserExperienceProviderProps<T extends UserExperience> = {
  initialValue?: T extends PrimitiveUserExperience | PrimitiveUserExperience[]
    ? never
    : PartialDeep<T>;
  cookieName?: string;
};
export interface UserExperienceContext<T extends UserExperience> {
  userExperience: T;
  updateUserExperience: (p: T | ((prev: T) => T)) => void;
  processedCookie: boolean;
  initialUserExperience: T;
}
export interface WidgetContext {
  name: string;
  selected: boolean;
  hidden: boolean;
}
export interface WidgetsContext {
  widgets: Partial<Record<string, Partial<Record<string, WidgetContext>>>>;
  activeWidget: string | null;
  updateActiveWidget: (widgetId: string | null) => void;
  registerWidget: (pageId: string, widget: WidgetConfiguration) => void;
  registerPage: (pageId: string, initialWidgets: WidgetConfiguration[]) => void;
  isWidgetRegistered: (pageId: string, widgetId: string) => boolean;
  isPageRegistered: (pageId: string) => boolean;
  updateWidgetSelection: (
    pageId: string,
    widgetId: string,
    value: boolean
  ) => void;
  updateWidgetSelectionBulk: (
    pageId: string,
    selectedWidgetIds: string[]
  ) => void;
  isWidgetSelected: (pageId: string, widgetId: string) => boolean;
  hideWidget: (pageId: string, widgetId: string) => void;
}
export enum AlertCategory {
  Negative = "negative",
  Neutral = "neutral",
  Positive = "positive",
}
export enum TransitionDuration {
  Short = "short",
  Medium = "medium",
  Long = "long",
}
export enum RemoraidBreakpoint {
  ButtonCollapse = "buttonCollapse",
  BadgeGroupCollapse = "badgeGroupCollapse",
  NavbarStaticElementsCollapse = "navbarStaticElementsCollapse",
}
export enum RemoraidIconSize {
  Tiny = "tiny",
  ExtraSmall = "extraSmall",
  Small = "small",
  Medium = "medium",
  Large = "large",
  Huge = "huge",
}
export interface RemoraidTheme {
  bodyColor: string;
  containerSize: MantineSize | number;
  jsonStringifySpace: string | number;
  primaryGutter: MantineSize | number;
  transitionDurations: Record<TransitionDuration, number>;
  breakpoints: Record<RemoraidBreakpoint, MantineBreakpoint>;
  transparentBackground?: string;
  spacingPx?: Record<MantineSize, number>;
  componentsProps: {
    icons: Record<RemoraidIconSize, Partial<IconProps>>;
    alerts: Record<AlertCategory, Omit<Partial<AlertMinimalProps>, "category">>;
  };
}
export interface RemoraidThemeDependencies {
  mantineTheme: MantineTheme;
  colorScheme: MantineColorScheme;
}
export type RemoraidThemeCallback = (
  dependencies: Partial<RemoraidThemeDependencies>
) => PartialDeep<RemoraidTheme>;
export interface WidgetConfiguration {
  widgetId: string;
  initialValues?: PartialDeep<Omit<WidgetContext, "hidden">>;
  allowUnregisteredPageUsage?: boolean;
}
export interface PageConfiguration {
  pageId: string;
  name: string;
  registerPageDirectly?: boolean;
}
export interface SettingsTableOptions {
  leftColumnWidth: string | number;
}
export interface SettingsWidgetContext {
  unsavedChanges?: boolean;
  custom?: boolean;
}
export interface HydrationStatus {
  hasHydrated: boolean;
  ensureHydration: <T>(v: T) => T | undefined;
}
export enum LayoutType {
  Frame = "frame",
}
export enum FrameLayoutSection {
  Top = "top",
  Bottom = "bottom",
  Left = "left",
  Right = "right",
  Content = "content",
}
export type LayoutSection<T extends LayoutType> = T extends LayoutType.Frame
  ? FrameLayoutSection
  : string;
export interface LayoutContext<T extends LayoutType> {
  type: T;
  layoutId: string;
  sections: Record<LayoutSection<T>, HTMLDivElement | null>;
}
export interface LayoutsContext {
  layouts: Partial<Record<string, Omit<LayoutContext<LayoutType>, "layoutId">>>;
  setLayouts: Dispatch<
    SetStateAction<
      Partial<Record<string, Omit<LayoutContext<LayoutType>, "layoutId">>>
    >
  >;
}
export interface LayoutElementContext<T extends LayoutType> {
  layoutType: T;
  section: LayoutSection<T>;
}
export interface ContextCluster<Context, StaticID extends string = never> {
  contexts: Partial<Record<string, React.Context<Context>>>;
  defaultValues: Partial<Record<string, Context>>;
  generalDefaultValue: Context;
  createContext: (id: string, defaultValue?: Context) => React.Context<Context>;
  useContext: <ID extends string>(
    id: ID
  ) => ID extends StaticID ? Context : Context | null;
}
export enum ClickTransformation {
  Default = "default",
  None = "none",
  TiltDown = "tiltDown",
  TiltUp = "tiltUp",
  TiltRight = "tiltRight",
  TiltLeft = "tiltLeft",
  Scale = "scale",
}
