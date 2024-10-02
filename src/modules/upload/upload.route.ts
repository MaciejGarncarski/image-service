import { readdir, unlink } from "node:fs/promises";

import { FastifyPluginAsync, FastifyRequest } from "fastify";
import z from "zod";

import { config } from "../../config/config.js";
import { uploadHandler } from "./upload.controller.js";
import { uploadResponseSchema } from "./upload.schema.js";

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
			params: z.object({
				folder: z.string(),
			}),
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
				return reply.send({ status: "success" });
			} catch {
				return reply.notFound();
			}
		},
	});
};
