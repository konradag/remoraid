import {
  MantineColorScheme,
  MantineColorShade,
  MantinePrimaryShade,
  MantineSize,
  MantineTheme,
  px,
  rgba,
} from "@mantine/core";

export const co = <T>(
  condition: (value: T) => boolean,
  value: T,
  fallback: T
): T => (condition(value) ? value : fallback);

const isMantinePrimaryShade = (
  primaryShade: MantinePrimaryShade | MantineColorShade
): primaryShade is MantinePrimaryShade => {
  if (isNaN(Number(primaryShade))) {
    return true;
  }
  return false;
};

export const getCustomStyles: (
  theme: MantineTheme,
  colorScheme: MantineColorScheme
) => {
  transparentBackground: string;
  primaryColor: string;
  spacingPx: { [S in MantineSize]: number };
} = (theme, colorScheme) => {
  return {
    transparentBackground:
      colorScheme === "dark"
        ? rgba(theme.colors.dark[8], 0.8)
        : rgba(theme.white, 0.8),
    primaryColor:
      theme.colors[theme.primaryColor][
        isMantinePrimaryShade(theme.primaryShade)
          ? theme.primaryShade[colorScheme === "auto" ? "light" : colorScheme]
          : theme.primaryShade
      ],
    spacingPx: {
      xs: Number(co((v) => !Number.isNaN(v), Number(px(theme.spacing.xs)), 0)),
      sm: Number(co((v) => !Number.isNaN(v), Number(px(theme.spacing.sm)), 0)),
      md: Number(co((v) => !Number.isNaN(v), Number(px(theme.spacing.md)), 0)),
      lg: Number(co((v) => !Number.isNaN(v), Number(px(theme.spacing.lg)), 0)),
      xl: Number(co((v) => !Number.isNaN(v), Number(px(theme.spacing.xl)), 0)),
    },
  };
};
