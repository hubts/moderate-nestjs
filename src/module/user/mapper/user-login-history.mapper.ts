import { UserLoginHistory } from "@prisma/client";
import { UserLoginHistoryModel } from "src/shared/api/user/user.domain";

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
