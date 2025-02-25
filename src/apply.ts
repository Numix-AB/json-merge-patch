import {
  Is,
  isScalar,
  OptionalIfUndefined,
  recursiveRemoveNulls,
  RecursiveRemoveNulls,
  Scalar,
} from "./utils.js";
import rfdc from "rfdc";
const clone = rfdc({});

export type PatchedProperty<
  T extends object,
  P extends object,
  K
> = K extends keyof P
  ? Extract<P[K], null> extends never
    ? K extends keyof T
      ? // This branch is if both T and P have a property with the same key.
        PatchedTarget<T[K], P[K]>
      : // This branch is if only P has a property with the key.
        RecursiveRemoveNulls<(P & {})[K]>
    : undefined
  : K extends keyof T
  ? T[K]
  : // This shouldn't be reachable since K should be a key of either T or P.
    never;

export type PatchedDictionary<
  T extends object,
  P extends object
> = OptionalIfUndefined<{
  [K in keyof T | keyof P]: PatchedProperty<T, P, K>;
}>;

export type PatchedTarget<T, P> =
  // If P is a scalar value, the result should be that scalar value.
  | (Extract<P, Scalar> extends never ? never : Extract<P, Scalar>)
  // If T is a scalar value.
  | (Extract<T, Scalar> extends never
      ? never
      : Extract<P, null> extends never
      ? // If patch is not null.
        Extract<P, undefined> extends never
        ? // If patch is not null or undefined, the result should be P.
          RecursiveRemoveNulls<P>
        : // If patch is undefined, the result should be T.
          T
      : never)
  // If P is null, the result should be undefined.
  | (Extract<P, null> extends never ? never : undefined)
  // If T and T2 are both objects (but not arrays), the result should be a recursive merge of the two objects.
  | (Is<P, Scalar | null | undefined> extends false
      ? Is<P, Scalar | null | undefined> extends false
        ? PatchedDictionary<T & object, P & object>
        : never
      : never)
  // If P is undefined, the result should be T.
  | (Extract<P, undefined> extends never ? never : T);

export default function apply<T, P>(target: T, patch: P): PatchedTarget<T, P> {
  if (patch === undefined) {
    return target as Extract<P, undefined> extends never ? never : T;
  }

  if (patch === null) {
    return undefined as Extract<P, null> extends never ? never : undefined;
  }

  if (isScalar(patch)) {
    return clone(patch) as Extract<P, Scalar>;
  }

  if (target === undefined || target === null || isScalar(target)) {
    return recursiveRemoveNulls(patch) as PatchedTarget<T, P>;
  }

  if (
    target === undefined ||
    target === null ||
    isScalar(target) ||
    isScalar(patch)
  ) {
    if (typeof patch === "object" && !Array.isArray(patch)) {
      return patch as PatchedTarget<T, P>;
    }

    return patch as PatchedTarget<T, P>;
  }

  const newTarget = { ...target } as PatchedDictionary<T & object, P & object>;

  Object.keys(patch).forEach(function (key) {
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return undefined;
    }

    const result = apply(
      newTarget[key as keyof typeof newTarget],
      patch[key as keyof typeof newTarget]
    );

    if (result === undefined) {
      delete newTarget[key as keyof PatchedDictionary<T & object, P & object>];
    } else {
      newTarget[key as keyof PatchedDictionary<T & object, P & object>] =
        result as any;
    }
  });

  return newTarget as PatchedTarget<T, P>;
}
