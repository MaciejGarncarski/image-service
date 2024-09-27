import {FastifyReply, FastifyRequest, preHandlerAsyncHookHandler} from "fastify";

import {config} from "../config/config.js";

declare module "fastify" {
    interface FastifyInstance {
        checkApiKey: preHandlerAsyncHookHandler;
    }

    interface FastifyRequest {
        fastify: FastifyInstance;
    }
}

export const checkApiKey: preHandlerAsyncHookHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.headers["x-api-key"]) {
        return reply.unauthorized()
    }

    if (request.headers["x-api-key"] !== config.API_KEY) {
        return reply.unauthorized()
    }
}