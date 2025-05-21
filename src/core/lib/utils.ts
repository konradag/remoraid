import { RemoraidButtonProps } from "./types";

export const co = <T>(
  condition: (value: T) => boolean,
  value: T,
  fallback: T
): T => (condition(value) ? value : fallback);
export type Common<A, B> = Pick<A & B, keyof A & keyof B>;
export const isRemoraidButtonProps = (e: any): e is RemoraidButtonProps => {
  if (typeof e !== "object") {
    return false;
  }
  if (!("label" in e)) {
    return false;
  }
  return true;
};
