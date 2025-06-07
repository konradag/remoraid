import { ReactNode } from "react";
import RemoraidButton, { RemoraidButtonProps } from "../../RemoraidButton";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useSettingsWidgetContext } from "..";

export interface SettingsWidgetSaveButtonProps {
  onSaveChanges: () => void;
  componentsProps?: {
    button?: Partial<RemoraidButtonProps>;
  };
}

export default function SaveButton({
  onSaveChanges,
  componentsProps,
}: SettingsWidgetSaveButtonProps): ReactNode {
  const settingsWidgetOptions = useSettingsWidgetContext();

  return (
    <RemoraidButton
      label="Save Changes"
      icon={IconDeviceFloppy}
      onClick={onSaveChanges}
      responsive={false}
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
