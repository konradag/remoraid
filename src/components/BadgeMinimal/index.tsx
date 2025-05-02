import {
  Badge,
  BadgeProps,
  Tooltip,
  TooltipProps,
  Transition,
  TransitionProps,
} from "@mantine/core";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";

export interface BadgeMinimalProps {
  label: string;
  tooltip?: string;
  mounted?: boolean;
  componentsProps?: {
    badge?: BadgeProps;
    transition?: Omit<TransitionProps, "mounted">;
    tooltip?: TooltipProps;
  };
}

export const isBadgeMinimalProps = (e: any): e is BadgeMinimalProps => {
  if (typeof e !== "object") {
    return false;
  }
  if (!("label" in e)) {
    return false;
  }
  return true;
};

export default function BadgeMinimal(props: BadgeMinimalProps) {
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
            style={{ ...transitionStyle, cursor: "pointer" }}
            {...componentsProps?.badge}
          >
            {label}
          </Badge>
        </Tooltip>
      )}
    </Transition>
  );
}
