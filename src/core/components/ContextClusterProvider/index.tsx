import { ContextCluster } from "@/core/lib/types";
import React, { PropsWithChildren, ReactNode } from "react";

export const createContextCluster = <Context,>(
  generalDefaultValue: Context
): ContextCluster<Context> => {
  const contexts: Record<string, React.Context<Context>> = {};
  const defaultValues: Record<string, Context> = {};
  const createContext = (id: string, defaultValue?: Context) => {
    const context = React.createContext<Context>(
      defaultValue ?? generalDefaultValue
    );
    contexts[id] = context;
    defaultValues[id] = defaultValue ?? generalDefaultValue;
    return context;
  };
  const useContext = (id: string): Context | null => {
    if (!contexts[id]) {
      return null;
    }
    return React.useContext(contexts[id]);
  };
  return {
    contexts,
    defaultValues,
    generalDefaultValue,
    createContext,
    useContext,
  };
};

export interface ContextClusterProviderProps<Context> {
  cluster: ContextCluster<Context>;
  values?: Record<string, Context>;
}

export default function ContextClusterProvider<Context>({
  cluster,
  values = {},
  children,
}: PropsWithChildren<ContextClusterProviderProps<Context>>): ReactNode {
  return Object.entries(cluster.contexts).reduceRight(
    (t, [id, context]) => (
      <context.Provider
        value={
          values[id] ?? cluster.defaultValues[id] ?? cluster.generalDefaultValue
        }
      >
        {t}
      </context.Provider>
    ),
    children
  );
}
