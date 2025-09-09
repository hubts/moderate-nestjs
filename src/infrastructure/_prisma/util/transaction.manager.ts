import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Prisma } from "@sdk";
import { ExpectedErrorException } from "src/common/error/expected-error.exception";

@Injectable()
export class TransactionManager {
    constructor(private readonly prisma: PrismaService) {}

    async transaction<R>(callback: () => Promise<R>): Promise<R> {
        return await this.prisma.$transaction(
            async (tx: Prisma.TransactionClient) => {
                try {
                    this.prisma.beginTransaction(tx);
                    return await callback();
                } catch (e) {
                    if (
                        e instanceof Prisma.PrismaClientKnownRequestError ||
                        e instanceof Prisma.PrismaClientValidationError
                    ) {
                        throw new ExpectedErrorException(
                            "INTERNAL_SERVER_ERROR",
                            {
                                cause: e,
                                describe: e.message,
                            }
                        );
                    } else if (e instanceof HttpException) {
                        throw e;
                    }
                    throw new ExpectedErrorException("INTERNAL_SERVER_ERROR", {
                        cause: `${e}`,
                        describe: `${e}`,
                    });
                } finally {
                    this.prisma.endTransaction();
                }
            }
        );
    }
}
