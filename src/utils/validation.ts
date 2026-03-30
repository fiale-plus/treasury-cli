const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateDate(value: string, name: string): void {
  if (!DATE_RE.test(value)) {
    throw new Error(`Invalid ${name}: "${value}". Expected YYYY-MM-DD format.`);
  }
}

export function validatePositiveInt(value: string, name: string, max?: number): number {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`Invalid ${name}: "${value}". Expected a positive integer.`);
  }
  if (max !== undefined && n > max) {
    throw new Error(`Invalid ${name}: ${n} exceeds maximum of ${max}.`);
  }
  return n;
}

export function validateFilter(value: string): void {
  // Treasury API filter format: field:operator:value
  const parts = value.split(":");
  if (parts.length < 3) {
    throw new Error(
      `Invalid filter: "${value}". Expected format: field:operator:value\n` +
        "Operators: eq, lt, lte, gt, gte, in, range",
    );
  }
}
