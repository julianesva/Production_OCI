import globals from "globals";
import { defineConfig } from "eslint/config";
import babelParser from "@babel/eslint-parser";

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
      globals: {
        ...safeBrowserGlobals,
        jest: true, // Añade el entorno de Jest (si lo estás usando para pruebas)
        // Si usas otro framework de pruebas como Mocha, usa 'mocha': true
      },
      parser: babelParser, // Usa el parser de Babel
      parserOptions: {
        requireConfigFile: false, // Si no tienes un archivo babel.config.js
        babelOptions: {
          presets: ["@babel/preset-react"], // Asegúrate de tener este preset instalado si usas React
        },
      },
    },
    rules: {
      // Solo errores críticos (sintaxis o problemas de ejecución)
      "no-undef": "warn", // Cambiado a "warn" para los errores de variables no definidas en pruebas
      "no-unexpected-multiline": "error",
      "no-unreachable": "error",
      "no-unused-vars": "warn", // puedes cambiar a "off"
      "no-empty": "warn",
    },
  },
]);