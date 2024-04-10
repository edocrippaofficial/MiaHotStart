import {FastifyLoggerOptions, FastifyPluginAsync} from 'fastify'
import {PinoLoggerOptions} from "fastify/types/logger"
import {AxiosInstance, CreateAxiosDefaults} from 'axios'

export * from 'fastify-metrics'

export interface Envs {
  [x: string]: string;
}

declare module 'fastify' {
  export interface FastifyInstance {
    // The environment variables map as defined in the schema.
    envs: Envs
  }

  export interface FastifyRequest {
    // The environment variables map as defined in the schema.
    envs: Envs,

    // Returns the HTTP Client instance.
    getHttpClient(baseUrl: string, baseOptions?: CreateAxiosDefaults): AxiosInstance,

    // Returns the User ID from the request headers.
    getUserId(): string | null,

    // Returns the User Groups list from the request headers
    getGroups(): string[],

    // Returns the User Properties object from the request headers
    getUserProperties(): Object | null,

    // Returns the Client Type from the request headers
    getClientType(): string | null,
  }
}

export interface PluginOptions {
  envSchema: Object,
  envSchemaOptions?: Object,
  logLevelEnvKey?: string,

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

  httpClient?: {
    additionalHeadersToProxy?: string[],
    disableDurationInterceptor?: boolean,
    disableLogsInterceptor?: boolean,
  }

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
