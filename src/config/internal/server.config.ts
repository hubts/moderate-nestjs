import { registerAs } from "@nestjs/config";
import { IServerConfig, ServerEnv } from "../config.interface";
import { ConfigValidation } from "../validator/config-validation.decorator";
import { NotEmptyEnum } from "../validator/not-empty-enum.decorator";
import { NotEmptyIntRange } from "../validator/not-empty-int.decorator";
import { NotEmptyString } from "../validator/not-empty-string.decorator";

export const ServerConfig = registerAs("server", (): IServerConfig => {
    const config = new ServerConfigValidation();
    return {
        env: config.ENV,
        port: config.PORT,
        isProduction: config.ENV === ServerEnv.PRODUCTION,
        endpoint: {
            external: config.EXTERNAL_ENDPOINT,
            globalPrefix: config.GLOBAL_PREFIX,
        },
        docs: {
            path: config.DOCS_PATH,
            fullPath: `/${config.GLOBAL_PREFIX}/${config.DOCS_PATH}`,
        },
        fileServeStatic: {
            path: config.FILE_SERVE_PATH,
            fullPath: `/${config.GLOBAL_PREFIX}/${config.FILE_SERVE_PATH}`,
        },
    };
});

@ConfigValidation()
class ServerConfigValidation {
    @NotEmptyEnum(ServerEnv)
    ENV: ServerEnv;

    @NotEmptyIntRange(0, 65535)
    PORT: number;

    @NotEmptyString()
    GLOBAL_PREFIX: string;

    @NotEmptyString()
    EXTERNAL_ENDPOINT: string;

    @NotEmptyString()
    DOCS_PATH: string;

    @NotEmptyString()
    FILE_SERVE_PATH: string;
}
