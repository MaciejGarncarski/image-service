import { readdir, unlink } from "node:fs/promises";

import { Type } from "@sinclair/typebox";
import { FastifyPluginAsync, FastifyRequest } from "fastify";

import { config } from "@/config/config.js";
import { uploadHandler } from "@/modules/upload/upload.controller.js";
import { uploadResponseSchema } from "@/modules/upload/upload.schema.js";

export const uploadRoutes: FastifyPluginAsync = async (server) => {
	server.route({
		method: "POST",
		url: "/upload",
		preHandler: [server.checkApiKey],
		schema: {
			response: uploadResponseSchema,
		},
		handler: uploadHandler,
	});

	server.route({
		method: "GET",
		url: "/list/:folder",
		schema: {
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
		handler: async (
			request: FastifyRequest<{ Params: { folder: string; file: string } }>,
			reply,
		) => {
			const folder = request.params.folder;
			const file = request.params.file;

			try {
				await unlink(`${config.IMAGE_DIR}/${folder}/${file}`);
				return reply.send({ message: "File deleted" });
			} catch {
				return reply.notFound();
			}
		},
	});
};
