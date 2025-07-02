import { Group, GroupProps } from "@mantine/core";
import { IconPennant, IconProps } from "@tabler/icons-react";
import { ReactNode } from "react";

export interface FooterMinimalProps {
  componentsProps?: {
    container?: Partial<GroupProps>;
    icon?: Partial<IconProps>;
  };
}

export default function FooterMinimal({
  componentsProps,
}: FooterMinimalProps): ReactNode {
  return (
    <Group justify="center" w="100%" {...componentsProps?.container}>
      <IconPennant
        size={50}
        color="var(--mantine-color-default-border)"
        {...componentsProps?.icon}
      />
    </Group>
  );
}
