import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    rules: {
      'no-console': 'warn', // Чтобы не забыть удалить console.log() перед сборкой в продакшен
      'eqeqeq': 'warn', // Правило, которое требует использовать сторогое сравнение (===)
      'curly': 'warn', // Обязывает ставить фигурные скобки даже для однострочных условий
      'no-else-return': 'warn', // Убирает лишний else послe return
    },
    languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
]);