import {
  ActionIcon,
  ActionIconProps,
  ActionIconVariant,
  Button,
  ButtonProps,
  ButtonVariant,
  MantineBreakpoint,
  MantineColor,
  MantineSize,
  Tooltip,
  TooltipProps,
  Transition,
  TransitionProps,
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
  color?: MantineColor;
  icon?: Icon;
  onClick?: () => void;
  loading?: boolean;
  variant?: Extract<ButtonVariant, ActionIconVariant>;
  mounted?: TransitionProps["mounted"];
  componentsProps?: {
    tooltip?: Partial<TooltipProps>;
    icon?: Partial<IconProps>;
    button?: Omit<
      Partial<Common<ButtonProps, ActionIconProps>>,
      "variant" | "onClick" | "size" | "color" | "loading"
    >;
    transition?: Partial<Omit<TransitionProps, "mounted">>;
    Button?: Partial<ButtonProps>;
    ActionIcon?: Partial<ActionIconProps>;
  };
}

export default function RemoraidButton({
  label,
  responsive,
  breakpoint,
  collapsed,
  size,
  color,
  onClick,
  loading,
  variant = "default",
  mounted = true,
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
    <Transition
      mounted={mounted}
      transition="fade"
      duration={theme.transitionDurations.short}
      timingFunction="ease"
      {...componentsProps?.transition}
    >
      {(transitionStyle) => (
        <>
          <Tooltip label={label} {...componentsProps?.tooltip}>
            <ActionIcon
              aria-label={label}
              variant={variant}
              onClick={onClick}
              loading={loading}
              size={size ? `input-${size}` : "input-sm"}
              color={color}
              {...componentsProps?.button}
              {...componentsProps?.ActionIcon}
              hiddenFrom={responsive === false ? undefined : breakpoint ?? "md"}
              display={
                responsive === false && collapsed !== true
                  ? "none"
                  : componentsProps?.ActionIcon?.display ??
                    componentsProps?.button?.display
              }
              style={{
                ...transitionStyle,
                ...(componentsProps?.ActionIcon?.style ??
                  componentsProps?.button?.style),
              }}
            >
              {icon}
            </ActionIcon>
          </Tooltip>
          <Button
            onClick={onClick}
            loading={loading}
            variant={variant ?? "default"}
            size={size}
            color={color}
            leftSection={props.icon ? icon : undefined}
            {...componentsProps?.button}
            {...componentsProps?.Button}
            visibleFrom={responsive === false ? undefined : breakpoint ?? "md"}
            display={
              responsive === false && collapsed
                ? "none"
                : componentsProps?.Button?.display ??
                  componentsProps?.button?.display
            }
            style={{
              ...transitionStyle,
              ...(componentsProps?.Button?.style ??
                componentsProps?.button?.style),
            }}
          >
            {label}
          </Button>
        </>
      )}
    </Transition>
  );
}
