import { Chip, Divider, Flex, ScrollArea, Text } from "@mantine/core";
import {
  useWidgetRegistration,
  useWidgetSelection,
  useWidgets,
} from "@/components/RemoraidProvider/WidgetsProvider";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { usePage } from "../Page";

interface WidgetSelectionHeaderProps {
  title?: string;
  disabledWidgets?: string[];
}

export default function WidgetSelectionHeader({
  title,
  disabledWidgets,
}: WidgetSelectionHeaderProps) {
  const theme = useRemoraidTheme();
  const widgets = useWidgets();
  const { isPageRegistered } = useWidgetRegistration();
  const { updateWidgetSelectionBulk } = useWidgetSelection();
  const page = usePage();

  if (!page) {
    console.error(
      "'WidgetSelectionHeader' must be rendered inside of a 'Page' component."
    );
    return null;
  }

  return (
    <Flex justify="flex-start" align="center" gap="xs">
      <Text size="lg" fw={400}>
        {title ?? page.name}
      </Text>
      <Divider orientation="vertical" />
      {isPageRegistered(page.pageId) && (
        <ScrollArea flex={1} {...theme.scrollAreaProps}>
          <Chip.Group
            multiple
            value={Object.keys(widgets[page.pageId]).filter(
              (widgetId) => widgets[page.pageId][widgetId].selected
            )}
            onChange={(value: string[]) => {
              updateWidgetSelectionBulk(page.pageId, value);
            }}
          >
            <Flex justify="flex-start" align="center" gap="xs" h="auto">
              {Object.keys(widgets[page.pageId]).map((widgetId) => (
                <Chip
                  value={widgetId}
                  size="sm"
                  key={widgetId}
                  disabled={
                    disabledWidgets && disabledWidgets.includes(widgetId)
                  }
                >
                  {widgets[page.pageId][widgetId].name}
                </Chip>
              ))}
            </Flex>
          </Chip.Group>
        </ScrollArea>
      )}
    </Flex>
  );
}
