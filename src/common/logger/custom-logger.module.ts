import { Global, Module } from "@nestjs/common";
import { CustomLogger } from "./custom.logger";
import { CustomLoggerRepository } from "./custom-logger.repository";
import { PrismaModule } from "src/infrastructure/prisma/prisma.module";

@Global()
@Module({
    imports: [PrismaModule],
    providers: [CustomLogger, CustomLoggerRepository],
    exports: [CustomLogger],
})
export class CustomLoggerModule {}
