import {FastifyPluginAsync} from 'fastify'

export interface getUserId {
  // Returns the User ID from the request headers.
  (): string
}
export interface getGroups {
  // Returns the User Groups list from the request headers
  (): string[]
}
export interface getUserProperties {
  // Returns the User Properties object from the request headers
  (): Object
}
export interface getClientType {
  // Returns the Client Type from the request headers
  (): string
}

export interface envs {
  [x: string]: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    // The environment variables map defined in the schema.
    envs: envs
  }

  interface FastifyRequest {
    // The environment variables map defined in the schema.
    envs: envs,

    getUserId: getUserId,
    getGroups: getGroups,
    getUserProperties: getUserProperties,
    getClientType: getClientType,
  }
}

export interface PluginOptions {
  envSchema: Object,
  envSchemaOptions?: Object,
  logLevelKey?: string,

  gracefulShutdownSeconds?: number,

  customReadyRouteHandler?: Function,
  customHealthzRouteHandler?: Function,
  customCheckUpRouteHandler?: Function,

  platformHeaders?: {
    userId?: string,
    userGroups?: string,
    userProperties?: string,
    clientType?: string,
  },

  disableSwagger?: boolean,
  disableMetrics?: boolean,
  disableRequestLogging?: boolean,
  disableStatusRoutes?: boolean,
  disableGracefulShutdown?: boolean,
  disableFormBody?: boolean,
  disablePlatformDecorators?: boolean,
}

export const fastifyMia: FastifyPluginAsync<PluginOptions>
export default fastifyMia
