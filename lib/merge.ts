import { MergePatch } from "./apply.js";

export default function merge<T, P extends MergePatch<P>>(
  patch1: MergePatch<T>,
  patch2: null
): null;
export default function merge<T, P extends MergePatch<P>>(
  patch1: MergePatch<T>,
  patch2: MergePatch<T>
): MergePatch<T>;
export default function merge(patch1: any, patch2: any): any;
export default function merge(patch1: any, patch2: any) {
  if (
    patch1 === null ||
    patch2 === null ||
    typeof patch1 !== "object" ||
    Array.isArray(patch1) ||
    typeof patch2 !== "object" ||
    Array.isArray(patch2)
  ) {
    return patch2;
  }
  const patch = JSON.parse(JSON.stringify(patch1));

  Object.keys(patch2).forEach(function (key) {
    if (patch1[key] !== undefined) {
      patch[key] = merge(patch1[key], patch2[key]);
    } else {
      patch[key] = patch2[key];
    }
  });
  return patch;
}
