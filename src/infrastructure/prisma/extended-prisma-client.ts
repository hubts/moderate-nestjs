import { PrismaClient } from "@prisma/client";
import {
    filterSoftDeletedExtension,
    softDeleteExtension,
} from "./soft-delete.extension";

/**
 * Prisma Client 확장 클래스
 *
 * @description
 * 구현된 PrismaService에 대한 확장을 위한 클래스입니다.
 * 이것은 확장된 Prisma 클라이언트의 인스턴스를 포함합니다.
 */
export class PrismaClientExtended extends PrismaClient {
    extendedPrismaClient: ExtendedPrismaClient;

    // 확장된 Prisma 클라이언트를 반환합니다.
    get client() {
        if (!this.extendedPrismaClient)
            this.extendedPrismaClient = extendPrismaClient(this);
        return this.extendedPrismaClient;
    }
}

/**
 * 일반 Prisma 클라이언트를 확장된 Prisma 클라이언트로 확장하는 함수
 *
 * @description
 * 별도로 정의한 확장(Extension) 함수들을 이곳에서 적용($extends)합니다.
 */
export const extendPrismaClient = (prismaClient: PrismaClient) => {
    return prismaClient
        .$extends(softDeleteExtension)
        .$extends(filterSoftDeletedExtension);
};

// 확장된 Prisma 클라이언트의 타입
export type ExtendedPrismaClient = ReturnType<typeof extendPrismaClient>;
