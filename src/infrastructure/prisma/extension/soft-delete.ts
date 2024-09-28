import { Prisma } from "@prisma/client";

/**
 * 데이터를 SoftDelete하는 확장 함수
 *
 * @description
 * 특정 Model에 대하여 데이터를 SoftDelete 합니다.
 * 실제로는 할당된 'deletedAt' 필드를 현재 시간으로 업데이트합니다.
 */
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
