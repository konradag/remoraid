import { IndicatorProps, MantineSize, ScrollAreaProps } from "@mantine/core";
import { Icon } from "@tabler/icons-react";
import { ImageProps } from "next/image";
import { ReactNode } from "react";

export interface Page {
  icon: Icon;
  label: string;
  href: string;
}
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
  scrollAreaProps: ScrollAreaProps;
}
export type AppShellLogo = (
  props: Omit<ImageProps, "src" | "alt">
) => ReactNode;
export interface NavbarProps {
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
}
