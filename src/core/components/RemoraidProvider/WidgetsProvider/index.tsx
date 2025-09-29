import {
  WidgetConfiguration,
  WidgetContext,
  WidgetsContext,
} from "@/core/lib/types";
import { merge } from "lodash";
import React, {
  useState,
  useContext,
  PropsWithChildren,
  ReactNode,
} from "react";

export const getDefaultWidgetContext = (
  configuration: WidgetConfiguration
): WidgetContext => {
  const mergedConfiguration = merge(
    { name: configuration.widgetId, selected: true },
    configuration.initialValues
  );
  return { ...mergedConfiguration, hidden: !mergedConfiguration.selected };
};

const widgetsContext = React.createContext<WidgetsContext>({
  widgets: {},
  activeWidget: null,
  updateActiveWidget: () => {},
  registerWidget: () => {},
  registerPage: () => {},
  isWidgetRegistered: () => false,
  isPageRegistered: () => false,
  updateWidgetSelection: () => {},
  updateWidgetSelectionBulk: () => {},
  isWidgetSelected: () => false,
  hideWidget: () => {},
});

export const useWidgets = (): WidgetsContext => {
  return useContext(widgetsContext);
};

export const useWidget = (
  pageId: string | undefined,
  widgetId: string | undefined
): WidgetContext | null => {
  const { widgets } = useWidgets();
  if (pageId === undefined || widgetId === undefined) {
    return null;
  }
  return widgets?.[pageId]?.[widgetId] ?? null;
};

export interface WidgetsProviderProps {}

export default function WidgetsProvider({
  children,
}: PropsWithChildren<WidgetsProviderProps>): ReactNode {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<WidgetsContext["widgets"]>({});

  const updateActiveWidget = (widgetId: string | null) => {
    setActiveWidget(widgetId);
  };
  const updateWidgetSelection = (
    pageId: string,
    widgetId: string,
    value: boolean
  ) => {
    const page = widgets[pageId];
    if (!page) {
      console.error(
        `Cannot change selection of widget in page ${pageId}. Because this page does exist.`
      );
      return;
    }
    const widget = page[widgetId];
    if (!widget) {
      console.error(
        `Cannot change selection of widget ${widgetId}. Because this widget does not exist on page ${pageId}.`
      );
      return;
    }
    setWidgets((prev) => ({
      ...prev,
      [pageId]: {
        ...page,
        [widgetId]: {
          ...widget,
          selected: value,
          hidden: false,
        },
      },
    }));
  };
  const updateWidgetSelectionBulk = (
    pageId: string,
    selectedWidgetIds: string[]
  ) => {
    const page = widgets[pageId];
    if (!page) {
      console.error(
        `Cannot change selection of widget in page ${pageId}. Because this page does exist.`
      );
      return;
    }
    setWidgets((prev) => {
      const updatedPage: Partial<Record<string, WidgetContext>> = {};
      for (const [widgetId, widget] of Object.entries(page)) {
        if (!widget) {
          continue;
        }
        const selected = selectedWidgetIds.includes(widgetId);
        const selectionChanged = widget.selected !== selected;
        if (!selectionChanged) {
          updatedPage[widgetId] = widget;
          continue;
        }
        updatedPage[widgetId] = {
          ...widget,
          selected,
          hidden: false,
        };
      }
      return {
        ...prev,
        [pageId]: updatedPage,
      };
    });
  };
  const registerPage = (
    pageId: string,
    initialWidgets: WidgetConfiguration[]
  ) => {
    setWidgets((prev) => ({
      ...prev,
      [pageId]: initialWidgets.reduce(
        (t: Record<string, WidgetContext>, widget) => {
          return {
            ...t,
            [widget.widgetId]: getDefaultWidgetContext(widget),
          };
        },
        {}
      ),
    }));
  };
  const isPageRegistered = (pageId: string) => {
    if (!widgets[pageId]) {
      return false;
    }
    return true;
  };
  const registerWidget = (pageId: string, widget: WidgetConfiguration) => {
    if (!isPageRegistered(pageId)) {
      if (widget.allowUnregisteredPageUsage !== false) {
        registerPage(pageId, [widget]);
        return;
      }
      console.error(
        `Not allowed to register widget in unregistered page ${pageId}. Try registering the page first.`
      );
      return;
    }
    setWidgets((prev) => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [widget.widgetId]: getDefaultWidgetContext(widget),
      },
    }));
  };
  const isWidgetRegistered = (pageId: string, widgetId: string) => {
    if (!widgets[pageId]) {
      return false;
    }
    if (!widgets[pageId][widgetId]) {
      return false;
    }
    return true;
  };
  const isWidgetSelected = (pageId: string, widgetId: string): boolean => {
    return Boolean(widgets[pageId]?.[widgetId]?.selected);
  };
  const hideWidget = (pageId: string, widgetId: string) => {
    const widget = widgets[pageId]?.[widgetId];
    if (!widget) {
      console.error(
        `Cannot call 'hideWidget' for widget ${widgetId}. Because this widget does not exist on page ${pageId}.`
      );
      return;
    }
    setWidgets((prev) => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [widgetId]: { ...widget, selected: false, hidden: true },
      },
    }));
  };

  return (
    <widgetsContext.Provider
      value={{
        widgets,
        activeWidget,
        updateActiveWidget,
        updateWidgetSelection,
        updateWidgetSelectionBulk,
        isWidgetSelected,
        registerWidget,
        registerPage,
        isWidgetRegistered,
        isPageRegistered,
        hideWidget,
      }}
    >
      {children}
    </widgetsContext.Provider>
  );
}
