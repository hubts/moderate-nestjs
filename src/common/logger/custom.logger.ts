import dotenv from "dotenv";
import {
    ConsoleLogger,
    Injectable,
    LoggerService,
    LogLevel,
} from "@nestjs/common";
import { ServerEnv } from "src/config/config.interface";
import { Random } from "src/common/util/random";
import { CustomLoggerRepository } from "./custom-logger.repository";
import { LogOptions } from "./custom-logger.interface";
import { LoggingCreateInput } from "./logging.schema";

@Injectable()
export class CustomLogger extends ConsoleLogger implements LoggerService {
    constructor(
        private readonly database: CustomLoggerRepository,
        context: string
    ) {
        super(context, {
            timestamp: true,
        });

        // Set log levels
        dotenv.config();
        const environment = process.env.ENV;
        if (!environment) {
            throw new Error(`Logger environment is not set: ${environment}`);
        }
        this.setLogLevels(this.getLogLevels(environment as ServerEnv));
    }

    // Get log levels
    private getLogLevels(environment: ServerEnv): LogLevel[] {
        const defaults: LogLevel[] = ["log", "error"];
        switch (environment) {
            case ServerEnv.PRODUCTION:
                return [...defaults];
            case ServerEnv.TEST:
                return [...defaults, "warn"];
            case ServerEnv.DEVELOPMENT:
                return [...defaults, "warn", "debug"];
            case ServerEnv.LOCAL:
                return [...defaults, "warn", "debug", "verbose"];
            default:
                return [];
        }
    }

    // Get context
    private getContext(context?: string): string {
        return context ?? this.context ?? "unknown";
    }

    // Save log to database
    private async save(input: LoggingCreateInput): Promise<void> {
        try {
            await this.database.create(input);
        } catch (error) {
            console.error(`Logging Error: ${error}`);
        }
    }

    // Set context as [Class.method]
    setContextForClass<T>(instance: Function, methodName: keyof T): void {
        this.setContext(`${instance.name}.${methodName as string}`);
    }

    // Verbose
    verbose(message: string, context?: string) {
        super.verbose.apply(this, [message, this.getContext(context)]);
    }

    // Verbose Pretty
    verbosePretty<T>(message: string, data?: T) {
        this.verbose(`${message}: ${JSON.stringify(data, null, 4)}`);
    }

    // Debug
    debug(message: string, context?: string) {
        super.debug.apply(this, [message, this.getContext(context)]);
    }

    // Debug Pretty
    debugPretty<T>(message: string, data?: T) {
        this.debug(`${message}: ${JSON.stringify(data, null, 4)}`);
    }

    // Log
    log(message: string, context?: string) {
        super.log.apply(this, [message, this.getContext(context)]);
    }

    // Log advanced mode
    logMore(message: string, options?: LogOptions) {
        const { context, detail } = options ?? {};
        const { save, cause } = detail ?? {};
        let finalMessage = message;
        if (cause) {
            finalMessage += `: ${JSON.stringify(cause, null, 4)}`;
        }
        if (save) {
            const ticketId = Random.uuid();
            finalMessage = `(ID = ${ticketId}) ` + finalMessage;
            this.save({
                id: ticketId,
                level: "log",
                message,
                ...(detail && { ...detail }),
            });
        }
        this.log(finalMessage, context);
    }

    // Log Pretty
    logPretty<T>(message: string, data?: T) {
        this.logMore(message, {
            detail: {
                ...(data && { cause: data }),
            },
        });
    }

    // Warn
    warn(message: string, context?: string) {
        super.warn.apply(this, [message, this.getContext(context)]);
    }

    // Warn advanced mode
    warnMore(message: string, options?: LogOptions) {
        const { context, detail } = options ?? {};
        const { save, cause } = detail ?? {};
        let finalMessage = message;
        if (cause) {
            finalMessage += `: ${JSON.stringify(cause, null, 4)}`;
        }
        if (save) {
            const ticketId = Random.uuid();
            finalMessage = `(ID = ${ticketId}) ` + finalMessage;
            this.save({
                id: ticketId,
                level: "warn",
                message,
                ...(detail && { ...detail }),
            });
        }
        this.warn(finalMessage, context);
    }

    // Error
    error(message: string, stack?: string, context?: string) {
        super.error.apply(this, [message, stack, this.getContext(context)]);
    }

    // Error with console log saving
    errorMore(message: string, options?: LogOptions) {
        const { context, stack, detail } = options ?? {};
        const { save, cause } = detail ?? {};
        let finalMessage = message;
        if (cause) {
            finalMessage += `: ${JSON.stringify(cause, null, 4)}`;
        }
        if (save) {
            const ticketId = Random.uuid();
            finalMessage = `(ID = ${ticketId}) ` + finalMessage;
            this.save({
                id: ticketId,
                level: "error",
                message,
                ...(detail && {
                    request: detail.request,
                    response: detail.response,
                    cause: {
                        ...detail.cause,
                        stack,
                    },
                }),
            });
        }
        this.error(finalMessage, stack, context);
    }
}
