import { fastifyMultipart } from "@fastify/multipart";
import { fastifySensible } from "@fastify/sensible";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from "fastify-type-provider-zod";

import { environment, MAX_FILE_SIZE } from "./config/config.js";
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
	});

	await app.register(fastifySensible);

	await app.register(fastifyMultipart, {
		limits: {
			fileSize: MAX_FILE_SIZE,
		},
	});
	await app.register(fastifySwagger, {
		transform: jsonSchemaTransform,
		openapi: {
			info: {
				title: "Image Service",
				description: "Upload images to your server!",
				version: "1.0.0",
			},
		},
	});

	await app.register(fastifySwaggerUi, {
		routePrefix: "/documentation",
		uiConfig: {
			docExpansion: "full",
			deepLinking: false,
		},
	});

	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	app.decorate("checkApiKey", checkApiKey);
	await app.register(uploadRoutes);

	return app.withTypeProvider<ZodTypeProvider>();
};
