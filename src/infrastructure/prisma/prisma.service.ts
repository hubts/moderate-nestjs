import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClientExtended } from "./extended-prisma-client";
import { PrismaTxClient } from "./type/prisma-tx-client.type";

@Injectable()
export class PrismaService
    extends PrismaClientExtended
    implements OnModuleInit, OnModuleDestroy
{
    private tx: PrismaTxClient;

    constructor() {
        super({
            log: [
                { emit: "stdout", level: "query" },
                { emit: "stdout", level: "info" },
                { emit: "stdout", level: "warn" },
                { emit: "stdout", level: "error" },
            ],
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

    getTransaction() {
        return this.tx ?? new PrismaClientExtended();
    }
}
