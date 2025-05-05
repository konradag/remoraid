import {
  AlertProps,
  IndicatorProps,
  MantineBreakpoint,
  MantineSize,
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
export interface UserExperience {
  navbarVariant: NavbarVariant;
  navbarSettings: NavbarSettings;
  showWelcomeMessage: boolean;
}
export interface RemoraidTheme {
  transitionDurations: { short: number; medium: number; long: number };
  breakpoints: {
    buttonCollapse: MantineBreakpoint;
    badgeGroupCollapse: MantineBreakpoint;
  };
  scrollAreaProps: ScrollAreaProps;
  alertProps: {
    negative: AlertProps;
    neutral: AlertProps;
    positive: AlertProps;
  };
  containerSize: MantineSize | number;
  iconProps: {
    tiny: IconProps;
    medium: IconProps;
  };
}
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
