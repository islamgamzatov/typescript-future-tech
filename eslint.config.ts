import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
// import prettierPlugin from "eslint-plugin-prettier";
// import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      js,
      // prettier: prettierPlugin,
    },
    extends: [
      "js/recommended",
      // prettierConfig
    ],
    rules: {
      // @ts-expect-error - игнорируем ошибку TypeScript для Prettier конфигурации
      ...prettierPlugin.configs.recommended.rules,
      "no-console": "warn", // Чтобы не забыть удалить console.log() перед сборкой в продакшен
      eqeqeq: "warn", // Правило, которое требует использовать сторогое сравнение (===)
      curly: "warn", // Обязывает ставить фигурные скобки даже для однострочных условий
      "no-else-return": "warn", // Убирает лишний else послe return
    },
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
]);
