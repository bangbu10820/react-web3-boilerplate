//  @ts-check

import { tanstackConfig } from "@tanstack/eslint-config";
import pluginRouter from "@tanstack/eslint-plugin-router";

export default [
  ...tanstackConfig,
  ...pluginRouter.configs["flat/recommended"],
  {
    // Ignore config files completely
    ignores: ["**/*.config.js", "eslint.config.js"],
  },
  {
    rules: {
      // Disable pnpm rule since we're not using pnpm workspace
      "pnpm/json-enforce-catalog": "off",
    },
  },
];
