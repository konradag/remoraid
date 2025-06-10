import {
  AppShell as MantineAppShell,
  Burger,
  rem,
  Group,
  useMantineTheme,
  Paper,
  px,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavbarMinimal from "./NavbarMinimal";
import Footer from "./Footer";
import { PropsWithChildren, ReactNode } from "react";
import {
  AppShellLogo,
  NavbarProps,
  NavbarSettings,
  NavbarVariant,
  RemoraidAppContext,
  RemoraidUser,
} from "@/core/lib/types";
import { co } from "@/core/lib/utils";
import { useRemoraidUserExperience } from "../RemoraidProvider/CoreUserExperienceProvider";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import AppProvider from "./AppProvider";
import { useHydratedMantineColorScheme } from "../RemoraidProvider/HydrationStatusProvider";

export interface AppShellProps {
  logo: AppShellLogo;
  navigablePages: RemoraidAppContext["navigablePages"];
  navbar?: NavbarProps;
  user?: RemoraidUser;
}

export default function AppShell({
  children,
  logo,
  navbar,
  user,
  navigablePages,
}: PropsWithChildren<AppShellProps>): ReactNode {
  const { userExperience } = useRemoraidUserExperience();
  const mantineTheme = useMantineTheme();
  const theme = useRemoraidTheme();
  const { colorScheme } = useHydratedMantineColorScheme();
  const [opened, { toggle }] = useDisclosure();

  // Helpers
  const navbarVariant: NavbarVariant =
    navbar && navbar.variant ? navbar.variant : userExperience.navbarVariant;
  const navbarSettings: NavbarSettings = {
    ...userExperience.navbarSettings,
    ...navbar?.settings,
  };
  const navbarLinkSizePx: number = co(
    (v) => !Number.isNaN(v),
    Number(px(navbarSettings.linkSize)),
    0
  );
  const navbarPaddingPx =
    typeof navbarSettings.px === "number"
      ? navbarSettings.px
      : theme.spacingPx
      ? theme.spacingPx[navbarSettings.px]
      : 0;

  return (
    <AppProvider user={user} navigablePages={navigablePages}>
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
          {navbarVariant === NavbarVariant.Minimal && (
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
    </AppProvider>
  );
}
