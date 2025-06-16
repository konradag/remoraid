import { ReactElement } from "react";

export const co = <T>(
  condition: (value: T) => boolean,
  value: T,
  fallback: T
): T => (condition(value) ? value : fallback);
export type Common<A, B> = Pick<A & B, keyof A & keyof B>;
export type OnlyChildrenOf<T extends (...args: any) => any, P = any> =
  | ReactElement<P, T>
  | ReactElement<P, T>[];
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
