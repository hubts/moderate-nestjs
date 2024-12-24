import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { MulterOptionsFactory } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { existsSync, mkdirSync } from "fs";
import { diskStorage } from "multer";
import { ServerConfig } from "./server.config";
import { editFilename } from "src/infrastructure/_attachment/attachment.util";

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    private config: ConfigType<typeof ServerConfig>;

    constructor(
        @Inject(ServerConfig.KEY)
        config: ConfigType<typeof ServerConfig>
    ) {
        this.config = config;

        // 경로가 존재하지 않으면 디렉토리 생성
        if (!existsSync(this.config.fileServeStatic.path)) {
            mkdirSync(this.config.fileServeStatic.path, { recursive: true });
        }
    }

    createMulterOptions(): MulterOptions | Promise<MulterOptions> {
        return {
            dest: this.config.fileServeStatic.path,
            // storage: memoryStorage(),
            storage: diskStorage({
                destination: this.config.fileServeStatic.path,
                filename: editFilename,
            }),
        };
    }
}
