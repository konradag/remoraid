import { cloneElement, ReactElement, ReactNode } from "react";
import SettingsTable, {
  SettingsTableProps,
} from "../SettingsWidget/SettingsTable";
import SettingsWidget from "../SettingsWidget";
import { WidgetProps } from "../Widget";
import {
  defaultNavbarSettings,
  useRemoraidUserExperience,
} from "../RemoraidProvider/CoreUserExperienceProvider";
import { isEqual } from "lodash";
import { SettingsTableRowProps } from "../SettingsWidget/SettingsTable/Row";
import { Chip, Group } from "@mantine/core";
import { useRemoraidApp } from "../AppShell/AppProvider";
import { IconLink } from "@tabler/icons-react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";

export const defaultNavbarSettingsWidgetId = "navbar-settings";

export interface NavbarSettingsWidgetProps {
  additionalRows?: ReactElement<
    SettingsTableRowProps,
    typeof SettingsTable.Row
  >[];
  widgetProps?: Partial<WidgetProps>;
  componentsProps?: { table: Partial<Omit<SettingsTableProps, "children">> };
}

export default function NavbarSettingsWidget({
  additionalRows,
  widgetProps,
  componentsProps,
}: NavbarSettingsWidgetProps): ReactNode {
  const { userExperience, updateUserExperience, initialUserExperience } =
    useRemoraidUserExperience();
  const app = useRemoraidApp();
  const theme = useRemoraidTheme();

  return (
    <SettingsWidget
      widgetProps={{
        id: defaultNavbarSettingsWidgetId,
        title: "Navbar Settings",
        ...widgetProps,
      }}
      onRestoreDefaultValues={() => {
        updateUserExperience((prev) => ({
          ...prev,
          navbarSettings: defaultNavbarSettings[userExperience.navbarVariant],
        }));
      }}
      custom={
        !isEqual(
          userExperience.navbarSettings,
          initialUserExperience.navbarSettings
        )
      }
    >
      <SettingsTable
        children={[
          <SettingsTable.Row
            key="select-hidden-pages"
            label="Select which pages you want to display or hide"
          >
            <Chip.Group
              multiple
              value={app.navigablePages
                .filter(
                  (p) =>
                    !userExperience.navbarSettings.hiddenPages.includes(p.href)
                )
                .map((p) => p.href)}
              onChange={(newValue) => {
                updateUserExperience((prev) => ({
                  ...prev,
                  navbarSettings: {
                    ...prev.navbarSettings,
                    hiddenPages: app.navigablePages
                      .filter((p) => !newValue.includes(p.href))
                      .map((p) => p.href),
                  },
                }));
              }}
            >
              <Group justify="flex-start" gap="xs">
                {app.navigablePages
                  .map((p) => ({ ...p, icon: p.icon ?? IconLink }))
                  .map((p, i) => (
                    <Chip
                      value={p.href}
                      key={i}
                      icon={
                        <p.icon
                          {...theme.iconProps.tiny}
                          color={theme.primaryColor}
                        />
                      }
                      variant="outline"
                      // disabled={p.href === "/settings"}
                    >
                      {p.label}
                    </Chip>
                  ))}
              </Group>
            </Chip.Group>
          </SettingsTable.Row>,
          ...(additionalRows ?? []).map((row, i) =>
            row.key ? row : cloneElement(row, { key: i })
          ),
        ]}
        {...componentsProps?.table}
      />
    </SettingsWidget>
  );
}
