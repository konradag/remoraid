import { getCustomStyles } from "@/lib/utils";
import {
  ActionIcon,
  ActionIconVariant,
  Button,
  ButtonVariant,
  MantineBreakpoint,
  Tooltip,
  TooltipProps,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { Icon } from "@tabler/icons-react";

export interface ResponsiveButtonProps {
  label: string;
  icon: Icon;
  onClick?: () => void;
  breakpoint?: MantineBreakpoint;
  loading?: boolean;
  variant?: Extract<ButtonVariant, ActionIconVariant>;
  componentsProps?: {
    tooltip?: TooltipProps;
  };
}

export const isResponsiveButtonProps = (e: any): e is ResponsiveButtonProps => {
  if (typeof e !== "object") {
    return false;
  }
  if (!("label" in e) || !("icon" in e)) {
    return false;
  }
  return true;
};

export default function ResponsiveButton(props: ResponsiveButtonProps) {
  const { onClick, label, loading, variant, componentsProps, breakpoint } =
    props;

  // Style
  const mantineTheme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { iconSize } = getCustomStyles(mantineTheme, colorScheme);

  return (
    <>
      <Tooltip label={label} {...componentsProps?.tooltip}>
        <ActionIcon
          variant={variant || "default"}
          onClick={onClick}
          loading={loading}
          size="input-sm"
          aria-label="Refresh"
          hiddenFrom={breakpoint || "md"}
        >
          <props.icon size={iconSize} />
        </ActionIcon>
      </Tooltip>
      <Button
        onClick={onClick}
        loading={loading}
        variant={variant || "default"}
        leftSection={<props.icon size={iconSize} />}
        visibleFrom={breakpoint || "md"}
      >
        {label}
      </Button>
    </>
  );
}
