export const uploadRoutes = async (server) => {
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
