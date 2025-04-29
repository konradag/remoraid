import {
  Tooltip,
  UnstyledButton,
  Stack,
  rem,
  useMantineColorScheme,
  Flex,
  Paper,
  useMantineTheme,
  Divider,
  Indicator,
  IndicatorProps,
} from "@mantine/core";
import {
  Icon,
  IconLogin,
  IconLogout,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AppShellLogo, NavbarProps, NavbarSettings, Page } from "@/lib/types";
import { getCustomStyles } from "@/lib/utils";
import { useUserExperience } from "@/components/RemoraidProvider/UserExperienceProvider";

interface NavbarLinkProps {
  icon: Icon;
  label: string;
  settings: NavbarSettings;
  indicator?: (isHovering: boolean) => IndicatorProps;
  href?: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({
  icon: Icon,
  label,
  active,
  onClick,
  href,
  indicator,
  settings,
}: NavbarLinkProps) {
  // State
  const [isHoveringRoleIndicator, setIsHoveringRoleIndicator] =
    useState<boolean>(false);

  // Helpers
  const iconProps = {
    size: settings.iconSize,
    stroke: 1.5,
  };
  if (!href) {
    return (
      <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
        <UnstyledButton
          onClick={onClick}
          className="remoraid-navbar-minimal-link"
          data-active={active || undefined}
          w={settings.linkSize}
          h={settings.linkSize}
        >
          <Icon {...iconProps} />
        </UnstyledButton>
      </Tooltip>
    );
  }
  const button = (
    <UnstyledButton
      onClick={onClick}
      className="remoraid-navbar-minimal-link"
      data-active={active || undefined}
      w={settings.linkSize}
      h={settings.linkSize}
      component={Link}
      href={href}
    >
      <Icon {...iconProps} />
    </UnstyledButton>
  );

  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      {indicator === undefined ? (
        button
      ) : (
        <Indicator
          withBorder
          size={13}
          offset={2}
          onMouseEnter={() => setIsHoveringRoleIndicator(true)}
          onMouseLeave={() => setIsHoveringRoleIndicator(false)}
          {...indicator(isHoveringRoleIndicator)}
        >
          {button}
        </Indicator>
      )}
    </Tooltip>
  );
}

interface NavbarMinimalProps extends NavbarProps {
  logo: AppShellLogo;
  pages: Page[];
  user?: { name: string } | null;
}

export const defaultSettings: NavbarSettings = {
  hiddenPages: [],
  linkSize: rem("50px"),
  iconSize: "50%",
  px: "sm",
  py: "md",
};

export default function NavbarMinimal({
  logo,
  pages,
  user,
  settings: settingsProp,
  linkIndicator,
  logoIndicator,
  onLogout,
}: NavbarMinimalProps) {
  const userExperience = useUserExperience();
  const pathname = usePathname();

  // Style
  const theme = useMantineTheme();
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  const { transparentBackground } = getCustomStyles(theme, colorScheme);

  // State
  const [isHoveringRoleIndicator, setIsHoveringRoleIndicator] =
    useState<boolean>(false);

  // Helpers
  const settings: NavbarSettings =
    settingsProp || userExperience.navbarSettings;
  const links = pages
    .filter((link) => !settings.hiddenPages.includes(link.href))
    .map((link) => (
      <NavbarLink
        key={link.label}
        active={link.href === pathname}
        indicator={linkIndicator}
        settings={settings}
        {...link}
      />
    ));
  const logoImage = logo({
    style: {
      cursor: "pointer",
      width: settings.linkSize,
      height: settings.linkSize,
    },
  });

  return (
    <Paper
      h="100%"
      py={settings.py}
      bg={transparentBackground}
      radius={0}
      shadow="md"
    >
      <Flex direction="column" h="100%" align="center" px={settings.px}>
        {logoIndicator === undefined ? (
          logoImage
        ) : (
          <Indicator
            withBorder
            offset={2}
            size={13}
            onMouseEnter={() => setIsHoveringRoleIndicator(true)}
            onMouseLeave={() => setIsHoveringRoleIndicator(false)}
            {...logoIndicator(isHoveringRoleIndicator)}
          >
            {logoImage}
          </Indicator>
        )}
        <Divider my={"md"} variant="dashed" w="100%" />
        <Stack justify="flex-start" gap={0} flex={1}>
          {links}
        </Stack>
        <Stack justify="center" gap={0}>
          {user !== undefined &&
            (user === null ? (
              <NavbarLink
                icon={IconLogin}
                label="Login"
                href="/login"
                active={pathname === "/login"}
                settings={settings}
              />
            ) : (
              <NavbarLink
                icon={IconLogout}
                label="Logout"
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                  }
                }}
                href={"/login"}
                settings={settings}
              />
            ))}
          <NavbarLink
            icon={colorScheme === "dark" ? IconSun : IconMoon}
            onClick={() => {
              if (colorScheme === "dark") {
                setColorScheme("light");
              } else {
                setColorScheme("dark");
              }
            }}
            label="Toggle Color Scheme"
            settings={settings}
          />
        </Stack>
      </Flex>
    </Paper>
  );
}
