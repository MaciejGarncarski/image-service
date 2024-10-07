import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		setupFiles: ["./tests/setup.ts"],
		coverage: {
			include: ["src/**/*.controller.ts", "src/**/*.service.ts"],
			provider: "v8",
		},
		alias: {
			"@/*": new URL("./src/", import.meta.url).pathname,
			"@tests/*": new URL("./tests/", import.meta.url).pathname,
		},
		globals: true,
	},
	plugins: [tsconfigPaths()],
});
