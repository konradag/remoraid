import { createTheme } from "@mantine/core";
import { merge } from "lodash";
import { defaultTransitionDurations } from "remoraid/core";

export const createMantineTheme: typeof createTheme = (
  customTheme,
  ...props
) => {
  return createTheme(
    merge(
      {
        headings: { fontWeight: "500" },
        components: {
          Menu: {
            defaultProps: {
              withArrow: true,
              transitionProps: {
                duration: defaultTransitionDurations.short,
              },
            },
          },
          Tooltip: {
            defaultProps: {
              withArrow: true,
              transitionProps: {
                duration: defaultTransitionDurations.short,
              },
            },
          },
          HoverCard: {
            defaultProps: {
              withArrow: true,
              transitionProps: {
                duration: defaultTransitionDurations.short,
              },
            },
          },
          ScrollArea: {
            defaultProps: {
              scrollbarSize: 8,
              scrollHideDelay: 20,
              type: "hover",
              styles: { thumb: { zIndex: 5 } },
            },
          },
        },
      },
      customTheme
    ),
    ...props
  );
};
