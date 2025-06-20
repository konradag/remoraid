import { ReactElement } from "react";
import { PrimitiveUserExperience, UserExperience } from "./types";

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
export type OptionalIfExtends<T, K extends keyof T, V1, V2> = [V1] extends [V2]
  ? Optional<T, K>
  : T;
export const isPrimitiveUserExperience = (
  userExperience: UserExperience
): userExperience is PrimitiveUserExperience | PrimitiveUserExperience[] => {
  const isPrimitive = (x: unknown): x is PrimitiveUserExperience =>
    typeof x === "string" || typeof x === "number" || typeof x === "boolean";
  if (isPrimitive(userExperience)) {
    return true;
  }
  if (Array.isArray(userExperience) && userExperience.every(isPrimitive)) {
    return true;
  }
  return false;
};
