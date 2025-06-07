import { createContext, ReactNode, useContext } from "react";
import { useRemoraidTheme } from "../../RemoraidProvider/ThemeProvider";
import { Table } from "@mantine/core";
import { SettingsTableOptions } from "@/core/lib/types";
import Row, { SettingsTableRowProps } from "./Row";
import { OnlyChildrenOf } from "@/core/lib/utils";

export const defaultSettingsTableOptions = {
  leftColumnWidth: "30%",
};
const settingsTableOptionsContext = createContext<SettingsTableOptions>(
  defaultSettingsTableOptions
);
export const useSettingsTableOptions = (): SettingsTableOptions => {
  return useContext(settingsTableOptionsContext);
};

export interface SettingsTableProps {
  children: OnlyChildrenOf<typeof Row, SettingsTableRowProps>;
  leftColumnWidth?: string | number;
}

function SettingsTable({
  children,
  leftColumnWidth,
}: SettingsTableProps): ReactNode {
  const theme = useRemoraidTheme();

  return (
    <settingsTableOptionsContext.Provider
      value={{
        leftColumnWidth:
          leftColumnWidth ?? defaultSettingsTableOptions.leftColumnWidth,
      }}
    >
      <Table
        bg={theme.transparentBackground}
        withTableBorder
        variant="vertical"
        layout="fixed"
      >
        <Table.Tbody>{children}</Table.Tbody>
      </Table>
    </settingsTableOptionsContext.Provider>
  );
}

export interface SettingsTable extends React.FC<SettingsTableProps> {
  Row: typeof Row;
}
(SettingsTable as SettingsTable).Row = Row;
export default SettingsTable;
