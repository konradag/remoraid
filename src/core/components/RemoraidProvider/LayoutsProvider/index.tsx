import { Layout, LayoutsContext, LayoutType } from "@/core/lib/types";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";

export const defaultLayoutsContext = {
  layouts: {},
  setLayouts: (): void => {},
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
  const [layouts, setLayouts] = useState<{
    [index: string]: Layout<LayoutType>;
  }>({});

  return (
    <layoutsContext.Provider value={{ layouts, setLayouts }}>
      {children}
    </layoutsContext.Provider>
  );
}
