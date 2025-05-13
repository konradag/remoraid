import {
  PartialRemoraidTheme,
  RemoraidTheme,
  RemoraidThemeCallback,
} from "@/core/lib/types";
import { co } from "@/core/lib/utils";
import {
  MantineColorScheme,
  MantineColorShade,
  MantinePrimaryShade,
  MantineTheme,
  px,
  rgba,
  useMantineColorScheme,
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
  mantineTheme?: MantineTheme,
  colorScheme?: MantineColorScheme
) => RemoraidTheme = (customTheme, mantineTheme, colorScheme) => {
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
    complete: true,
    transitionDurations: {
      short: 200,
      medium: 350,
      long: 500,
    },
    breakpoints: {
      buttonCollapse: "md",
      badgeGroupCollapse: "md",
    },
    scrollAreaProps: {
      scrollbarSize: 8,
      scrollHideDelay: 20,
      type: "hover",
    },
    containerSize: 1300,
    alertProps: {
      negative: {
        icon: <IconAlertCircle {...defaultMediumIconProps} />,
        variant: "light",
        color: "red",
        title: "Attention!",
        // bg: transparentBackground,
      },
      neutral: {
        icon: <IconInfoCircle {...defaultMediumIconProps} />,
        variant: "light",
        color: mantineTheme?.primaryColor,
        title: "Information",
        // bg: transparentBackground,
      },
      positive: {
        icon: <IconCircleCheck {...defaultMediumIconProps} />,
        variant: "light",
        color: "green",
        title: "Success",
        // bg: transparentBackground,
      },
    },
    iconProps: {
      medium: defaultMediumIconProps,
      tiny: { size: 14, stroke: 3 },
    },
    transparentBackground,
    primaryColor,
    spacingPx,
    ...customTheme,
  };
};

export const isRemoraidTheme = (
  x?: RemoraidTheme | PartialRemoraidTheme | RemoraidThemeCallback
): x is RemoraidTheme => {
  if (!x) {
    return false;
  }
  if (typeof x !== "object") {
    return false;
  }
  if (!("complete" in x)) {
    return false;
  }
  return true;
};

const themeContext = React.createContext<RemoraidTheme>(createRemoraidTheme());

export const useRemoraidTheme = (): RemoraidTheme => {
  return useContext(themeContext);
};
export interface ThemeProviderProps {
  theme?: RemoraidTheme | RemoraidThemeCallback | PartialRemoraidTheme;
}

export default function ThemeProvider({
  children,
  theme,
}: PropsWithChildren<ThemeProviderProps>): ReactNode {
  // Style
  const mantineTheme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Helpers
  const remoraidTheme = useMemo(() => {
    let value: RemoraidTheme;
    if (isRemoraidTheme(theme)) {
      value = theme;
    } else if (typeof theme === "function") {
      value = theme(mantineTheme, colorScheme);
    } else {
      value = createRemoraidTheme(theme, mantineTheme, colorScheme);
    }
    return value;
  }, [colorScheme]);

  return (
    <themeContext.Provider value={remoraidTheme}>
      {children}
    </themeContext.Provider>
  );
}
