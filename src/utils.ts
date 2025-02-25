export function serialize(value: any): any {
  return value && typeof value.toJSON === "function" ? value.toJSON() : value;
}

// This type can be used to ensure that the resulting object of an applied patch is the same type as the target object.
// export type MergePatch<T> =
//   // If the property can be undefined, it can be set to null.
//   | (Extract<T, undefined> extends never ? never : null)
//   | (Is<T, Scalar> extends true
//       ? T
//       : {
//           // If the property is an object, it can be set to a patch of itself. Otherwise, it can be set to a value.
//           [P in keyof T]?: MergePatch<T[P]>;
//         });

export type MergePatch<T> =
  // If the property can be undefined, it can be set to null.
  | undefined
  | (Extract<T, undefined> extends never ? never : null)
  | (Is<Exclude<T, undefined>, Scalar> extends true ? T : never)
  | (IsSimpleObject<Exclude<T, undefined>> extends true
      ? {
          // If the property is an object, it can be set to a patch of itself. Otherwise, it can be set to a value.
          [P in keyof T]?: MergePatch<T[P]>;
        }
      : never);

export type IsSimpleObject<T> = Not<Is<T, Scalar | null | undefined>>;

export type Is<T, U> = T extends U ? true : false;
export type Not<T extends boolean> = T extends true ? false : true;
export type And<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? true
    : false
  : false;
export type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : B extends true
  ? true
  : false;

export type NotUndefined<T> = T extends undefined ? false : true;

export type RecursiveRemoveNulls<T> = {
  [K in keyof T as Exclude<T[K], null> extends never
    ? never
    : K]: T[K] extends object ? RecursiveRemoveNulls<T[K]> : T[K];
};

export type Scalar =
  | string
  | number
  | boolean
  | symbol
  | any[]
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  | Function
  | Date;

export type OptionalIfUndefined<T extends Record<string, any>> = {
  // All non-undefined properties should be required.
  [K in keyof T as Extract<T[K], undefined> extends never ? K : never]: T[K];
} & {
  // All undefinable properties should be optional.
  [K in keyof T as undefined extends T[K] ? K : never]?: T[K];
};

export function isScalar(value: any): value is Scalar {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    Array.isArray(value) ||
    typeof value === "function" ||
    typeof value === "symbol" ||
    typeof value === "bigint" ||
    value instanceof Date
  );
}

export function recursiveRemoveNulls<T extends object>(
  val: T
): RecursiveRemoveNulls<T> {
  if (val === null || typeof val !== "object") {
    return val as any;
  }

  const result: any = {};
  for (const key in val) {
    if (val[key] !== null) {
      if (val[key] === null) {
        continue;
      }

      if (isScalar(val[key]) || typeof val[key] !== "object") {
        result[key] = val[key];
      } else {
        result[key] = recursiveRemoveNulls(val[key]);
      }
    }
  }
  return result;
}
