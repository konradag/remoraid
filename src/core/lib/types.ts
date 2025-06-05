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
import { ReactNode } from "react";

export type NavbarVariant = "minimal";
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
}
export type AlertCategory = "negative" | "neutral" | "positive";
export type TransitionDuration = "short" | "medium" | "long";
export type RemoraidBreakpoint = "buttonCollapse" | "badgeGroupCollapse";
export type RemoraidIconSize = "tiny" | "medium";
export interface RemoraidTheme {
  complete: true;
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
export type RemoraidThemeCallback = (
  mantineTheme: MantineTheme,
  colorScheme: MantineColorScheme
) => RemoraidTheme;
export type PartialRemoraidTheme = Omit<Partial<RemoraidTheme>, "complete">;
export type AppShellLogo = (
  props: Omit<ImageProps, "src" | "alt">
) => ReactNode;
export interface NavbarLink {
  icon: Icon;
  label: string;
  href: string;
}
export interface NavbarProps {
  links: NavbarLink[];
  settings?: NavbarSettings;
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
