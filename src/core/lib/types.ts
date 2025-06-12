import {
  AlertProps,
  IndicatorProps,
  MantineBreakpoint,
  MantineColorScheme,
  MantineSize,
  MantineTheme,
  ScrollAreaProps,
} from "@mantine/core";
import { Icon, IconProps } from "@tabler/icons-react";
import { ImageProps } from "next/image";
import { Dispatch, ReactNode, SetStateAction } from "react";

export type RemoraidUser = { name: string } | null; // null when logged out
export interface RemoraidAppContext {
  navigablePages: {
    label: string;
    href: string;
    icon?: Icon;
  }[];
  user?: RemoraidUser;
}
export enum NavbarVariant {
  Minimal = "minimal",
}
export interface NavbarSettings {
  hiddenPages: string[];
  linkSize: string;
  px: MantineSize | number;
  py: MantineSize | number;
  iconSize?: string | number;
}
export type UserExperience = Record<string, any>;
export interface CoreUserExperience extends UserExperience {
  navbarVariant: NavbarVariant;
  navbarSettings: NavbarSettings;
  showWelcomeMessage: boolean;
}
export type UserExperienceProviderProps<T extends UserExperience> = {
  initialValue?: Partial<T>;
  cookieName?: string;
};
export interface UserExperienceContext<T extends UserExperience> {
  userExperience: T;
  updateUserExperience: (p: T | ((prev: T) => T)) => void;
  processedCookie: boolean;
  initialUserExperience: T;
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
}
export enum RemoraidIconSize {
  Tiny = "tiny",
  Medium = "medium",
}
export interface RemoraidTheme {
  transitionDurations: Record<TransitionDuration, number>;
  breakpoints: Record<RemoraidBreakpoint, MantineBreakpoint>;
  scrollAreaProps: ScrollAreaProps;
  alertProps: Record<AlertCategory, AlertProps>;
  containerSize: MantineSize | number;
  iconProps: Record<RemoraidIconSize, IconProps>;
  jsonStringifySpace: string | number;
  transparentBackground?: string;
  primaryColor?: string;
  spacingPx?: Record<MantineSize, number>;
}
export interface RemoraidThemeDependencies {
  mantineTheme: MantineTheme;
  colorScheme: MantineColorScheme;
}
export type RemoraidThemeCallback = (
  dependencies: Partial<RemoraidThemeDependencies>
) => Partial<RemoraidTheme>;
export type AppShellLogo = (
  props: Omit<ImageProps, "src" | "alt">
) => ReactNode;
export interface NavbarProps {
  settings?: Partial<NavbarSettings>;
  variant?: NavbarVariant;
  linkIndicator?: (isHovering: boolean) => IndicatorProps;
  logoIndicator?: (isHovering: boolean) => IndicatorProps;
  onLogout?: () => void;
}
export interface WidgetConfiguration {
  widgetId: string;
  name: string;
  initialValue?: boolean;
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
}
export type Layout<T extends LayoutType> = T extends LayoutType.Frame
  ? {
      sections: Record<FrameLayoutSection, HTMLDivElement | null>;
    }
  : never;
export interface LayoutsContext {
  layouts: Record<string, Layout<LayoutType>>;
  setLayouts: Dispatch<SetStateAction<Record<string, Layout<LayoutType>>>>;
}
export type FrameLayoutContext = {
  layoutId: string | null; // null, if component not in frame layout
  layout: Layout<LayoutType.Frame>;
  setLayout: Dispatch<SetStateAction<Layout<LayoutType.Frame>>>;
};
