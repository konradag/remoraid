import { createContext, PropsWithChildren, ReactNode, useContext } from "react";
import Widget, { WidgetProps } from "../Widget";
import { IconRestore } from "@tabler/icons-react";
import { SettingsWidgetContext } from "@/core/lib/types";
import SaveButtonComponent from "./SaveButton";

export const defaultSettingsWidgetContext = {};
const settingsWidgetContext = createContext<SettingsWidgetContext>(
  defaultSettingsWidgetContext
);
export const useSettingsWidgetContext = (): SettingsWidgetContext => {
  return useContext(settingsWidgetContext);
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
    <settingsWidgetContext.Provider value={{ custom, unsavedChanges }}>
      <Widget
        title="Settings"
        id="settings"
        {...widgetProps}
        buttons={[
          ...(onRestoreDefaultValues
            ? [
                {
                  label: "Restore Default Values",
                  icon: IconRestore,
                  onClick: onRestoreDefaultValues,
                  componentsProps: { button: { disabled: custom === false } },
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
    </settingsWidgetContext.Provider>
  );
}

export interface SettingsWidget
  extends React.FC<PropsWithChildren<SettingsWidgetProps>> {
  SaveButton: typeof SaveButtonComponent;
}
export default Object.assign(SettingsWidget, {
  SaveButton: SaveButtonComponent,
}) as SettingsWidget;
