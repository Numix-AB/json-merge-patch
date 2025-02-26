import { describe, it } from "mocha";
import { assert } from "chai";

import apply, { PatchedTarget } from "../src/apply.js";
import { Equals, Equiv, IsTrue } from "./utils.spec.js";
import { MergePatch } from "../src/utils.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _Test1Assertion1 = IsTrue<
  Equiv<
    PatchedTarget<
      { a: string; c: string },
      {
        a: string;
        c: null;
      }
    >,
    {
      a: string;
    } & {
      c?: undefined;
    }
  >
>;

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
namespace MergePatchPatchedTargetEquivTest {
  interface Test1 {
    a: string;
    b: number;
    c: {
      d: string;
    };
    e?: {
      f: number;
      g?: Date;
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test1Assertion = IsTrue<
    Equals<PatchedTarget<Test1, MergePatch<Test1>>, Test1>
  >;

  interface Test2 {
    a: string;
    b: number;
    c: {
      d: string;
      e: {
        f: number;
        g?: Date;
      };
    };
    h: {
      i: {
        j: string;
        k: number;
      };
    };
    l: string[];
    m: {
      n?: {
        o: Date;
      }[];
      p?: string[];
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test2Assertion = IsTrue<
    Equals<PatchedTarget<Test2, MergePatch<Test2>>, Test2>
  >;
}

describe("apply", function () {
  it("should replace an attribute", function () {
    assert.deepEqual(apply({ a: "b" }, { a: "c" }), { a: "c" });
  });

  it("should add an attribute", function () {
    assert.deepEqual(apply({ a: "b" }, { b: "c" }), { a: "b", b: "c" });
  });

  it("should delete attribute", function () {
    assert.deepEqual(apply({ a: "b" }, { a: null }), {});
  });

  it("should delete attribute without affecting others", function () {
    assert.deepEqual(apply({ a: "b", b: "c" }, { a: null }), { b: "c" });
  });

  it("should replace array with a string", function () {
    assert.deepEqual(apply({ a: ["b"] }, { a: "c" }), { a: "c" });
  });

  it("should replace an string with an array", function () {
    assert.deepEqual(apply({ a: "c" }, { a: ["b"] }), { a: ["b"] });
  });

  it("should apply recursively", function () {
    assert.deepEqual(apply({ a: { b: "c" } }, { a: { b: "d", c: null } }), {
      a: { b: "d" },
    });
  });

  it("should replace an object array with a number array", function () {
    assert.deepEqual(apply({ a: [{ b: "c" }] }, { a: [1] }), { a: [1] });
  });

  it("should replace an array", function () {
    assert.deepEqual(apply(["a", "b"], ["c", "d"]), ["c", "d"]);
  });

  it("should replace an object with an array", function () {
    assert.deepEqual(apply({ a: "b" }, ["c"]), ["c"]);
  });

  it("should replace an object with null", function () {
    assert.deepEqual(apply({ a: "foo" }, null), undefined);
  });

  it("should replace with an object implementing toJSON() method", function () {
    assert.deepEqual(
      apply({ a: "foo" }, { a: new Date("2020-05-09T00:00:00.000Z") }),
      { a: new Date("2020-05-09T00:00:00.000Z") }
    );
  });

  it("should replace an object with a string", function () {
    assert.deepEqual(apply({ a: "foo" }, "bar"), "bar");
  });

  it("should not change null attributes", function () {
    assert.deepEqual(apply({ e: null }, { a: 1 }), { e: null, a: 1 });
  });

  it("should not set an attribute to null", function () {
    assert.deepEqual(apply([1, 2], { a: "b", c: null }), { a: "b" });
  });

  it("should not set an attribute to null in a sub object", function () {
    assert.deepEqual(apply({}, { a: { bb: { ccc: null } } }), {
      a: { bb: {} },
    });
  });
});
