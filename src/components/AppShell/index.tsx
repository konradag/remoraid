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
} from "@/lib/types";
import { co, getCustomStyles } from "@/lib/utils";
import { useRemoraidUserExperience } from "../RemoraidProvider/UserExperienceProvider";

interface AppShellProps {
  logo: AppShellLogo;
  navbar: NavbarProps;
  user?: { name: string } | null; // null when logged out
}

export default function AppShell({
  children,
  logo,
  navbar,
  user,
}: PropsWithChildren<AppShellProps>) {
  const { userExperience } = useRemoraidUserExperience();
  const mantineTheme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { spacingPx } = getCustomStyles(mantineTheme, colorScheme);
  const [opened, { toggle }] = useDisclosure();

  // Helpers
  const navbarVariant: NavbarVariant =
    navbar && navbar.variant ? navbar.variant : userExperience.navbarVariant;
  const navbarSettings: NavbarSettings =
    navbar && navbar.settings ? navbar.settings : userExperience.navbarSettings;
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
      bg={
        colorScheme === "dark"
          ? mantineTheme.colors.dark[9]
          : mantineTheme.colors.gray[0]
      }
    >
      <MantineAppShell.Header withBorder={false}>
        <Group
          p="md"
          bg={
            colorScheme === "dark"
              ? mantineTheme.colors.dark[8]
              : mantineTheme.colors.gray[3]
          }
          hiddenFrom="sm"
        >
          <Burger opened={opened} onClick={toggle} h={20} size={18} />
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Navbar withBorder={false}>
        {navbarVariant === "minimal" && (
          <NavbarMinimal logo={logo} user={user} {...navbar} />
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
