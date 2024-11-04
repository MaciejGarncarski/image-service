import { FastifyPluginAsync } from "fastify";

import { deleteFileHandler, getFileListHandler, uploadHandler } from "./upload.controller.js";
import { deleteFileSchema, getFileListSchema, uploadSchema } from "./upload.schema.js";

export const uploadRoutes: FastifyPluginAsync = async (server) => {
	server.route({
		method: "POST",
		url: "/upload",
		preHandler: [server.checkApiKey],
		schema: uploadSchema,
		handler: uploadHandler,
	});

	server.route({
		method: "GET",
		preHandler: [server.checkApiKey],
		url: "/list",
		schema: getFileListSchema,
		handler: getFileListHandler,
	});

	server.route({
		method: "DELETE",
		preHandler: [server.checkApiKey],
		url: "/delete/:folder/:file",
		schema: deleteFileSchema,
		handler: deleteFileHandler,
	});
};
