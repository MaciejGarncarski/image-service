import { fastifyMultipart } from "@fastify/multipart";
import { fastifySensible } from "@fastify/sensible";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { checkApiKey } from "./middleware/check-api-key.js";
import { uploadRoutes } from "./modules/upload/upload.route.js";
export const createServer = async (app) => {
    await app.register(fastifySensible);
    await app.register(fastifyMultipart);
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.decorate('checkApiKey', checkApiKey);
    await app.register(uploadRoutes);
    return app.withTypeProvider();
};
