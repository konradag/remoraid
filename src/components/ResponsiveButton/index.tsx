import {
  ActionIcon,
  ActionIconVariant,
  Button,
  ButtonVariant,
  MantineBreakpoint,
  Tooltip,
  TooltipProps,
} from "@mantine/core";
import { Icon } from "@tabler/icons-react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";

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
  const theme = useRemoraidTheme();

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
          <props.icon {...theme.iconProps.medium} />
        </ActionIcon>
      </Tooltip>
      <Button
        onClick={onClick}
        loading={loading}
        variant={variant || "default"}
        leftSection={<props.icon {...theme.iconProps.medium} />}
        visibleFrom={breakpoint || "md"}
      >
        {label}
      </Button>
    </>
  );
}
