import { ReactNode } from "react";
import RemoraidButton, { RemoraidButtonProps } from "../../RemoraidButton";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useSettingsWidgetContext } from "..";
import { Group, GroupProps } from "@mantine/core";

export interface SettingsWidgetSaveButtonProps {
  onSaveChanges: () => void;
  insideContainer?: boolean;
  componentsProps?: {
    container?: Partial<GroupProps>;
    button?: Partial<RemoraidButtonProps>;
  };
}

export default function SaveButton({
  onSaveChanges,
  insideContainer,
  componentsProps,
}: SettingsWidgetSaveButtonProps): ReactNode {
  const settingsWidgetOptions = useSettingsWidgetContext();

  // Helpers
  const button = (
    <RemoraidButton
      label="Save Changes"
      icon={IconDeviceFloppy}
      onClick={onSaveChanges}
      responsive={false}
      {...componentsProps?.button}
      componentsProps={{
        button: {
          disabled: settingsWidgetOptions.unsavedChanges === false,
          ...componentsProps?.button?.componentsProps?.button,
        },
      }}
    />
  );

  if (insideContainer !== false) {
    return (
      <Group
        w="100%"
        justify="flex-end"
        mt="md"
        {...componentsProps?.container}
      >
        {button}
      </Group>
    );
  }
  return button;
}
