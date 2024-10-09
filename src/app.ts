import { config } from "./config/config.js";
import { createServer } from "./server.js";

const server = await createServer();

try {
	await server.listen({ port: Number(config.PORT) || 3001, host: "0.0.0.0" });
} catch (e) {
	if (e instanceof Error) {
		server.log.error(e.message);
		process.exit(1);
	}

	process.exit(1);
}
