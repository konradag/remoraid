import { LayoutContext, LayoutsContext, LayoutType } from "@/core/lib/types";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";

export const defaultLayoutsContext: LayoutsContext = {
  layouts: {},
  setLayouts: () => {},
};

const layoutsContext = createContext<LayoutsContext>(defaultLayoutsContext);

export const useLayouts = (): LayoutsContext => {
  return useContext(layoutsContext);
};

export interface LayoutsProviderProps {}

export default function LayoutsProvider({
  children,
}: PropsWithChildren<LayoutsProviderProps>): ReactNode {
  // State
  const [layouts, setLayouts] = useState<
    Partial<Record<string, Omit<LayoutContext<LayoutType>, "layoutId">>>
  >({});

  return (
    <layoutsContext.Provider value={{ layouts, setLayouts }}>
      {children}
    </layoutsContext.Provider>
  );
}
