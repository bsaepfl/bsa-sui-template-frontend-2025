import tseslintParser from "@typescript-eslint/parser";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import reactHooks from "eslint-plugin-react-hooks";

export default [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "move/**", ".claude/**"],
  },

  // TypeScript + React source files
  {
    files: ["app/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // Disable base rules that conflict with TS equivalents
      "no-unused-vars": "off",
    },
  },

  // React Hooks rules (flat config format)
  {
    files: ["app/**/*.{ts,tsx}"],
    ...reactHooks.configs.flat["recommended-latest"],
    rules: {
      ...reactHooks.configs.flat["recommended-latest"].rules,
      // Downgrade to warn: setState in useEffect is valid for mount-time init patterns
      "react-hooks/set-state-in-effect": "warn",
    },
  },
];
