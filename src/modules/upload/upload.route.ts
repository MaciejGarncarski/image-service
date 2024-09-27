import { FastifyPluginAsync } from 'fastify';

export const uploadRoutes: FastifyPluginAsync = async (server) => {
  server.route({
    method: 'GET',
    url: '/upload',
    preHandler: [server.checkApiKey],
    handler: async () => {
      return 'test223';
    },
  });

  console.log('test');
};
