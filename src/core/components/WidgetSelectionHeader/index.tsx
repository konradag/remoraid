import { Chip, Divider, Flex, MantineSize, Text } from "@mantine/core";
import {
  getDefaultWidgetContext,
  useWidgets,
} from "@/core/components/RemoraidProvider/WidgetsProvider";
import { useRemoraidTheme } from "../RemoraidProvider/ThemeProvider";
import { usePage } from "../Page";
import { IconCheck } from "@tabler/icons-react";
import { ReactNode } from "react";
import ScrollableChipGroup from "../ScrollableChipGroup";
import { InvalidComponentUsageError } from "@/core/lib/errors";

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
  const { isPageRegistered, updateWidgetSelectionBulk, ...widgetsContext } =
    useWidgets();
  const page = usePage();
  if (!page) {
    throw new InvalidComponentUsageError(
      "WidgetSelectionHeader",
      "must be used as child of 'Page'."
    );
  }

  // Helpers
  const widgets = widgetsContext.widgets[page.pageId] ?? {};

  return (
    <Flex justify="flex-start" align="center" gap="xs" mt={mt}>
      <Text size="lg" fw={400}>
        {title ?? page.name}
      </Text>
      <Divider orientation="vertical" />
      {isPageRegistered(page.pageId) && (
        <ScrollableChipGroup
          value={Object.keys(widgets).filter(
            (widgetId) => widgets[widgetId]?.selected
          )}
          onChange={(value: string[]) => {
            updateWidgetSelectionBulk(page.pageId, value);
          }}
          componentsProps={{ ScrollArea: { flex: 1 } }}
        >
          {Object.keys(widgets).map((widgetId) => {
            const widget =
              widgets[widgetId] ?? getDefaultWidgetContext({ widgetId });
            return (
              <Chip
                value={widgetId}
                size="sm"
                key={widgetId}
                disabled={disabledWidgets && disabledWidgets.includes(widgetId)}
                icon={<IconCheck {...theme.componentsProps.icons.small} />}
              >
                {widget.name}
              </Chip>
            );
          })}
        </ScrollableChipGroup>
      )}
    </Flex>
  );
}
