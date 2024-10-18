import {
    ConsoleLogger,
    Inject,
    Injectable,
    LoggerService,
    LogLevel,
} from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { ServerEnv } from "src/config/config.interface";
import { ServerConfig } from "src/config/validated/server.config";
import { IConsoleLog } from "./interface/log.interface";
import { CustomLoggerRepository } from "./custom-logger.repository";
import { Random } from "../util/random";

@Injectable()
export class CustomLogger extends ConsoleLogger implements LoggerService {
    constructor(
        context: string,
        @Inject(ServerConfig.KEY)
        private readonly serverConfig: ConfigType<typeof ServerConfig>,
        private readonly logRepo: CustomLoggerRepository
    ) {
        super();
        this.setLogLevels(this.getLogLevels(serverConfig.env));
        this.setContext(context);
    }

    private getLogLevels(environment: ServerEnv): LogLevel[] {
        if (environment === ServerEnv.PRODUCTION) {
            return ["log", "verbose", "warn", "error"];
        } else if (environment === ServerEnv.TEST) {
            return [];
        }
        return ["error", "warn", "log", "verbose", "debug"];
    }

    private getContext(context?: string): string {
        return context ?? this.context ?? "unknown";
    }

    private async createConsoleLog(log: IConsoleLog): Promise<void> {
        try {
            await this.logRepo.console(log);
        } catch (error) {
            console.error(`Logging Error: ${error}`);
        }
    }

    // Log without any saving
    log(message: string, context?: string) {
        super.log.apply(this, [message, this.getContext(context)]);
    }

    // Debug without any saving
    debug(message: string, context?: string) {
        super.debug.apply(this, [message, context ?? this.context]);
    }

    // Verbose with console log saving
    verbose(
        message: string,
        context?: string,
        options?: {
            request?: object;
            response?: object;
            cause?: object;
        }
    ) {
        const { request, response, cause } = options ?? {};
        super.verbose.apply(this, [message, context]);

        const id = Random.uuid();
        this.createConsoleLog({
            id,
            level: "verbose",
            message,
            ...(request && { request }),
            ...(response && { response }),
            ...(cause && { cause }),
        });
    }

    // Warn with console log saving
    warn(
        message: string,
        context?: string,
        options?: {
            request?: object;
            response?: object;
            cause?: object;
        }
    ) {
        const { request, response, cause } = options ?? {};
        super.warn.apply(this, [message, context]);

        const id = Random.uuid();
        this.createConsoleLog({
            id,
            level: "warn",
            message,
            ...(request && { request }),
            ...(response && { response }),
            ...(cause && { cause }),
        });
    }

    // Error with console log saving
    error(
        message: string,
        stack?: string,
        context?: string,
        options?: {
            request?: object;
            response?: object;
            cause?: object;
        }
    ) {
        const id = Random.uuid();
        const { request, response, cause } = options ?? {};

        super.error.apply(this, [
            `${message} (See Log ID = ${id})`,
            context,
            // stack,
        ]);
        this.createConsoleLog({
            id,
            level: "error",
            message,
            ...(request && { request }),
            ...(response && { response }),
            ...(cause && { cause }),
        });
    }
}
