export function serialize(value: any): any {
  return value && typeof value.toJSON === "function" ? value.toJSON() : value;
}
