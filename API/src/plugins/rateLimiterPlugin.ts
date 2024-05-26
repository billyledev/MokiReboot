import { RateLimiterMemory, RateLimiterRedis } from 'rate-limiter-flexible';
import type { IRateLimiterRes } from 'rate-limiter-flexible';

import type Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';

interface RateLimiterPluginData {
  pluginName: string;
  pluginVersion: string;
  rateLimiter?: RateLimiterMemory | RateLimiterRedis;
}

const baseRateConfig = {
  points: 6, // 6 requests
  duration: 60, // per 60 second by IP
};

const rateLimiterMemory = new RateLimiterMemory(baseRateConfig);

const internals: RateLimiterPluginData = {
  pluginName: 'app/rateLimiter',
  pluginVersion: '1.0.0',
  rateLimiter: rateLimiterMemory,
};

const rateLimiterPlugin = {
  name: internals.pluginName,
  version: internals.pluginVersion,
  register: async (server: Hapi.Server) => {
    server.ext('onPreAuth', async (request, h) => {
      try {
        await internals.rateLimiter?.consume(request.info.remoteAddress);
        return h.continue;
      } catch (rej) {
        let error;
        if (rej instanceof Error) {
          // If some Redis error and insuranceLimiter is not set
          error = Boom.internal();
        } else {
          // Not enough points to consume
          const rateLimitError = rej as IRateLimiterRes;
          error = Boom.tooManyRequests('Rate limit exceeded');
          error.output.headers['Retry-After'] = Math.round((rateLimitError?.msBeforeNext ?? 1000) / 1000);
        }
        return error;
      }
    });
  },
};

export default rateLimiterPlugin;
