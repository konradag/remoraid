import { ContextCluster } from "@/core/lib/types";
import React, { PropsWithChildren, ReactNode } from "react";

export const createContextCluster = <Context, ID extends string = string>(
  generalDefaultValue: Context
): ContextCluster<Context, ID> => {
  const contexts: Partial<Record<ID, React.Context<Context>>> = {};
  const defaultValues: Partial<Record<ID, Context>> = {};
  const createContext = (id: ID, defaultValue?: Context) => {
    const context = React.createContext<Context>(
      defaultValue ?? generalDefaultValue
    );
    contexts[id] = context;
    defaultValues[id] = defaultValue ?? generalDefaultValue;
    return context;
  };
  const useContext = (id: ID): Context => {
    if (!contexts[id]) {
      throw new Error(`Context "${id}" not found.`);
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

export interface ContextClusterProviderProps<
  Context,
  ID extends string = string
> {
  cluster: ContextCluster<Context, ID>;
  values?: Partial<Record<ID, Context>>;
}

export default function ContextClusterProvider<
  Context,
  ID extends string = string
>({
  cluster,
  values = {},
  children,
}: PropsWithChildren<ContextClusterProviderProps<Context, ID>>): ReactNode {
  return Object.entries(cluster.contexts).reduceRight((t, entry) => {
    const [id, context] = entry as [ID, React.Context<Context>];
    return (
      <context.Provider
        value={
          values[id] ?? cluster.defaultValues[id] ?? cluster.generalDefaultValue
        }
      >
        {t}
      </context.Provider>
    );
  }, children);
}
