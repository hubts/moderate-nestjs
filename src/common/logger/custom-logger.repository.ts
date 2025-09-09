import { Injectable } from "@nestjs/common";
import { ConsoleLog, Prisma } from "@sdk";
import { PrismaService } from "src/infrastructure/_prisma/prisma.service";

@Injectable()
export class CustomLoggerRepository {
    constructor(private prisma: PrismaService) {}

    async save(data: Prisma.ConsoleLogCreateInput): Promise<ConsoleLog> {
        return await this.prisma.consoleLog.create({
            data,
        });
    }
}
