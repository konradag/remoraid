import {
  ActionIcon,
  ActionIconProps,
  ActionIconVariant,
  Button,
  ButtonProps,
  ButtonVariant,
  MantineBreakpoint,
  MantineSize,
  Tooltip,
  TooltipProps,
} from "@mantine/core";
import { Icon, IconClick, IconProps } from "@tabler/icons-react";
import { ReactNode } from "react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { Common } from "@/core/lib/utils";

export interface RemoraidButtonProps {
  label: string;
  responsive?: boolean;
  breakpoint?: MantineBreakpoint;
  collapsed?: boolean;
  size?: MantineSize;
  icon?: Icon;
  onClick?: () => void;
  loading?: boolean;
  variant?: Extract<ButtonVariant, ActionIconVariant>;
  componentsProps: {
    tooltip?: Partial<TooltipProps>;
    icon?: Partial<IconProps>;
    button: Omit<
      Partial<Common<ButtonProps, ActionIconProps>>,
      "variant" | "onClick" | "size" | "loading"
    >;
    Button?: Partial<ButtonProps>;
    ActionIcon?: Partial<ActionIconProps>;
  };
}

export const isRemoraidButtonProps = (e: any): e is RemoraidButtonProps => {
  if (typeof e !== "object") {
    return false;
  }
  if (!("label" in e)) {
    return false;
  }
  return true;
};

export default function RemoraidButton({
  label,
  responsive,
  breakpoint,
  collapsed,
  size,
  onClick,
  loading,
  variant,
  componentsProps,
  ...props
}: RemoraidButtonProps): ReactNode {
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
          variant={variant ?? "default"}
          onClick={onClick}
          loading={loading}
          size={size ? `input-${size}` : undefined}
          {...componentsProps?.button}
          {...componentsProps?.ActionIcon}
          hiddenFrom={breakpoint ?? "md"}
          display={
            responsive === false && collapsed !== true
              ? "none"
              : componentsProps?.ActionIcon?.display ??
                componentsProps?.button?.display
          }
        >
          {icon}
        </ActionIcon>
      </Tooltip>
      <Button
        onClick={onClick}
        loading={loading}
        variant={variant ?? "default"}
        size={size}
        leftSection={props.icon ? icon : undefined}
        {...componentsProps?.button}
        {...componentsProps?.Button}
        visibleFrom={breakpoint ?? "md"}
        display={
          responsive === false && collapsed
            ? "none"
            : componentsProps?.Button?.display ??
              componentsProps?.button?.display
        }
      >
        {label}
      </Button>
    </>
  );
}
