import {
  Tooltip,
  UnstyledButton,
  Stack,
  Flex,
  Paper,
  Divider,
  Indicator,
  IndicatorProps,
  PaperProps,
  rem,
} from "@mantine/core";
import {
  Icon,
  IconLink,
  IconLogin,
  IconLogout,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { useRemoraidUserExperience } from "@/core/components/RemoraidProvider/CoreUserExperienceProvider";
import { useRemoraidTheme } from "@/core/components/RemoraidProvider/ThemeProvider";
import { useRemoraidApp } from "../AppProvider";
import { useHydratedMantineColorScheme } from "../../RemoraidProvider/HydrationStatusProvider";

interface NavbarLinkProps {
  label: string;
  linkSize: string;
  iconSize: string;
  icon?: Icon;
  indicator?: (isHovering: boolean) => IndicatorProps;
  href?: string;
  active?: boolean;
  onClick?(): void;
}

function NavbarLink({
  icon,
  linkSize,
  iconSize,
  label,
  active,
  onClick,
  href,
  indicator,
}: NavbarLinkProps): ReactNode {
  // State
  const [isHoveringRoleIndicator, setIsHoveringRoleIndicator] =
    useState<boolean>(false);

  // Helpers
  const iconProps = {
    size: iconSize,
    stroke: 1.5,
  };
  const Icon = icon ?? IconLink;
  if (!href) {
    return (
      <Tooltip label={label} position="right">
        <UnstyledButton
          onClick={onClick}
          className="remoraid-navbar-minimal-link"
          data-active={active || undefined}
          w={linkSize}
          h={linkSize}
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
      w={linkSize}
      h={linkSize}
      component={Link}
      href={href}
    >
      <Icon {...iconProps} />
    </UnstyledButton>
  );

  return (
    <Tooltip label={label} position="right">
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

export interface NavbarMinimalProps {
  linkSize?: string;
  iconSize?: string;
  linkIndicator?: (isHovering: boolean) => IndicatorProps;
  logoIndicator?: (isHovering: boolean) => IndicatorProps;
  componentsProps?: {
    container?: Partial<PaperProps>;
    link?: Partial<NavbarLinkProps>;
  };
}

export default function NavbarMinimal({
  linkSize = rem("50px"),
  iconSize = "50%",
  linkIndicator,
  logoIndicator,
  componentsProps,
}: NavbarMinimalProps): ReactNode {
  const pathname = usePathname();
  const theme = useRemoraidTheme();
  const { setColorScheme, colorScheme } = useHydratedMantineColorScheme();
  const { userExperience } = useRemoraidUserExperience();
  const { navigablePages, logo, auth } = useRemoraidApp();

  // State
  const [isHoveringRoleIndicator, setIsHoveringRoleIndicator] =
    useState<boolean>(false);

  // Helpers
  const linkProps = {
    linkSize,
    iconSize,
    ...componentsProps?.link,
  };
  const links = navigablePages
    .filter((link) => !userExperience.navbar.hiddenPages.includes(link.href))
    .map((link) => (
      <NavbarLink
        key={link.label}
        active={link.href === pathname}
        indicator={linkIndicator}
        {...link}
        {...linkProps}
      />
    ));
  const logoProps = {
    style: {
      cursor: "pointer",
      width: linkSize,
      height: linkSize,
    },
  };

  return (
    <Paper
      h="100%"
      p="md"
      shadow="md"
      bg={theme.transparentBackground}
      {...componentsProps?.container}
    >
      <Flex direction="column" h="100%" align="center">
        {logo !== undefined && (
          <>
            {logoIndicator === undefined ? (
              logo(logoProps)
            ) : (
              <Indicator
                withBorder
                offset={2}
                size={13}
                onMouseEnter={() => setIsHoveringRoleIndicator(true)}
                onMouseLeave={() => setIsHoveringRoleIndicator(false)}
                {...logoIndicator(isHoveringRoleIndicator)}
              >
                {logo(logoProps)}
              </Indicator>
            )}
            <Divider my={"md"} variant="dashed" w="100%" />
          </>
        )}
        <Stack justify="flex-start" gap={0} flex={1}>
          {links}
        </Stack>
        <Stack justify="center" gap={0}>
          {auth !== undefined &&
            (auth.user === null ? (
              <NavbarLink
                icon={IconLogin}
                label="Login"
                href="/login"
                active={pathname === "/login"}
                {...linkProps}
              />
            ) : (
              <NavbarLink
                icon={IconLogout}
                label="Logout"
                onClick={() => {
                  if (auth.onLogout) {
                    auth.onLogout();
                  }
                }}
                href={"/login"}
                {...linkProps}
              />
            ))}
          <NavbarLink
            icon={colorScheme === "dark" ? IconSun : IconMoon}
            onClick={() => {
              if (!colorScheme || !setColorScheme) {
                return;
              }
              setColorScheme(colorScheme === "dark" ? "light" : "dark");
            }}
            label="Toggle Color Scheme"
            {...linkProps}
          />
        </Stack>
      </Flex>
    </Paper>
  );
}
