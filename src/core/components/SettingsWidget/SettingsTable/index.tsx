import { ComponentProps, createContext, ReactNode, useContext } from "react";
import { useRemoraidTheme } from "../../RemoraidProvider/ThemeProvider";
import { Table } from "@mantine/core";
import { SettingsTableOptions } from "@/core/lib/types";
import RowComponent from "./Row";
import { PropsWithChildrenOfType } from "@/core/lib/utils";

export const defaultSettingsTableOptions = {
  leftColumnWidth: "38.2%",
};
const settingsTableOptionsContext = createContext<SettingsTableOptions>(
  defaultSettingsTableOptions
);
export const useSettingsTableOptions = (): SettingsTableOptions => {
  return useContext(settingsTableOptionsContext);
};

export interface SettingsTableProps {
  leftColumnWidth?: string | number;
}

function SettingsTable({
  leftColumnWidth,
  children,
}: PropsWithChildrenOfType<
  typeof RowComponent,
  SettingsTableProps
>): ReactNode {
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

export interface SettingsTable
  extends React.FC<ComponentProps<typeof SettingsTable>> {
  Row: typeof RowComponent;
}
export default Object.assign(SettingsTable, {
  Row: RowComponent,
}) as SettingsTable;
