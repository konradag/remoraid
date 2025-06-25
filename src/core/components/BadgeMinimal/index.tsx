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

export interface BadgeMinimalProps {
  label: string;
  tooltip?: string;
  mounted?: boolean;
  componentsProps?: {
    badge?: BadgeProps;
    transition?: Partial<Omit<TransitionProps, "mounted">>;
    tooltip?: TooltipProps;
  };
}

export default function BadgeMinimal(props: BadgeMinimalProps): ReactNode {
  const { label, tooltip, mounted, componentsProps } = props;

  // Style
  const theme = useRemoraidTheme();

  return (
    <Transition
      mounted={mounted !== false}
      transition="fade"
      duration={theme.transitionDurations.short}
      timingFunction="ease"
      {...componentsProps?.transition}
    >
      {(transitionStyle) => (
        <Tooltip
          disabled={!tooltip}
          label={tooltip}
          {...componentsProps?.tooltip}
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
