import { Prisma } from "@prisma/client";

export async function softDeleteMany<M, A>(
    this: M,
    where: Prisma.Args<M, "deleteMany">["where"]
): Promise<Prisma.Result<M, A, "updateMany">> {
    const context = Prisma.getExtensionContext(this);
    return (context as any).updateMany({
        where,
        data: {
            deletedAt: new Date(),
        },
    });
}
