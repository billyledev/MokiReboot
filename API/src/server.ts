import 'dotenv/config';

import Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Inert from '@hapi/inert';
import HapiPino from 'hapi-pino';
import Path from 'path';

import rateLimiterPlugin from '@/plugins/rateLimiterPlugin';
import hapiAuthJWT from 'hapi-auth-jwt2';
import authPlugin from '@/plugins/authPlugin';
import adminPlugin from '@/plugins/adminPlugin';

const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = process.env.BASE_URL ?? '';

const server: Hapi.Server = Hapi.server({
  port: process.env.PORT ?? 3000,
  host: process.env.HOST ?? '0.0.0.0',
  routes: {
    cors: {
      origin: [BASE_URL],
    },
    validate: {
      failAction: async (request, h, err) => {
        if (isProduction) {
          console.error('ValidationError:', err?.message);
          throw Boom.badRequest('Invalid input');
        } else {
          console.log(err);
          throw err ?? new Error('Unknown error');
        }
      },
    },
    files: {
      relativeTo: Path.join(__dirname, 'public'),
    },
  },
});

export async function createServer(): Promise<Hapi.Server> {
  await server.register({
    plugin: HapiPino,
    options: {
      logEvents: process.env.TEST === 'true' ? false : undefined,
      redact: ['req.headers.authorization'],
      ...(isProduction ? {} : { transport: { target: 'pino-pretty' } }),
    },
  });

  await server.register(Inert);

  await server.register([
    rateLimiterPlugin,
    hapiAuthJWT,
    authPlugin,
    adminPlugin,
  ]);
  await server.initialize();

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => h.file('index.html'),
    options: {
      auth: false,
    },
  });

  return server;
}

export async function startServer(s: Hapi.Server): Promise<Hapi.Server> {
  await s.start();
  s.log('info', `Server running on ${s.info.uri}`);
  return s;
}

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});
