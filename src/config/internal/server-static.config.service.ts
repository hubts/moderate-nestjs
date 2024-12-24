import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import {
    ServeStaticModuleOptions,
    ServeStaticModuleOptionsFactory,
} from "@nestjs/serve-static";
import { ServerConfig } from "./server.config";

@Injectable()
export class ServeStaticConfigService
    implements ServeStaticModuleOptionsFactory
{
    private config: ConfigType<typeof ServerConfig>;

    constructor(
        @Inject(ServerConfig.KEY)
        config: ConfigType<typeof ServerConfig>
    ) {
        this.config = config;
    }

    createLoggerOptions():
        | ServeStaticModuleOptions[]
        | Promise<ServeStaticModuleOptions[]> {
        return [
            {
                rootPath: this.config.fileServeStatic.path,
                serveRoot: this.config.fileServeStatic.fullPath,
                serveStaticOptions: {
                    redirect: false,
                    index: false,
                },
            },
        ];
    }

    get getServePath() {
        return this.config.fileServeStatic.path;
    }
}
