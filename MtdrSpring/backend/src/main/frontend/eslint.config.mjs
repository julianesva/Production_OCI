import globals from "globals";
import { defineConfig } from "eslint/config";
import parser from "@babel/eslint-parser";

const safeBrowserGlobals = {
  ...globals.browser,
  AudioWorkletGlobalScope: globals.browser["AudioWorkletGlobalScope "],
};
delete safeBrowserGlobals["AudioWorkletGlobalScope "];

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: safeBrowserGlobals,
    },
    rules: {
      "no-undef": "warn",
      "no-unexpected-multiline": "warn",
      "no-unreachable": "warn",
      "no-unused-vars": "warn",
      "no-empty": "warn",
    },
  },
]);



