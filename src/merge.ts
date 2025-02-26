import { Is, isScalar, Scalar } from "./utils.js";
import rfdc from "rfdc";
const clone = rfdc({});

export type MergedProperty<
  P1 extends object,
  P2 extends object,
  K
> = K extends keyof P1
  ? // This branch is if both P1 and P2 have a property with the same key.
    K extends keyof P2
    ? MergedPatches<P1[K], P2[K]>
    : // This branch is if only P1 has a property with the key.
      P1[K]
  : K extends keyof P2
  ? // This branch is if only P2 has a property with the key.
    P2[K]
  : // This shouldn't be reachable since K is a key of either P1 or P2.
    never;

export type MergedDictionary<P1 extends object, P2 extends object> = {
  [K in keyof P1 | keyof P2]: MergedProperty<
    Extract<P1, object>,
    Extract<P2, object>,
    K
  >;
};

export type MergedPatches<P1, P2> =
  | (Extract<P2, Scalar | null> extends never
      ? never
      : // If P2 is a scalar value (incl null), the result should be that scalar value.
        Extract<P2, Scalar | null>)
  // If P1 and P2 are both objects (but not arrays), the result should be a recursive merge of the two objects.
  | (Is<P2, Scalar | null | undefined> extends false
      ? Is<P1, Scalar | null | undefined> extends false
        ? MergedDictionary<Extract<P1, object>, Extract<P2, object>>
        : never
      : never)
  // If P2 is undefined, the result should be P1.
  | (Extract<P2, undefined> extends never ? never : P1);

export default function merge<P1, P2>(
  patch1: P1,
  patch2: P2
): MergedPatches<P1, P2>;
export default function merge<T>(patch1: T, patch2: T): T;
export default function merge<P1, P2>(
  patch1: P1,
  patch2: P2
): MergedPatches<P1, P2> {
  if (patch2 === undefined) {
    return clone(patch1) as MergedPatches<P1, P2>;
  }

  if (
    patch1 === undefined ||
    isScalar(patch1) ||
    isScalar(patch2) ||
    patch1 === null ||
    patch2 === null
  ) {
    return clone(patch2) as MergedPatches<P1, P2>;
  }

  const newPatch = { ...patch1 } as MergedDictionary<
    Extract<P1, object>,
    Extract<P2, object>
  >;

  Object.keys(patch2).forEach(function (key) {
    if (key in newPatch) {
      newPatch[key as keyof P1 & keyof P2] = merge<P1[keyof P1], P2[keyof P2]>(
        patch1[key as keyof P1],
        patch2[key as keyof P2]
      ) as MergedProperty<
        Extract<P1, object>,
        Extract<P2, object>,
        keyof P1 & keyof P2
      >;
    } else {
      newPatch[key as keyof P1 & keyof P2] = patch2[
        key as keyof P2
      ] as MergedProperty<
        Extract<P1, object>,
        Extract<P2, object>,
        keyof P1 & keyof P2
      >;
    }
  });
  return newPatch as MergedPatches<P1, P2>;
}
