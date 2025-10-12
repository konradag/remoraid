import { ComponentProps, ReactNode } from "react";
import { useRemoraidApp } from "../AppProvider";
import NavbarMinimal, { NavbarMinimalProps } from "./NavbarMinimal";
import { IconLogin, IconLogout, IconMoon, IconSun } from "@tabler/icons-react";
import {
  AppShellNavbarVariant,
  DefaultNavigationElementsDependencies,
  FrameLayoutSection,
  NavbarPosition,
  NavbarVariant,
  NavigationElement,
  NavigationElementType,
} from "@/core/lib/types";

export const supportedNavbarPositions: Record<
  Exclude<AppShellNavbarVariant, null>,
  NavbarPosition[]
> = {
  [NavbarVariant.Minimal]: [
    null,
    FrameLayoutSection.Top,
    FrameLayoutSection.Bottom,
    FrameLayoutSection.Left,
    FrameLayoutSection.Right,
    FrameLayoutSection.Content,
  ],
};

export const defaultNavbarPositions: Record<
  Exclude<AppShellNavbarVariant, null>,
  NavbarPosition
> = { [NavbarVariant.Minimal]: FrameLayoutSection.Left };

export const getDefaultNavigationElements = ({
  colorScheme,
  setColorScheme,
  auth,
}: Partial<DefaultNavigationElementsDependencies>): NavigationElement[] => [
  {
    type: NavigationElementType.Button,
    label: colorScheme === "dark" ? "Light mode" : "Dark mode",
    icon: colorScheme === "dark" ? IconSun : IconMoon,
    static: true,
    onClick: () => {
      if (!colorScheme || !setColorScheme) {
        return;
      }
      setColorScheme(colorScheme === "dark" ? "light" : "dark");
    },
  },
  {
    mounted: auth !== undefined && auth.user === null,
    type: NavigationElementType.Anchor,
    label: "Login",
    href: "/login",
    static: true,
    icon: IconLogin,
  },
  {
    mounted: auth !== undefined && auth.user !== null,
    type: NavigationElementType.Button,
    label: "Logout",
    static: true,
    icon: IconLogout,
    onClick: () => {
      auth?.onLogout?.();
    },
  },
];

export interface NavbarProps {
  componentsProps?: {
    NavbarMinimal?: Partial<NavbarMinimalProps>;
  };
}

function Navbar({ componentsProps }: NavbarProps): ReactNode {
  // Contexts
  const { navbarVariant } = useRemoraidApp();

  if (navbarVariant === NavbarVariant.Minimal) {
    return <NavbarMinimal {...componentsProps?.NavbarMinimal} />;
  }
  return null;
}

export interface Navbar extends React.FC<ComponentProps<typeof Navbar>> {
  NavbarMinimal: typeof NavbarMinimal;
}
export default Object.assign(Navbar, {
  NavbarMinimal: NavbarMinimal,
}) as Navbar;
