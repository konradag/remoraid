import {
  AlertCategory,
  RemoraidBreakpoint,
  RemoraidIconSize,
  RemoraidTheme,
  RemoraidThemeCallback,
  RemoraidThemeDependencies,
  TransitionDuration,
} from "@/core/lib/types";
import { co } from "@/core/lib/utils";
import { px, rgba, useMantineTheme } from "@mantine/core";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconInfoCircle,
} from "@tabler/icons-react";
import React, {
  useContext,
  PropsWithChildren,
  useMemo,
  ReactNode,
} from "react";
import { useHydratedMantineColorScheme } from "../HydrationStatusProvider";
import { merge } from "lodash";
import { PartialDeep } from "type-fest";

export const createRemoraidTheme: (
  customTheme?: PartialDeep<RemoraidTheme>,
  dependencies?: Partial<RemoraidThemeDependencies>
) => RemoraidTheme = (customTheme, dependencies) => {
  const { mantineTheme, colorScheme } = dependencies ?? {};

  // Root values (values which are dependencies of default values)
  const transitionDurations = merge(
    {
      [TransitionDuration.Short]: 200,
      [TransitionDuration.Medium]: 350,
      [TransitionDuration.Long]: 500,
    },
    customTheme?.transitionDurations
  );
  const transparentBackground =
    customTheme?.transparentBackground ??
    (mantineTheme && colorScheme
      ? colorScheme === "dark"
        ? rgba(mantineTheme.colors.dark[8], 0.8)
        : rgba(mantineTheme.white, 0.8)
      : undefined);

  // Default values
  let spacingPx;
  if (mantineTheme && colorScheme) {
    spacingPx = {
      xs: Number(
        co((v) => !Number.isNaN(v), Number(px(mantineTheme.spacing.xs)), 0)
      ),
      sm: Number(
        co((v) => !Number.isNaN(v), Number(px(mantineTheme.spacing.sm)), 0)
      ),
      md: Number(
        co((v) => !Number.isNaN(v), Number(px(mantineTheme.spacing.md)), 0)
      ),
      lg: Number(
        co((v) => !Number.isNaN(v), Number(px(mantineTheme.spacing.lg)), 0)
      ),
      xl: Number(
        co((v) => !Number.isNaN(v), Number(px(mantineTheme.spacing.xl)), 0)
      ),
    };
  }
  const defaultTheme: RemoraidTheme = {
    containerSize: 1300,
    jsonStringifySpace: 2,
    transparentBackground,
    spacingPx,
    transitionDurations,
    breakpoints: {
      [RemoraidBreakpoint.ButtonCollapse]: "md",
      [RemoraidBreakpoint.BadgeGroupCollapse]: "md",
    },
    primaryGutter: "md",
    componentsProps: {
      alerts: {
        [AlertCategory.Negative]: {
          icon: IconAlertCircle,
          color: "red",
          title: "Attention!",
        },
        [AlertCategory.Neutral]: {
          icon: IconInfoCircle,
          color: mantineTheme?.primaryColor,
          title: "Information",
        },
        [AlertCategory.Positive]: {
          icon: IconCircleCheck,
          color: "green",
          title: "Success",
        },
      },
      icons: {
        [RemoraidIconSize.Medium]: {
          size: 20,
          stroke: 2,
        },
        [RemoraidIconSize.Small]: {
          size: 16,
          stroke: 2.3,
        },
        [RemoraidIconSize.Tiny]: {
          size: 12,
          stroke: 2.6,
        },
      },
      ScrollArea: {
        scrollbarSize: 8,
        scrollHideDelay: 20,
        type: "hover",
      },
      HoverCard: {
        shadow: "md",
        withArrow: true,
        transitionProps: {
          transition: "pop",
          duration: transitionDurations.short,
        },
        styles: {
          dropdown: { border: "none", background: transparentBackground },
          arrow: { border: "none" },
        },
      },
      Tooltip: {
        withArrow: true,
      },
    },
  };

  // Merge
  return merge(defaultTheme, customTheme);
};

const themeContext = React.createContext<RemoraidTheme>(createRemoraidTheme());

export const useRemoraidTheme = (): RemoraidTheme => {
  return useContext(themeContext);
};
export interface ThemeProviderProps {
  theme?: PartialDeep<RemoraidTheme> | RemoraidThemeCallback;
}

export default function ThemeProvider({
  theme,
  children,
}: PropsWithChildren<ThemeProviderProps>): ReactNode {
  // Style
  const mantineTheme = useMantineTheme();
  const { colorScheme } = useHydratedMantineColorScheme();

  // Helpers
  const remoraidTheme = useMemo(() => {
    const dependencies: Partial<RemoraidThemeDependencies> = {
      mantineTheme,
      colorScheme,
    };
    return createRemoraidTheme(
      typeof theme === "function" ? theme(dependencies) : theme,
      dependencies
    );
  }, [colorScheme, theme]);

  return (
    <themeContext.Provider value={remoraidTheme}>
      {children}
    </themeContext.Provider>
  );
}
