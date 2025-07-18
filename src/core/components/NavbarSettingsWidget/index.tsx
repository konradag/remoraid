import { ComponentProps, ReactNode } from "react";
import SettingsTable, {
  SettingsTableProps,
} from "../SettingsWidget/SettingsTable";
import SettingsWidget from "../SettingsWidget";
import { WidgetProps } from "../Widget";
import { useRemoraidUserExperience } from "../RemoraidProvider/CoreUserExperienceProvider";
import { isEqual } from "lodash";
import { Chip, Group } from "@mantine/core";
import { useRemoraidApp } from "../AppShell/AppProvider";
import { IconLink } from "@tabler/icons-react";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import {
  asElementOrPropsOfType,
  ElementOfType,
  isValidElementOfType,
} from "@/core/lib/utils";

export const defaultNavbarSettingsWidgetId = "navbar-settings";

export interface NavbarSettingsWidgetProps {
  additionalRows?: (
    | ComponentProps<typeof SettingsTable.Row>
    | ElementOfType<typeof SettingsTable.Row>
  )[];
  widgetProps?: Partial<WidgetProps>;
  componentsProps?: { table: Partial<SettingsTableProps> };
}

export default function NavbarSettingsWidget({
  additionalRows: additionalRowsProp,
  widgetProps,
  componentsProps,
}: NavbarSettingsWidgetProps): ReactNode {
  // Type safety
  const additionalRows = additionalRowsProp?.map((additionalRow) =>
    asElementOrPropsOfType(
      SettingsTable.Row,
      additionalRow,
      "Check the 'additionalRows' property of 'NavbarSettingsWidget'."
    )
  );

  // Contexts
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
          navbar: initialUserExperience.navbar,
        }));
      }}
      custom={!isEqual(userExperience.navbar, initialUserExperience.navbar)}
    >
      <SettingsTable {...componentsProps?.table}>
        <SettingsTable.Row
          key="select-hidden-pages"
          label="Select which pages you want to display or hide"
        >
          <Chip.Group
            multiple
            value={app.navigablePages
              .filter(
                (p) => !userExperience.navbar.hiddenPages.includes(p.href)
              )
              .map((p) => p.href)}
            onChange={(newValue) => {
              updateUserExperience((prev) => ({
                ...prev,
                navbar: {
                  ...prev.navbar,
                  hiddenPages: app.navigablePages
                    .filter((p) => !newValue.includes(p.href))
                    .map((p) => p.href),
                },
              }));
            }}
          >
            <Group justify="flex-start" gap="xs">
              {app.navigablePages.map(
                ({ label, href, icon: Icon = IconLink }, i) => {
                  return (
                    <Chip
                      key={i}
                      value={href}
                      icon={
                        <Icon
                          {...theme.componentsProps.icons.small}
                          color="var(--mantine-primary-color-filled)"
                        />
                      }
                      variant="outline"
                      // disabled={href === "/settings"}
                    >
                      {label}
                    </Chip>
                  );
                }
              )}
            </Group>
          </Chip.Group>
        </SettingsTable.Row>
        {additionalRows &&
          additionalRows.map((row, i) => {
            if (isValidElementOfType(SettingsTable.Row, row)) {
              return row;
            }
            return <SettingsTable.Row key={i} {...row} />;
          })}
      </SettingsTable>
    </SettingsWidget>
  );
}
