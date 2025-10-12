import { ComponentProps, ReactNode } from "react";
import { isEqual } from "lodash";
import { Select } from "@mantine/core";
import SettingsTable from "../SettingsWidget/SettingsTable";
import {
  asElementOrPropsOfType,
  ElementOfType,
  isValidElementOfType,
} from "@/core/lib/utils";
import { WidgetProps } from "../Widget";
import { SettingsTableRowProps } from "../SettingsWidget/SettingsTable/Row";
import { useRemoraidApp } from "../AppShell/AppProvider";
import { useAppShellUserExperience } from "../AppShell/AppShellUserExperienceProvider";
import { FooterPosition, FrameLayoutSection } from "@/core/lib/types";
import SettingsWidget from "../SettingsWidget";
import { supportedFooterPositions } from "../AppShell/Footer";

export const defaultFooterSettingsWidgetId = "footer-settings";

export interface FooterSettingsWidgetProps {
  additionalRows?: (
    | ComponentProps<typeof SettingsTable.Row>
    | ElementOfType<typeof SettingsTable.Row>
  )[];
  widgetProps?: Partial<WidgetProps>;
  componentsProps?: { table: Partial<SettingsTableRowProps> };
}

export default function FooterSettingsWidget({
  additionalRows: additionalRowsProp,
  widgetProps,
  componentsProps,
}: FooterSettingsWidgetProps): ReactNode {
  // Type safety
  const additionalRows = additionalRowsProp?.map((additionalRow) =>
    asElementOrPropsOfType(
      SettingsTable.Row,
      additionalRow,
      "Check the 'additionalRows' property of 'FooterSettingsWidget'."
    )
  );

  // Contexts
  const { userExperience, updateUserExperience, initialUserExperience } =
    useAppShellUserExperience();
  const app = useRemoraidApp();

  // Helpers
  const positionLabels: Record<Exclude<FooterPosition, null>, string> = {
    [FrameLayoutSection.Bottom]: "Bottom",
    [FrameLayoutSection.Top]: "Top",
    [FrameLayoutSection.Left]: "Left",
    [FrameLayoutSection.Right]: "Right",
    [FrameLayoutSection.Content]: "Content section",
  };

  return (
    <SettingsWidget
      widgetProps={{
        id: defaultFooterSettingsWidgetId,
        title: "Footer Settings",
        ...widgetProps,
      }}
      onRestoreDefaultValues={() => {
        updateUserExperience((prev) => ({
          ...prev,
          footer: initialUserExperience.footer,
        }));
      }}
      custom={!isEqual(userExperience.footer, initialUserExperience.footer)}
    >
      <SettingsTable {...componentsProps?.table}>
        <SettingsTable.Row
          key="select-footer-position"
          label="Select footer position"
        >
          <Select
            value={userExperience.footer.position ?? "hidden"}
            data={
              app.footerVariant === null
                ? []
                : supportedFooterPositions[app.footerVariant].map(
                    (position) => ({
                      value: position ?? "hidden",
                      label:
                        position === null ? "Hidden" : positionLabels[position],
                    })
                  )
            }
            onChange={(newValue) => {
              if (newValue === null) {
                return;
              }
              updateUserExperience((prev) => ({
                ...prev,
                footer: {
                  ...prev.footer,
                  position: (newValue === "hidden"
                    ? null
                    : newValue) as FooterPosition,
                },
              }));
            }}
          />
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
