import { HydrationStatus } from "@/core/lib/types";
import { MantineColorScheme, useMantineColorScheme } from "@mantine/core";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const defaultHydrationStatus = {
  hasHydrated: false,
  ensureHydration: () => undefined,
};

const hydrationStatusContext = createContext<HydrationStatus>(
  defaultHydrationStatus
);

export const useHydrationStatus = (): HydrationStatus => {
  return useContext(hydrationStatusContext);
};

export const useHydratedMantineColorScheme = (): {
  colorScheme?: MantineColorScheme;
  setColorScheme?: (value: MantineColorScheme) => void;
  clearColorScheme?: () => void;
  toggleColorScheme?: () => void;
} => {
  const { ensureHydration } = useHydrationStatus();
  return ensureHydration(useMantineColorScheme()) ?? {};
};

export interface HydrationStatusProviderProps {}

export default function HydrationStatusProvider({
  children,
}: PropsWithChildren<HydrationStatusProviderProps>): ReactNode {
  // State
  const [hasHydrated, setHasHydrated] = useState<boolean>(
    defaultHydrationStatus.hasHydrated
  );

  // Helpers
  const hydrationStatus: HydrationStatus = useMemo(
    () => ({
      hasHydrated,
      ensureHydration: (v) => (hasHydrated ? v : undefined),
    }),
    [hasHydrated]
  );

  // Effects
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return (
    <hydrationStatusContext.Provider value={hydrationStatus}>
      {children}
    </hydrationStatusContext.Provider>
  );
}
