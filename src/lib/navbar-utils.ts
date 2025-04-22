import { defaultSettings as navbarMinimalDefaultSettings } from "@/components/AppShell/NavbarMinimal";
import { NavbarSettings, NavbarVariant } from "./types";

export const defaultNavbarVariant: NavbarVariant = "minimal";
export const defaultNavbarSettings: { [V in NavbarVariant]: NavbarSettings } = {
  minimal: navbarMinimalDefaultSettings,
};
