import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		setupFiles: ["./__tests__/setup.ts"],
		coverage: {
			include: ["src/**/*"],
			exclude: ["src/**/*.route.ts", "src/**/*.schema.ts", "src/app.ts", "src/server.ts"],
			provider: "v8",
		},
		globals: true,
	},
});
