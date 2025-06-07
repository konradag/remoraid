import { Table, Text } from "@mantine/core";
import { useSettingsTableOptions } from "..";
import { PropsWithChildren, ReactNode } from "react";

export interface SettingsTableRowProps {
  label: string;
}

export default function Row({
  children,
  label,
}: PropsWithChildren<SettingsTableRowProps>): ReactNode {
  const options = useSettingsTableOptions();

  return (
    <Table.Tr>
      <Table.Th w={options.leftColumnWidth}>
        <Text size="sm">{label}</Text>
      </Table.Th>
      <Table.Td py="xs">{children}</Table.Td>
    </Table.Tr>
  );
}
