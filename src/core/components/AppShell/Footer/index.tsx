import { Group, useMantineTheme } from "@mantine/core";
import { IconPennant } from "@tabler/icons-react";
import { ReactNode } from "react";
import { useHydratedMantineColorScheme } from "../../RemoraidProvider/HydrationStatusProvider";

export default function Footer(): ReactNode {
  const theme = useMantineTheme();
  const { colorScheme } = useHydratedMantineColorScheme();
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
