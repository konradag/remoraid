import { Group } from "@mantine/core";
import { IconPennant } from "@tabler/icons-react";
import { ReactNode } from "react";

export default function Footer(): ReactNode {
  return (
    <Group justify="center" w="100%" py="md">
      <IconPennant size={50} color="var(--mantine-color-default-border)" />
    </Group>
  );
}
