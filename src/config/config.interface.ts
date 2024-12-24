export enum ServerEnv {
    LOCAL = "local",
    DEVELOPMENT = "development",
    TEST = "test",
    PRODUCTION = "production",
}

export interface IServerConfig {
    env: ServerEnv;
    port: number;
    endpoint: {
        globalPrefix: string;
        external: string;
    };
    isProduction: boolean;
    docs: {
        path: string;
        fullPath: string;
    };
    fileServeStatic: {
        path: string;
        fullPath: string;
    };
}

export interface IJwtConfig {
    privateKey: string;
    publicKey: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
}

export interface IThrottlerConfig {
    ttl: number;
    limit: number;
}
