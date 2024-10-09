import { readdir } from "node:fs/promises";

import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync, FastifyRequest } from "fastify";

import { config } from "../../config/config.js";
import { deleteFileHandler, uploadHandler } from "./upload.controller.js";
import { uploadResponseSchema } from "./upload.schema.js";

export const uploadRoutes: FastifyPluginAsync = async (server) => {
	server.route({
		method: "POST",
		url: "/upload",
		preHandler: [server.checkApiKey],
		schema: {
			security: [
				{
					apiKey: [],
				},
			],
			response: uploadResponseSchema,
		},
		handler: uploadHandler,
	});

	server.route({
		method: "GET",
		url: "/list/:folder",
		schema: {
			security: [
				{
					apiKey: [],
				},
			],
			params: Type.Object({
				folder: Type.String(),
			}),
			response: {
				404: {
					$ref: "HttpError",
				},
			},
		},
		handler: async (request: FastifyRequest<{ Params: { folder: string } }>, reply) => {
			const folder = request.params.folder;
			try {
				const dir = await readdir(`${config.IMAGE_DIR}/${folder || "default"}`);
				return reply.send({ data: dir });
			} catch {
				return reply.notFound();
			}
		},
	});

	server.route({
		method: "DELETE",
		url: "/delete/:folder/:file",
		schema: {
			security: [
				{
					apiKey: [],
				},
			],
		},
		handler: deleteFileHandler,
	});
};
