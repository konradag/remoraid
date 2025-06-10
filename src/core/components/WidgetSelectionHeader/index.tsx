import { Chip, Divider, Flex, MantineSize, Text } from "@mantine/core";
import { useWidgets } from "@/core/components/RemoraidProvider/WidgetsProvider";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { usePage } from "../Page";
import { IconCheck } from "@tabler/icons-react";
import { ReactNode } from "react";
import ScrollableChipGroup from "../ScrollableChipGroup";

export interface WidgetSelectionHeaderProps {
  title?: string;
  disabledWidgets?: string[];
  mt?: MantineSize | number;
}

export default function WidgetSelectionHeader({
  title,
  disabledWidgets,
  mt,
}: WidgetSelectionHeaderProps): ReactNode {
  const theme = useRemoraidTheme();
  const { widgets, isPageRegistered, updateWidgetSelectionBulk } = useWidgets();
  const page = usePage();

  if (!page) {
    console.error(
      "'WidgetSelectionHeader' must be rendered inside of a 'Page' component."
    );
    return null;
  }

  return (
    <Flex justify="flex-start" align="center" gap="xs" mt={mt}>
      <Text size="lg" fw={400}>
        {title ?? page.name}
      </Text>
      <Divider orientation="vertical" />
      {isPageRegistered(page.pageId) && (
        <ScrollableChipGroup
          value={Object.keys(widgets[page.pageId]).filter(
            (widgetId) => widgets[page.pageId][widgetId].selected
          )}
          onChange={(value: string[]) => {
            updateWidgetSelectionBulk(page.pageId, value);
          }}
          componentsProps={{ scrollArea: { flex: 1 } }}
        >
          {Object.keys(widgets[page.pageId]).map((widgetId) => (
            <Chip
              value={widgetId}
              size="sm"
              key={widgetId}
              disabled={disabledWidgets && disabledWidgets.includes(widgetId)}
              icon={<IconCheck {...theme.iconProps.tiny} />}
            >
              {widgets[page.pageId][widgetId].name}
            </Chip>
          ))}
        </ScrollableChipGroup>
      )}
    </Flex>
  );
}
