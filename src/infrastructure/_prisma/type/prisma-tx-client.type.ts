import { PrismaClient } from "@prisma/client";

export type PrismaTxClient = Parameters<
    Parameters<PrismaClient["$transaction"]>[0]
>[0];
