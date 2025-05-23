export const co = <T>(
  condition: (value: T) => boolean,
  value: T,
  fallback: T
): T => (condition(value) ? value : fallback);
export type Common<A, B> = Pick<A & B, keyof A & keyof B>;
