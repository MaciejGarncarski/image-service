import { FastifyReply, FastifyRequest, preHandlerAsyncHookHandler } from "fastify";

import { config, HEADER_API_KEY } from "../config/config.js";

declare module "fastify" {
	interface FastifyInstance {
		checkApiKey: preHandlerAsyncHookHandler;
	}

	interface FastifyRequest {
		fastify: FastifyInstance;
	}
}

export const checkApiKey: preHandlerAsyncHookHandler = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	if (!request.headers[HEADER_API_KEY]) {
		return reply.unauthorized("No key provided");
	}

	if (request.headers[HEADER_API_KEY] !== config.API_KEY) {
		return reply.unauthorized("Invalid key provided");
	}
};
