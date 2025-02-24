import { serialize } from "./utils.js";

// This type can be used to ensure that the resulting object is the same type as the target object.
export type MergePatch<T> = {
  [P in keyof T]?:  // If the property can be undefined, it can be set to null.
    | (Extract<T[P], undefined> extends never ? never : null)
    // If the property is an object, it can be set to a patch of itself. Otherwise, it can be set to a value.
    | (Exclude<T[P], undefined> extends object[]
        ? T[P]
        : Exclude<T[P], undefined> extends object
        ? MergePatch<Exclude<T[P], undefined>>
        : T[P]);
};

export default function apply<T>(target: T, patch: null): null;
export default function apply<T>(target: T, patch: MergePatch<T>): T;
export default function apply<T>(
  target: T,
  patch: MergePatch<T> | null
): T | null;
export default function apply(target: any, patch: any): any;
export default function apply(target: any, patch: any): any {
  patch = serialize(patch);
  if (patch === null || typeof patch !== "object" || Array.isArray(patch)) {
    return patch;
  }

  target = serialize(target);
  if (target === null || typeof target !== "object" || Array.isArray(target)) {
    target = {};
  }
  const keys = Object.keys(patch);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return target;
    }
    if (patch[key] === null) {
      // eslint-disable-next-line no-prototype-builtins
      if (target.hasOwnProperty(key)) {
        delete target[key];
      }
    } else {
      target[key] = apply(target[key], patch[key]);
    }
  }
  return target;
}
