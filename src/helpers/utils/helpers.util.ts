export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;

  if (Number.isNaN(a) && Number.isNaN(b)) return true;

  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  ) {
    return false;
  }

  const obj1 = a as Record<string, unknown>;
  const obj2 = b as Record<string, unknown>;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!(key in obj2) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
