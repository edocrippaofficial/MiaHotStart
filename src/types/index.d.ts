import {FastifyLoggerOptions, FastifyPluginAsync} from 'fastify'
import {PinoLoggerOptions} from "fastify/types/logger"
import {AxiosInstance, CreateAxiosDefaults} from 'axios'

export * from 'fastify-metrics'

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

export interface getHttpClient {
  // Returns the HTTP Client instance.
  (baseUrl: string, baseOptions?: CreateAxiosDefaults): AxiosInstance
}

export interface envs {
  [x: string]: string;
}

declare module 'fastify' {
  interface FastifyInstance {
    // The environment variables map as defined in the schema.
    envs: envs
  }

  interface FastifyRequest {
    // The environment variables map as defined in the schema.
    envs: envs,

    getHttpClient: getHttpClient,

    getUserId: getUserId,
    getGroups: getGroups,
    getUserProperties: getUserProperties,
    getClientType: getClientType,
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

type DefaultFastifyServerOptions = {
  // Sensible default redaction rules
  // all first level properties in object or array of objects
  // we don't want to see emails, usernames and passwords even if encrypted and/or hashed
  logger: FastifyLoggerOptions & PinoLoggerOptions
  // even after closing the server, it routes the incoming request as usual
  return503OnClosing: boolean,
  // use “legacy” header version with prefixed x- for better compatibility with existing enterprises infrastructures
  requestIdHeader: string,
  // set 30 seconds to plugins to load
  pluginTimeout: number,
  // virtually disable the max body size limit
  bodyLimit: number,
  // do not log requests and replies since we have a custom logger
  disableRequestLogging: boolean,
}
export const defaultFastifyOptions: DefaultFastifyServerOptions
