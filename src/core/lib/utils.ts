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
export type ElementOrPropsOfType<T extends ElementType> =
  | ElementOfType<T>
  | ComponentProps<T>;
export const isValidElementOfType = <T extends ElementType>(
  type: T,
  value: unknown
): value is ElementOfType<T> => {
  return isValidElement(value) && value.type === type;
};
export const getElementTypeName = (
  type: ElementType | ReactElement["type"]
): string => {
  if (typeof type === "string") {
    return type;
  }
  if (typeof type === "function") {
    return (type as any).displayName ?? type.name ?? "anonymous component";
  }
  return "unknown";
};
export const asElementOfType = <T extends ElementType>(
  type: T,
  element: ReactElement,
  additionalErrorMessage?: string
): ElementOfType<T> => {
  if (isValidElementOfType(type, element)) {
    return element;
  }
  throw new TypeError(
    `Expected React element of type ${getElementTypeName(
      type
    )}, but received type: ${getElementTypeName(element.type)}.${
      additionalErrorMessage !== undefined && additionalErrorMessage.length > 0
        ? " "
        : ""
    }${additionalErrorMessage}`
  );
};
export const asChildrenOfType = <T extends ElementType>(
  type: T,
  children: ChildrenOfType<ElementType>,
  additionalErrorMessage?: string
): ChildrenOfType<T> => {
  if (children === undefined || children === null) {
    return children;
  }
  if (Array.isArray(children)) {
    return children.map((child) => asChildrenOfType(type, child));
  }
  return asElementOfType(
    type,
    children as ReactElement,
    additionalErrorMessage
  );
};
export const asElementOrPropsOfType = <T extends ElementType>(
  type: T,
  elementOrProps: ReactElement | ComponentProps<T>,
  additionalErrorMessage?: string
): ElementOrPropsOfType<T> => {
  if (isValidElement(elementOrProps)) {
    return asElementOfType(type, elementOrProps, additionalErrorMessage);
  }
  return elementOrProps;
};
