import { Global, Module } from "@nestjs/common";
import { CustomLogger } from "./custom.logger";
import { CustomLoggerRepository } from "./custom-logger.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Logging, LoggingSchema } from "./logging.schema";
import { LOGGER_FACTORY } from "./custom-logger.constant";
import { CustomLoggerFactory } from "./custom-logger.factory";

@Global()
@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const uri = configService.get<string>("MONGO_URL");
                if (!uri) {
                    console.warn(
                        "Warning: MONGO_URL is not defined, log will be not saved."
                    );
                    return {
                        uri: "",
                    };
                }
                return {
                    uri,
                };
            },
            inject: [ConfigService],
        }),
        MongooseModule.forFeature([
            {
                name: Logging.name,
                schema: LoggingSchema,
            },
        ]),
    ],
    providers: [
        CustomLoggerRepository,
        {
            provide: LOGGER_FACTORY,
            useFactory: (repository: CustomLoggerRepository) => {
                return (context: string) =>
                    new CustomLogger(repository, context);
            },
            inject: [CustomLoggerRepository],
        },
        CustomLoggerFactory,
    ],
    exports: [CustomLoggerFactory],
})
export class CustomLoggerModule {}
