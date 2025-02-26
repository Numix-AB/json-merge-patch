import { And, Is, RecursiveRemoveNulls } from "../src/utils";

export type Equals<T, U> = (<G>() => G extends T ? 1 : 2) extends <
  G
>() => G extends U ? 1 : 2
  ? true
  : false;

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
namespace EqualsTest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test1 = IsFalse<
    Equals<
      {
        a: string;
        c?: undefined;
      },
      {
        a: string;
      } & {
        c?: undefined;
      }
    >
  >;
}

// The above assertion should fail because the expected type is not equal to the actual type.
// The Equiv type should be used to compare the types.
export type Equiv<T, U> = And<Is<T, U>, Is<U, T>>;

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
namespace EquivTest {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type _Test1 = IsTrue<
    Equiv<
      {
        a: string;
        c?: undefined;
      },
      {
        a: string;
      } & {
        c?: undefined;
      }
    >
  >;
}

export type IsTrue<T extends true> = T;
export type IsFalse<T extends false> = T;

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
