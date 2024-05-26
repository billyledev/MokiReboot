import type Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import type { ValidationResult } from 'hapi-auth-jwt2';
import bcrypt from 'bcrypt';

const adminUser = 'admin';

const ADMIN_PASS = process.env.ADMIN_PASS ?? '';

export const API_AUTH_STATEGY = 'API';

const JWT_SECRET = process.env.JWT_SECRET ?? '';

const JWT_ALGORITHM = 'HS256';

declare module '@hapi/hapi' {
  interface AuthCredentials {
    username: string;
  }
}

const apiTokenSchema = Joi.object({
  username: Joi.string(),
});

interface APITokenPayload {
  username: string;
}

interface LoginInput {
  password: string;
}

type Response = Hapi.ResponseObject | Boom.Boom;

const validateAPIToken = async (decoded: APITokenPayload, request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<ValidationResult> => {
  const { username } = decoded;
  const { error } = apiTokenSchema.validate(decoded);

  if (error != null) {
    request.log(['error', 'auth'], `API token error: ${error.message}`);
    return { isValid: false };
  }

  try {
    if (username !== adminUser) {
      return { isValid: false, errorMessage: 'Invalid token' };
    }

    return {
      isValid: true,
      credentials: {
        username: adminUser,
      },
    };
  } catch (err) {
    console.log(err);
    return {
      isValid: false,
      errorMessage: 'Server Error',
    };
  }
};

function generateAuthToken(username: string): string {
  const jwtPayload = { username };

  return jwt.sign(jwtPayload, JWT_SECRET, {
    algorithm: JWT_ALGORITHM,
    noTimestamp: true,
  });
}

async function loginHandler(request: Hapi.Request, h: Hapi.ResponseToolkit): Promise<Response> {
  const { password } = request.payload as LoginInput;
  const ip = request.headers['x-real-ip'];

  try {
    const valid = await bcrypt.compare(password, ADMIN_PASS);

    if (!valid) {
      request.logger.warn(`Failed login request from ip ${ip}`);
      return Boom.badRequest('Login failed');
    }

    request.logger.info(`Successful login request from ip ${ip}`);
    const authToken = generateAuthToken(adminUser);
    return h.response({}).code(StatusCodes.OK).header('Authorization', authToken).header('Access-Control-Expose-Headers', 'Authorization');
  } catch (err) {
    console.log(err);
    return Boom.badImplementation('Server error');
  }
}

const authPlugin = {
  name: 'app/auth',
  dependencies: ['hapi-auth-jwt2'],
  register: async (server: Hapi.Server) => {
    server.auth.strategy(API_AUTH_STATEGY, 'jwt', {
      key: JWT_SECRET,
      verifyOptions: { algorithms: [JWT_ALGORITHM] },
      validate: validateAPIToken,
    });

    server.auth.default(API_AUTH_STATEGY);

    server.route([
      {
        method: 'POST',
        path: '/login',
        handler: loginHandler,
        options: {
          auth: false,
          validate: {
            payload: Joi.object({
              password: Joi.string().required(),
            }),
          },
        },
      },
    ]);
  },
};

export default authPlugin;
