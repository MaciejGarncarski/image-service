import pluginJs from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
	{
		ignores: ["dist/", "node_modules/", "*.js"],
	},
	{
		files: ["**/*.{js,mjs,cjs,ts}"],
	},
	{
		languageOptions: { globals: globals.builtin },
		plugins: {
			unicorn: eslintPluginUnicorn,
			"unused-imports": eslintPluginUnusedImports,
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			"no-console": "error",
			"@typescript-eslint/no-unused-vars": "off",
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",
			"unused-imports/no-unused-imports": "error",
			"unused-imports/no-unused-vars": [
				"warn",
				{
					vars: "all",
					varsIgnorePattern: "^_",
					args: "after-used",
					argsIgnorePattern: "^_",
				},
			],
		},
	},
	pluginJs.configs.recommended,
	importPlugin.flatConfigs.typescript,
	...tseslint.configs.recommended,
];
