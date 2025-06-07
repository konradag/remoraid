import { ReactElement, ReactNode } from "react";
import SettingsTable from "../SettingsWidget/SettingsTable";
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
}

export default function NavbarSettingsWidget({
  additionalRows,
  widgetProps,
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
      custom={!isEqual(userExperience.navbarSettings, initialUserExperience)}
    >
      <SettingsTable
        children={[
          ...(additionalRows ?? []),
          <SettingsTable.Row label="Select which pages you want to display or hide">
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
                    hiddenPagesNavbar: app.navigablePages
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
                          width="100%"
                          height="100%"
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
        ]}
      />
    </SettingsWidget>
  );
}
