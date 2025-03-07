import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
// export default [
//   {
//     languageOptions: {
//       globals: {
//         ...globals.node,
//         ...globals.mocha,
//       },
//     },

//     rules: {
//       "no-debugger": 2,
//       "no-dupe-args": 2,
//       "no-dupe-keys": 2,
//       "no-duplicate-case": 2,
//       "no-ex-assign": 2,
//       "no-unreachable": 2,
//       "valid-typeof": 2,
//       "no-fallthrough": 2,
//       quotes: [2, "single", "avoid-escape"],
//       indent: [2, 2],
//       "comma-spacing": 2,
//       semi: 2,
//       "space-infix-ops": 2,
//       "keyword-spacing": 2,
//       "space-before-function-paren": [2, "never"],
//       "space-before-blocks": [2, "always"],
//       "new-parens": 2,
//       "max-len": [2, 120, 2],

//       "no-multiple-empty-lines": [
//         2,
//         {
//           max: 2,
//         },
//       ],

//       "eol-last": 2,
//       "no-trailing-spaces": 2,
//       strict: [2, "global"],
//       "no-undef": 2,
//     },
//   },
// ];
