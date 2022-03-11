/* global module, require */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:jest/recommended",
    "plugin:jest/style",
    "prettier",
  ],
  rules: {
    "no-warning-comments": [
      "error",
      {
        terms: ["todo"],
      },
    ],
  },
  overrides: [
    {
      files: [
        "./packages/backend/jest-resolver.js",
        "./packages/backend/mongodb/seed/*.js",
        ".eslintrc.js",
        "babel.config.js",
      ],
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: "*.spec.ts",
      rules: {
        "@typescript-eslint/no-non-null-assertion": "off",
      },
    },
    {
      files: "*.d.ts",
      rules: {
        "no-var": "off",
      },
    },
  ],
  settings: {
    jest: {
      version: require("jest/package.json").version,
    },
  },
};
