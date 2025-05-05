import { ActionIcon, Transition } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import {
  useActiveWidget,
  useWidgetSelection,
} from "@/components/RemoraidProvider/WidgetsProvider";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { usePage } from "../Page";

interface CloseButtonProps {
  widgetId: string;
}

export default function CloseButton({ widgetId }: CloseButtonProps) {
  const theme = useRemoraidTheme();
  const activeWidget = useActiveWidget();
  const { updateWidgetSelection } = useWidgetSelection();
  const page = usePage();

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
            if (!page) {
              return;
            }
            updateWidgetSelection(page.pageId, widgetId, false);
          }}
          style={transitionStyle}
        >
          <IconX {...theme.iconProps.tiny} />
        </ActionIcon>
      )}
    </Transition>
  );
}
