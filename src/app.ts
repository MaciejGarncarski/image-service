import Fastify from 'fastify';

import { environment } from './config/config.js';
import { createServer } from './server.js';

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
  production: true,
};

const server = Fastify({
  trustProxy: true,
  logger: envToLogger[environment] ?? true,
});

console.log('test');

await createServer(server);

server.listen(
  { port: Number(process.env.port) || 3001, host: '0.0.0.0' },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);
