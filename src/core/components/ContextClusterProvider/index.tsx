import { ContextCluster } from "@/core/lib/types";
import React, { PropsWithChildren, ReactNode } from "react";

export const createContextCluster = <Context, StaticID extends string = never>(
  generalDefaultValue: Context,
  staticIds?: StaticID[]
): ContextCluster<Context, StaticID> => {
  const isStaticId = (id: string): id is StaticID => {
    if (staticIds?.find((staticId) => staticId === id)) {
      return true;
    }
    return false;
  };
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
  const useContext = (<ID extends string>(id: ID) => {
    if (isStaticId(id)) {
      return contexts[id] ?? generalDefaultValue;
    }
    return contexts[id] ?? null;
  }) as <ID extends string>(
    id: ID
  ) => ID extends StaticID ? Context : Context | null;
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
  StaticID extends string = never
> {
  cluster: ContextCluster<Context, StaticID>;
  values?: Record<string, Context>;
}

export default function ContextClusterProvider<
  Context,
  StaticID extends string = never
>({
  cluster,
  values = {},
  children,
}: PropsWithChildren<
  ContextClusterProviderProps<Context, StaticID>
>): ReactNode {
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
