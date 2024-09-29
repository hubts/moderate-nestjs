import {
    Inject,
    Injectable,
    OnModuleDestroy,
    OnModuleInit,
} from "@nestjs/common";
import { PrismaClientExtended } from "./extended-prisma-client";
import { PrismaTxClient } from "./type/prisma-tx-client.type";
import { PRISMA_MODULE_OPTIONS } from "./constant/prisma.constant";
import { PrismaModuleOptions } from "./type/prisma-module-options.interface";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaService
    extends PrismaClientExtended
    implements OnModuleInit, OnModuleDestroy
{
    private tx: PrismaTxClient;

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

    beginTransaction(tx: PrismaTxClient) {
        this.tx = tx;
    }

    endTransaction() {
        this.tx = this.client;
    }

    getTransaction() {
        return this.tx ?? this.client;
    }
}
