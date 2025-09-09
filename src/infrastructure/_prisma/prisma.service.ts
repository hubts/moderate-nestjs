import {
    Inject,
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { PRISMA_MODULE_OPTIONS } from "./module/prisma.constant";
import { PrismaModuleOptions } from "./module/prisma-module-options.interface";
import { Prisma, PrismaClient } from "@sdk";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private tx: Prisma.TransactionClient;

    constructor(
        @Inject(PRISMA_MODULE_OPTIONS)
        readonly options: PrismaModuleOptions
    ) {
        const { log } = options;
        const logConfig: Prisma.LogDefinition[] =
            (log && [
                { level: "query", emit: "stdout" },
                { level: "info", emit: "stdout" },
                { level: "warn", emit: "stdout" },
                { level: "error", emit: "stdout" },
            ]) ||
            [];

        super({
            log: logConfig,
            errorFormat: "minimal",
        });
        // this.$on("query", e => {
        //     console.log("Query: " + e.query);
        //     console.log("Params: " + e.params);
        //     console.log("Duration: " + e.duration + "ms");
        // });
    }

    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    beginTransaction(tx: Prisma.TransactionClient) {
        this.tx = tx;
    }

    endTransaction() {
        this.tx = new PrismaClient();
    }

    getTransaction() {
        return this.tx ?? new PrismaClient();
    }
}
