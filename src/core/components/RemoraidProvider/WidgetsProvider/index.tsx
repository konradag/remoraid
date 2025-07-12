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
): WidgetContext =>
  merge(
    { name: configuration.widgetId, selected: true },
    configuration.initialValues
  );

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
});

export const useWidgets = (): WidgetsContext => {
  return useContext(widgetsContext);
};

export const useWidget = (
  pageId: string,
  widgetId: string
): WidgetContext | null => {
  const { widgets } = useWidgets();
  return widgets?.[pageId]?.[widgetId] ?? null;
};

export interface WidgetsProviderProps {}

export default function WidgetsProvider({
  children,
}: PropsWithChildren<WidgetsProviderProps>): ReactNode {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [widgets, setWidgets] = useState<{
    [index: string]: { [index: string]: { name: string; selected: boolean } };
  }>({});

  const updateActiveWidget = (widgetId: string | null) => {
    setActiveWidget(widgetId);
  };
  const updateWidgetSelection = (
    pageId: string,
    widgetId: string,
    value: boolean
  ) => {
    if (!widgets[pageId]) {
      console.error(
        `Cannot change selection of widget in page ${pageId}. Because this page does exist.`
      );
      return;
    }
    if (!widgets[pageId][widgetId]) {
      console.error(
        `Cannot change selection of widget ${widgetId}. Because this widget does not exist on page ${pageId}.`
      );
      return;
    }
    setWidgets((prev) => ({
      ...prev,
      [pageId]: {
        ...widgets[pageId],
        [widgetId]: { ...widgets[pageId][widgetId], selected: value },
      },
    }));
  };
  const updateWidgetSelectionBulk = (
    pageId: string,
    selectedWidgetIds: string[]
  ) => {
    if (!widgets[pageId]) {
      console.error(
        `Cannot change selection of widget in page ${pageId}. Because this page does exist.`
      );
      return;
    }
    const updatedPage = widgets[pageId];
    for (let widgetId of Object.keys(updatedPage)) {
      updatedPage[widgetId] = {
        ...updatedPage[widgetId],
        selected: selectedWidgetIds.includes(widgetId),
      };
    }
    setWidgets((prev) => ({
      ...prev,
      [pageId]: updatedPage,
    }));
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
  const isWidgetSelected = (pageId: string, widgetId: string) => {
    if (!isWidgetRegistered(pageId, widgetId)) {
      return false;
    }
    return widgets[pageId][widgetId].selected;
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
      }}
    >
      {children}
    </widgetsContext.Provider>
  );
}
