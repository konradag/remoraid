import { ActionIcon, Transition, useMantineTheme } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import {
  useActiveWidget,
  useWidgetSelection,
} from "@/components/RemoraidProvider/WidgetsProvider";
import { usePathname } from "next/navigation";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";

interface CloseButtonProps {
  widgetId: string;
}

export default function CloseButton({ widgetId }: CloseButtonProps) {
  const theme = useRemoraidTheme();
  const mantineTheme = useMantineTheme();
  const activeWidget = useActiveWidget();
  const { updateWidgetSelection } = useWidgetSelection();
  const pathname = usePathname();

  return (
    <Transition
      mounted={activeWidget === widgetId}
      transition="pop-top-right"
      duration={theme.transitionDurations.short}
      timingFunction="ease"
    >
      {(transitionStyle) => (
        <ActionIcon
          pos="absolute"
          size="xs"
          className="remoraid-close-button"
          radius="xl"
          color="red"
          onClick={() => {
            updateWidgetSelection(pathname, widgetId, false);
          }}
          style={transitionStyle}
        >
          <IconX size={mantineTheme.fontSizes.sm} />
        </ActionIcon>
      )}
    </Transition>
  );
}
