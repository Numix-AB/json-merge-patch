import equal from "fast-deep-equal";
import { serialize } from "./utils.js";
import { MergePatch } from "./apply.js";

function arrayEquals(before: any, after: any) {
  if (before.length !== after.length) {
    return false;
  }
  for (let i = 0; i < before.length; i++) {
    if (!equal(after[i], before[i])) {
      return false;
    }
  }
  return true;
}

export default function generate<T>(before: T, after: T): MergePatch<T>;
export default function generate<T, U>(
  before: T,
  after: U
): MergePatch<T | U> | undefined;
export default function generate<T>(before: T, after: null): null;
export default function generate(before: any, after: any): any;
export default function generate(before: any, after: any) {
  before = serialize(before);
  after = serialize(after);

  if (
    before === null ||
    after === null ||
    typeof before !== "object" ||
    typeof after !== "object" ||
    Array.isArray(before) !== Array.isArray(after)
  ) {
    return after;
  }

  if (Array.isArray(before)) {
    if (!arrayEquals(before, after)) {
      return after;
    }
    return undefined;
  }

  const patch: any = {};
  const beforeKeys = Object.keys(before);
  const afterKeys = Object.keys(after);

  let key, i;

  // new elements
  const newKeys: any = {};
  for (i = 0; i < afterKeys.length; i++) {
    key = afterKeys[i];
    if (beforeKeys.indexOf(key) === -1) {
      newKeys[key] = true;
      patch[key] = serialize(after[key]);
    }
  }

  // removed & modified elements
  const removedKeys: any = {};
  for (i = 0; i < beforeKeys.length; i++) {
    key = beforeKeys[i];
    if (afterKeys.indexOf(key) === -1) {
      removedKeys[key] = true;
      patch[key] = null;
    } else {
      if (before[key] !== null && typeof before[key] === "object") {
        const subPatch = generate(before[key], after[key]);
        if (subPatch !== undefined) {
          patch[key] = subPatch;
        }
      } else if (before[key] !== after[key]) {
        patch[key] = serialize(after[key]);
      }
    }
  }

  return Object.keys(patch).length > 0 ? patch : undefined;
}
