import {
  ActionIcon,
  ActionIconVariant,
  Button,
  ButtonVariant,
  MantineBreakpoint,
  Tooltip,
  TooltipProps,
} from "@mantine/core";
import { Icon, IconClick } from "@tabler/icons-react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { ReactNode } from "react";

export interface ResponsiveButtonProps {
  label: string;
  icon?: Icon;
  onClick?: () => void;
  breakpoint?: MantineBreakpoint;
  loading?: boolean;
  variant?: Extract<ButtonVariant, ActionIconVariant>;
  componentsProps?: {
    tooltip?: Partial<TooltipProps>;
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
  const { onClick, label, loading, variant, componentsProps, breakpoint } =
    props;
  const theme = useRemoraidTheme();

  // Helpers
  const icon = props.icon ? (
    <props.icon {...theme.iconProps.medium} />
  ) : (
    <IconClick {...theme.iconProps.medium} />
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
          hiddenFrom={breakpoint || "md"}
        >
          {icon}
        </ActionIcon>
      </Tooltip>
      <Button
        onClick={onClick}
        loading={loading}
        variant={variant || "default"}
        leftSection={props.icon ? icon : undefined}
        visibleFrom={breakpoint || "md"}
      >
        {label}
      </Button>
    </>
  );
}
