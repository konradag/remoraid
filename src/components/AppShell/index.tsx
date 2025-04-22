import {
  AppShell as MantineAppShell,
  Burger,
  rem,
  Group,
  useMantineTheme,
  useMantineColorScheme,
  Paper,
  px,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavbarMinimal from "./NavbarMinimal";
import Footer from "./Footer";
import { PropsWithChildren } from "react";
import {
  AppShellLogo,
  NavbarProps,
  NavbarSettings,
  NavbarVariant,
  Page,
} from "@/lib/types";
import { co, getCustomStyles } from "@/lib/utils";
import {
  defaultNavbarSettings,
  defaultNavbarVariant,
} from "@/lib/navbar-utils";

interface AppShellProps {
  logo: AppShellLogo;
  pages: Page[];
  navbar?: NavbarProps;
  user?: { name: string } | null; // null when logged out
}

export default function AppShell({
  children,
  logo,
  pages,
  navbar,
  user,
}: PropsWithChildren<AppShellProps>) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { spacingPx } = getCustomStyles(theme, colorScheme);
  const [opened, { toggle }] = useDisclosure();

  // Helpers
  const navbarVariant: NavbarVariant =
    navbar && navbar.variant ? navbar.variant : defaultNavbarVariant;
  const navbarSettings: NavbarSettings =
    navbar && navbar.settings
      ? navbar.settings
      : defaultNavbarSettings[defaultNavbarVariant];
  const navbarLinkSizePx: number = co(
    (v) => !Number.isNaN(v),
    Number(px(navbarSettings.linkSize)),
    0
  );
  const navbarPaddingPx =
    typeof navbarSettings.px === "number"
      ? navbarSettings.px
      : spacingPx[navbarSettings.px];

  return (
    <MantineAppShell
      header={{ height: 0 }}
      navbar={{
        width: rem(`${navbarLinkSizePx + 2 * navbarPaddingPx}px`),
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      bg={colorScheme === "dark" ? theme.colors.dark[9] : theme.colors.gray[0]}
    >
      <MantineAppShell.Header withBorder={false}>
        <Group
          p="md"
          bg={
            colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[3]
          }
          hiddenFrom="sm"
        >
          <Burger opened={opened} onClick={toggle} h={20} size={18} />
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar withBorder={false}>
        {navbarVariant === "minimal" && (
          <NavbarMinimal logo={logo} pages={pages} user={user} {...navbar} />
        )}
      </MantineAppShell.Navbar>
      <MantineAppShell.Main>
        <>
          <Paper radius={0} my="md" h={20} hiddenFrom="sm" />
          {children}
          <Footer />
        </>
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
