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
import {
  Common,
  getDefaultButtonIconSize,
  OptionalIfExtends,
} from "@/core/lib/utils";
import { RemoraidIconSize } from "@/core/lib/types";
import { merge } from "lodash";

export type RemoraidButtonDefaultResponsivity = true;

interface ExplicitRemoraidButtonProps<Responsive extends boolean> {
  responsive: Responsive;
  label: string;
  size?: MantineSize;
  color?: MantineColor;
  breakpoint?: true extends Responsive ? MantineBreakpoint : never;
  collapsed?: false extends Responsive ? boolean : never;
  icon?: Icon;
  iconSize?: RemoraidIconSize;
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

export type RemoraidButtonProps<
  Responsive extends boolean = RemoraidButtonDefaultResponsivity
> = OptionalIfExtends<
  ExplicitRemoraidButtonProps<Responsive>,
  "responsive",
  true,
  Responsive
>;

export default function RemoraidButton<
  Responsive extends boolean = RemoraidButtonDefaultResponsivity
>({
  label,
  responsive: ResponsiveProp,
  breakpoint: breakpointProp,
  collapsed: collapsedProp,
  size = "sm",
  color,
  onClick,
  loading,
  variant = "default",
  mounted = true,
  icon: iconProp,
  iconSize: iconSizeProp,
  componentsProps,
}: RemoraidButtonProps<Responsive>): ReactNode {
  // Props default values
  const responsive: boolean =
    ResponsiveProp ?? (true satisfies RemoraidButtonDefaultResponsivity);
  const breakpoint: MantineBreakpoint = breakpointProp ?? "md";
  const collapsed: boolean = collapsedProp ?? false;
  const iconSize: RemoraidIconSize =
    iconSizeProp ?? getDefaultButtonIconSize(size);
  const Icon: Icon = iconProp ?? IconClick;

  // Contexts
  const theme = useRemoraidTheme();

  // Helpers
  const iconElement = (
    <Icon
      {...merge(
        {},
        theme.componentsProps.icons[iconSize],
        componentsProps?.icon
      )}
    />
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
              hiddenFrom={!responsive ? undefined : breakpoint}
              display={
                !responsive && !collapsed
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
              {iconElement}
            </ActionIcon>
          </Tooltip>
          <Button
            onClick={onClick}
            loading={loading}
            variant={variant}
            size={size}
            color={color}
            leftSection={iconProp ? iconElement : undefined}
            {...componentsProps?.button}
            {...componentsProps?.Button}
            visibleFrom={!responsive ? undefined : breakpoint}
            display={
              !responsive && collapsed
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
