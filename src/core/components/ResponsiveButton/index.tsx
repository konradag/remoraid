import {
  ActionIcon,
  ActionIconProps,
  ActionIconVariant,
  Button,
  ButtonProps,
  ButtonVariant,
  MantineBreakpoint,
  Tooltip,
  TooltipProps,
} from "@mantine/core";
import { Icon, IconClick, IconProps } from "@tabler/icons-react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { ReactNode } from "react";
import { ResponsiveButtonSize } from "@/core/lib/types";
import { Common } from "@/core/lib/utils";

export interface ResponsiveButtonProps {
  label: string;
  icon?: Icon;
  onClick?: () => void;
  breakpoint?: MantineBreakpoint;
  loading?: boolean;
  variant?: Extract<ButtonVariant, ActionIconVariant>;
  fixedSize?: ResponsiveButtonSize;
  componentsProps?: {
    tooltip?: Partial<TooltipProps>;
    button?: Partial<Common<ButtonProps, ActionIconProps>>;
    icon?: Partial<IconProps>;
    Button?: Partial<ButtonProps>;
    ActionIcon?: Partial<ActionIconProps>;
  };
}

export const isResponsiveButtonProps = (e: any): e is ResponsiveButtonProps => {
  if (typeof e !== "object") {
    return false;
  }
  if (!("label" in e)) {
    return false;
  }
  return true;
};

export default function ResponsiveButton(
  props: ResponsiveButtonProps
): ReactNode {
  const {
    onClick,
    label,
    loading,
    variant,
    componentsProps,
    breakpoint,
    fixedSize,
  } = props;
  const theme = useRemoraidTheme();

  // Helpers
  const iconProps = { ...theme.iconProps.medium, ...componentsProps?.icon };
  const icon = props.icon ? (
    <props.icon {...iconProps} />
  ) : (
    <IconClick {...iconProps} />
  );

  return (
    <>
      <Tooltip label={label} {...componentsProps?.tooltip}>
        <ActionIcon
          variant={variant || "default"}
          onClick={onClick}
          loading={loading}
          size="input-sm"
          aria-label="Refresh"
          {...componentsProps?.button}
          {...componentsProps?.ActionIcon}
          display={fixedSize && fixedSize !== "small" ? "none" : undefined}
          hiddenFrom={fixedSize === "small" ? undefined : breakpoint || "md"}
        >
          {icon}
        </ActionIcon>
      </Tooltip>
      <Button
        onClick={onClick}
        loading={loading}
        variant={variant || "default"}
        leftSection={props.icon ? icon : undefined}
        {...componentsProps?.button}
        {...componentsProps?.Button}
        display={fixedSize && fixedSize !== "medium" ? "none" : undefined}
        visibleFrom={fixedSize === "medium" ? undefined : breakpoint || "md"}
      >
        {label}
      </Button>
    </>
  );
}
