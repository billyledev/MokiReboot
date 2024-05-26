import type Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

import { API_AUTH_STATEGY } from '@/plugins/authPlugin';

type Response = Hapi.ResponseObject | Boom.Boom;

let status = '';

interface StatusInput {
  status: string;
}

async function getStatusHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Response> {
  const currentStatus = status;
  status = ''; // Reset status

  return h.response(currentStatus).code(StatusCodes.OK);
}

async function updateStatusHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Response> {
  const { status: newStatus } = request.payload as StatusInput;

  if (newStatus !== 'reboot') {
    return Boom.badRequest('Invalid status value');
  }

  status = newStatus;

  return h.response({}).code(StatusCodes.OK);
}

const adminPlugin = {
  name: 'app/admin',
  dependencies: [],
  register: async (server: Hapi.Server) => {
    server.route([
      {
        method: 'GET',
        path: '/status',
        handler: getStatusHandler,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STATEGY,
          },
        },
      },
      {
        method: 'PATCH',
        path: '/status',
        handler: updateStatusHandler,
        options: {
          auth: {
            mode: 'required',
            strategy: API_AUTH_STATEGY,
          },
          validate: {
            payload: Joi.object({
              status: Joi.string().required(),
            }),
          },
        },
      },
    ]);
  },
};

export default adminPlugin;
