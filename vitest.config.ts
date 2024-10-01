import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		setupFiles: ["./tests/setup.ts"],
		coverage: {
			include: ["src/**/*.controller.ts", "src/**/*.service.ts"],
			provider: "v8",
		},
		globals: true,
	},
});
