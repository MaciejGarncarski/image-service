import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import { fastifySensible } from "@fastify/sensible";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";

import { environment, HEADER_API_KEY, MAX_FILE_SIZE } from "./config/config.js";
import { checkApiKey } from "./middleware/check-api-key.js";
import { uploadRoutes } from "./modules/upload/upload.route.js";

export const createServer = async () => {
	const envToLogger = {
		development: {
			transport: {
				target: "pino-pretty",
				options: {
					translateTime: "HH:MM:ss Z",
					ignore: "pid,hostname",
				},
			},
		},
		production: true,
		test: false,
	};

	const app = Fastify({
		trustProxy: true,
		logger: envToLogger[environment] ?? true,
	}).withTypeProvider<TypeBoxTypeProvider>();

	await app.register(fastifySensible, {
		sharedSchemaId: "HttpError",
	});

	await app.register(fastifyCors, {
		origin: "*",
	});

	await app.register(fastifyMultipart, {
		limits: {
			fileSize: MAX_FILE_SIZE,
		},
	});
	await app.register(fastifySwagger, {
		openapi: {
			openapi: "3.1.0",
			info: {
				title: "Image Service",
				description: "Upload images to your server!",
				version: "1.0.0",
			},
			components: {
				securitySchemes: {
					apiKey: {
						type: "apiKey",
						name: HEADER_API_KEY,
						in: "header",
					},
				},
			},
		},
	});

	await app.register(fastifySwaggerUi, {
		routePrefix: "/docs",
		uiConfig: {
			docExpansion: "list",
			deepLinking: true,
		},
		theme: {
			title: "Image Service",
		},
	});

	app.decorate("checkApiKey", checkApiKey);
	await app.register(uploadRoutes);

	return app;
};
