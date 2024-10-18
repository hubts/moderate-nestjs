import { Injectable } from "@nestjs/common";
import { ConsoleLog, Prisma } from "@prisma/client";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@Injectable()
export class CustomLoggerRepository {
    constructor(private prisma: PrismaService) {}

    async console(data: Prisma.ConsoleLogCreateInput): Promise<ConsoleLog> {
        return await this.prisma.consoleLog.create({
            data,
        });
    }
}
