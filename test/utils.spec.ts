import { MergePatch, RecursiveRemoveNulls } from "../src/utils";

export type Equals<T, U> = (<G>() => G extends T ? 1 : 2) extends <
  G
>() => G extends U ? 1 : 2
  ? true
  : false;

export type IsTrue<T extends true> = T;

// Null should be removed from the object.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _Test1Assertion1 = IsTrue<
  Equals<
    RecursiveRemoveNulls<{
      a: string;
      c: null;
    }>,
    {
      a: string;
    }
  >
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _Test2Assertion1 = IsTrue<
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
type _Test3Assertion1 = IsTrue<
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
type _Test4Assertion1 = IsTrue<
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
type _Test4Assertion5 = IsTrue<
  Equals<MergePatch<number | undefined>, number | null | undefined>
>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _Test4Assertion6 = IsTrue<Equals<MergePatch<Date>, Date | undefined>>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _Test4Assertion7 = IsTrue<
  Equals<MergePatch<Date | undefined>, Date | null | undefined>
>;
