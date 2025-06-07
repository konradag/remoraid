import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import Widget, { WidgetProps } from "../Widget";
import { IconRestore } from "@tabler/icons-react";
import { SettingsWidgetOptions } from "@/core/lib/types";
import SaveButton from "./SaveButton";

export const defaultSettingsWidgetOptions = {};
const settingsWidgetOptionsContext = createContext<SettingsWidgetOptions>(
  defaultSettingsWidgetOptions
);
export const useSettingsWidgetOptions = (): SettingsWidgetOptions => {
  return useContext(settingsWidgetOptionsContext);
};

export interface SettingsWidgetProps {
  onRestoreDefaultValues?: () => void;
  unsavedChanges?: boolean;
  custom?: boolean;
  widgetProps?: Partial<WidgetProps>;
}

function SettingsWidget({
  children,
  onRestoreDefaultValues,
  unsavedChanges,
  custom,
  widgetProps,
}: PropsWithChildren<SettingsWidgetProps>): ReactNode {
  return (
    <settingsWidgetOptionsContext.Provider value={{ custom, unsavedChanges }}>
      <Widget
        title="Settings"
        id="settings"
        mt="md"
        {...widgetProps}
        buttons={[
          ...(onRestoreDefaultValues
            ? [
                {
                  label: "Restore Default Values",
                  icon: IconRestore,
                  onClick: onRestoreDefaultValues,
                },
              ]
            : []),
          ...(widgetProps?.buttons ?? []),
        ]}
        badges={[
          {
            label: "Custom",
            tooltip: "Your settings differ from the default settings",
            mounted: custom ?? false,
          },
          {
            label: "Unsaved Changes",
            mounted: unsavedChanges ?? false,
          },
          ...(widgetProps?.badges ?? []),
        ]}
      >
        {children}
      </Widget>
    </settingsWidgetOptionsContext.Provider>
  );
}

export interface SettingsWidget extends React.FC<SettingsWidgetProps> {
  SaveButton: typeof SaveButton;
}
(SettingsWidget as SettingsWidget).SaveButton = SaveButton;
export default SettingsWidget;
