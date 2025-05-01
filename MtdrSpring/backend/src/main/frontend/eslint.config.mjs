import globals from "globals";
import { defineConfig } from "eslint/config";

// Fix del bug de AudioWorkletGlobalScope con espacio
const safeBrowserGlobals = {
  ...globals.browser,
  AudioWorkletGlobalScope: globals.browser["AudioWorkletGlobalScope "],
};
delete safeBrowserGlobals["AudioWorkletGlobalScope "];

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: safeBrowserGlobals,
    },
    rules: {
      // Solo errores críticos (sintaxis o problemas de ejecución)
      "no-undef": "error",
      "no-unexpected-multiline": "error",
      "no-unreachable": "error",
      "no-unused-vars": "warn", // puedes cambiar a "off"
      "no-empty": "warn",
    },
  },
]);



