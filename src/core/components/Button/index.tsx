import {
  ActionIcon,
  Tooltip,
  Button as MantineButton,
  TooltipProps,
  ActionIconProps,
} from "@mantine/core";
import { IconClick, IconProps } from "@tabler/icons-react";
import { ReactNode } from "react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { RemoraidButtonProps } from "@/core/lib/types";

export interface ButtonProps extends RemoraidButtonProps {
  collapsed?: boolean;
  componentsProps?: {
    tooltip?: Partial<TooltipProps>;
    icon?: Partial<IconProps>;
    button?: Partial<ButtonProps>;
    actionIcon?: Partial<ActionIconProps>;
  };
}

export default function Button({
  label,
  collapsed,
  componentsProps,
  onClick,
  loading,
  variant,
  ...props
}: ButtonProps): ReactNode {
  const theme = useRemoraidTheme();

  // Helpers
  const iconProps = { ...theme.iconProps.medium, ...componentsProps?.icon };
  const icon = props.icon ? (
    <props.icon {...iconProps} />
  ) : (
    <IconClick {...iconProps} />
  );

  if (collapsed === true) {
    return (
      <Tooltip label={label} {...componentsProps?.tooltip}>
        <ActionIcon
          variant={variant ?? "default"}
          onClick={onClick}
          loading={loading}
          size="input-sm"
          aria-label="Refresh"
          {...componentsProps?.actionIcon}
        >
          {icon}
        </ActionIcon>
      </Tooltip>
    );
  }
  return (
    <MantineButton
      onClick={onClick}
      loading={loading}
      variant={variant ?? "default"}
      leftSection={props.icon ? icon : undefined}
      {...componentsProps?.button}
    >
      {label}
    </MantineButton>
  );
}
