import { Prisma } from "@prisma/client";

export async function softDelete<M, A>(
    this: M,
    where: Prisma.Args<M, "delete">["where"]
): Promise<Prisma.Result<M, A, "update">> {
    const context = Prisma.getExtensionContext(this);
    return (context as any).update({
        where,
        data: {
            deletedAt: new Date(),
        },
    });
}
