import { Prisma } from "@prisma/client";

/**
 * 여러 개의 데이터를 SoftDelete하는 확장 함수
 *
 * @description
 * 특정 Model에 대하여 여러 개의 데이터를 SoftDelete 합니다.
 * 실제로는 할당된 'deletedAt' 필드를 현재 시간으로 업데이트합니다.
 */
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
