import { describe, it } from "mocha";
import { assert } from "chai";

import merge, { MergedPatches } from "../src/merge.js";
import { Equals, IsTrue } from "./utils.spec.js";
import { MergePatch } from "../src/utils.js";

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
namespace MergedPatchesTests {
  // Any type that is merged with null should be null.
  type Test1<T1> = MergedPatches<T1, null>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test1Assertion1 = IsTrue<Equals<Test1<any>, null>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test1Assertion2 = IsTrue<Equals<Test1<null>, null>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test1Assertion3 = IsTrue<Equals<Test1<undefined>, null>>;

  // Any type that is merged with just undefined should be the same type.
  type Test2<T1> = MergedPatches<T1, undefined>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test2Assertion1 = IsTrue<Equals<Test2<any>, any>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test2Assertion2 = IsTrue<Equals<Test2<null>, null>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test2Assertion3 = IsTrue<Equals<Test2<undefined>, undefined>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test2Assertion4 = IsTrue<
    Equals<
      Test2<{
        a: string;
      }>,
      {
        a: string;
      }
    >
  >;

  // Any type that is merged with null OR undefined should either be null or the same type.
  type Test3<T1> = MergedPatches<T1, null | undefined>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test3Assertion1 = IsTrue<Equals<Test3<any>, any | null>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test3Assertion2 = IsTrue<Equals<Test3<null>, null>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test3Assertion3 = IsTrue<Equals<Test3<undefined>, undefined | null>>;

  // Any two scalar values that are merged should be the second value.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test4Assertion1 = IsTrue<Equals<MergedPatches<string, number>, number>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test4Assertion2 = IsTrue<Equals<MergedPatches<number, string>, string>>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test4Assertion3 = IsTrue<Equals<MergedPatches<boolean, null>, null>>;

  // Any two objects that are merged should be a recursive merge of the two objects.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test5Assertion1 = IsTrue<
    Equals<
      MergedPatches<{ a: string }, { b: number }>,
      {
        a: string;
        b: number;
      }
    >
  >;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test5Assertion2 = IsTrue<
    Equals<
      MergedPatches<{ a: string; b: { c: boolean } }, { b: { d: null } }>,
      {
        a: string;
        b: {
          c: boolean;
          d: null;
        };
      }
    >
  >;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test5Assertion3 = IsTrue<
    Equals<
      MergedPatches<{ a: string; b: { c: boolean } }, { b: { c: string } }>,
      {
        a: string;
        b: {
          c: string;
        };
      }
    >
  >;

  // Any two arrays are simply overwritten by the second array.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test6Assertion1 = IsTrue<
    Equals<MergedPatches<string[], number[]>, number[]>
  >;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test6Assertion2 = IsTrue<
    Equals<
      MergedPatches<string[], { a: string }[]>,
      {
        a: string;
      }[]
    >
  >;

  // Object overwritten by scalar value.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test7Assertion1 = IsTrue<
    Equals<MergedPatches<{ a: string }, number>, number>
  >;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test7Assertion2 = IsTrue<
    Equals<MergedPatches<{ a: string }, null>, null>
  >;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test7Assertion3 = IsTrue<
    Equals<MergedPatches<{ a: string }, string[]>, string[]>
  >;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test8Assertion1 = IsTrue<
    Equals<
      MergePatch<{
        a: string;
        c?: number;
      }>,
      | {
          a?: string;
          c?: number | null;
        }
      | undefined
    >
  >;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test9Assertion1 = IsTrue<
    Equals<
      MergePatch<{
        a: string;
        b: number;
        c: {
          d: string;
        };
        e?: {
          f: number;
          g?: string;
        };
      }>,
      | {
          a?: string;
          b?: number;
          c?: {
            d?: string;
          };
          e?: {
            f?: number;
            g?: string | null;
          } | null;
        }
      | undefined
    >
  >;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test10Assertion1 = IsTrue<
    Equals<
      MergePatch<{
        a: string;
        b: number;
        c: {
          d: string;
        };
        e?: {
          f: number;
          g?: Date;
        };
      }>,
      | {
          a?: string;
          b?: number;
          c?: {
            d?: string;
          };
          e?: {
            f?: number;
            g?: Date | null;
          } | null;
        }
      | undefined
    >
  >;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test11 = IsTrue<
    Equals<MergePatch<number | undefined>, number | null | undefined>
  >;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test12 = IsTrue<Equals<MergePatch<Date>, Date | undefined>>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test13 = IsTrue<
    Equals<MergePatch<Date | undefined>, Date | null | undefined>
  >;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test14 = IsTrue<
    Equals<MergePatch<string | undefined>, string | null | undefined>
  >;
}

describe("merge", function () {
  it("should merge 2 patches with different attributes", function () {
    assert.deepEqual(merge({ a: "b" }, { b: "c" }), { a: "b", b: "c" });
  });

  it("should merge take last patch attributes for rewriting", function () {
    assert.deepEqual(merge({ a: "b" }, { a: "c" }), { a: "c" });
  });

  it("should merge take last patch attributes for rewriting and keep other attributes", function () {
    assert.deepEqual(merge({ a: "b", b: "d" }, { a: "c" }), { a: "c", b: "d" });
  });

  it("should keep null attributes for deleting", function () {
    assert.deepEqual(merge({ a: null }, { b: "c" }), { a: null, b: "c" });
  });

  it("should replace null with newer attribute", function () {
    assert.deepEqual(merge({ a: null }, { a: "b" }), { a: "b" });
  });

  it("should replace an attribute with null if newer", function () {
    assert.deepEqual(merge({ a: "b" }, { a: null }), { a: null });
  });

  it("should replace an array with an object", function () {
    assert.deepEqual(merge([], { a: "b" }), { a: "b" });
  });

  it("should replace an object with an array", function () {
    assert.deepEqual(merge({ a: "b" }, []), []);
  });

  it("should merge sub objects", function () {
    assert.deepEqual(
      merge({ a: { b: { c: "d" } }, d: "e" }, { a: { b: "a" } }),
      { a: { b: "a" }, d: "e" }
    );
  });

  it("should merge recursively", function () {
    assert.deepEqual(
      merge({ a: { b: { c: "d" }, d: "e" } }, { a: { b: { c: "e" } } }),
      { a: { b: { c: "e" }, d: "e" } }
    );
  });

  it("should replace object with with null value", function () {
    assert.deepEqual(merge({ a: "b" }, null), null);
  });

  it("should replace the array with the second array", function () {
    assert.deepEqual(merge([], ["a"]), ["a"]);
  });

  it("should replace the array with the second array inside an object", function () {
    assert.deepEqual(merge({ a: ["b"] }, { a: ["c", "d"] }), { a: ["c", "d"] });
  });
});
