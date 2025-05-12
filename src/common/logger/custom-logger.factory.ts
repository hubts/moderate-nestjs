import { Injectable, Inject } from "@nestjs/common";
import { CustomLogger } from "./custom.logger";
import { LOGGER_FACTORY } from "./custom-logger.constant";

@Injectable()
export class CustomLoggerFactory {
    constructor(
        @Inject(LOGGER_FACTORY)
        private readonly factory: (context: string) => CustomLogger
    ) {}

    createLogger(context: string): CustomLogger {
        return this.factory(context);
    }
}
