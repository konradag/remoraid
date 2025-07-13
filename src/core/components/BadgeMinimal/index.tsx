import {
  Badge,
  BadgeProps,
  Tooltip,
  TooltipProps,
  Transition,
  TransitionProps,
} from "@mantine/core";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { ReactNode } from "react";
import { merge } from "lodash";

export interface BadgeMinimalProps {
  label: string;
  tooltip?: string;
  mounted?: TransitionProps["mounted"];
  componentsProps?: {
    badge?: BadgeProps;
    transition?: Partial<Omit<TransitionProps, "mounted">>;
    tooltip?: TooltipProps;
  };
}

export default function BadgeMinimal({
  label,
  tooltip,
  mounted = true,
  componentsProps,
}: BadgeMinimalProps): ReactNode {
  const theme = useRemoraidTheme();

  return (
    <Transition
      mounted={mounted}
      transition="fade"
      duration={theme.transitionDurations.short}
      timingFunction="ease"
      {...componentsProps?.transition}
    >
      {(transitionStyle) => (
        <Tooltip
          {...merge(
            theme.componentsProps.Tooltip,
            { label: tooltip, disabled: !Boolean(tooltip) },
            componentsProps?.tooltip
          )}
        >
          <Badge
            variant="default"
            {...componentsProps?.badge}
            style={{
              ...transitionStyle,
              cursor: "pointer",
              ...componentsProps?.badge?.style,
            }}
          >
            {label}
          </Badge>
        </Tooltip>
      )}
    </Transition>
  );
}
