import {
  ActionIconProps,
  ButtonProps as MantineButtonProps,
  MantineBreakpoint,
  TooltipProps,
  Box,
} from "@mantine/core";
import { IconProps } from "@tabler/icons-react";
import { ReactNode } from "react";
import { RemoraidButtonProps } from "@/core/lib/types";
import { Common } from "@/core/lib/utils";
import Button, { ButtonProps } from "../Button";

export interface ResponsiveButtonProps extends RemoraidButtonProps {
  breakpoint?: MantineBreakpoint;
  componentsProps?: {
    Button?: Partial<ButtonProps>;
    button?: Omit<
      Partial<Common<MantineButtonProps, ActionIconProps>>,
      "variant"
    >;
    tooltip?: Partial<TooltipProps>;
    icon?: Partial<IconProps>;
  };
}

export default function ResponsiveButton({
  breakpoint,
  componentsProps,
  ...remoraidButtonProps
}: ResponsiveButtonProps): ReactNode {
  return (
    <>
      <Box hiddenFrom={breakpoint ?? "md"}>
        <Button
          {...remoraidButtonProps}
          {...componentsProps?.Button}
          componentsProps={{
            tooltip: componentsProps?.tooltip,
            icon: componentsProps?.icon,
            ...componentsProps?.Button?.componentsProps,
            actionIcon: {
              ...componentsProps?.button,
              ...componentsProps?.Button?.componentsProps?.actionIcon,
            },
          }}
          collapsed={true}
        />
      </Box>
      <Box visibleFrom={breakpoint ?? "md"}>
        <Button
          {...remoraidButtonProps}
          {...componentsProps?.Button}
          componentsProps={{
            tooltip: componentsProps?.tooltip,
            icon: componentsProps?.icon,
            ...componentsProps?.Button?.componentsProps,
            button: {
              ...componentsProps?.button,
              ...componentsProps?.Button?.componentsProps?.button,
            },
          }}
          collapsed={false}
        />
      </Box>
    </>
  );
}
