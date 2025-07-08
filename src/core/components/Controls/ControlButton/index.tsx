import {
  ActionIcon,
  ActionIconProps,
  Tooltip,
  TooltipProps,
  Transition,
  TransitionProps,
} from "@mantine/core";
import { Icon, IconClick, IconProps } from "@tabler/icons-react";
import { ComponentProps, ReactNode } from "react";
import { useRemoraidTheme } from "../../RemoraidProvider/ThemeProvider";
import { RemoraidIconSize } from "@/core/lib/types";

export interface ControlButtonProps {
  icon: Icon;
  mounted?: boolean;
  tooltip?: string;
  size?: ActionIconProps["size"];
  iconSize?: RemoraidIconSize;
  color?: ActionIconProps["color"];
  onClick?: ComponentProps<typeof ActionIcon<"button">>["onClick"];
  order?: number;
  componentsProps?: {
    transition?: Partial<TransitionProps>;
    tooltip?: Partial<TooltipProps>;
    button?: Partial<ActionIconProps>;
    icon?: Partial<IconProps>;
  };
}

export default function ControlButton({
  icon: Icon = IconClick,
  mounted = true,
  size = "xs",
  iconSize = RemoraidIconSize.Tiny,
  onClick,
  order,
  color,
  tooltip,
  componentsProps,
}: ControlButtonProps): ReactNode {
  const theme = useRemoraidTheme();

  return (
    <Transition
      mounted={mounted}
      transition="pop-top-right"
      duration={theme.transitionDurations.short}
      timingFunction="ease"
      {...componentsProps?.transition}
    >
      {(transitionStyle) => (
        <Tooltip
          label={tooltip}
          disabled={!Boolean(tooltip)}
          {...componentsProps?.tooltip}
        >
          <ActionIcon
            size={size}
            color={color}
            onClick={onClick}
            radius="xl"
            {...componentsProps?.button}
            style={{
              ...transitionStyle,
              order,
              ...componentsProps?.button?.style,
            }}
          >
            <Icon {...theme.iconProps[iconSize]} {...componentsProps?.icon} />
          </ActionIcon>
        </Tooltip>
      )}
    </Transition>
  );
}
