import { LogLevel } from "@nestjs/common";

export interface IConsoleLog {
    id: string;
    level: LogLevel;
    message: string;
    request?: object;
    response?: object;
    cause?: object;
}
