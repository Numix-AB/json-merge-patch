import apply from "./apply.js";
import type {
  PatchedDictionary,
  PatchedProperty,
  PatchedTarget,
} from "./apply.js";
import generate from "./generate.js";
import merge from "./merge.js";
import type {
  MergedDictionary,
  MergedProperty,
  MergedPatches,
} from "./merge.js";
import type { MergePatch } from "./utils.js";

export { apply, generate, merge };
export type {
  PatchedDictionary,
  PatchedProperty,
  PatchedTarget,
  MergedDictionary,
  MergedProperty,
  MergedPatches,
  MergePatch,
};
