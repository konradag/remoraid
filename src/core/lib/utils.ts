import {
  MantineColorShade,
  MantinePrimaryShade,
  MantineSize,
} from "@mantine/core";
import {
  ComponentProps,
  ElementType,
  isValidElement,
  ReactElement,
} from "react";
import { RemoraidIconSize } from "./types";

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
export type ElementOfType<
  T extends ElementType,
  P = ComponentProps<T>
> = ReactElement<P, T>;
export type ChildrenOfType<T extends ElementType> =
  | ElementOfType<T>
  | undefined
  | null
  | ReadonlyArray<ChildrenOfType<T>>;
export type PropsWithChildrenOfType<T extends ElementType, P = {}> = P & {
  children?: ChildrenOfType<T>;
};
export type ElementOrPropsOfType<
  T extends ElementType,
  P = ComponentProps<T>
> = ElementOfType<T, P> | P;
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
        ? ` ${additionalErrorMessage}`
        : ""
    }`
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
    return children.map((child) =>
      asChildrenOfType(type, child, additionalErrorMessage)
    );
  }
  return asElementOfType(
    type,
    children as ReactElement,
    additionalErrorMessage
  );
};
export const asElementOrPropsOfType = <
  T extends ElementType,
  P = ComponentProps<T>
>(
  type: T,
  elementOrProps: ReactElement | P,
  additionalErrorMessage?: string
): ElementOrPropsOfType<T, P> => {
  if (isValidElement(elementOrProps)) {
    return asElementOfType(type, elementOrProps, additionalErrorMessage);
  }
  return elementOrProps;
};
export const isMantinePrimaryShade = (
  shade: MantinePrimaryShade | MantineColorShade
): shade is MantinePrimaryShade => {
  if (isNaN(Number(shade))) {
    return true;
  }
  return false;
};
export const getDefaultButtonIconSize = (
  buttonSize: MantineSize
): RemoraidIconSize => {
  if (buttonSize === "xs") {
    return RemoraidIconSize.Small;
  }
  return RemoraidIconSize.Medium;
};
export const scrollToWidget = (widgetId: string): void => {
  const widgetElement = document.getElementById(widgetId);
  if (!widgetElement) {
    return;
  }
  widgetElement.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};
