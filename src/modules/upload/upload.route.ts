import { readdir, readFile } from 'node:fs/promises';

import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { fileTypeFromBuffer } from 'file-type';
import z from 'zod';

import { config } from '../../config/config.js';
import { uploadHandler } from './upload.controller.js';
import { uploadResponseSchema } from './upload.schema.js';

export const uploadRoutes: FastifyPluginAsync = async (server) => {
  server.route({
    method: 'POST',
    url: '/upload',
    preHandler: [server.checkApiKey],
    schema: {
      response: uploadResponseSchema,
    },
    handler: uploadHandler,
  });

  server.route({
    method: 'GET',
    url: '/list/:dirname',
    schema: {
      params: z.object({
        dirname: z.string(),
      }),
    },
    handler: async (
      request: FastifyRequest<{ Params: { dirname: string } }>,
      reply,
    ) => {
      const dirname = request.params.dirname;

      const dir = await readdir(`${config.IMAGE_DIR}/${dirname || 'default'}`);
      return reply.send({ data: dir });
    },
  });

  server.route({
    method: 'GET',
    url: '/static/:dirname/:fileId',
    schema: {
      params: z.object({
        dirname: z.string(),
        fileId: z.string(),
      }),
    },
    handler: async (request, reply) => {
      const dir = await readdir(`${config.IMAGE_DIR}`);
      const file = await readFile(`${config.IMAGE_DIR}/${dir[0]}`);
      const fileType = await fileTypeFromBuffer(file);

      if (!file || !fileType) {
        return reply.notFound();
      }

      return reply.header('Content-Type', fileType.mime).send(file);
    },
  });
};
