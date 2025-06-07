import { ReactNode } from "react";
import RemoraidButton, { RemoraidButtonProps } from "../../RemoraidButton";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useSettingsWidgetOptions } from "..";

export interface SettingsWidgetSaveButtonProps {
  onSaveChanges: () => void;
  componentsProps?: {
    button?: RemoraidButtonProps;
  };
}

export default function SaveButton({
  onSaveChanges,
  componentsProps,
}: SettingsWidgetSaveButtonProps): ReactNode {
  const settingsWidgetOptions = useSettingsWidgetOptions();

  return (
    <RemoraidButton
      label="Save Changes"
      icon={IconDeviceFloppy}
      onClick={onSaveChanges}
      {...componentsProps?.button}
      componentsProps={{
        button: {
          mt: "md",
          disabled: settingsWidgetOptions.unsavedChanges === false,
          ...componentsProps?.button?.componentsProps?.button,
        },
      }}
    />
  );
}
