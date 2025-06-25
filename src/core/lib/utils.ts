import {
  ComponentProps,
  ElementType,
  isValidElement,
  ReactElement,
} from "react";

export const co = <T>(
  condition: (value: T) => boolean,
  value: T,
  fallback: T
): T => (condition(value) ? value : fallback);
export type Common<A, B> = Pick<A & B, keyof A & keyof B>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type OptionalIfExtends<T, K extends keyof T, V1, V2> = [V1] extends [V2]
  ? Optional<T, K>
  : T;
export type ElementOfType<T extends ElementType> = ReactElement<
  ComponentProps<T>,
  T
>;
export type ChildrenOfType<T extends ElementType> =
  | ElementOfType<T>
  | undefined
  | null
  | ReadonlyArray<ChildrenOfType<T>>;
export type PropsWithChildrenOfType<T extends ElementType, P = {}> = P & {
  children?: ChildrenOfType<T>;
};
export const isValidElementOfType = <T extends ElementType>(
  type: T,
  value: unknown
): value is ElementOfType<T> => {
  return isValidElement(value) && value.type === type;
};
