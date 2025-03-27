import { UserLoginHistory } from "@prisma/client";
import { UserLoginHistoryModel } from "@sdk";

export function userLoginHistoryMapper(
    entity: UserLoginHistory
): UserLoginHistoryModel {
    return {
        id: entity.id,
        userId: entity.userId,
        loggedAt: entity.createdAt,
        ip: entity.ip,
        userAgent: entity.userAgent,
    };
}
