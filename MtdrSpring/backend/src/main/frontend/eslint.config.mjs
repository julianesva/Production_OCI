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
      "no-undef": "warn",
      "no-unexpected-multiline": "warn",
      "no-unreachable": "warn",
      "no-unused-vars": "warn", // puedes cambiar a "off"
      "no-empty": "warn",
    },
  },
]);



