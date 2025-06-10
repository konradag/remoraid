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
import {
  MantineColorShade,
  MantinePrimaryShade,
  px,
  rgba,
  useMantineTheme,
} from "@mantine/core";
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

const isMantinePrimaryShade = (
  primaryShade: MantinePrimaryShade | MantineColorShade
): primaryShade is MantinePrimaryShade => {
  if (isNaN(Number(primaryShade))) {
    return true;
  }
  return false;
};

export const createRemoraidTheme: (
  customTheme?: Partial<RemoraidTheme>,
  dependencies?: Partial<RemoraidThemeDependencies>
) => RemoraidTheme = (customTheme, dependencies) => {
  const { mantineTheme, colorScheme } = dependencies ?? {};
  const defaultMediumIconProps = { size: "1.125em" };
  let transparentBackground;
  let primaryColor;
  let spacingPx;
  if (mantineTheme && colorScheme) {
    transparentBackground =
      colorScheme === "dark"
        ? rgba(mantineTheme.colors.dark[8], 0.8)
        : rgba(mantineTheme.white, 0.8);
    primaryColor =
      mantineTheme.colors[mantineTheme.primaryColor][
        isMantinePrimaryShade(mantineTheme.primaryShade)
          ? mantineTheme.primaryShade[
              colorScheme === "auto" ? "light" : colorScheme
            ]
          : mantineTheme.primaryShade
      ];
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
  return {
    containerSize: 1300,
    jsonStringifySpace: 2,
    transparentBackground,
    primaryColor,
    spacingPx,
    ...customTheme,
    transitionDurations: {
      [TransitionDuration.Short]: 200,
      [TransitionDuration.Medium]: 350,
      [TransitionDuration.Long]: 500,
      ...customTheme?.transitionDurations,
    },
    breakpoints: {
      [RemoraidBreakpoint.ButtonCollapse]: "md",
      [RemoraidBreakpoint.BadgeGroupCollapse]: "md",
      ...customTheme?.breakpoints,
    },
    scrollAreaProps: {
      scrollbarSize: 8,
      scrollHideDelay: 20,
      type: "hover",
      ...customTheme?.scrollAreaProps,
    },
    alertProps: {
      [AlertCategory.Negative]: {
        icon: <IconAlertCircle {...defaultMediumIconProps} />,
        variant: "light",
        color: "red",
        title: "Attention!",
        ...customTheme?.alertProps?.negative,
      },
      [AlertCategory.Neutral]: {
        icon: <IconInfoCircle {...defaultMediumIconProps} />,
        variant: "light",
        color: mantineTheme?.primaryColor,
        title: "Information",
        ...customTheme?.alertProps?.neutral,
      },
      [AlertCategory.Positive]: {
        icon: <IconCircleCheck {...defaultMediumIconProps} />,
        variant: "light",
        color: "green",
        title: "Success",
        ...customTheme?.alertProps?.positive,
      },
    },
    iconProps: {
      [RemoraidIconSize.Medium]: {
        ...defaultMediumIconProps,
        ...customTheme?.iconProps?.medium,
      },
      [RemoraidIconSize.Tiny]: {
        size: 14,
        stroke: 3,
        ...customTheme?.iconProps?.tiny,
      },
    },
  };
};

const themeContext = React.createContext<RemoraidTheme>(createRemoraidTheme());

export const useRemoraidTheme = (): RemoraidTheme => {
  return useContext(themeContext);
};
export interface ThemeProviderProps {
  theme?: RemoraidTheme | RemoraidThemeCallback;
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
