import { isValidElement, ReactElement, ReactNode } from "react";
import {
  Box,
  FloatingPosition,
  Group,
  MantineBreakpoint,
  Paper,
  PaperProps,
  ScrollArea,
  Stack,
} from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { useAppShellUserExperience } from "../../../AppShellUserExperienceProvider";
import { merge } from "lodash";
import { useRemoraidApp } from "../../../AppProvider";
import NavigationMenu, { NavigationMenuProps } from "./NavigationMenu";
import { IconDots } from "@tabler/icons-react";
import Navbar, { getDefaultNavigationElements } from "../..";
import {
  ClickTransformation,
  FrameLayoutSection,
  NavbarMode,
  NavbarOrientation,
  NavigationElement,
  NavigationElementType,
} from "@/core/lib/types";
import RemoraidButton, {
  defaultRemoraidButtonSize,
  RemoraidButtonProps,
} from "@/core/components/RemoraidButton";
import { useRemoraidTheme } from "@/core/components/RemoraidProvider/ThemeProvider";
import { useFrameLayoutElement } from "@/core/components/FrameLayout/Element";
import { useHydratedMantineColorScheme } from "@/core/components/RemoraidProvider/HydrationStatusProvider";
import { getDefaultButtonIconSize, isIcon } from "@/core/lib/utils";
import Image, { ImageProps } from "next/image";

export interface NavbarMinimalContentProps {
  orientation: NavbarOrientation;
  maxElements?: number;
  collapseStaticElementsBreakpoint?: MantineBreakpoint;
  componentsProps?: {
    container?: Partial<PaperProps>;
    button?:
      | Partial<RemoraidButtonProps<true>>
      | Partial<RemoraidButtonProps<false>>;
    logoButton?:
      | Partial<RemoraidButtonProps<true>>
      | Partial<RemoraidButtonProps<false>>;
    logo?: Partial<ImageProps>;
    NavigationMenu?: Partial<NavigationMenuProps>;
  };
}

export default function NavbarMinimalContent({
  orientation,
  maxElements,
  collapseStaticElementsBreakpoint: collapseStaticElementsBreakpointProp,
  componentsProps,
}: NavbarMinimalContentProps): ReactNode {
  // Contexts
  const theme = useRemoraidTheme();
  const { userExperience: appShellUserExperience } =
    useAppShellUserExperience();
  const app = useRemoraidApp();
  const router = useRouter();
  const pathname = usePathname();
  const layoutElement = useFrameLayoutElement();
  const { colorScheme, setColorScheme } = useHydratedMantineColorScheme();

  // Props default values
  const collapseStaticElementsBreakpoint =
    collapseStaticElementsBreakpointProp ??
    theme.breakpoints.navbarStaticElementsCollapse;

  // Helpers
  const mode: NavbarMode = appShellUserExperience.navbar.mode;
  const floatingPositions: Record<
    FrameLayoutSection,
    FloatingPosition | undefined
  > = {
    [FrameLayoutSection.Bottom]: "top",
    [FrameLayoutSection.Left]: "right",
    [FrameLayoutSection.Top]: "bottom",
    [FrameLayoutSection.Right]: "left",
    [FrameLayoutSection.Content]: undefined,
  };
  const floatingPosition = layoutElement?.section
    ? floatingPositions[layoutElement.section]
    : undefined;
  const buttonResponsive = mode === NavbarMode.Responsive;
  let buttonCollapsed = undefined;
  if (mode === NavbarMode.Collapsed) {
    buttonCollapsed = true;
  } else if (mode === NavbarMode.Expanded) {
    buttonCollapsed = false;
  }
  const buttonClickTransformation =
    orientation === NavbarOrientation.Horizontal
      ? ClickTransformation.TiltRight
      : ClickTransformation.Default;
  const logoButtonSize =
    componentsProps?.logoButton?.size ??
    componentsProps?.button?.size ??
    defaultRemoraidButtonSize;
  const logoIconSize = getDefaultButtonIconSize(logoButtonSize);
  const logoButton = app.logo ? (
    <RemoraidButton
      label={app.name}
      variant="subtle"
      icon={
        isValidElement(app.logo) || isIcon(app.logo) ? (
          app.logo
        ) : (
          <Image
            src={app.logo}
            alt="App logo"
            {...componentsProps?.logo}
            style={{
              width: theme.componentsProps.icons[logoIconSize].size,
              height: theme.componentsProps.icons[logoIconSize].size,
              ...componentsProps?.logo?.style,
            }}
          />
        )
      }
      responsive={buttonResponsive}
      collapsed={buttonCollapsed}
      clickTransformation={buttonClickTransformation}
      {...componentsProps?.button}
      {...componentsProps?.logoButton}
      componentsProps={merge(
        {
          button: {
            c: "var(--mantine-color-text)",
          },
          Button: { justify: "flex-start" },
          tooltip: { position: floatingPosition },
        },
        componentsProps?.button?.componentsProps,
        componentsProps?.logoButton?.componentsProps
      )}
      onClick={(e) => {
        componentsProps?.button?.onClick?.(e);
        componentsProps?.logoButton?.onClick?.(e);
      }}
    />
  ) : undefined;
  const button = (element: NavigationElement, key?: string): ReactElement => (
    <NavigationMenu
      key={key}
      label={element.label}
      target={
        <RemoraidButton
          mounted={element.mounted}
          label={element.label}
          icon={element.icon}
          variant={
            element.type === NavigationElementType.Anchor &&
            element.href === pathname
              ? "light"
              : "default"
          }
          responsive={buttonResponsive}
          collapsed={buttonCollapsed}
          clickTransformation={buttonClickTransformation}
          {...componentsProps?.button}
          componentsProps={merge(
            {
              tooltip: {
                position: floatingPosition,
                disabled:
                  element.children !== undefined && element.children.length > 0,
              },
              Button: { justify: "flex-start" },
              button: {
                w:
                  orientation === NavbarOrientation.Vertical
                    ? "100%"
                    : undefined,
              },
            },
            componentsProps?.button?.componentsProps
          )}
          onClick={(e) => {
            if (element.type === NavigationElementType.Anchor) {
              router.push(element.href);
            }
            if (element.type === NavigationElementType.Button) {
              element.onClick(e);
            }
            componentsProps?.button?.onClick?.(e);
          }}
        />
      }
      elements={element.children}
      {...componentsProps?.NavigationMenu}
      componentsProps={merge(
        {
          Menu: { position: floatingPosition },
        },
        componentsProps?.NavigationMenu?.componentsProps
      )}
    />
  );
  const elements: NavigationElement[] = [
    ...app.nav,
    ...getDefaultNavigationElements({ colorScheme, setColorScheme }),
  ];
  const buttons = elements
    .filter((element) => !element.static)
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
    .slice(0, maxElements)
    .map((element, i) => button(element, `nav-element-${i}`));
  const staticElements = elements.filter((element) => element.static);
  const staticButtons = staticElements
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
    .map((element, i) => button(element, `static-nav-element-${i}`));
  const collapseStaticElements =
    staticElements.filter((element) => element.mounted ?? true).length > 1;
  const staticMenuButton = collapseStaticElements ? (
    <Box hiddenFrom={collapseStaticElementsBreakpoint}>
      <NavigationMenu
        elements={staticElements}
        target={
          <RemoraidButton
            label="Static elements"
            icon={IconDots}
            responsive={
              orientation === NavbarOrientation.Vertical
                ? buttonResponsive
                : false
            }
            collapsed={
              orientation === NavbarOrientation.Vertical
                ? buttonCollapsed
                : true
            }
            clickTransformation={buttonClickTransformation}
            {...componentsProps?.button}
            componentsProps={merge(
              {
                tooltip: { disabled: true },
                Button: { justify: "flex-start" },
                button: {
                  w:
                    orientation === NavbarOrientation.Vertical
                      ? "100%"
                      : undefined,
                },
              },
              componentsProps?.button?.componentsProps
            )}
          />
        }
        {...componentsProps?.NavigationMenu}
        componentsProps={merge(
          {
            Menu: { position: floatingPosition },
          },
          componentsProps?.NavigationMenu?.componentsProps
        )}
      />
    </Box>
  ) : null;

  return (
    <Paper
      bg={theme.transparentBackground}
      h="100%"
      p="md"
      shadow="md"
      {...componentsProps?.container}
    >
      {orientation === NavbarOrientation.Vertical ? (
        <Stack h="100%">
          {logoButton}
          <ScrollArea flex={1}>
            <Stack>{buttons}</Stack>
          </ScrollArea>
          <Stack
            visibleFrom={
              collapseStaticElements
                ? collapseStaticElementsBreakpoint
                : undefined
            }
          >
            {staticButtons}
          </Stack>
          {staticMenuButton}
        </Stack>
      ) : (
        <Group wrap="nowrap">
          {logoButton}
          <ScrollArea flex={1} style={{ contain: "inline-size" }}>
            <Group wrap="nowrap">{buttons}</Group>
          </ScrollArea>
          <Group
            wrap="nowrap"
            visibleFrom={
              collapseStaticElements
                ? collapseStaticElementsBreakpoint
                : undefined
            }
          >
            {staticButtons}
          </Group>
          {staticMenuButton}
        </Group>
      )}
    </Paper>
  );
}
