import { Group, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconPennant } from "@tabler/icons-react";
import { ReactNode } from "react";

export default function Footer(): ReactNode {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  return (
    <Group justify="center" w="100%" py="md">
      <IconPennant
        size={50}
        color={
          colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[3]
        }
      />
    </Group>
  );
}
