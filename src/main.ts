/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { json } from "body-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { AppModule } from "./app.module";
import { HealthCheckController } from "./module/_health-check/health-check.controller";
import { setupSwagger } from "./common/swagger/setup";
import { IServerConfig } from "./config/config.interface";
import { ServerConfig } from "./config/internal/server.config";
import { SuccessResponseDto } from "./common/dto/success-response.dto";
import { SwaggerThemeNameEnum } from "swagger-themes";
import { CustomLoggerFactory } from "./common/logger/custom-logger.factory";

async function run() {
    // Application and configuration
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        abortOnError: true,
    });
    const loggerFactory = app.get(CustomLoggerFactory);
    const logger = loggerFactory.createLogger("Main");

    try {
        const serverConfig = app.get<IServerConfig>(ServerConfig.KEY);
        const packageJson = require("../../package.json");

        // Payload limit
        app.use(json({ limit: "256kb" }));

        // CORS
        app.enableCors({
            allowedHeaders: ["Content-Type", "Authorization"],
            methods: "GET, POST",
            credentials: true,
            origin: "*",
        });

        // Swagger
        const swaggerPath = serverConfig.docs.fullPath;
        setupSwagger(app, {
            path: swaggerPath,
            theme: SwaggerThemeNameEnum.FEELING_BLUE,
            serverUrl: `${serverConfig.endpoint.external}/${serverConfig.endpoint.globalPrefix}`,
            // localhostPort: serverConfig.port,
            title: packageJson.name,
            version: packageJson.version,
            description: "Documents to experience API.",
            extraModels: [SuccessResponseDto],
        });

        // Secure HTTP header and compression
        app.use(helmet());
        app.use(compression());

        // Logging middleware (optional)
        app.use(morgan(serverConfig.isProduction ? "combined" : "dev"));

        // API prefix and versioning (optional)
        app.setGlobalPrefix(serverConfig.endpoint.globalPrefix);
        // app.enableVersioning({
        //     type: VersioningType.URI,
        // });

        /**
         * Start
         */
        const healthCheckController = app.get(HealthCheckController);
        const status = await healthCheckController.getStatus();
        await app.listen(serverConfig.port, async () => {
            let log = `Application [ ${packageJson.name}:${packageJson.version} ] is successfully started\n`;
            log += `< Information >\n`;
            log += `🌏 Env                 : ${serverConfig.env}\n`;
            log += `🌏 Application URL     : ${await app.getUrl()}\n`;
            log += `🌏 External endpoint   : ${serverConfig.endpoint.external}\n`;
            log += `🌏 Swagger document    : ${serverConfig.endpoint.external}${serverConfig.docs.fullPath}\n`;
            log += `🌏 Healthy (overview)  : ${
                status.overview ? "✅" : "🚫"
            }\n`;
            log += `🌏 Healthy (details)   : ${Object.keys(status.details)
                .map(key => `${key} ( ${status.details[key] ? "✅" : "🚫"} )`)
                .join(", ")}`;

            logger.logMore(log, { detail: { save: true } });
        });
    } catch (error) {
        logger.errorMore(
            `Failed to start the application: ${JSON.stringify(error)}`,
            { detail: { save: true } }
        );
        process.exit(1);
    }
}
run();
