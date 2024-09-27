import { config } from "../config/config.js";
export const checkApiKey = async (request, reply) => {
    if (!request.headers["x-api-key"]) {
        return reply.unauthorized();
    }
    if (request.headers["x-api-key"] !== config.API_KEY) {
        return reply.unauthorized();
    }
};
