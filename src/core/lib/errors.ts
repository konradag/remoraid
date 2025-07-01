export class InvalidComponentUsageError extends Error {
  constructor(component: string, rule: string) {
    super(`Invalid usage of '${component}': ${rule}`);
    this.name = "InvalidComponentUsageError";
  }
}
