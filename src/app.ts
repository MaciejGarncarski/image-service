import { config } from "@/config/config.js";
import { createServer } from "@/server.js";

const server = await createServer();

server.listen({ port: Number(config.PORT) || 3001, host: "0.0.0.0" }, (err) => {
	if (err) {
		server.log.error(err);
		process.exit(1);
	}
});
