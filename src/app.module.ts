import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_FILTER, APP_GUARD, APP_PIPE } from "@nestjs/core";

import { AppController } from "./module/_app/app.controller";
import { CustomValidationPipe } from "./common/pipe/custom-validation.pipe";
import { HealthCheckModule } from "./module/_health-check/health-check.module";
import { configurations } from "./config/configurations";
import { AppService } from "./module/_app/app.service";
import { UserModule } from "./module/user/user.module";
import { AuthModule } from "./module/auth/auth.module";
import { CustomLoggerModule } from "./common/logger/custom-logger.module";
import { ThrottlerConfigService } from "./config/internal/throttler.config.service";
import { CacheModule } from "./infrastructure/_cache/cache.module";
import { PrismaModule } from "./infrastructure/_prisma/prisma.module";
import { CustomErrorExceptionFilter } from "./common/error/custom-error-exception.filter";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "./config/internal/multer.config.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticConfigService } from "./config/internal/server-static.config.service";
import { AttachmentModule } from "./infrastructure/_attachment/attachment.module";

const DomainModules = [
    /**
     * Below: Implemented domain modules
     */
    UserModule,
    AuthModule,
];

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // ConfigModule can be globally used in any module
            expandVariables: true, // Supports environment variable expansion
            envFilePath: [".env"], // The environment file to be imported
            load: [...configurations], // Load configurations organized and separated into each config object
        }),
        ThrottlerModule.forRootAsync({ useClass: ThrottlerConfigService }), // Throttler configuration imported
        CustomLoggerModule, // Custom logger module to use logger in 'main.ts'
        HealthCheckModule, // Health check module
        PrismaModule, // Prisma ORM module (global)
        CacheModule, // Cache module (global)
        AttachmentModule, // Attachment module (global)
        MulterModule.registerAsync({
            useClass: MulterConfigService,
        }),
        ServeStaticModule.forRootAsync({
            useClass: ServeStaticConfigService,
        }),
        ...DomainModules,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // Globally used providers with 'APP_' prefix
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_PIPE, useClass: CustomValidationPipe },
        { provide: APP_FILTER, useClass: CustomErrorExceptionFilter },
    ],
})
export class AppModule {}
